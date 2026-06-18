using XiaoJuanSchoolPayment.Server.Data;

using XiaoJuanSchoolPayment.Server.Data.Models;

namespace XiaoJuanSchoolPayment.Server.Services
{
  public static class DataInitialize
  {
    private const int UsdCurrencyId = 1;
    private const int PhpCurrencyId = 5;
    private static readonly Guid CiaSchoolId = Guid.Parse("2f6a6d78-b2f1-4b84-9ac4-1d3b3bd10c1a");
    private const string CiaSchoolName = "CIA Cebu International Academy";

    public static async Task SeedAsync(IServiceProvider services)
    {
      using var scope = services.CreateScope();
      var provider = scope.ServiceProvider;
      var context = provider.GetRequiredService<AppDbContext>();

      await SeedCurrenciesAsync(context);
      await SeedCiaPricingAsync(context);
    }

    private static async Task SeedCurrenciesAsync(AppDbContext context)
    {
      UpsertCurrency(context, UsdCurrencyId, "USD", "$");
      UpsertCurrency(context, 2, "GBP", "£");
      UpsertCurrency(context, 3, "CNY", "¥");
      UpsertCurrency(context, 4, "EUR", "€");
      UpsertCurrency(context, PhpCurrencyId, "PHP", "₱");

      await context.SaveChangesAsync();
    }

    private static void UpsertCurrency(AppDbContext context, int id, string code, string symbol)
    {
      var currency = context.SchoolCurrency.FirstOrDefault(x => x.Id == id);

      if (currency == null)
      {
        context.SchoolCurrency.Add(new XiaoJuanSchoolPayment.Server.Data.Models.Currency { Id = id, CurrencyCode = code, Symbol = symbol });
        return;
      }

      currency.CurrencyCode = code;
      currency.Symbol = symbol;
    }

    private static async Task SeedCiaPricingAsync(AppDbContext context)
    {
      var now = DateTime.UtcNow;
      var school = context.Schools.FirstOrDefault(x => x.Id == CiaSchoolId || x.Name == CiaSchoolName);

      if (school == null)
      {
        school = new XiaoJuanSchoolPayment.Server.Data.Models.School
        {
          Id = CiaSchoolId,
          Name = CiaSchoolName,
          CreatedDate = new DateTime(2003, 1, 1, 0, 0, 0, DateTimeKind.Utc),
        };
        context.Schools.Add(school);
      }
      else
      {
        school.Name = CiaSchoolName;
        if (school.CreatedDate == default)
        {
          school.CreatedDate = new DateTime(2003, 1, 1, 0, 0, 0, DateTimeKind.Utc);
        }
      }

      var schoolId = school.Id;

      UpsertLesson(context, schoolId, "Regular ESL", 4, 900m, "预算优先、基础综合提升", now);
      UpsertLesson(context, schoolId, "Intensive ESL", 4, 1000m, "想增加一对一课时", now);
      UpsertLesson(context, schoolId, "Power Intensive", 4, 1100m, "短期高强度口语突破", now);
      UpsertLesson(context, schoolId, "IELTS Regular", 4, 1050m, "雅思专项备考", now);
      UpsertLesson(context, schoolId, "TOEIC Regular", 4, 1000m, "托业专项备考", now);
      UpsertLesson(context, schoolId, "Business", 4, 1050m, "商务沟通与面试表达", now);

      UpsertRoom(context, schoolId, "单人间 P-1", 4, 1350m, "隐私最好，旺季最容易满房", now);
      UpsertRoom(context, schoolId, "单人间 S-1", 4, 1150m, "适合重视安静和独立空间", now);
      UpsertRoom(context, schoolId, "双人间 D-2", 4, 950m, "朋友同行或预算舒适平衡", now);
      UpsertRoom(context, schoolId, "三人间 D-3", 4, 850m, "预算比双人间更低", now);
      UpsertRoom(context, schoolId, "四人间 D-4", 4, 750m, "默认报价参考，预算压力较低", now);

      UpsertFee(context, schoolId, "注册费", 100m, UsdCurrencyId, "前期支付费用；一次性报名注册费", now);
      UpsertFee(context, schoolId, "旺季附加费", 40m, UsdCurrencyId, "前期支付费用；2026/6/14-8/8、2027/1/17-2/14期间按 USD 40 / 周计算", now);
      UpsertFee(context, schoolId, "SSP", 8000m, PhpCurrencyId, "到校支付费用；特别学习许可，通常到校支付", now);
      UpsertFee(context, schoolId, "SSP E-card", 4000m, PhpCurrencyId, "到校支付费用；以学校现场收费为准", now);
      UpsertFee(context, schoolId, "管理费", 4000m, PhpCurrencyId, "到校支付费用；4周参考", now);
      UpsertFee(context, schoolId, "水电费", 2000m, PhpCurrencyId, "到校支付费用；按周期或实际使用调整", now);
      UpsertFee(context, schoolId, "教材费", 2000m, PhpCurrencyId, "到校支付费用；按课程和实际购买教材调整", now);
      UpsertFee(context, schoolId, "学生证", 200m, PhpCurrencyId, "到校支付费用；一次性费用参考", now);
      UpsertFee(context, schoolId, "押金", 2500m, PhpCurrencyId, "到校支付费用；退房检查后按学校规则退还", now);
      UpsertFee(context, schoolId, "接机费", 1000m, PhpCurrencyId, "到校支付费用；宿务机场接机参考", now);
      UpsertFee(context, schoolId, "ACR I-card", 4500m, PhpCurrencyId, "到校支付费用；长期学习或延签时可能需要", now);

      await context.SaveChangesAsync();
    }

    private static void UpsertLesson(
      AppDbContext context,
      Guid schoolId,
      string name,
      int week,
      decimal price,
      string description,
      DateTime lastUpdated)
    {
      var lesson = context.SchoolLessons.FirstOrDefault(x => x.SchoolId == schoolId && x.Name == name && x.Week == week);

      if (lesson == null)
      {
        context.SchoolLessons.Add(new SchoolLesson
        {
          Id = Guid.NewGuid(),
          SchoolId = schoolId,
          Name = name,
          Week = week,
          Price = price,
          CurrencyId = UsdCurrencyId,
          Description = description,
          Note = "CIA 2026年4周课程费参考；最终以学校正式报价为准",
          LastUpdated = lastUpdated,
        });
        return;
      }

      lesson.Price = price;
      lesson.CurrencyId = UsdCurrencyId;
      lesson.Description = description;
      lesson.Note = "CIA 2026年4周课程费参考；最终以学校正式报价为准";
      lesson.LastUpdated = lastUpdated;
    }

    private static void UpsertRoom(
      AppDbContext context,
      Guid schoolId,
      string name,
      int week,
      decimal price,
      string description,
      DateTime lastUpdated)
    {
      var room = context.SchoolRooms.FirstOrDefault(x => x.SchoolId == schoolId && x.Name == name && x.Week == week);

      if (room == null)
      {
        context.SchoolRooms.Add(new SchoolRoom
        {
          Id = Guid.NewGuid(),
          SchoolId = schoolId,
          Name = name,
          Week = week,
          Price = price,
          CurrencyId = UsdCurrencyId,
          Description = description,
          LastUpdated = lastUpdated,
        });
        return;
      }

      room.Price = price;
      room.CurrencyId = UsdCurrencyId;
      room.Description = description;
      room.LastUpdated = lastUpdated;
    }

    private static void UpsertFee(
      AppDbContext context,
      Guid schoolId,
      string name,
      decimal fee,
      int currencyId,
      string description,
      DateTime lastUpdated)
    {
      var schoolFee = context.SchoolFees.FirstOrDefault(x => x.SchoolId == schoolId && x.Name == name);

      if (schoolFee == null)
      {
        context.SchoolFees.Add(new SchoolFee
        {
          Id = Guid.NewGuid(),
          SchoolId = schoolId,
          Name = name,
          Fee = fee,
          CurrencyId = currencyId,
          Description = description,
          LastUpdated = lastUpdated,
        });
        return;
      }

      schoolFee.Fee = fee;
      schoolFee.CurrencyId = currencyId;
      schoolFee.Description = description;
      schoolFee.LastUpdated = lastUpdated;
    }
  }
}
