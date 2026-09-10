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
      if (!StaffPermissionScopes.All.Contains(scope, StringComparer.Ordinal)) return false;
      if (user.IsInRole("Admin") || user.IsInRole("Manager") || user.IsInRole("Staff"))
      {
        return await _context.Schools.AsNoTracking().AnyAsync(school => school.Id == schoolId, cancellationToken);
      }
      var userId = user.FindFirstValue(ClaimTypes.NameIdentifier);
      if (string.IsNullOrWhiteSpace(userId)) return false;
      var value = ClaimValue(schoolId, scope);
      return await _context.UserClaims.AsNoTracking().AnyAsync(
        claim => claim.UserId == userId && claim.ClaimType == ClaimType && claim.ClaimValue == value,
        cancellationToken);
    }

    public async Task<IList<Guid>> GetSchoolIdsAsync(ClaimsPrincipal user, string scope, CancellationToken cancellationToken)
    {
      if (!StaffPermissionScopes.All.Contains(scope, StringComparer.Ordinal)) return [];
      if (user.IsInRole("Admin") || user.IsInRole("Manager") || user.IsInRole("Staff"))
      {
        return await _context.Schools.AsNoTracking().Select(school => school.Id).ToListAsync(cancellationToken);
      }
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
      var employeeRoles = await _context.Roles.AsNoTracking()
        .Where(role => role.Name == "Staff" || role.Name == "Manager")
        .Select(role => new { role.Id, role.Name })
        .ToListAsync(cancellationToken);
      if (employeeRoles.Count == 0) return [];

      var roleIds = employeeRoles.Select(role => role.Id).ToList();
      var roleLinks = await _context.UserRoles.AsNoTracking()
        .Where(link => roleIds.Contains(link.RoleId))
        .ToListAsync(cancellationToken);
      var userIds = roleLinks.Select(link => link.UserId).Distinct().ToList();
      var users = await _context.Users.AsNoTracking().Where(user => userIds.Contains(user.Id)).OrderBy(user => user.FirstName).ThenBy(user => user.LastName).ToListAsync(cancellationToken);
      var managerRoleId = employeeRoles.FirstOrDefault(role => role.Name == "Manager")?.Id;
      var result = new List<StaffPermissionUserDTO>();
      foreach (var user in users)
      {
        var employeeType = managerRoleId != null && roleLinks.Any(link => link.UserId == user.Id && link.RoleId == managerRoleId)
          ? "Manager"
          : "Consultant";
        result.Add(await BuildUserAsync(user, employeeType, cancellationToken));
      }
      return result;
    }

    public async Task<StaffPermissionUserDTO?> GetMineAsync(ClaimsPrincipal principal, CancellationToken cancellationToken)
    {
      var userId = principal.FindFirstValue(ClaimTypes.NameIdentifier);
      if (string.IsNullOrWhiteSpace(userId)) return null;
      var user = await _context.Users.AsNoTracking().FirstOrDefaultAsync(item => item.Id == userId, cancellationToken);
      if (user == null) return null;
      if (principal.IsInRole("Admin") || principal.IsInRole("Manager") || principal.IsInRole("Staff"))
      {
        var employeeType = principal.IsInRole("Admin") || principal.IsInRole("Manager") ? "Manager" : "Consultant";
        return await BuildUserAsync(user, employeeType, cancellationToken);
      }
      return null;
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
      return await BuildUserAsync(user, "Consultant", cancellationToken);
    }

    public async Task<StaffPermissionUserDTO?> UpdateEmployeeTypeAsync(
      string userId,
      string employeeType,
      CancellationToken cancellationToken)
    {
      var user = await _userManager.FindByIdAsync(userId);
      if (user == null) return null;

      var isManager = string.Equals(employeeType, "Manager", StringComparison.OrdinalIgnoreCase);
      var isConsultant = string.Equals(employeeType, "Consultant", StringComparison.OrdinalIgnoreCase);
      if (!isManager && !isConsultant) throw new ArgumentException("员工类型只能选择顾问或管理。");

      var currentRoles = await _userManager.GetRolesAsync(user);
      if (!currentRoles.Contains("Staff") && !currentRoles.Contains("Manager")) return null;

      var desiredRole = isManager ? "Manager" : "Staff";
      var otherRole = isManager ? "Staff" : "Manager";
      if (currentRoles.Contains(otherRole))
      {
        var removeResult = await _userManager.RemoveFromRoleAsync(user, otherRole);
        if (!removeResult.Succeeded) throw new InvalidOperationException(string.Join("; ", removeResult.Errors.Select(error => error.Description)));
      }
      if (!currentRoles.Contains(desiredRole))
      {
        var addResult = await _userManager.AddToRoleAsync(user, desiredRole);
        if (!addResult.Succeeded) throw new InvalidOperationException(string.Join("; ", addResult.Errors.Select(error => error.Description)));
      }

      return await BuildUserAsync(user, isManager ? "Manager" : "Consultant", cancellationToken);
    }

    private async Task<StaffPermissionUserDTO> BuildUserAsync(
      SchoolUser user,
      string employeeType,
      CancellationToken cancellationToken)
    {
      var schools = await _context.Schools.AsNoTracking().OrderBy(school => school.Name).ToListAsync(cancellationToken);
      return new StaffPermissionUserDTO
      {
        UserId = user.Id,
        Name = $"{user.FirstName} {user.LastName}".Trim(),
        Account = user.PhoneNumber ?? user.Email ?? user.UserName ?? string.Empty,
        EmployeeType = employeeType,
        CanPublish = string.Equals(employeeType, "Manager", StringComparison.Ordinal),
        Schools = schools.Select(school => new StaffSchoolPermissionDTO
        {
          SchoolId = school.Id, SchoolName = school.Name,
          SchoolContent = true,
          Pricing = true,
          QuoteImage = true,
          Media = true,
          Students = true,
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
