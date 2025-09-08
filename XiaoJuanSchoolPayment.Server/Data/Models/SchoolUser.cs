using Microsoft.AspNetCore.Identity;

namespace XiaoJuanSchoolPayment.Server.Data.Models
{
  public class SchoolUser : IdentityUser
  {
    public required string FirstName { get; set; }
    public required string LastName { get; set; }
  }
}
