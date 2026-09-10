using System.Security.Claims;
using XiaoJuanSchoolPayment.Server.Data.DTO;

namespace XiaoJuanSchoolPayment.Server.Interface
{
  public static class StaffPermissionScopes
  {
    public const string SchoolContent = "SchoolContent";
    public const string Pricing = "Pricing";
    public const string QuoteImage = "QuoteImage";
    public const string Media = "Media";
    public const string Students = "Students";
    public static readonly string[] All = [SchoolContent, Pricing, QuoteImage, Media, Students];
  }

  public interface IStaffPermissionService
  {
    Task<bool> HasAsync(ClaimsPrincipal user, Guid schoolId, string scope, CancellationToken cancellationToken);
    Task<IList<Guid>> GetSchoolIdsAsync(ClaimsPrincipal user, string scope, CancellationToken cancellationToken);
    Task<IList<StaffPermissionUserDTO>> GetStaffAsync(CancellationToken cancellationToken);
    Task<StaffPermissionUserDTO?> GetMineAsync(ClaimsPrincipal user, CancellationToken cancellationToken);
    Task<StaffPermissionUserDTO?> UpdateAsync(string userId, IList<StaffSchoolPermissionDTO> schools, CancellationToken cancellationToken);
    Task<StaffPermissionUserDTO?> UpdateEmployeeTypeAsync(string userId, string employeeType, CancellationToken cancellationToken);
  }
}
