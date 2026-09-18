using COSXML;
using COSXML.Auth;
using COSXML.Model.Object;
using COSXML.Model.Tag;
using Microsoft.Extensions.Options;
using System.Security.Cryptography;
using System.Text;
using XiaoJuanSchoolPayment.Server.Data.Config;
using XiaoJuanSchoolPayment.Server.Interface;

namespace XiaoJuanSchoolPayment.Server.Services.Storage;

public sealed class TencentCosSchoolMediaStorage : ISchoolMediaStorage
{
  private readonly TencentCosOptions _options;
  private readonly CosXmlServer? _client;
  private readonly string _normalizedPrefix;
  private readonly Uri? _customDomain;

  public TencentCosSchoolMediaStorage(IOptions<TencentCosOptions> options)
  {
    _options = options.Value;
    _normalizedPrefix = NormalizePrefix(_options.KeyPrefix);
    _customDomain = ParseCustomDomain(_options.CustomDomain);

    if (!_options.Enabled)
    {
      return;
    }

    var config = new CosXmlConfig.Builder()
      .SetAppid(_options.AppId)
      .SetRegion(_options.Region)
      .IsHttps(true)
      .Build();
    var credentials = new DefaultQCloudCredentialProvider(
      _options.SecretId,
      _options.SecretKey,
      Math.Max(600, _options.SignedUrlLifetimeSeconds));
    _client = new CosXmlServer(config, credentials);
  }

  public bool Enabled => _options.Enabled;

  public bool UsesRedirectDelivery =>
    string.Equals(_options.DeliveryMode, "Redirect", StringComparison.OrdinalIgnoreCase);

  public string BuildObjectKey(Guid schoolId, string storedFileName) =>
    $"{_normalizedPrefix}/schools/{schoolId:N}/{storedFileName}";

  public bool IsCosObjectKey(string path)
  {
    if (string.IsNullOrWhiteSpace(path)) return false;
    return path.StartsWith($"{_normalizedPrefix}/", StringComparison.Ordinal);
  }

  public async Task UploadAsync(
    string objectKey,
    Stream content,
    long contentLength,
    string contentType,
    CancellationToken cancellationToken)
  {
    var client = GetClient();
    var request = new PutObjectRequest(_options.Bucket, objectKey, content, 0, contentLength);
    request.SetRequestHeader("Content-Type", contentType);
    request.SetRequestHeader("Cache-Control", "public, max-age=31536000, immutable");
    if (_options.UseServerSideEncryption)
    {
      request.SetCosServerSideEncryption();
    }

    using var cancellationRegistration = cancellationToken.Register(() => client.Cancel(request));
    await client.ExecuteAsync<PutObjectResult>(request).WaitAsync(cancellationToken);
  }

  public async Task DeleteAsync(string objectKey, CancellationToken cancellationToken)
  {
    var client = GetClient();
    var request = new DeleteObjectRequest(_options.Bucket, objectKey);
    using var cancellationRegistration = cancellationToken.Register(() => client.Cancel(request));
    await client.ExecuteAsync<DeleteObjectResult>(request).WaitAsync(cancellationToken);
  }

  public string CreateSignedReadUrl(string objectKey, string httpMethod)
  {
    var client = GetClient();
    var signature = new PreSignatureStruct
    {
      appid = _options.AppId,
      region = _options.Region,
      bucket = _options.Bucket,
      key = objectKey,
      httpMethod = httpMethod,
      isHttps = true,
      signHost = true,
      signDurationSecond = Math.Clamp(_options.SignedUrlLifetimeSeconds, 60, 3600),
    };

    if (UsesRedirectDelivery && _customDomain != null)
    {
      signature.host = _customDomain.IsDefaultPort
        ? _customDomain.Host
        : _customDomain.Authority;
    }

    return client.GenerateSignURL(signature);
  }

  public string CreatePreviewUrl(Guid mediaId)
  {
    var lifetime = Math.Clamp(_options.PreviewUrlLifetimeSeconds, 300, 86400);
    var expires = DateTimeOffset.UtcNow.AddSeconds(lifetime).ToUnixTimeSeconds();
    var signature = CreatePreviewSignature(mediaId, expires);
    return $"/school/media-file/{mediaId:N}?previewExpires={expires}&previewSignature={signature}";
  }

  public bool IsValidPreviewToken(Guid mediaId, long expires, string signature)
  {
    if (!_options.Enabled || string.IsNullOrWhiteSpace(signature)) return false;

    var now = DateTimeOffset.UtcNow.ToUnixTimeSeconds();
    var maximumLifetime = Math.Clamp(_options.PreviewUrlLifetimeSeconds, 300, 86400);
    if (expires < now || expires > now + maximumLifetime + 300) return false;

    var expected = Encoding.ASCII.GetBytes(CreatePreviewSignature(mediaId, expires));
    var supplied = Encoding.ASCII.GetBytes(signature.Trim());
    return expected.Length == supplied.Length &&
      CryptographicOperations.FixedTimeEquals(expected, supplied);
  }

  private CosXmlServer GetClient() => _client
    ?? throw new InvalidOperationException("腾讯云 COS 尚未启用或配置不完整。");

  private static string NormalizePrefix(string prefix)
  {
    var value = prefix.Trim().Trim('/');
    return string.IsNullOrWhiteSpace(value) ? "school-media" : value;
  }

  private static Uri? ParseCustomDomain(string value)
  {
    if (string.IsNullOrWhiteSpace(value)) return null;
    return Uri.TryCreate(value.Trim().TrimEnd('/'), UriKind.Absolute, out var uri)
      ? uri
      : null;
  }

  private string CreatePreviewSignature(Guid mediaId, long expires)
  {
    using var hmac = new HMACSHA256(Encoding.UTF8.GetBytes(_options.SecretKey));
    var payload = Encoding.UTF8.GetBytes($"{mediaId:N}:{expires}");
    return Convert.ToHexString(hmac.ComputeHash(payload)).ToLowerInvariant();
  }
}
