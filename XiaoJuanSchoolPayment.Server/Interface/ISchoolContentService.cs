using System.Text.Json;
using XiaoJuanSchoolPayment.Server.Data.DTO;

namespace XiaoJuanSchoolPayment.Server.Interface
{
  public interface ISchoolContentService
  {
    Task<SchoolContentRevisionDTO?> GetPublished(Guid schoolId, CancellationToken cancellationToken);
    Task<SchoolContentEditorDTO?> GetEditor(Guid schoolId, CancellationToken cancellationToken);
    Task<SchoolContentRevisionDTO> SaveDraft(
      Guid schoolId,
      JsonElement content,
      string? changeSummary,
      string userId,
      string userName,
      CancellationToken cancellationToken);
    Task<SchoolContentRevisionDTO> SavePricingSettingsDraft(
      Guid schoolId,
      JsonElement content,
      string? changeSummary,
      string userId,
      string userName,
      CancellationToken cancellationToken);
    Task<SchoolContentRevisionDTO> SaveQuoteImageSettingsDraft(
      Guid schoolId,
      JsonElement quoteImageSettings,
      string? changeSummary,
      string userId,
      string userName,
      CancellationToken cancellationToken);
    Task<SchoolContentRevisionDTO> SaveMediaSettingsDraft(
      Guid schoolId,
      JsonElement media,
      string? changeSummary,
      string userId,
      string userName,
      CancellationToken cancellationToken);
    Task<SchoolContentRevisionDTO?> Publish(
      Guid schoolId,
      string userId,
      string userName,
      CancellationToken cancellationToken);
    Task<SchoolContentRevisionDTO?> SubmitForReview(
      Guid schoolId,
      string userId,
      string userName,
      CancellationToken cancellationToken);
    Task<SchoolContentRevisionDTO?> ReturnToDraft(
      Guid schoolId,
      string? reason,
      string userId,
      string userName,
      CancellationToken cancellationToken);
    Task<SchoolContentRevisionDTO?> RestoreToDraft(
      Guid schoolId,
      Guid revisionId,
      string userId,
      string userName,
      CancellationToken cancellationToken);
  }
}
