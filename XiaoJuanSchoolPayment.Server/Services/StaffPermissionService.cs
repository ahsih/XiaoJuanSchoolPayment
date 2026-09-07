using System.Security.Claims;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using XiaoJuanSchoolPayment.Server.Data;
using XiaoJuanSchoolPayment.Server.Data.DTO;
using XiaoJuanSchoolPayment.Server.Data.Models;
using XiaoJuanSchoolPayment.Server.Interface;

namespace XiaoJuanSchoolPayment.Server.Services
{
  public class StaffPermissionService : IStaffPermissionService
  {
    public const string ClaimType = "SchoolPermission";
    private readonly AppDbContext _context;
    private readonly UserManager<SchoolUser> _userManager;

    public StaffPermissionService(AppDbContext context, UserManager<SchoolUser> userManager)
    {
      _context = context;
      _userManager = userManager;
    }

    public async Task<bool> HasAsync(ClaimsPrincipal user, Guid schoolId, string scope, CancellationToken cancellationToken)
    {
      if (user.IsInRole("Admin")) return true;
      if (!StaffPermissionScopes.All.Contains(scope, StringComparer.Ordinal)) return false;
      var userId = user.FindFirstValue(ClaimTypes.NameIdentifier);
      if (string.IsNullOrWhiteSpace(userId)) return false;
      var value = ClaimValue(schoolId, scope);
      return await _context.UserClaims.AsNoTracking().AnyAsync(
        claim => claim.UserId == userId && claim.ClaimType == ClaimType && claim.ClaimValue == value,
        cancellationToken);
    }

    public async Task<IList<Guid>> GetSchoolIdsAsync(ClaimsPrincipal user, string scope, CancellationToken cancellationToken)
    {
      if (user.IsInRole("Admin")) return await _context.Schools.AsNoTracking().Select(school => school.Id).ToListAsync(cancellationToken);
      var userId = user.FindFirstValue(ClaimTypes.NameIdentifier);
      if (string.IsNullOrWhiteSpace(userId)) return [];
      var suffix = $":{scope}";
      var values = await _context.UserClaims.AsNoTracking()
        .Where(claim => claim.UserId == userId && claim.ClaimType == ClaimType && claim.ClaimValue != null && claim.ClaimValue.EndsWith(suffix))
        .Select(claim => claim.ClaimValue!).ToListAsync(cancellationToken);
      return values.Select(ParseSchoolId).Where(id => id.HasValue).Select(id => id!.Value).Distinct().ToList();
    }

    public async Task<IList<StaffPermissionUserDTO>> GetStaffAsync(CancellationToken cancellationToken)
    {
      var staffRoleId = await _context.Roles.AsNoTracking().Where(role => role.Name == "Staff").Select(role => role.Id).FirstOrDefaultAsync(cancellationToken);
      if (staffRoleId == null) return [];
      var userIds = await _context.UserRoles.AsNoTracking().Where(link => link.RoleId == staffRoleId).Select(link => link.UserId).ToListAsync(cancellationToken);
      var users = await _context.Users.AsNoTracking().Where(user => userIds.Contains(user.Id)).OrderBy(user => user.FirstName).ThenBy(user => user.LastName).ToListAsync(cancellationToken);
      var result = new List<StaffPermissionUserDTO>();
      foreach (var user in users) result.Add(await BuildUserAsync(user, cancellationToken));
      return result;
    }

    public async Task<StaffPermissionUserDTO?> GetMineAsync(ClaimsPrincipal principal, CancellationToken cancellationToken)
    {
      var userId = principal.FindFirstValue(ClaimTypes.NameIdentifier);
      if (string.IsNullOrWhiteSpace(userId)) return null;
      var user = await _context.Users.AsNoTracking().FirstOrDefaultAsync(item => item.Id == userId, cancellationToken);
      if (user == null) return null;
      if (principal.IsInRole("Admin"))
      {
        var dto = await BuildUserAsync(user, cancellationToken);
        foreach (var school in dto.Schools) SetAll(school, true);
        return dto;
      }
      return await BuildUserAsync(user, cancellationToken);
    }

    public async Task<StaffPermissionUserDTO?> UpdateAsync(string userId, IList<StaffSchoolPermissionDTO> schools, CancellationToken cancellationToken)
    {
      var user = await _userManager.FindByIdAsync(userId);
      if (user == null || !await _userManager.IsInRoleAsync(user, "Staff")) return null;
      var knownSchoolIds = await _context.Schools.AsNoTracking().Select(school => school.Id).ToHashSetAsync(cancellationToken);
      var claims = (await _userManager.GetClaimsAsync(user)).Where(claim => claim.Type == ClaimType).ToList();
      if (claims.Count > 0)
      {
        var removeResult = await _userManager.RemoveClaimsAsync(user, claims);
        if (!removeResult.Succeeded) throw new InvalidOperationException(string.Join("; ", removeResult.Errors.Select(error => error.Description)));
      }
      var newClaims = schools.Where(school => knownSchoolIds.Contains(school.SchoolId)).SelectMany(ToClaims).DistinctBy(claim => claim.Value).ToList();
      if (newClaims.Count > 0)
      {
        var addResult = await _userManager.AddClaimsAsync(user, newClaims);
        if (!addResult.Succeeded) throw new InvalidOperationException(string.Join("; ", addResult.Errors.Select(error => error.Description)));
      }
      return await BuildUserAsync(user, cancellationToken);
    }

    private async Task<StaffPermissionUserDTO> BuildUserAsync(SchoolUser user, CancellationToken cancellationToken)
    {
      var schools = await _context.Schools.AsNoTracking().OrderBy(school => school.Name).ToListAsync(cancellationToken);
      var values = await _context.UserClaims.AsNoTracking().Where(claim => claim.UserId == user.Id && claim.ClaimType == ClaimType).Select(claim => claim.ClaimValue).ToListAsync(cancellationToken);
      var set = values.Where(value => value != null).ToHashSet(StringComparer.Ordinal);
      return new StaffPermissionUserDTO
      {
        UserId = user.Id,
        Name = $"{user.FirstName} {user.LastName}".Trim(),
        Account = user.PhoneNumber ?? user.Email ?? user.UserName ?? string.Empty,
        Schools = schools.Select(school => new StaffSchoolPermissionDTO
        {
          SchoolId = school.Id, SchoolName = school.Name,
          SchoolContent = set.Contains(ClaimValue(school.Id, StaffPermissionScopes.SchoolContent)),
          Pricing = set.Contains(ClaimValue(school.Id, StaffPermissionScopes.Pricing)),
          QuoteImage = set.Contains(ClaimValue(school.Id, StaffPermissionScopes.QuoteImage)),
          Media = set.Contains(ClaimValue(school.Id, StaffPermissionScopes.Media)),
          Students = set.Contains(ClaimValue(school.Id, StaffPermissionScopes.Students)),
        }).ToList(),
      };
    }

    private static IEnumerable<Claim> ToClaims(StaffSchoolPermissionDTO school)
    {
      if (school.SchoolContent) yield return NewClaim(school.SchoolId, StaffPermissionScopes.SchoolContent);
      if (school.Pricing) yield return NewClaim(school.SchoolId, StaffPermissionScopes.Pricing);
      if (school.QuoteImage) yield return NewClaim(school.SchoolId, StaffPermissionScopes.QuoteImage);
      if (school.Media) yield return NewClaim(school.SchoolId, StaffPermissionScopes.Media);
      if (school.Students) yield return NewClaim(school.SchoolId, StaffPermissionScopes.Students);
    }
    private static Claim NewClaim(Guid schoolId, string scope) => new(ClaimType, ClaimValue(schoolId, scope));
    private static string ClaimValue(Guid schoolId, string scope) => $"{schoolId:N}:{scope}";
    private static Guid? ParseSchoolId(string value) => Guid.TryParseExact(value.Split(':')[0], "N", out var id) ? id : null;
    private static void SetAll(StaffSchoolPermissionDTO school, bool value) { school.SchoolContent = value; school.Pricing = value; school.QuoteImage = value; school.Media = value; school.Students = value; }
  }
}
