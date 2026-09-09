using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using XiaoJuanSchoolPayment.Server.Data.DTO;
using XiaoJuanSchoolPayment.Server.Interface;

namespace XiaoJuanSchoolPayment.Server.Controllers
{
  [ApiController]
  [Route("school-content")]
  public class SchoolContentController : ControllerBase
  {
    private readonly ISchoolContentService _schoolContentService;
    private readonly IStaffPermissionService _permissions;

    public SchoolContentController(
      ISchoolContentService schoolContentService,
      IStaffPermissionService permissions)
    {
      _schoolContentService = schoolContentService;
      _permissions = permissions;
    }

    [AllowAnonymous]
    [HttpGet("{schoolId:guid}/published")]
    public async Task<IActionResult> GetPublished(Guid schoolId, CancellationToken cancellationToken)
    {
      var content = await _schoolContentService.GetPublished(schoolId, cancellationToken);
      return content == null ? NotFound() : Ok(content);
    }

    [Authorize(Roles = "Admin,Staff")]
    [HttpGet("{schoolId:guid}/editor")]
    public async Task<IActionResult> GetEditor(Guid schoolId, CancellationToken cancellationToken)
    {
      if (!await CanUseEitherEditor(schoolId, cancellationToken)) return Forbid();
      var content = await _schoolContentService.GetEditor(schoolId, cancellationToken);
      return content == null ? NotFound() : Ok(content);
    }

    [Authorize(Roles = "Admin,Staff")]
    [HttpPut("{schoolId:guid}/draft")]
    public async Task<IActionResult> SaveDraft(
      Guid schoolId,
      [FromBody] SaveSchoolContentDraftDTO request,
      CancellationToken cancellationToken)
    {
      if (!await _permissions.HasAsync(User, schoolId, StaffPermissionScopes.SchoolContent, cancellationToken)) return Forbid();
      try
      {
        var result = await _schoolContentService.SaveDraft(
          schoolId,
          request.Content,
          request.ChangeSummary,
          CurrentUserId(),
          CurrentUserName(),
          cancellationToken);
        return Ok(result);
      }
      catch (ArgumentException ex)
      {
        return BadRequest(ex.Message);
      }
    }

    [Authorize(Roles = "Admin,Staff")]
    [HttpPut("{schoolId:guid}/pricing-draft")]
    public async Task<IActionResult> SavePricingDraft(
      Guid schoolId,
      [FromBody] SavePricingSettingsDraftDTO request,
      CancellationToken cancellationToken)
    {
      if (!await _permissions.HasAsync(User, schoolId, StaffPermissionScopes.Pricing, cancellationToken)) return Forbid();
      try
      {
        var result = await _schoolContentService.SavePricingSettingsDraft(
          schoolId,
          request.Content,
          request.ChangeSummary,
          CurrentUserId(),
          CurrentUserName(),
          cancellationToken);
        return Ok(result);
      }
      catch (ArgumentException ex)
      {
        return BadRequest(ex.Message);
      }
    }

    [Authorize(Roles = "Admin,Staff")]
    [HttpPut("{schoolId:guid}/quote-image-draft")]
    public async Task<IActionResult> SaveQuoteImageDraft(
      Guid schoolId,
      [FromBody] SaveQuoteImageSettingsDraftDTO request,
      CancellationToken cancellationToken)
    {
      if (!await _permissions.HasAsync(User, schoolId, StaffPermissionScopes.QuoteImage, cancellationToken)) return Forbid();
      try
      {
        var result = await _schoolContentService.SaveQuoteImageSettingsDraft(
          schoolId,
          request.QuoteImageSettings,
          request.ChangeSummary,
          CurrentUserId(),
          CurrentUserName(),
          cancellationToken);
        return Ok(result);
      }
      catch (ArgumentException ex)
      {
        return BadRequest(ex.Message);
      }
    }

    [Authorize(Roles = "Admin,Staff")]
    [HttpPut("{schoolId:guid}/media-draft")]
    public async Task<IActionResult> SaveMediaDraft(
      Guid schoolId,
      [FromBody] SaveMediaSettingsDraftDTO request,
      CancellationToken cancellationToken)
    {
      if (!await _permissions.HasAsync(User, schoolId, StaffPermissionScopes.Media, cancellationToken)) return Forbid();
      try
      {
        var result = await _schoolContentService.SaveMediaSettingsDraft(
          schoolId,
          request.Media,
          request.ChangeSummary,
          CurrentUserId(),
          CurrentUserName(),
          cancellationToken);
        return Ok(result);
      }
      catch (ArgumentException ex)
      {
        return BadRequest(ex.Message);
      }
    }

    [Authorize(Roles = "Admin")]
    [HttpPost("{schoolId:guid}/publish")]
    public async Task<IActionResult> Publish(Guid schoolId, CancellationToken cancellationToken)
    {
      var result = await _schoolContentService.Publish(
        schoolId,
        CurrentUserId(),
        CurrentUserName(),
        cancellationToken);
      return result == null ? NotFound("没有待审核版本，请先提交审核。") : Ok(result);
    }

    [Authorize(Roles = "Admin,Staff")]
    [HttpPost("{schoolId:guid}/submit-review")]
    public async Task<IActionResult> SubmitForReview(
      Guid schoolId,
      [FromQuery] string scope,
      CancellationToken cancellationToken)
    {
      var requiredScope = string.Equals(scope, StaffPermissionScopes.QuoteImage, StringComparison.OrdinalIgnoreCase)
        ? StaffPermissionScopes.QuoteImage
        : string.Equals(scope, StaffPermissionScopes.Media, StringComparison.OrdinalIgnoreCase)
          ? StaffPermissionScopes.Media
          : string.Equals(scope, StaffPermissionScopes.Pricing, StringComparison.OrdinalIgnoreCase)
            ? StaffPermissionScopes.Pricing
            : StaffPermissionScopes.SchoolContent;
      if (!await _permissions.HasAsync(User, schoolId, requiredScope, cancellationToken)) return Forbid();
      try
      {
        var result = await _schoolContentService.SubmitForReview(
          schoolId,
          CurrentUserId(),
          CurrentUserName(),
          cancellationToken);
        return result == null ? NotFound("请先保存草稿。") : Ok(result);
      }
      catch (ArgumentException ex)
      {
        return BadRequest(ex.Message);
      }
    }

    [Authorize(Roles = "Admin")]
    [HttpPost("{schoolId:guid}/return-to-draft")]
    public async Task<IActionResult> ReturnToDraft(
      Guid schoolId,
      [FromBody] string? reason,
      CancellationToken cancellationToken)
    {
      var result = await _schoolContentService.ReturnToDraft(
        schoolId,
        reason,
        CurrentUserId(),
        CurrentUserName(),
        cancellationToken);
      return result == null ? NotFound("没有待审核版本。") : Ok(result);
    }

    [Authorize(Roles = "Admin")]
    [HttpPost("{schoolId:guid}/restore/{revisionId:guid}")]
    public async Task<IActionResult> Restore(
      Guid schoolId,
      Guid revisionId,
      CancellationToken cancellationToken)
    {
      var result = await _schoolContentService.RestoreToDraft(
        schoolId,
        revisionId,
        CurrentUserId(),
        CurrentUserName(),
        cancellationToken);
      return result == null ? NotFound() : Ok(result);
    }

    private string CurrentUserId() =>
      User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.Identity?.Name ?? "unknown";

    private string CurrentUserName() =>
      User.FindFirstValue(ClaimTypes.Name) ?? User.Identity?.Name ?? "员工";

    private async Task<bool> CanUseEitherEditor(Guid schoolId, CancellationToken cancellationToken) =>
      await _permissions.HasAsync(User, schoolId, StaffPermissionScopes.SchoolContent, cancellationToken) ||
      await _permissions.HasAsync(User, schoolId, StaffPermissionScopes.Pricing, cancellationToken) ||
      await _permissions.HasAsync(User, schoolId, StaffPermissionScopes.QuoteImage, cancellationToken) ||
      await _permissions.HasAsync(User, schoolId, StaffPermissionScopes.Media, cancellationToken);
  }
}
