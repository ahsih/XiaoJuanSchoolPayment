using Microsoft.AspNetCore.Identity;

namespace XiaoJuanSchoolPayment.Server.Services
{
  public static class UserRoleInitialize
  {
    public static async Task Initialize(IServiceProvider serviceProvider)
    {
      var roleManager = serviceProvider.GetRequiredService<RoleManager<IdentityRole>>();

      string[] roles = { "Admin", "User" };

      foreach (var role in roles)
      {
        if (!await roleManager.RoleExistsAsync(role))
        {
          await roleManager.CreateAsync(new IdentityRole(role));
        }
      }
    }
  }
}
