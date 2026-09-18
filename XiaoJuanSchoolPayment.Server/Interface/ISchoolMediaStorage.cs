namespace XiaoJuanSchoolPayment.Server.Interface;

public interface ISchoolMediaStorage
{
  bool Enabled { get; }
  bool UsesRedirectDelivery { get; }
  string BuildObjectKey(Guid schoolId, string storedFileName);
  bool IsCosObjectKey(string path);
  Task UploadAsync(
    string objectKey,
    Stream content,
    long contentLength,
    string contentType,
    CancellationToken cancellationToken);
  Task DeleteAsync(string objectKey, CancellationToken cancellationToken);
  string CreateSignedReadUrl(string objectKey, string httpMethod);
  string CreatePreviewUrl(Guid mediaId);
  bool IsValidPreviewToken(Guid mediaId, long expires, string signature);
}
