using System.Text.Json;

namespace XiaoJuanSchoolPayment.Server.Data.DTO
{
  public class SaveSchoolContentDraftDTO
  {
    public JsonElement Content { get; set; }
    public string? ChangeSummary { get; set; }
  }

  public class SavePricingSettingsDraftDTO
  {
    public JsonElement Content { get; set; }
    public string? ChangeSummary { get; set; }
  }

  public class SaveQuoteImageSettingsDraftDTO
  {
    public JsonElement QuoteImageSettings { get; set; }
    public string? ChangeSummary { get; set; }
  }

  public class SaveMediaSettingsDraftDTO
  {
    public JsonElement Media { get; set; }
    public string? ChangeSummary { get; set; }
  }

  public class SchoolContentRevisionDTO
  {
    public Guid Id { get; set; }
    public int Version { get; set; }
    public string Status { get; set; } = string.Empty;
    public JsonElement Content { get; set; }
    public string? ChangeSummary { get; set; }
    public string UpdatedByName { get; set; } = string.Empty;
    public DateTime UpdatedAt { get; set; }
    public DateTime? PublishedAt { get; set; }
  }

  public class SchoolContentRevisionSummaryDTO
  {
    public Guid Id { get; set; }
    public int Version { get; set; }
    public string Status { get; set; } = string.Empty;
    public string? ChangeSummary { get; set; }
    public string UpdatedByName { get; set; } = string.Empty;
    public DateTime UpdatedAt { get; set; }
    public DateTime? PublishedAt { get; set; }
  }

  public class SchoolContentEditorDTO
  {
    public Guid SchoolId { get; set; }
    public string SchoolName { get; set; } = string.Empty;
    public SchoolContentRevisionDTO? Draft { get; set; }
    public SchoolContentRevisionDTO? PendingReview { get; set; }
    public SchoolContentRevisionDTO? Published { get; set; }
    public IList<SchoolContentRevisionSummaryDTO> History { get; set; } = [];
  }
}
