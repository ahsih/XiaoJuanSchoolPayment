using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using XiaoJuanSchoolPayment.Server.Data;
using XiaoJuanSchoolPayment.Server.Data.Config;
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
    private readonly AuthenticationOptions _authOptions;
    private readonly IVerificationCodeDeliveryService _deliveryService;
    private readonly IWebHostEnvironment _environment;
    private readonly ILogger<AuthController> _logger;

    public AuthController(
      UserManager<SchoolUser> userManager,
      SignInManager<SchoolUser> signInManager,
      AppDbContext context,
      IConfiguration config,
      IOptions<AuthenticationOptions> authOptions,
      IVerificationCodeDeliveryService deliveryService,
      IWebHostEnvironment environment,
      ILogger<AuthController> logger)
    {
      _userManager = userManager;
      _signInManager = signInManager;
      _context = context;
      _config = config;
      _authOptions = authOptions.Value;
      _deliveryService = deliveryService;
      _environment = environment;
      _logger = logger;
    }

    [AllowAnonymous]
    [HttpPost("verification-code")]
    public async Task<ActionResult<VerificationCodeResponseDTO>> SendVerificationCode(
      SendVerificationCodeDTO request,
      CancellationToken cancellationToken)
    {
      if (!AccountIdentifier.TryCreate(request.Account, out var account, out var accountError) || account == null)
      {
        return BadRequest(accountError);
      }

      var purpose = request.Purpose;
      var existingUser = await account.FindUserAsync(_userManager, _context);
      if (purpose == "Register" && existingUser != null)
      {
        return Conflict("该手机号码或邮箱已注册，请直接登录。");
      }
      if (purpose == "Login" && existingUser == null)
      {
        return BadRequest("该手机号码或邮箱尚未注册。");
      }

      var now = DateTime.UtcNow;
      var cooldown = Math.Clamp(_authOptions.ResendCooldownSeconds, 30, 300);
      var latestRequest = await _context.AccountVerificationCodes.AsNoTracking()
        .Where(x => x.Account == account.Value && x.Purpose == purpose)
        .OrderByDescending(x => x.CreatedAt)
        .FirstOrDefaultAsync(cancellationToken);
      if (latestRequest != null && latestRequest.CreatedAt.AddSeconds(cooldown) > now)
      {
        var retryAfter = (int)Math.Ceiling((latestRequest.CreatedAt.AddSeconds(cooldown) - now).TotalSeconds);
        return StatusCode(StatusCodes.Status429TooManyRequests, $"请在 {retryAfter} 秒后重新获取验证码。");
      }

      var hourlyLimit = Math.Clamp(_authOptions.MaxRequestsPerHour, 3, 20);
      var requestsLastHour = await _context.AccountVerificationCodes.CountAsync(
        x => x.Account == account.Value && x.Purpose == purpose && x.CreatedAt >= now.AddHours(-1),
        cancellationToken);
      if (requestsLastHour >= hourlyLimit)
      {
        return StatusCode(StatusCodes.Status429TooManyRequests, "验证码请求过于频繁，请稍后再试。");
      }

      var code = RandomNumberGenerator.GetInt32(0, 1_000_000).ToString("D6");
      var lifetimeMinutes = Math.Clamp(_authOptions.VerificationCodeLifetimeMinutes, 3, 15);
      var verification = new AccountVerificationCode
      {
        Id = Guid.NewGuid(),
        Account = account.Value,
        AccountType = account.Type,
        Purpose = purpose,
        CodeHash = HashVerificationCode(account.Value, purpose, code),
        CreatedAt = now,
        ExpiresAt = now.AddMinutes(lifetimeMinutes),
      };

      _context.AccountVerificationCodes.Add(verification);
      await _context.SaveChangesAsync(cancellationToken);

      string? developmentCode = null;
      try
      {
        await _deliveryService.SendAsync(account, code, cancellationToken);
      }
      catch (VerificationDeliveryUnavailableException) when (_environment.IsDevelopment())
      {
        developmentCode = code;
        _logger.LogWarning("Verification delivery is not configured for {AccountType}; returning a development-only code.", account.Type);
      }
      catch (Exception ex)
      {
        verification.ConsumedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync(cancellationToken);
        _logger.LogError(ex, "Failed to deliver a verification code through {AccountType}.", account.Type);
        return StatusCode(StatusCodes.Status503ServiceUnavailable, "验证码暂时无法发送，请稍后重试。");
      }

      return Ok(new VerificationCodeResponseDTO
      {
        DeliveryChannel = account.Type,
        MaskedAccount = MaskAccount(account),
        ExpiresInSeconds = lifetimeMinutes * 60,
        RetryAfterSeconds = cooldown,
        DevelopmentCode = developmentCode,
      });
    }

    [AllowAnonymous]
    [HttpPost("register")]
    public async Task<IActionResult> Register(SchoolUserDTO request, CancellationToken cancellationToken)
    {
      if (!AccountIdentifier.TryCreate(request.Account, out var account, out var accountError) || account == null)
      {
        return BadRequest(accountError);
      }

      if (await account.FindUserAsync(_userManager, _context) != null)
      {
        return Conflict("该手机号码或邮箱已注册，请直接登录。");
      }

      await using var transaction = await _context.Database.BeginTransactionAsync(cancellationToken);
      var now = DateTime.UtcNow;
      var invitationHash = XiaoJuanSchoolPayment.Server.Controllers.InvitationCodesController.HashCode(request.InvitationCode);
      var invitation = await _context.InvitationCodes.AsNoTracking()
        .FirstOrDefaultAsync(x => x.CodeHash == invitationHash, cancellationToken);
      var role = string.Empty;

      if (invitation != null)
      {
        if (invitation.UsedAt.HasValue || invitation.RevokedAt.HasValue || invitation.ExpiresAt <= now)
        {
          await transaction.RollbackAsync(cancellationToken);
          return BadRequest("验证码无效、已使用或已过期。");
        }
        role = invitation.Role;
      }
      else
      {
        var accessCode = _config["AccessCode"];
        var canBootstrapAdmin = !await _context.Users.AnyAsync(cancellationToken)
          && !string.IsNullOrWhiteSpace(accessCode)
          && string.Equals(accessCode, request.InvitationCode, StringComparison.Ordinal);
        if (!canBootstrapAdmin)
        {
          await transaction.RollbackAsync(cancellationToken);
          return BadRequest("验证码无效、已使用或已过期。");
        }
        role = "Admin";
      }

      var displayName = request.Name.Trim();
      var user = new SchoolUser
      {
        Email = account.Type == "Email" ? account.Value : null,
        EmailConfirmed = account.Type == "Email",
        PhoneNumber = account.Type == "Phone" ? account.Value : null,
        PhoneNumberConfirmed = account.Type == "Phone",
        FirstName = displayName,
        LastName = string.Empty,
        UserName = account.UserName,
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
          return Conflict("该验证码刚刚已被使用，请向邀请人获取新的验证码。");
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

      if (request.Method == "Password")
      {
        if (string.IsNullOrWhiteSpace(request.Password))
        {
          return BadRequest("请输入密码。");
        }

        var passwordResult = await _signInManager.CheckPasswordSignInAsync(user, request.Password, lockoutOnFailure: true);
        if (!passwordResult.Succeeded)
        {
          return Unauthorized(passwordResult.IsLockedOut ? "登录尝试过多，请稍后再试。" : "账号或密码不正确。");
        }
      }
      else
      {
        if (string.IsNullOrWhiteSpace(request.VerificationCode))
        {
          return BadRequest("请输入验证码。");
        }

        var codeError = await ValidateAndConsumeCodeAsync(account.Value, "Login", request.VerificationCode, cancellationToken);
        if (codeError != null)
        {
          return Unauthorized(codeError);
        }
      }

      return Ok(await CreateTokenAsync(user));
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

    private async Task<string?> ValidateAndConsumeCodeAsync(
      string account,
      string purpose,
      string code,
      CancellationToken cancellationToken)
    {
      var now = DateTime.UtcNow;
      var verification = await _context.AccountVerificationCodes.AsNoTracking()
        .Where(x => x.Account == account && x.Purpose == purpose && x.ConsumedAt == null && x.ExpiresAt > now)
        .OrderByDescending(x => x.CreatedAt)
        .FirstOrDefaultAsync(cancellationToken);
      if (verification == null)
      {
        return "验证码无效或已过期，请重新获取。";
      }

      var maxAttempts = Math.Clamp(_authOptions.MaxFailedAttempts, 3, 10);
      if (verification.FailedAttempts >= maxAttempts)
      {
        await _context.AccountVerificationCodes
          .Where(x => x.Id == verification.Id && x.ConsumedAt == null)
          .ExecuteUpdateAsync(setters => setters.SetProperty(x => x.ConsumedAt, now), cancellationToken);
        return "验证码尝试次数过多，请重新获取。";
      }

      var suppliedHash = HashVerificationCode(account, purpose, code);
      if (!CryptographicOperations.FixedTimeEquals(
        Convert.FromHexString(verification.CodeHash),
        Convert.FromHexString(suppliedHash)))
      {
        if (verification.FailedAttempts + 1 >= maxAttempts)
        {
          await _context.AccountVerificationCodes
            .Where(x => x.Id == verification.Id && x.ConsumedAt == null)
            .ExecuteUpdateAsync(setters => setters
              .SetProperty(x => x.FailedAttempts, x => x.FailedAttempts + 1)
              .SetProperty(x => x.ConsumedAt, now), cancellationToken);
        }
        else
        {
          await _context.AccountVerificationCodes
            .Where(x => x.Id == verification.Id && x.ConsumedAt == null)
            .ExecuteUpdateAsync(setters => setters
              .SetProperty(x => x.FailedAttempts, x => x.FailedAttempts + 1), cancellationToken);
        }
        return "验证码不正确。";
      }

      var consumedCodes = await _context.AccountVerificationCodes
        .Where(x => x.Id == verification.Id && x.ConsumedAt == null && x.ExpiresAt > now)
        .ExecuteUpdateAsync(setters => setters.SetProperty(x => x.ConsumedAt, now), cancellationToken);
      return consumedCodes == 1 ? null : "验证码已被使用，请重新获取。";
    }

    private string HashVerificationCode(string account, string purpose, string code)
    {
      var secret = _config["Jwt:Key"] ?? throw new InvalidOperationException("Jwt:Key is not configured.");
      using var hmac = new HMACSHA256(Encoding.UTF8.GetBytes(secret));
      return Convert.ToHexString(hmac.ComputeHash(Encoding.UTF8.GetBytes($"{account}|{purpose}|{code}")));
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

    private static string MaskAccount(AccountIdentifier account)
    {
      if (account.Type == "Phone")
      {
        var value = account.Value;
        return value.Length > 8 ? $"{value[..Math.Min(5, value.Length - 4)]}****{value[^4..]}" : "****";
      }

      var parts = account.Value.Split('@', 2);
      var localPart = parts[0];
      var maskedLocal = localPart.Length <= 2
        ? $"{localPart[0]}*"
        : $"{localPart[..2]}***";
      return $"{maskedLocal}@{parts[1]}";
    }
  }
}
