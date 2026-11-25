namespace XiaoJuanSchoolPayment.Server.Data.Config;

/// <summary>
/// WeChat mini program settings for subscribe messages (微信订阅消息). AppSecret is a secret and comes only from the
/// server environment (WeChatMiniProgram__AppSecret). Each template is picked in the mini program console
/// (订阅消息 → 公共模板库); its TemplateId and field keys go here. A template with no id is simply not sent.
/// </summary>
public sealed class WeChatMiniProgramOptions
{
  public string AppId { get; set; } = string.Empty;
  public string AppSecret { get; set; } = string.Empty;

  /// <summary>formal, trial or developer: which mini program version a tapped message opens.</summary>
  public string MiniProgramState { get; set; } = "formal";

  /// <summary>Keyed by <see cref="WeChatTemplateKinds"/>.</summary>
  public Dictionary<string, WeChatTemplateOptions> Templates { get; set; } = new(StringComparer.OrdinalIgnoreCase);

  public bool CanCallApi => !string.IsNullOrWhiteSpace(AppId) && !string.IsNullOrWhiteSpace(AppSecret);

  public WeChatTemplateOptions? Template(string kind) =>
    Templates.TryGetValue(kind, out var template) && !string.IsNullOrWhiteSpace(template.TemplateId) && template.Fields.Count > 0
      ? template
      : null;

  public IReadOnlyList<string> ConfiguredTemplateIds() =>
    WeChatTemplateKinds.All.Select(Template).Where(template => template != null).Select(template => template!.TemplateId.Trim())
      .Distinct().ToList();
}

public sealed class WeChatTemplateOptions
{
  public string TemplateId { get; set; } = string.Empty;

  /// <summary>
  /// Template field key (thing1, date2, amount3...) → text with placeholders: {title}, {school}, {student},
  /// {detail}, {state}, {status}, {item}, {amount}, {date}. The field type (the letters of the key) decides the format
  /// and length WeChat accepts, so the same placeholder fits a thing, date or amount field.
  /// </summary>
  public Dictionary<string, string> Fields { get; set; } = new(StringComparer.Ordinal);
}

public static class WeChatTemplateKinds
{
  /// <summary>Application published, payment confirmed, upload returned.</summary>
  public const string Progress = "Progress";

  /// <summary>A fee is due within 7 days.</summary>
  public const string FeeDue = "FeeDue";

  /// <summary>The course starts within 14 days and documents or fees are outstanding.</summary>
  public const string Departure = "Departure";

  public static readonly string[] All = [Progress, FeeDue, Departure];
}
