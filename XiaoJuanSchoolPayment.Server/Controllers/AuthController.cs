using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.IdentityModel.Tokens;
using XiaoJuanSchoolPayment.Server.Data;
using XiaoJuanSchoolPayment.Server.Data.DTO;
using XiaoJuanSchoolPayment.Server.Data.Models;
using XiaoJuanSchoolPayment.Server.Services;

namespace MyProject.Controllers
{
  [ApiController]
  [Route("auth")]
  public class AuthController : ControllerBase
  {
    private readonly UserManager<SchoolUser> _userManager;
    private readonly SignInManager<SchoolUser> _signInManager;
    private readonly AppDbContext _context;
    private readonly IConfiguration _config;
    private readonly IMemoryCache _memoryCache;
    private readonly IAccountEmailService _accountEmailService;
    private readonly ILogger<AuthController> _logger;

    public AuthController(
      UserManager<SchoolUser> userManager,
      SignInManager<SchoolUser> signInManager,
      AppDbContext context,
      IConfiguration config,
      IMemoryCache memoryCache,
      IAccountEmailService accountEmailService,
      ILogger<AuthController> logger)
    {
      _userManager = userManager;
      _signInManager = signInManager;
      _context = context;
      _config = config;
      _memoryCache = memoryCache;
      _accountEmailService = accountEmailService;
      _logger = logger;
    }

        [AllowAnonymous]
        [HttpPost("register")]
        public async Task<IActionResult> Register(SchoolUserDTO request, CancellationToken cancellationToken)
        {
            if (!AccountIdentifier.TryCreate(request.Email, out var email, out var emailError)
              || email == null
              || email.Type != "Email")
            {
                return BadRequest(emailError ?? "邮箱格式不正确。");
            }

            if (await email.FindUserAsync(_userManager, _context) != null)
            {
                return Conflict("该邮箱已注册，请直接登录。");
            }

            AccountIdentifier? phone = null;
            if (!string.IsNullOrWhiteSpace(request.PhoneNumber))
            {
                if (!AccountIdentifier.TryCreate(request.PhoneNumber, out phone, out var phoneError)
                  || phone == null
                  || phone.Type != "Phone")
                {
                    return BadRequest(phoneError ?? "手机号码格式不正确。");
                }

                if (await phone.FindUserAsync(_userManager, _context) != null)
                {
                    return Conflict("该手机号码已注册，请直接登录。");
                }
            }

            await using var transaction = await _context.Database.BeginTransactionAsync(cancellationToken);
            var now = DateTime.UtcNow;
            InvitationCode? invitation = null;
            var role = string.Empty;
            var accessCode = _config["AccessCode"];
            var usesAdminAccessCode = !string.IsNullOrWhiteSpace(accessCode)
              && string.Equals(accessCode, request.AccessCode, StringComparison.Ordinal);

            if (usesAdminAccessCode)
            {
                role = "Admin";
            }
            else
            {
                var invitationHash = XiaoJuanSchoolPayment.Server.Controllers.InvitationCodesController.HashCode(request.InvitationCode);
                invitation = await _context.InvitationCodes.AsNoTracking()
                  .FirstOrDefaultAsync(x => x.CodeHash == invitationHash, cancellationToken);
                if (invitation == null
                  || invitation.UsedAt.HasValue
                  || invitation.RevokedAt.HasValue
                  || invitation.ExpiresAt <= now)
                {
                    await transaction.RollbackAsync(cancellationToken);
                    return BadRequest("邀请码或管理员访问码无效、已使用或已过期。");
                }
                role = invitation.Role;
            }

            var displayName = request.Name.Trim();
            var user = new SchoolUser
            {
                Email = email.Value,
                EmailConfirmed = false,
                PhoneNumber = phone?.Value,
                PhoneNumberConfirmed = false,
                FirstName = displayName,
                LastName = string.Empty,
                UserName = email.UserName,
            };

            var createResult = await _userManager.CreateAsync(user, request.Password);
            if (!createResult.Succeeded)
            {
                await transaction.RollbackAsync(cancellationToken);
                return BadRequest(createResult.Errors.Select(x => x.Description));
            }

            var roleResult = await _userManager.AddToRoleAsync(user, role);
            if (!roleResult.Succeeded)
            {
                await transaction.RollbackAsync(cancellationToken);
                return BadRequest(roleResult.Errors.Select(x => x.Description));
            }

            if (string.Equals(role, "Student", StringComparison.OrdinalIgnoreCase))
            {
                await _context.StudentApplications
                  .Where(application => application.StudentUserId == null
                    && application.StudentEmail != null
                    && application.StudentEmail.ToLower() == email.Value.ToLower())
                  .ExecuteUpdateAsync(setters => setters
                    .SetProperty(application => application.StudentUserId, user.Id), cancellationToken);
            }

            if (invitation != null)
            {
                var consumedInvitations = await _context.InvitationCodes
                  .Where(x => x.Id == invitation.Id
                    && x.UsedAt == null
                    && x.RevokedAt == null
                    && x.ExpiresAt > now)
                  .ExecuteUpdateAsync(setters => setters
                    .SetProperty(x => x.UsedAt, now)
                    .SetProperty(x => x.UsedByUserId, user.Id), cancellationToken);
                if (consumedInvitations != 1)
                {
                    await transaction.RollbackAsync(cancellationToken);
                    return Conflict("该邀请码刚刚已被使用，请向邀请人获取新的邀请码。");
                }
            }

            await transaction.CommitAsync(cancellationToken);
            return Ok();
        }

    [AllowAnonymous]
    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginDTO request, CancellationToken cancellationToken)
    {
      if (!AccountIdentifier.TryCreate(request.Account, out var account, out var accountError) || account == null)
      {
        return BadRequest(accountError);
      }

      var user = await account.FindUserAsync(_userManager, _context);
      if (user == null)
      {
        return Unauthorized("账号或登录凭证不正确。");
      }

      var passwordResult = await _signInManager.CheckPasswordSignInAsync(
        user,
        request.Password,
        lockoutOnFailure: true);
      if (!passwordResult.Succeeded)
      {
        return Unauthorized(passwordResult.IsLockedOut
          ? "登录尝试过多，请稍后再试。"
          : "账号或密码不正确。");
      }

      return Ok(await CreateTokenAsync(user));
    }

    [AllowAnonymous]
    [HttpPost("forgot-password")]
    public async Task<IActionResult> ForgotPassword(
      ForgotPasswordDTO request,
      CancellationToken cancellationToken)
    {
      if (!AccountIdentifier.TryCreate(request.Account, out var account, out var accountError) || account == null)
      {
        return BadRequest(accountError);
      }

      var cooldownKey = $"password-reset:{account.Type}:{account.Value}";
      if (_memoryCache.TryGetValue(cooldownKey, out _))
      {
        return Accepted(new { message = "如果该账号存在，密码重置邮件将发送至注册邮箱。" });
      }
      _memoryCache.Set(cooldownKey, true, TimeSpan.FromMinutes(1));

      var user = await account.FindUserAsync(_userManager, _context);
      if (user == null || string.IsNullOrWhiteSpace(user.Email))
      {
        return Accepted(new { message = "如果该账号存在，密码重置邮件将发送至注册邮箱。" });
      }

      var token = await _userManager.GeneratePasswordResetTokenAsync(user);
      var resetUrl = BuildPasswordResetUrl(user.Email, token);
      var displayName = string.Join(" ", new[] { user.FirstName, user.LastName }
        .Where(x => !string.IsNullOrWhiteSpace(x)));

      try
      {
        await _accountEmailService.SendPasswordResetAsync(
          user.Email,
          displayName,
          resetUrl,
          cancellationToken);
      }
      catch (Exception ex)
      {
        _memoryCache.Remove(cooldownKey);
        _logger.LogError(ex, "Failed to send a password reset email.");
        return StatusCode(
          StatusCodes.Status503ServiceUnavailable,
          "密码重置邮件暂时无法发送，请稍后重试。");
      }

      return Accepted(new { message = "如果该账号存在，密码重置邮件将发送至注册邮箱。" });
    }

    [AllowAnonymous]
    [HttpPost("reset-password")]
    public async Task<IActionResult> ResetPassword(ResetPasswordDTO request)
    {
      var email = request.Email.Trim().ToLowerInvariant();
      var user = await _userManager.FindByEmailAsync(email);
      if (user == null)
      {
        return BadRequest("密码重置链接无效或已过期，请重新申请。");
      }

      user.EmailConfirmed = true;
      var result = await _userManager.ResetPasswordAsync(user, request.Token, request.NewPassword);
      if (!result.Succeeded)
      {
        return BadRequest(result.Errors.Any(x => x.Code.Contains("Password", StringComparison.OrdinalIgnoreCase))
          ? result.Errors.Select(x => x.Description)
          : new[] { "密码重置链接无效或已过期，请重新申请。" });
      }

      return Ok();
    }

        [Authorize]
    [HttpPost("change-password")]
    public async Task<IActionResult> ChangePassword(ChangePasswordDTO model)
    {
      var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
      var user = string.IsNullOrWhiteSpace(userId) ? null : await _userManager.FindByIdAsync(userId);
      if (user == null)
      {
        return Unauthorized();
      }

      var result = await _userManager.ChangePasswordAsync(user, model.CurrentPassword, model.NewPassword);
      return result.Succeeded ? Ok() : BadRequest(result.Errors.Select(x => x.Description));
    }

    private string BuildPasswordResetUrl(string email, string token)
    {
      var configuredOrigin = _config["Authentication:PublicOrigin"]?.Trim().TrimEnd('/');
      var origin = string.IsNullOrWhiteSpace(configuredOrigin)
        ? $"{Request.Scheme}://{Request.Host}"
        : configuredOrigin;
      return $"{origin}/reset-password?email={Uri.EscapeDataString(email)}&token={Uri.EscapeDataString(token)}";
    }

    private async Task<JWTLoginTokenDTO> CreateTokenAsync(SchoolUser user)
    {
      var roles = await _userManager.GetRolesAsync(user);
      var displayName = string.Join(" ", new[] { user.FirstName, user.LastName }.Where(x => !string.IsNullOrWhiteSpace(x)));
      var claims = new List<Claim>
      {
        new(JwtRegisteredClaimNames.Sub, user.Id),
        new(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
        new(ClaimTypes.NameIdentifier, user.Id),
        new(ClaimTypes.Name, displayName),
      };
      if (!string.IsNullOrWhiteSpace(user.Email))
      {
        claims.Add(new Claim(ClaimTypes.Email, user.Email));
      }
      if (!string.IsNullOrWhiteSpace(user.PhoneNumber))
      {
        claims.Add(new Claim(ClaimTypes.MobilePhone, user.PhoneNumber));
      }
      foreach (var role in roles)
      {
        claims.Add(new Claim(ClaimTypes.Role, role));
      }

      var keyValue = _config["Jwt:Key"] ?? throw new InvalidOperationException("Jwt:Key is not configured.");
      var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(keyValue));
      var expiresMinutes = double.TryParse(_config["Jwt:ExpiresInMinutes"], out var configuredMinutes)
        ? configuredMinutes
        : 120;
      var token = new JwtSecurityToken(
        issuer: _config["Jwt:Issuer"],
        audience: _config["Jwt:Audience"],
        claims: claims,
        expires: DateTime.UtcNow.AddMinutes(expiresMinutes),
        signingCredentials: new SigningCredentials(key, SecurityAlgorithms.HmacSha256));

      return new JWTLoginTokenDTO
      {
        Token = new JwtSecurityTokenHandler().WriteToken(token),
        ExpiryDate = token.ValidTo,
        Roles = roles,
        Name = displayName,
        Account = user.Email ?? user.PhoneNumber ?? user.UserName ?? string.Empty,
        Email = user.Email,
        PhoneNumber = user.PhoneNumber,
      };
    }

  }
}
