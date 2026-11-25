using System.ComponentModel.DataAnnotations;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.Extensions.Options;
using XiaoJuanSchoolPayment.Server.Data.Config;
using XiaoJuanSchoolPayment.Server.Data.Models;
using XiaoJuanSchoolPayment.Server.Services.Security;
using XiaoJuanSchoolPayment.Server.Services.WeChat;

namespace XiaoJuanSchoolPayment.Server.Controllers
{
  /// <summary>
  /// WeChat reminders for the mini program 学员中心: which subscribe-message templates the student may allow,
  /// and linking the signed-in Student account to their mini program openid so those messages can reach them.
  /// </summary>
  [ApiController]
  [Authorize(Roles = "Student")]
  [Route("student-notifications")]
  public class StudentNotificationsController : ControllerBase
  {
    private readonly UserManager<SchoolUser> _userManager;
    private readonly WeChatApiClient _weChat;
    private readonly WeChatMiniProgramOptions _options;

    public StudentNotificationsController(UserManager<SchoolUser> userManager, WeChatApiClient weChat, IOptions<WeChatMiniProgramOptions> options)
    {
      _userManager = userManager;
      _weChat = weChat;
      _options = options.Value;
    }

    [HttpGet("wechat")]
    public async Task<ActionResult<WeChatReminderStatusDTO>> GetWeChatStatus()
    {
      var user = await CurrentUserAsync();
      if (user == null) return Unauthorized();
      var templateIds = _weChat.Enabled ? _options.ConfiguredTemplateIds() : [];
      return Ok(new WeChatReminderStatusDTO
      {
        Enabled = templateIds.Count > 0,
        TemplateIds = templateIds,
        Bound = !string.IsNullOrWhiteSpace(user.WeChatOpenId),
      });
    }

    [HttpPost("wechat/bind")]
    [EnableRateLimiting(AbuseRateLimits.AuthPolicy)]
    public async Task<ActionResult<WeChatReminderStatusDTO>> BindWeChat([FromBody] WeChatBindRequestDTO request, CancellationToken cancellationToken)
    {
      var user = await CurrentUserAsync();
      if (user == null) return Unauthorized();
      if (!_weChat.Enabled || _options.ConfiguredTemplateIds().Count == 0)
      {
        return StatusCode(StatusCodes.Status503ServiceUnavailable, new { message = "微信提醒暂未开通。" });
      }

      var openId = await _weChat.GetOpenIdAsync(request.Code.Trim(), cancellationToken);
      if (openId == null) return BadRequest(new { message = "微信登录已过期，请再点一次。" });
      if (user.WeChatOpenId != openId)
      {
        user.WeChatOpenId = openId;
        var result = await _userManager.UpdateAsync(user);
        if (!result.Succeeded) return StatusCode(StatusCodes.Status500InternalServerError, new { message = "保存失败，请稍后再试。" });
      }

      return Ok(new WeChatReminderStatusDTO { Enabled = true, TemplateIds = _options.ConfiguredTemplateIds(), Bound = true });
    }

    /// <summary>
    /// Turns WeChat reminders off for this account: the stored openid is removed, so nothing more is sent to
    /// that WeChat. The mini program calls it from 关闭微信提醒 and when the student signs out. Emails continue.
    /// </summary>
    [HttpDelete("wechat")]
    public async Task<ActionResult<WeChatReminderStatusDTO>> UnbindWeChat()
    {
      var user = await CurrentUserAsync();
      if (user == null) return Unauthorized();
      if (!string.IsNullOrWhiteSpace(user.WeChatOpenId))
      {
        user.WeChatOpenId = null;
        var result = await _userManager.UpdateAsync(user);
        if (!result.Succeeded) return StatusCode(StatusCodes.Status500InternalServerError, new { message = "保存失败，请稍后再试。" });
      }

      var templateIds = _weChat.Enabled ? _options.ConfiguredTemplateIds() : [];
      return Ok(new WeChatReminderStatusDTO { Enabled = templateIds.Count > 0, TemplateIds = templateIds, Bound = false });
    }

    private async Task<SchoolUser?> CurrentUserAsync()
    {
      var id = User.FindFirstValue(ClaimTypes.NameIdentifier);
      return string.IsNullOrWhiteSpace(id) ? null : await _userManager.FindByIdAsync(id);
    }
  }

  public sealed class WeChatReminderStatusDTO
  {
    public bool Enabled { get; set; }
    public IReadOnlyList<string> TemplateIds { get; set; } = [];
    public bool Bound { get; set; }
  }

  public sealed class WeChatBindRequestDTO
  {
    [Required]
    [MaxLength(128)]
    public string Code { get; set; } = string.Empty;
  }
}
