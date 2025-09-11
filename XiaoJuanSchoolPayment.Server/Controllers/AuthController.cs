using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using XiaoJuanSchoolPayment.Server.Data.DTO;
using XiaoJuanSchoolPayment.Server.Data.Models;

namespace MyProject.Controllers
{
  [ApiController]
  [Route("auth")]
  public class AuthController : ControllerBase
  {
    private readonly UserManager<SchoolUser> _userManager;
    private readonly SignInManager<SchoolUser> _signInManager;
    private readonly IConfiguration _config;

    public AuthController(UserManager<SchoolUser> userManager, SignInManager<SchoolUser> signInManager, IConfiguration config)
    {
      _userManager = userManager;
      _signInManager = signInManager;
      _config = config;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register(SchoolUserDTO schoolUser)
    {
      string accessCode = _config["AccessCode"] ?? "";
      if(string.IsNullOrEmpty(accessCode) || !accessCode.Equals(schoolUser.AccessCode))
      {
        return BadRequest("Incorrect Access Code");
      }

      var user = new SchoolUser
      {
        Email = schoolUser.Email,
        FirstName = schoolUser.FirstName,
        LastName = schoolUser.LastName,
        UserName = schoolUser.Email
      };

      var result = await _userManager.CreateAsync(user, schoolUser.Password);

      if (result.Succeeded)
      {
        await _userManager.AddToRoleAsync(user, "Admin");
        return Ok();
      }
      return BadRequest(result.Errors);
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginDTO model)
    {
      var user = await _userManager.FindByEmailAsync(model.Email);
      if (user == null)
        return Unauthorized("Invalid login");

      var result = await _signInManager.PasswordSignInAsync(model.Email, model.Password, false, false);

      if (!result.Succeeded)
        return Unauthorized("Invalid login");

      var roles = await _userManager.GetRolesAsync(user);
      var claims = new List<Claim>
    {
        new Claim(JwtRegisteredClaimNames.Sub, user.Email),
        new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
        new Claim(ClaimTypes.Name, user.FirstName + " " + user.LastName),
        new Claim(ClaimTypes.Email, user.Email)
    };

      foreach (var role in roles)
      {
        claims.Add(new Claim(ClaimTypes.Role, role.ToString()));
      }

      var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]));
      var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
      var expires = DateTime.Now.AddMinutes(double.Parse(_config["Jwt:ExpiresInMinutes"]));
      var token = new JwtSecurityToken(
          issuer: _config["Jwt:Issuer"],
          audience: _config["Jwt:Audience"],
          claims: claims,
          expires: expires,
          signingCredentials: creds
      );

      return Ok(new
       JWTLoginTokenDTO {
        Token = new JwtSecurityTokenHandler().WriteToken(token),
        ExpiryDate = token.ValidTo,
        Roles = roles,
        Name = user.FirstName + " " + user.LastName,
        Email = user.Email
      });
    }

  }
}