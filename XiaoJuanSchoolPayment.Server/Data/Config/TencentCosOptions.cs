namespace XiaoJuanSchoolPayment.Server.Data.Config;

public sealed class TencentCosOptions
{
  public const string SectionName = "TencentCos";

  public bool Enabled { get; set; }
  public string AppId { get; set; } = "";
  public string Region { get; set; } = "";
  public string Bucket { get; set; } = "";
  public string SecretId { get; set; } = "";
  public string SecretKey { get; set; } = "";
  public string KeyPrefix { get; set; } = "school-media";
  public string DeliveryMode { get; set; } = "Proxy";
  public string CustomDomain { get; set; } = "";
  public int SignedUrlLifetimeSeconds { get; set; } = 900;
  public int PreviewUrlLifetimeSeconds { get; set; } = 28800;
  public bool UseServerSideEncryption { get; set; } = true;
}
