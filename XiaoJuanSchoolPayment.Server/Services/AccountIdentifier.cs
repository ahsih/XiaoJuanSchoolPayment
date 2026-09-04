using System.ComponentModel.DataAnnotations;
using System.Text.RegularExpressions;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using XiaoJuanSchoolPayment.Server.Data;
using XiaoJuanSchoolPayment.Server.Data.Models;

namespace XiaoJuanSchoolPayment.Server.Services
{
  public sealed record AccountIdentifier(string Type, string Value, string UserName)
  {
    private static readonly Regex InternationalPhonePattern = new("^\\+[1-9][0-9]{7,14}$", RegexOptions.Compiled);

    public static bool TryCreate(string? input, out AccountIdentifier? account, out string? error)
    {
      account = null;
      error = null;
      var value = input?.Trim();
      if (string.IsNullOrWhiteSpace(value))
      {
        error = "请输入邮箱或手机号码。";
        return false;
      }

      if (value.Contains('@'))
      {
        if (!new EmailAddressAttribute().IsValid(value))
        {
          error = "邮箱格式不正确。";
          return false;
        }

        var email = value.ToLowerInvariant();
        account = new AccountIdentifier("Email", email, email);
        return true;
      }

      var phone = Regex.Replace(value, "[\\s()\\-]", "");
      if (phone.StartsWith("00", StringComparison.Ordinal)) phone = $"+{phone[2..]}";
      if (Regex.IsMatch(phone, "^1[3-9][0-9]{9}$")) phone = $"+86{phone}";
      if (!InternationalPhonePattern.IsMatch(phone))
      {
        error = "手机号码格式不正确，中国大陆号码可直接输入 11 位号码。";
        return false;
      }

      account = new AccountIdentifier("Phone", phone, $"phone:{phone}");
      return true;
    }

    public async Task<SchoolUser?> FindUserAsync(UserManager<SchoolUser> userManager, AppDbContext context)
    {
      return Type == "Email"
        ? await userManager.FindByEmailAsync(Value)
        : await context.Users.SingleOrDefaultAsync(x => x.PhoneNumber == Value);
    }
  }
}
