using Microsoft.EntityFrameworkCore;
using XiaoJuanSchoolPayment.Server.Data;

namespace XiaoJuanSchoolPayment.Server.Services.Seo;

/// <summary>
/// When each school's public data last changed: the latest published content revision and the latest
/// edit of its courses, rooms, fees, notes or photos. A school page prerendered at build time
/// (scripts/prerender-school-pages.cjs in the client) shows the prices of that moment, so
/// <see cref="SpaSeoHtmlRenderer"/> only serves it while none of its schools has changed since; otherwise
/// the page is served as the empty shell and the browser loads the current prices, as before.
/// The table is read at most every few seconds. If the database cannot be read, every school counts as
/// changed, so an old price is never served.
/// </summary>
public sealed class SchoolDataFreshness
{
  private static readonly TimeSpan CacheDuration = TimeSpan.FromSeconds(10);

  private readonly IServiceScopeFactory _scopeFactory;
  private readonly ILogger<SchoolDataFreshness> _logger;
  private readonly SemaphoreSlim _refreshLock = new(1, 1);
  private Snapshot? _snapshot;

  public SchoolDataFreshness(IServiceScopeFactory scopeFactory, ILogger<SchoolDataFreshness> logger)
  {
    _scopeFactory = scopeFactory;
    _logger = logger;
  }

  /// <summary>True when none of <paramref name="schoolIds"/> changed after <paramref name="renderedAtUtc"/>.</summary>
  public async Task<bool> IsUnchangedSinceAsync(
    IReadOnlyCollection<Guid> schoolIds,
    DateTime renderedAtUtc,
    CancellationToken cancellationToken)
  {
    if (schoolIds.Count == 0)
    {
      return true;
    }

    var changes = await GetChangesAsync(cancellationToken);
    if (changes == null)
    {
      return false;
    }

    foreach (var schoolId in schoolIds)
    {
      if (changes.TryGetValue(schoolId, out var changedAt) && changedAt > renderedAtUtc)
      {
        return false;
      }
    }

    return true;
  }

  private async Task<IReadOnlyDictionary<Guid, DateTime>?> GetChangesAsync(CancellationToken cancellationToken)
  {
    var snapshot = _snapshot;
    if (snapshot != null && DateTime.UtcNow - snapshot.LoadedAt < CacheDuration)
    {
      return snapshot.Changes;
    }

    await _refreshLock.WaitAsync(cancellationToken);
    try
    {
      snapshot = _snapshot;
      if (snapshot != null && DateTime.UtcNow - snapshot.LoadedAt < CacheDuration)
      {
        return snapshot.Changes;
      }

      IReadOnlyDictionary<Guid, DateTime>? changes;
      try
      {
        changes = await LoadAsync(cancellationToken);
      }
      catch (Exception ex) when (ex is not OperationCanceledException)
      {
        _logger.LogWarning(ex, "Could not read when school data last changed; serving school pages without their prerendered body.");
        changes = null;
      }

      _snapshot = new Snapshot(DateTime.UtcNow, changes);
      return changes;
    }
    finally
    {
      _refreshLock.Release();
    }
  }

  private async Task<IReadOnlyDictionary<Guid, DateTime>> LoadAsync(CancellationToken cancellationToken)
  {
    using var scope = _scopeFactory.CreateScope();
    var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    var changes = new Dictionary<Guid, DateTime>();

    void Add(IEnumerable<SchoolChange> rows)
    {
      foreach (var row in rows)
      {
        if (!changes.TryGetValue(row.SchoolId, out var current) || row.ChangedAt > current)
        {
          changes[row.SchoolId] = row.ChangedAt;
        }
      }
    }

    // All times are stored as DateTime.UtcNow.
    Add(await context.SchoolContentRevisions.AsNoTracking()
      .Where(x => x.PublishedAt != null)
      .GroupBy(x => x.SchoolId)
      .Select(g => new SchoolChange(g.Key, g.Max(x => x.PublishedAt!.Value)))
      .ToListAsync(cancellationToken));
    Add(await context.SchoolLessons.AsNoTracking()
      .GroupBy(x => x.SchoolId)
      .Select(g => new SchoolChange(g.Key, g.Max(x => x.LastUpdated)))
      .ToListAsync(cancellationToken));
    Add(await context.SchoolRooms.AsNoTracking()
      .GroupBy(x => x.SchoolId)
      .Select(g => new SchoolChange(g.Key, g.Max(x => x.LastUpdated)))
      .ToListAsync(cancellationToken));
    Add(await context.SchoolFees.AsNoTracking()
      .GroupBy(x => x.SchoolId)
      .Select(g => new SchoolChange(g.Key, g.Max(x => x.LastUpdated)))
      .ToListAsync(cancellationToken));
    Add(await context.SchoolNotes.AsNoTracking()
      .GroupBy(x => x.SchoolId)
      .Select(g => new SchoolChange(g.Key, g.Max(x => x.LastUpdated)))
      .ToListAsync(cancellationToken));
    Add(await context.SchoolPhotos.AsNoTracking()
      .GroupBy(x => x.SchoolId)
      .Select(g => new SchoolChange(g.Key, g.Max(x => x.LastUpdated)))
      .ToListAsync(cancellationToken));
    return changes;
  }

  private sealed record SchoolChange(Guid SchoolId, DateTime ChangedAt);

  private sealed record Snapshot(DateTime LoadedAt, IReadOnlyDictionary<Guid, DateTime>? Changes);
}
