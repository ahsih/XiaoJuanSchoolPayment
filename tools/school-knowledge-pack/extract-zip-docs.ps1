# Copies only the document files (and document-like images) out of zip files; photos and videos inside are skipped.
# Input: a UTF-8 file with one "zip<TAB>targetFolder" pair per line. The zip files are only read.
# Keep this file ASCII-only (PowerShell 5.1 reads it as ANSI).
param([string]$ListFile, [string]$Pattern)

$ErrorActionPreference = 'Continue'
# Results go to Node as UTF-8 (the console default here is GBK).
[Console]::OutputEncoding = New-Object System.Text.UTF8Encoding($false)
Add-Type -AssemblyName System.IO.Compression
Add-Type -AssemblyName System.IO.Compression.FileSystem
# Zip entries without the UTF-8 flag were usually written on Chinese Windows (GBK).
$gbk = [System.Text.Encoding]::GetEncoding(936)
$keep = New-Object System.Text.RegularExpressions.Regex($Pattern, 'IgnoreCase')

$lines = Get-Content -LiteralPath $ListFile -Encoding UTF8 | Where-Object { $_ -match "`t" }
foreach ($line in $lines) {
  $zipPath, $target = $line -split "`t"
  try {
    $zip = [System.IO.Compression.ZipFile]::Open($zipPath, 'Read', $gbk)
    $count = 0
    foreach ($entry in $zip.Entries) {
      if (-not $entry.Name) { continue }
      if (-not $keep.IsMatch($entry.FullName)) { continue }
      $safe = ($entry.FullName -replace '[<>:"|?*]', '_') -replace '/', '\'
      $dest = Join-Path $target $safe
      # Windows paths over about 250 characters fail: keep only the file name then.
      if ($dest.Length -gt 240) {
        $leaf = ($entry.Name -replace '[<>:"|?*\\/]', '_')
        if ($leaf.Length -gt 80) { $leaf = $leaf.Substring(0, 70) + [System.IO.Path]::GetExtension($leaf) }
        $dest = Join-Path $target ('_long\' + $count + '_' + $leaf)
      }
      $dir = Split-Path $dest -Parent
      if (-not (Test-Path -LiteralPath $dir)) { New-Item -ItemType Directory -Path $dir -Force | Out-Null }
      [System.IO.Compression.ZipFileExtensions]::ExtractToFile($entry, $dest, $true)
      $count++
    }
    $zip.Dispose()
    New-Item -ItemType Directory -Path $target -Force | Out-Null
    Set-Content -LiteralPath (Join-Path $target '.done') -Value $count
    "OK`t$zipPath`t$count"
  }
  catch {
    $message = $_.Exception.Message -replace '\s+', ' '
    try { if ($zip) { $zip.Dispose() } } catch {}
    # Remember the failure so the next run does not try the same zip again (the folder name changes when the zip changes).
    try {
      New-Item -ItemType Directory -Path $target -Force | Out-Null
      [System.IO.File]::WriteAllText((Join-Path $target '.failed'), $message, (New-Object System.Text.UTF8Encoding($false)))
    } catch {}
    "FAIL`t$zipPath`t$message"
  }
  $zip = $null
}
