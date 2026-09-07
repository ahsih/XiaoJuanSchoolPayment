using System.Text;
using System.Text.Json;
using System.Text.Json.Nodes;
using Microsoft.EntityFrameworkCore;
using XiaoJuanSchoolPayment.Server.Data;
using XiaoJuanSchoolPayment.Server.Data.DTO;
using XiaoJuanSchoolPayment.Server.Data.Models;
using XiaoJuanSchoolPayment.Server.Interface;

namespace XiaoJuanSchoolPayment.Server.Services.School
{
  public class SchoolContentService : ISchoolContentService
  {
    private const string DraftStatus = "Draft";
    private const string PublishedStatus = "Published";
    private const string PendingReviewStatus = "PendingReview";
    private const string ArchivedStatus = "Archived";
    private const int MaxContentBytes = 1024 * 1024;

    private readonly AppDbContext _context;

    public SchoolContentService(AppDbContext context)
    {
      _context = context;
    }

    public async Task<SchoolContentRevisionDTO?> GetPublished(
      Guid schoolId,
      CancellationToken cancellationToken)
    {
      var revision = await _context.SchoolContentRevisions
        .AsNoTracking()
        .Where(x => x.SchoolId == schoolId && x.Status == PublishedStatus)
        .OrderByDescending(x => x.Version)
        .FirstOrDefaultAsync(cancellationToken);

      return revision == null ? null : ToRevisionDto(revision);
    }

    public async Task<SchoolContentEditorDTO?> GetEditor(
      Guid schoolId,
      CancellationToken cancellationToken)
    {
      var school = await _context.Schools
        .AsNoTracking()
        .Where(x => x.Id == schoolId)
        .Select(x => new { x.Id, x.Name })
        .FirstOrDefaultAsync(cancellationToken);

      if (school == null)
      {
        return null;
      }

      var revisions = await _context.SchoolContentRevisions
        .AsNoTracking()
        .Where(x => x.SchoolId == schoolId)
        .OrderByDescending(x => x.Version)
        .ToListAsync(cancellationToken);

      return new SchoolContentEditorDTO
      {
        SchoolId = school.Id,
        SchoolName = school.Name,
        Draft = revisions.Where(x => x.Status == DraftStatus)
          .Select(ToRevisionDto)
          .FirstOrDefault(),
        PendingReview = revisions.Where(x => x.Status == PendingReviewStatus)
          .Select(ToRevisionDto)
          .FirstOrDefault(),
        Published = revisions.Where(x => x.Status == PublishedStatus)
          .Select(ToRevisionDto)
          .FirstOrDefault(),
        History = revisions
          .Where(x => x.Status != DraftStatus && x.Status != PendingReviewStatus)
          .Select(ToSummaryDto)
          .ToList(),
      };
    }

    public async Task<SchoolContentRevisionDTO> SaveDraft(
      Guid schoolId,
      JsonElement content,
      string? changeSummary,
      string userId,
      string userName,
      CancellationToken cancellationToken)
    {
      var contentJson = ValidateAndSerializeContent(content);
      var schoolExists = await _context.Schools
        .AnyAsync(x => x.Id == schoolId, cancellationToken);

      if (!schoolExists)
      {
        throw new ArgumentException("The selected school was not found.");
      }

      var now = DateTime.UtcNow;
      var draft = await _context.SchoolContentRevisions
        .Where(x => x.SchoolId == schoolId && x.Status == DraftStatus)
        .OrderByDescending(x => x.Version)
        .FirstOrDefaultAsync(cancellationToken);

      if (draft == null)
      {
        var latestVersion = await _context.SchoolContentRevisions
          .Where(x => x.SchoolId == schoolId)
          .MaxAsync(x => (int?)x.Version, cancellationToken) ?? 0;

        draft = new SchoolContentRevision
        {
          Id = Guid.NewGuid(),
          SchoolId = schoolId,
          Version = latestVersion + 1,
          Status = DraftStatus,
          CreatedAt = now,
        };
        _context.SchoolContentRevisions.Add(draft);
      }

      draft.ContentJson = contentJson;
      draft.ChangeSummary = NormalizeSummary(changeSummary);
      draft.UpdatedByUserId = userId;
      draft.UpdatedByName = userName;
      draft.UpdatedAt = now;

      await _context.SaveChangesAsync(cancellationToken);
      return ToRevisionDto(draft);
    }

    public async Task<SchoolContentRevisionDTO> SaveQuoteImageSettingsDraft(
      Guid schoolId,
      JsonElement quoteImageSettings,
      string? changeSummary,
      string userId,
      string userName,
      CancellationToken cancellationToken)
    {
      if (quoteImageSettings.ValueKind != JsonValueKind.Object)
      {
        throw new ArgumentException("报价图片说明必须是有效的数据对象。");
      }

      var sourceJson = await _context.SchoolContentRevisions
        .AsNoTracking()
        .Where(x => x.SchoolId == schoolId &&
          (x.Status == DraftStatus || x.Status == PendingReviewStatus || x.Status == PublishedStatus))
        .OrderByDescending(x => x.Status == DraftStatus ? 3 : x.Status == PendingReviewStatus ? 2 : 1)
        .ThenByDescending(x => x.Version)
        .Select(x => x.ContentJson)
        .FirstOrDefaultAsync(cancellationToken);

      if (sourceJson == null)
      {
        throw new ArgumentException("请管理员先建立这所学校的内容初始版本，再编辑报价图片说明。");
      }

      var root = JsonNode.Parse(sourceJson) as JsonObject
        ?? throw new ArgumentException("学校内容数据无效，请管理员检查当前版本。");
      root["quoteImageSettings"] = JsonNode.Parse(quoteImageSettings.GetRawText());
      var merged = JsonSerializer.Deserialize<JsonElement>(root.ToJsonString());
      return await SaveDraft(schoolId, merged, changeSummary, userId, userName, cancellationToken);
    }

    public async Task<SchoolContentRevisionDTO?> Publish(
      Guid schoolId,
      string userId,
      string userName,
      CancellationToken cancellationToken)
    {
      await using var transaction = await _context.Database.BeginTransactionAsync(cancellationToken);
      var draft = await _context.SchoolContentRevisions
        .Where(x => x.SchoolId == schoolId && (x.Status == PendingReviewStatus || x.Status == DraftStatus))
        .OrderByDescending(x => x.Status == PendingReviewStatus)
        .ThenByDescending(x => x.Version)
        .FirstOrDefaultAsync(cancellationToken);

      if (draft == null)
      {
        return null;
      }

      var published = await _context.SchoolContentRevisions
        .Where(x => x.SchoolId == schoolId && x.Id != draft.Id &&
          (x.Status == PublishedStatus || x.Status == PendingReviewStatus))
        .ToListAsync(cancellationToken);
      foreach (var previous in published)
      {
        previous.Status = ArchivedStatus;
      }

      var now = DateTime.UtcNow;
      draft.Status = PublishedStatus;
      draft.UpdatedByUserId = userId;
      draft.UpdatedByName = userName;
      draft.UpdatedAt = now;
      draft.PublishedAt = now;

      await _context.SaveChangesAsync(cancellationToken);
      await transaction.CommitAsync(cancellationToken);
      return ToRevisionDto(draft);
    }

    public async Task<SchoolContentRevisionDTO?> SubmitForReview(
      Guid schoolId,
      string userId,
      string userName,
      CancellationToken cancellationToken)
    {
      var draft = await _context.SchoolContentRevisions
        .Where(x => x.SchoolId == schoolId && x.Status == DraftStatus)
        .OrderByDescending(x => x.Version)
        .FirstOrDefaultAsync(cancellationToken);
      if (draft == null) return null;

      var previousPending = await _context.SchoolContentRevisions
        .Where(x => x.SchoolId == schoolId && x.Status == PendingReviewStatus)
        .ToListAsync(cancellationToken);
      foreach (var revision in previousPending) revision.Status = ArchivedStatus;

      draft.Status = PendingReviewStatus;
      draft.UpdatedByUserId = userId;
      draft.UpdatedByName = userName;
      draft.UpdatedAt = DateTime.UtcNow;
      await _context.SaveChangesAsync(cancellationToken);
      return ToRevisionDto(draft);
    }

    public async Task<SchoolContentRevisionDTO?> ReturnToDraft(
      Guid schoolId,
      string? reason,
      string userId,
      string userName,
      CancellationToken cancellationToken)
    {
      var pending = await _context.SchoolContentRevisions
        .Where(x => x.SchoolId == schoolId && x.Status == PendingReviewStatus)
        .OrderByDescending(x => x.Version)
        .FirstOrDefaultAsync(cancellationToken);
      if (pending == null) return null;

      var otherDrafts = await _context.SchoolContentRevisions
        .Where(x => x.SchoolId == schoolId && x.Status == DraftStatus)
        .ToListAsync(cancellationToken);
      foreach (var draft in otherDrafts) draft.Status = ArchivedStatus;

      pending.Status = DraftStatus;
      var normalizedReason = NormalizeSummary(reason);
      if (normalizedReason != null)
      {
        pending.ChangeSummary = NormalizeSummary($"{pending.ChangeSummary ?? "待审核修改"}｜管理员退回：{normalizedReason}");
      }
      pending.UpdatedByUserId = userId;
      pending.UpdatedByName = userName;
      pending.UpdatedAt = DateTime.UtcNow;
      await _context.SaveChangesAsync(cancellationToken);
      return ToRevisionDto(pending);
    }

    public async Task<SchoolContentRevisionDTO?> RestoreToDraft(
      Guid schoolId,
      Guid revisionId,
      string userId,
      string userName,
      CancellationToken cancellationToken)
    {
      var source = await _context.SchoolContentRevisions
        .AsNoTracking()
        .FirstOrDefaultAsync(
          x => x.Id == revisionId && x.SchoolId == schoolId && x.Status != DraftStatus,
          cancellationToken);

      if (source == null)
      {
        return null;
      }

      var parsed = JsonSerializer.Deserialize<JsonElement>(source.ContentJson);
      return await SaveDraft(
        schoolId,
        parsed,
        $"从版本 {source.Version} 恢复为草稿",
        userId,
        userName,
        cancellationToken);
    }

    private static string ValidateAndSerializeContent(JsonElement content)
    {
      if (content.ValueKind != JsonValueKind.Object)
      {
        throw new ArgumentException("School content must be a JSON object.");
      }

      var json = content.GetRawText();
      if (Encoding.UTF8.GetByteCount(json) > MaxContentBytes)
      {
        throw new ArgumentException("School content must be 1MB or smaller.");
      }

      using var document = JsonDocument.Parse(json);
      if (!document.RootElement.TryGetProperty("schemaVersion", out var schemaVersion) ||
          schemaVersion.ValueKind != JsonValueKind.Number ||
          schemaVersion.GetInt32() < 1)
      {
        throw new ArgumentException("School content schemaVersion is required.");
      }

      return json;
    }

    private static string? NormalizeSummary(string? value)
    {
      var normalized = value?.Trim();
      if (string.IsNullOrEmpty(normalized))
      {
        return null;
      }

      return normalized.Length <= 500 ? normalized : normalized[..500];
    }

    private static SchoolContentRevisionDTO ToRevisionDto(SchoolContentRevision revision) => new()
    {
      Id = revision.Id,
      Version = revision.Version,
      Status = revision.Status,
      Content = JsonSerializer.Deserialize<JsonElement>(revision.ContentJson),
      ChangeSummary = revision.ChangeSummary,
      UpdatedByName = revision.UpdatedByName,
      UpdatedAt = revision.UpdatedAt,
      PublishedAt = revision.PublishedAt,
    };

    private static SchoolContentRevisionSummaryDTO ToSummaryDto(SchoolContentRevision revision) => new()
    {
      Id = revision.Id,
      Version = revision.Version,
      Status = revision.Status,
      ChangeSummary = revision.ChangeSummary,
      UpdatedByName = revision.UpdatedByName,
      UpdatedAt = revision.UpdatedAt,
      PublishedAt = revision.PublishedAt,
    };
  }
}
