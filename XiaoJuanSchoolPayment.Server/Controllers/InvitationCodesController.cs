using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using XiaoJuanSchoolPayment.Server.Data;
using XiaoJuanSchoolPayment.Server.Data.DTO;
using XiaoJuanSchoolPayment.Server.Data.Models;

namespace XiaoJuanSchoolPayment.Server.Controllers
{
  [ApiController]
  [Authorize(Roles = "Admin,Staff")]
  [Route("auth/invitations")]
  public class InvitationCodesController : ControllerBase
  {
    private readonly AppDbContext _context;

    public InvitationCodesController(AppDbContext context)
    {
      _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IList<InvitationCodeDTO>>> GetMine(CancellationToken cancellationToken)
    {
      var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
      if (string.IsNullOrWhiteSpace(userId)) return Unauthorized();

      var invitations = await _context.InvitationCodes.AsNoTracking()
        .Where(x => x.CreatedByUserId == userId)
        .OrderByDescending(x => x.CreatedAt)
        .Take(100)
        .ToListAsync(cancellationToken);

      return Ok(invitations.Select(x => ToDto(x, code: null)).ToList());
    }

    [HttpPost]
    public async Task<ActionResult<InvitationCodeDTO>> Create(
      [FromBody] CreateInvitationCodeDTO request,
      CancellationToken cancellationToken)
    {
      var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
      if (string.IsNullOrWhiteSpace(userId)) return Unauthorized();

      var role = User.IsInRole("Admin") ? "Staff" : "Student";
      var code = CreateReadableCode(role);
      var now = DateTime.UtcNow;
      var invitation = new InvitationCode
      {
        Id = Guid.NewGuid(),
        CodeHash = HashCode(code),
        CodePrefix = code[..Math.Min(12, code.Length)],
        Role = role,
        CreatedByUserId = userId,
        CreatedAt = now,
        ExpiresAt = now.AddDays(request.ExpiresInDays),
      };

      _context.InvitationCodes.Add(invitation);
      await _context.SaveChangesAsync(cancellationToken);
      return Ok(ToDto(invitation, code));
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Revoke(Guid id, CancellationToken cancellationToken)
    {
      var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
      if (string.IsNullOrWhiteSpace(userId)) return Unauthorized();

      var invitation = await _context.InvitationCodes
        .FirstOrDefaultAsync(x => x.Id == id && x.CreatedByUserId == userId, cancellationToken);
      if (invitation == null) return NotFound();
      if (invitation.UsedAt.HasValue) return BadRequest("已使用的邀请码不能撤销。");
      if (!invitation.RevokedAt.HasValue)
      {
        invitation.RevokedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync(cancellationToken);
      }

      return NoContent();
    }

    public static string HashCode(string code)
    {
      var normalized = code.Trim().ToUpperInvariant();
      return Convert.ToHexString(SHA256.HashData(Encoding.UTF8.GetBytes(normalized)));
    }

    private static string CreateReadableCode(string role)
    {
      var value = Convert.ToHexString(RandomNumberGenerator.GetBytes(10));
      var groups = Enumerable.Range(0, 5).Select(index => value.Substring(index * 4, 4));
      return $"{(role == "Staff" ? "YG-EMP" : "YG-STU")}-{string.Join('-', groups)}";
    }

    private static InvitationCodeDTO ToDto(InvitationCode invitation, string? code)
    {
      var now = DateTime.UtcNow;
      var status = invitation.UsedAt.HasValue
        ? "已使用"
        : invitation.RevokedAt.HasValue
          ? "已撤销"
          : invitation.ExpiresAt <= now
            ? "已过期"
            : "未使用";

      return new InvitationCodeDTO
      {
        Id = invitation.Id,
        Code = code,
        CodePrefix = invitation.CodePrefix,
        Role = invitation.Role,
        CreatedAt = invitation.CreatedAt,
        ExpiresAt = invitation.ExpiresAt,
        UsedAt = invitation.UsedAt,
        RevokedAt = invitation.RevokedAt,
        Status = status,
      };
    }
  }
}
