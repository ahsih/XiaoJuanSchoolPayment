#!/usr/bin/env bash
# Pushes a commit to the production server's "deploy" transport branch, sending
# its new files first in batches of about BATCH_MB (default 50).
#
# The runner-to-server link crosses into mainland China and is sometimes very
# slow: 117 MB once took 2 h 20 min, while GitHub stops a job after 6 hours.
# git push cannot resume, so one big push that times out starts from zero on
# the next run, and a single commit can hold hundreds of MB of videos.
#
# Each batch is a helper commit (no parent) whose tree holds some of the new
# files, pushed to refs/deploy-batches/<commit>. Files on the server under any
# advertised ref are not sent again, so the final push of the real commit only
# sends what is left. The helper commits are built the same way on every run,
# so after a timeout the next run skips the batches that already arrived. The
# helper refs are deleted once the real commit has arrived.
#
# Usage: push-in-batches.sh <remote URL> <target commit>
set -Eeuo pipefail

remote="$1"
target="$(git rev-parse --verify "$2^{commit}")"
batch_bytes=$(( ${BATCH_MB:-50} * 1024 * 1024 ))
work="$(mktemp -d)"
trap 'rm -rf "$work"' EXIT

git ls-remote "$remote" > "$work/remote-refs"

# Commits the server already has on main or deploy are not sent again. A server
# commit this checkout lacks cannot be used for that.
exclude=()
while read -r sha; do
  if git cat-file -e "$sha^{commit}" 2>/dev/null; then
    exclude+=("^$sha")
  fi
done < <(awk '$2 == "refs/heads/main" || $2 == "refs/heads/deploy" { print $1 }' "$work/remote-refs" | sort -u)

# Batches that arrived in an earlier, interrupted run.
awk '$2 ~ "^refs/deploy-batches/" { print $1 }' "$work/remote-refs" | sort -u > "$work/arrived"
awk '$2 ~ "^refs/deploy-batches/" { print $2 }' "$work/remote-refs" > "$work/arrived-refs"

# Files the server lacks, in the order their commits were made, so that later
# commits on main do not change the earlier batches.
git rev-list --objects "$target" "${exclude[@]}" | cut -d' ' -f1 \
  | git cat-file --batch-check='%(objecttype) %(objectname) %(objectsize)' \
  | awk '$1 == "blob" { print $2, $3 }' > "$work/missing"
git log --reverse --topo-order --no-renames --raw --no-abbrev --format= "$target" "${exclude[@]}" \
  | awk '/^:/ { print $4 }' > "$work/order"
awk '
  FILENAME == ARGV[1] { size[$1] = $2; next }
  ($1 in size) && !($1 in done) { done[$1] = 1; print $1, size[$1] }
' "$work/missing" "$work/order" > "$work/files"
# Files that only merge commits added come last, in a fixed order.
awk 'FILENAME == ARGV[1] { seen[$1] = 1; next } !($1 in seen)' "$work/files" "$work/missing" \
  | sort >> "$work/files"

# Group the files; a file larger than the limit is a batch of its own.
awk -v limit="$batch_bytes" '
  { if (total > 0 && total + $2 > limit) { batch++; total = 0 }
    total += $2
    print batch + 0, $1, $2 }
' "$work/files" > "$work/grouped"

batches=$(awk 'END { print (NR ? $1 + 1 : 0) }' "$work/grouped")
pushed=()
export GIT_AUTHOR_NAME=deploy GIT_AUTHOR_EMAIL=deploy@localhost GIT_AUTHOR_DATE='2000-01-01T00:00:00+0000'
export GIT_COMMITTER_NAME=deploy GIT_COMMITTER_EMAIL=deploy@localhost GIT_COMMITTER_DATE='2000-01-01T00:00:00+0000'
echo "New files: $(awk '{ s += $3 } END { printf "%d", s / 1048576 }' "$work/grouped") MB in $batches batch(es)."
for (( i = 0; i < batches; i++ )); do
  tree=$(awk -v b="$i" '$1 == b { printf "100644 blob %s\t%s\n", $2, $2 }' "$work/grouped" | git mktree)
  commit=$(git commit-tree "$tree" -m "Deploy file batch")
  mb=$(awk -v b="$i" '$1 == b { s += $3 } END { printf "%d", s / 1048576 }' "$work/grouped")
  if grep -qx "$commit" "$work/arrived"; then
    echo "Batch $((i + 1))/$batches ($mb MB) arrived in an earlier run."
  else
    started=$SECONDS
    echo "Batch $((i + 1))/$batches: sending $mb MB"
    git push --quiet "$remote" "$commit:refs/deploy-batches/$commit"
    echo "  arrived after $(( (SECONDS - started) / 60 )) min"
  fi
  pushed+=("$commit")
done

started=$SECONDS
echo "Sending commit $(git log -1 --format='%h %s' "$target")"
git push --force --quiet "$remote" "$target:refs/heads/deploy"
echo "  arrived after $(( (SECONDS - started) / 60 )) min"

# The real commit now holds every file, so the helper refs can go.
mapfile -t stale < <({ printf 'refs/deploy-batches/%s\n' "${pushed[@]}"; cat "$work/arrived-refs"; } \
  | grep -v '/$' | sort -u)
if [ "${#stale[@]}" -gt 0 ]; then
  git push --quiet "$remote" --delete "${stale[@]}" || echo "Could not delete the batch refs; the next run deletes them." >&2
fi
