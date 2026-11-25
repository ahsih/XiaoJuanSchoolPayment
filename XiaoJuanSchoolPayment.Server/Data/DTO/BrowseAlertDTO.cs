using System.ComponentModel.DataAnnotations;

namespace XiaoJuanSchoolPayment.Server.Data.DTO
{
  /// <summary>Sent anonymously by the website each time a visitor with a personal link opens a page.</summary>
  public class BrowseAlertViewRequestDTO
  {
    [MaxLength(32)]
    public string? Code { get; set; }

    [MaxLength(300)]
    public string? Path { get; set; }
  }

  public class BrowseAlertViewResponseDTO
  {
    /// <summary>False when the code is unknown or switched off; the website then forgets it.</summary>
    public bool Active { get; set; }

    /// <summary>The consultant who gets the reminders, for the one-time notice shown to the student.</summary>
    public string? ConsultantName { get; set; }
  }

  public class SaveBrowseAlertLinkDTO
  {
    [Required, MaxLength(60)]
    public string StudentName { get; set; } = string.Empty;

    [Required, MaxLength(20)]
    public string ConsultantName { get; set; } = string.Empty;

    [MaxLength(300)]
    public string? Note { get; set; }

    [MaxLength(300)]
    public string? LandingPath { get; set; }

    /// <summary>Only used when updating: false switches the link off.</summary>
    public bool? Active { get; set; }
  }

  public class BrowseAlertLinkDTO
  {
    public Guid Id { get; set; }
    public required string Code { get; set; }
    public required string StudentName { get; set; }
    public required string ConsultantName { get; set; }
    public string? Note { get; set; }
    public required string LandingPath { get; set; }
    public string? LandingPageName { get; set; }
    public DateTime CreatedAt { get; set; }
    public bool Active { get; set; }
    public DateTime? LastViewedAt { get; set; }
    public string? LastPageName { get; set; }
    public int ViewCount { get; set; }

    /// <summary>True when the consultant sent it from the WeCom chat sidebar.</summary>
    public bool FromWeCom { get; set; }
  }

  public class BrowseAlertViewDTO
  {
    public required string Path { get; set; }
    public required string PageName { get; set; }
    public DateTime ViewedAt { get; set; }
    public bool Notified { get; set; }
  }

  public class BrowseAlertPageDTO
  {
    public required string Path { get; set; }
    public required string Name { get; set; }
  }

  public class BrowseAlertChannelDTO
  {
    public required string ConsultantName { get; set; }

    /// <summary>Only whether a webhook is set and its last characters; the key itself is never returned.</summary>
    public bool HasWebhook { get; set; }
    public string? WebhookHint { get; set; }
    public string? Mention { get; set; }
    public string? WeComUserId { get; set; }
  }

  public class SaveBrowseAlertChannelDTO
  {
    [Required, MaxLength(20)]
    public string ConsultantName { get; set; } = string.Empty;

    /// <summary>Null keeps the saved webhook, an empty string removes it.</summary>
    [MaxLength(300)]
    public string? WebhookUrl { get; set; }

    [MaxLength(64)]
    public string? Mention { get; set; }

    [MaxLength(64)]
    public string? WeComUserId { get; set; }
  }

  public class BrowseAlertTestDTO
  {
    [Required, MaxLength(20)]
    public string ConsultantName { get; set; } = string.Empty;
  }

  /// <summary>The WeCom self-built app as owner Admins see it; the secret itself is never returned.</summary>
  public class WeComAppSettingDTO
  {
    public string? CorpId { get; set; }
    public int? AgentId { get; set; }
    public bool HasSecret { get; set; }
    public string? SecretHint { get; set; }

    /// <summary>CorpID, AgentId and Secret are all set, so reminders and the sidebar can use the app.</summary>
    public bool Complete { get; set; }

    /// <summary>Result of the last save's check against WeCom, when one ran.</summary>
    public string? CheckMessage { get; set; }
    public bool? CheckOk { get; set; }
  }

  public class SaveWeComAppSettingDTO
  {
    [MaxLength(64)]
    public string? CorpId { get; set; }

    public int? AgentId { get; set; }

    /// <summary>Null keeps the saved secret, an empty string removes it.</summary>
    [MaxLength(128)]
    public string? Secret { get; set; }
  }

  public class WeComSidebarConfigDTO
  {
    public bool Enabled { get; set; }
    public string? CorpId { get; set; }
    public int? AgentId { get; set; }
  }

  public class WeComSidebarSessionRequestDTO
  {
    [MaxLength(512)]
    public string? Code { get; set; }
  }

  public class WeComSidebarSessionDTO
  {
    /// <summary>Sent back in the X-Sidebar-Token header; missing when the WeCom account is not linked to a consultant.</summary>
    public string? Token { get; set; }
    public string? ConsultantName { get; set; }
    public string? WeComUserId { get; set; }
  }

  public class WeComSidebarSignatureRequestDTO
  {
    [MaxLength(1000)]
    public string? Url { get; set; }
  }

  public class WeComSidebarSignatureDTO
  {
    public required string CorpId { get; set; }
    public int AgentId { get; set; }
    public long Timestamp { get; set; }
    public required string NonceStr { get; set; }
    public required string ConfigSignature { get; set; }
    public required string AgentSignature { get; set; }
  }

  public class WeComSidebarContactRequestDTO
  {
    [MaxLength(64)]
    public string? ExternalUserId { get; set; }
  }

  public class WeComSidebarContactDTO
  {
    public required string StudentName { get; set; }
    public bool HasLink { get; set; }
    public bool LinkActive { get; set; }
    public int ViewCount { get; set; }
    public List<BrowseAlertViewDTO> RecentViews { get; set; } = new();
  }

  public class WeComSidebarSendRequestDTO
  {
    [MaxLength(64)]
    public string? ExternalUserId { get; set; }

    [MaxLength(300)]
    public string? Path { get; set; }

    [MaxLength(60)]
    public string? StudentName { get; set; }
  }

  /// <summary>The link card the sidebar puts into the chat with sendChatMessage.</summary>
  public class WeComSidebarCardDTO
  {
    public required string Url { get; set; }
    public required string Title { get; set; }
    public required string Description { get; set; }
    public required string ImageUrl { get; set; }

    /// <summary>False when this student's reminders were switched off, so the card carries no personal code.</summary>
    public bool Tracked { get; set; }
  }
}
