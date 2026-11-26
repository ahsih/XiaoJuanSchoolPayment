using Microsoft.AspNetCore.Identity;

namespace XiaoJuanSchoolPayment.Server.Data.Models
{
  public class SchoolUser : IdentityUser
  {
    public required string FirstName { get; set; }
    public required string LastName { get; set; }

    /// <summary>The student's openid in the WeChat mini program, set when they turn on WeChat reminders.</summary>
    [System.ComponentModel.DataAnnotations.MaxLength(64)]
    public string? WeChatOpenId { get; set; }
  }
}
