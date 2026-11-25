using System.ComponentModel.DataAnnotations;

namespace XiaoJuanSchoolPayment.Server.Data.Models
{
  /// <summary>
  /// A personal link a consultant sends one student (for example in personal WeChat). The website
  /// remembers its code in the student's browser and reports each school page the student opens, so
  /// the consultant gets a WeCom reminder to follow up. See BrowseAlertsController.
  /// </summary>
  public class BrowseAlertLink : AuditableEntity
  {
    /// <summary>Random code carried by the link (?vt=…); it only attributes page views, it grants nothing.</summary>
    [MaxLength(16)]
    public required string Code { get; set; }

    [MaxLength(60)]
    public required string StudentName { get; set; }

    /// <summary>Consultant name from the client's SIDA_CONSULTANT_DAILY_ORDER, e.g. "Perrin".</summary>
    [MaxLength(20)]
    public required string ConsultantName { get; set; }

    [MaxLength(300)]
    public string? Note { get; set; }

    /// <summary>The page the link opens, e.g. /philippines-study/cebu/cia-cebu-international-academy.</summary>
    [MaxLength(300)]
    public required string LandingPath { get; set; }

    /// <summary>The student as a WeCom customer (external_userid), when the link was sent from the WeCom chat sidebar.</summary>
    [MaxLength(64)]
    public string? WeComExternalUserId { get; set; }

    /// <summary>The employee's Identity user id, or "wecom:&lt;account&gt;" for a link sent from the WeCom chat sidebar.</summary>
    [MaxLength(450)]
    public required string CreatedByUserId { get; set; }

    public DateTime CreatedAt { get; set; }
    public DateTime? RevokedAt { get; set; }
    public DateTime? LastViewedAt { get; set; }
    public int ViewCount { get; set; }

    public List<BrowseAlertView> Views { get; set; } = new();
  }

  /// <summary>One school page opened through a <see cref="BrowseAlertLink"/>.</summary>
  public class BrowseAlertView : AuditableEntity
  {
    public Guid BrowseAlertLinkId { get; set; }
    public BrowseAlertLink? BrowseAlertLink { get; set; }

    [MaxLength(300)]
    public required string Path { get; set; }

    [MaxLength(120)]
    public required string PageName { get; set; }

    public DateTime ViewedAt { get; set; }

    /// <summary>False when the view repeated the same page within a few minutes, so no reminder went out.</summary>
    public bool Notified { get; set; }
  }

  /// <summary>
  /// Where reminders for one consultant go: a WeCom group robot webhook and who to @ in it.
  /// The row named "default" holds the shared webhook used when a consultant has none of their own.
  /// </summary>
  public class BrowseAlertChannel
  {
    public const string DefaultName = "default";

    [Key]
    [MaxLength(20)]
    public required string ConsultantName { get; set; }

    [MaxLength(300)]
    public string? WebhookUrl { get; set; }

    /// <summary>Mobile number or WeCom account to @ in the group, so the reminder stands out for that consultant.</summary>
    [MaxLength(64)]
    public string? Mention { get; set; }

    /// <summary>
    /// The consultant's WeCom account (userid). With the WeCom app set up, reminders go to this account as
    /// an app message instead of the group, and the chat sidebar knows which consultant is using it.
    /// </summary>
    [MaxLength(64)]
    public string? WeComUserId { get; set; }

    public DateTime UpdatedAt { get; set; }

    [MaxLength(450)]
    public string? UpdatedByUserId { get; set; }
  }

  /// <summary>
  /// The WeCom self-built app (自建应用) that sends reminders straight to a consultant and runs the chat
  /// sidebar. One row, id "default". Only owner Admins change it; the secret is never sent back.
  /// </summary>
  public class WeComAppSetting
  {
    public const string DefaultId = "default";

    [Key]
    [MaxLength(20)]
    public required string Id { get; set; }

    [MaxLength(64)]
    public string? CorpId { get; set; }

    public int? AgentId { get; set; }

    [MaxLength(128)]
    public string? Secret { get; set; }

    public DateTime UpdatedAt { get; set; }

    [MaxLength(450)]
    public string? UpdatedByUserId { get; set; }
  }
}
