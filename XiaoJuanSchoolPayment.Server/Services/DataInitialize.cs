using XiaoJuanSchoolPayment.Server.Data;

using XiaoJuanSchoolPayment.Server.Data.Models;

namespace XiaoJuanSchoolPayment.Server.Services
{
  public static class DataInitialize
  {
    private const int UsdCurrencyId = 1;
    private const int PhpCurrencyId = 5;
    private const int KrwCurrencyId = 6;
    private static readonly Guid CiaSchoolId = Guid.Parse("2f6a6d78-b2f1-4b84-9ac4-1d3b3bd10c1a");
    private static readonly Guid EvSchoolId = Guid.Parse("d48cd1f9-d76b-4b52-9960-e9db057f577d");
    private static readonly Guid CpiSchoolId = Guid.Parse("8c5d52f6-cfe1-45d9-9b66-1c5c0cdb2a6d");
    private static readonly Guid CpilsSchoolId = Guid.Parse("6d0bcf03-e6d7-41b3-b14f-1467e762747d");
    private static readonly Guid FellaSchoolId = Guid.Parse("ec6d3456-b310-46b8-9f4c-f7173c2a4e7c");
    private static readonly Guid PhilinterSchoolId = Guid.Parse("7a2e4b6c-8d51-42e7-9f3b-0a2d9f4c5b31");
    private static readonly Guid PinesSchoolId = Guid.Parse("3e72d4cb-9f12-4f21-9d7b-6b356a99f019");
    private static readonly Guid BeciSchoolId = Guid.Parse("8fa41c8c-0bb4-4bf3-a0c2-e28f07fd0c62");
    private static readonly Guid JicSchoolId = Guid.Parse("b9eb0a1e-1b2a-4e9f-8f63-0bd6f0c4417a");
    private static readonly Guid MonolSchoolId = Guid.Parse("2d7c4bd9-0f3b-4b2d-9fb7-d53c2d6a90df");
    private static readonly Guid WalesSchoolId = Guid.Parse("6b825ff8-4f79-4b65-9447-2f4e7abef0a1");
    private static readonly Guid EgSchoolId = Guid.Parse("82cbcbad-1162-4088-823d-ea100bfee689");
    private static readonly Guid EnderunSchoolId = Guid.Parse("d63f8a4e-27e2-45e9-b1cc-a5223e5d118f");
    private static readonly Guid AmericanEnglishSchoolId = Guid.Parse("4f0709fe-2a93-4dd5-8d0f-2819115f0288");
    private const string CiaSchoolName = "CIA Cebu International Academy";
    private const string EvSchoolName = "EV Academy";
    private const string CpiSchoolName = "菲律宾宿务CPI语言学校";
    private const string LegacyCpiSchoolName = "CPI Cebu Pelis Institute";
    private const string CpilsSchoolName = "菲律宾宿务CPILS语言学校";
    private const string LegacyCpilsSchoolName = "CPILS";
    private const string FellaSchoolName = "菲律宾宿务English Fella语言学校";
    private const string LegacyFellaSchoolName = "English Fella";
    private const string PhilinterSchoolName = "菲律宾宿务Philinter语言学校";
    private const string LegacyPhilinterSchoolName = "Philinter Academy";
    private const string PinesSchoolName = "菲律宾碧瑶PINES语言学校";
    private const string LegacyPinesSchoolName = "PINES International Academy";
    private const string BeciSchoolName = "菲律宾碧瑶BECI语言学校";
    private const string LegacyBeciSchoolName = "BECI International Language Academy";
    private const string ApiBeciSchoolName = "API BECI";
    private const string JicSchoolName = "菲律宾碧瑶JIC语言学校";
    private const string LegacyJicSchoolName = "Baguio JIC Academy";
    private const string JicAcademyBaguioName = "JIC Academy Baguio";
    private const string MonolSchoolName = "菲律宾碧瑶MONOL语言学校";
    private const string LegacyMonolSchoolName = "MONOL";
    private const string MonolFullSchoolName = "Models of Nonpareil and Outstanding Learning";
    private const string WalesSchoolName = "菲律宾碧瑶WALES语言学校";
    private const string LegacyWalesSchoolName = "WALES Academy";
    private const string WalesFullSchoolName = "Widest Asian Learners English School Inc.";
    private const string WalesShortSchoolName = "WALES";
    private const string EgSchoolName = "菲律宾克拉克EG语言学校";
    private const string LegacyEgSchoolName = "EG Academy";
    private const string EgFullSchoolName = "Education Group Granma INC";
    private const string EnderunSchoolName = "菲律宾马尼拉Enderun语言学校";
    private const string LegacyEnderunSchoolName = "Enderun Extension";
    private const string AmericanEnglishSchoolName = "菲律宾马尼拉American-English-Skill语言学校";
    private const string LegacyAmericanEnglishSchoolName = "American English Skills Development Center";

    public static async Task SeedAsync(IServiceProvider services)
    {
      using var scope = services.CreateScope();
      var provider = scope.ServiceProvider;
      var context = provider.GetRequiredService<AppDbContext>();

      await SeedCurrenciesAsync(context);
      await SeedCiaPricingAsync(context);
      await SeedEvPricingAsync(context);
      await SeedCpiPricingAsync(context);
      await SeedCpilsPricingAsync(context);
      await SeedFellaPricingAsync(context);
      await SeedPhilinterPricingAsync(context);
      await SeedPinesPricingAsync(context);
      await SeedBeciPricingAsync(context);
      await SeedJicPricingAsync(context);
      await SeedMonolPricingAsync(context);
      await SeedWalesPricingAsync(context);
      await SeedEgPricingAsync(context);
      await SeedEnderunPricingAsync(context);
      await SeedAmericanEnglishPricingAsync(context);
    }

    private static async Task SeedCurrenciesAsync(AppDbContext context)
    {
      UpsertCurrency(context, UsdCurrencyId, "USD", "$");
      UpsertCurrency(context, 2, "GBP", "£");
      UpsertCurrency(context, 3, "CNY", "¥");
      UpsertCurrency(context, 4, "EUR", "€");
      UpsertCurrency(context, PhpCurrencyId, "PHP", "₱");
      UpsertCurrency(context, KrwCurrencyId, "KRW", "₩");

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

      RemoveRoom(context, schoolId, "单人间 P-1", 4);
      RemoveRoom(context, schoolId, "单人间 S-1", 4);
      UpsertRoom(context, schoolId, "豪华单人间 P-1", 4, 1700m, "豪华单人间多了一个电磁炉，可以简单加热食物", now);
      UpsertRoom(context, schoolId, "标准单人间 S-1", 4, 1500m, "标准单人间，适合重视独立空间的学生", now);
      UpsertRoom(context, schoolId, "校外单人间 PN-1", 4, 1700m, "在学校对面的4号楼", now);
      UpsertRoom(context, schoolId, "双人间 D-2", 4, 1100m, "双人间，适合朋友同行或希望平衡预算", now);
      UpsertRoom(context, schoolId, "三人间 D-3", 4, 850m, "预算比双人间更低", now);
      UpsertRoom(context, schoolId, "四人间 D-4", 4, 750m, "默认报价参考，预算压力较低", now);
      UpsertRoom(context, schoolId, "单人套房 SR-1", 4, 2500m, "套房房型，空间更完整", now);
      UpsertRoom(context, schoolId, "双人套房 SR-2", 4, 1400m, "套房房型，适合两人入住", now);
      UpsertRoom(context, schoolId, "三人套房 SR-3", 4, 1200m, "套房房型，适合小组同行", now);
      UpsertRoom(context, schoolId, "四人套房 SR-4", 4, 1100m, "套房房型，预算和空间较平衡", now);

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

    private static async Task SeedEvPricingAsync(AppDbContext context)
    {
      var now = DateTime.UtcNow;
      var school = context.Schools.FirstOrDefault(x => x.Id == EvSchoolId || x.Name == EvSchoolName);

      if (school == null)
      {
        school = new XiaoJuanSchoolPayment.Server.Data.Models.School
        {
          Id = EvSchoolId,
          Name = EvSchoolName,
          CreatedDate = new DateTime(2002, 1, 1, 0, 0, 0, DateTimeKind.Utc),
        };
        context.Schools.Add(school);
      }
      else
      {
        school.Name = EvSchoolName;
        if (school.CreatedDate == default)
        {
          school.CreatedDate = new DateTime(2002, 1, 1, 0, 0, 0, DateTimeKind.Utc);
        }
      }

      var schoolId = school.Id;

      const string evLessonNote = "EV 2026年4周课程费参考；最终以学校正式报价为准";
      RemoveLesson(context, schoolId, "ESL Classic", 4);
      RemoveLesson(context, schoolId, "Intensive ESL", 4);
      RemoveLesson(context, schoolId, "Power Speaking 6", 4);
      RemoveLesson(context, schoolId, "Power Speaking 8", 4);
      RemoveLesson(context, schoolId, "IELTS", 4);
      RemoveLesson(context, schoolId, "TOEIC", 4);
      RemoveLesson(context, schoolId, "Business", 4);

      UpsertLesson(context, schoolId, "斯巴达 Intensive ESL", 4, 1030m, "4节一对一 + 2小团体 + 2大团体 + 选修课", now, evLessonNote);
      UpsertLesson(context, schoolId, "强化口说6（斯巴达）", 4, 1230m, "6节一对一 + 1节小团体 + 1节大团体 + 选修课", now, evLessonNote);
      UpsertLesson(context, schoolId, "强化口说8（斯巴达）", 4, 1410m, "8节一对一 + 自习 + 选修课", now, evLessonNote);
      UpsertLesson(context, schoolId, "常规雅思（斯巴达）", 4, 1150m, "4节一对一 + 2节小团体 + 2节大团体 + 选修课", now, evLessonNote);
      UpsertLesson(context, schoolId, "雅思保证班（斯巴达）", 4, 1290m, "1节早课 + 4节一对一 + 4节团体课 + 1节晚课 + 选修课", now, evLessonNote);
      UpsertLesson(context, schoolId, "多益（斯巴达）", 4, 1150m, "4节一对一 + 4节团体课 + 自习 + 选修课", now, evLessonNote);
      UpsertLesson(context, schoolId, "社交媒体英语（斯巴达）", 4, 1150m, "4节一对一 + 4节团体课 + 自习 + 选修课", now, evLessonNote);
      UpsertLesson(context, schoolId, "商务英语（斯巴达）", 4, 1150m, "4节一对一 + 4节团体课 + 自习 + 选修课", now, evLessonNote);
      UpsertLesson(context, schoolId, "半斯巴达 ESL", 4, 980m, "4节一对一 + 2小团体 + 2节大团体 + 选修课", now, evLessonNote);
      UpsertLesson(context, schoolId, "强化口说6（半斯巴达）", 4, 1180m, "6节一对一 + 1节小团体 + 1节大团体 + 选修课", now, evLessonNote);
      UpsertLesson(context, schoolId, "强化口说8（半斯巴达）", 4, 1360m, "8节一对一 + 选修课", now, evLessonNote);
      UpsertLesson(context, schoolId, "多益（半斯巴达）", 4, 1100m, "4节一对一 + 4节团体课 + 选修课", now, evLessonNote);
      UpsertLesson(context, schoolId, "商务英语（半斯巴达）", 4, 1100m, "4节一对一 + 4节团体课 + 选修课", now, evLessonNote);
      UpsertLesson(context, schoolId, "社交媒体英语（半斯巴达）", 4, 1100m, "4节一对一 + 4节团体课 + 选修课", now, evLessonNote);

      RemoveRoom(context, schoolId, "单人房", 4);
      RemoveRoom(context, schoolId, "双人房", 4);
      RemoveRoom(context, schoolId, "三人房", 4);
      RemoveRoom(context, schoolId, "四人房", 4);

      UpsertRoom(context, schoolId, "单人间", 4, 1400m, "热门房型建议提前6个月预定", now);
      UpsertRoom(context, schoolId, "双人间", 4, 1030m, "热门房型建议提前6个月预定", now);
      UpsertRoom(context, schoolId, "三人间", 4, 950m, "热门房型建议提前6个月预定", now);
      UpsertRoom(context, schoolId, "四人间（上下铺）", 4, 900m, "热门房型建议提前6个月预定", now);
      UpsertRoom(context, schoolId, "校外公寓单间", 4, 1550m, "校外公寓房型，建议提前确认空房", now);
      UpsertRoom(context, schoolId, "校外公寓双人间", 4, 1150m, "仅限于两人同时预定", now);

      UpsertFee(context, schoolId, "注册费", 100m, UsdCurrencyId, "前期支付费用；一次性报名注册费", now);
      UpsertFee(context, schoolId, "旺季附加费", 0m, UsdCurrencyId, "前期支付费用；是否收取及金额需按入学档期由顾问确认", now);
      UpsertFee(context, schoolId, "SSP", 7800m, PhpCurrencyId, "到校支付费用；特别学习许可，通常到校支付", now);
      UpsertFee(context, schoolId, "SSP E-card", 4500m, PhpCurrencyId, "到校支付费用；以学校现场收费为准", now);
      UpsertFee(context, schoolId, "教材费", 2000m, PhpCurrencyId, "到校支付费用；按实际购买教材调整", now);
      UpsertFee(context, schoolId, "水电费", 3200m, PhpCurrencyId, "到校支付费用；4周参考，按实际或学校规则调整", now);
      UpsertFee(context, schoolId, "ACR I-card", 4000m, PhpCurrencyId, "到校支付费用；长期学习或延签时通常需要", now);
      UpsertFee(context, schoolId, "学生证", 500m, PhpCurrencyId, "到校支付费用；一次性费用参考", now);
      UpsertFee(context, schoolId, "设施维护费", 2000m, PhpCurrencyId, "到校支付费用；4周参考", now);
      UpsertFee(context, schoolId, "接机费", 1200m, PhpCurrencyId, "到校支付费用；宿务机场接机参考", now);
      UpsertFee(context, schoolId, "保证金", 3000m, PhpCurrencyId, "到校支付费用；退房检查后按学校规则退还", now);
      UpsertFee(context, schoolId, "洗衣费", 600m, PhpCurrencyId, "到校支付费用；约 PHP 150 / 5kg / 次，按实际使用调整", now);

      await context.SaveChangesAsync();
    }

    private static async Task SeedCpiPricingAsync(AppDbContext context)
    {
      var now = DateTime.UtcNow;
      var school = context.Schools.FirstOrDefault(x => x.Id == CpiSchoolId || x.Name == CpiSchoolName || x.Name == LegacyCpiSchoolName);

      if (school == null)
      {
        school = new XiaoJuanSchoolPayment.Server.Data.Models.School
        {
          Id = CpiSchoolId,
          Name = CpiSchoolName,
          CreatedDate = new DateTime(2015, 1, 1, 0, 0, 0, DateTimeKind.Utc),
        };
        context.Schools.Add(school);
      }
      else
      {
        school.Name = CpiSchoolName;
        if (school.CreatedDate == default)
        {
          school.CreatedDate = new DateTime(2015, 1, 1, 0, 0, 0, DateTimeKind.Utc);
        }
      }

      var schoolId = school.Id;
      const string cpiLessonNote = "CPI 2026年4周课程费参考；最终以学校正式报价为准";

      UpsertLesson(context, schoolId, "General English", 4, 716m, "基础综合英语，适合第一次游学和稳步提升", now, cpiLessonNote);
      UpsertLesson(context, schoolId, "Intensive English", 4, 876m, "一对一课时更多，适合短期强化", now, cpiLessonNote);
      UpsertLesson(context, schoolId, "Rapid 30", 4, 604m, "短期密集课程，适合时间有限的学生", now, cpiLessonNote);
      UpsertLesson(context, schoolId, "Rapid 60", 4, 1208m, "更高强度短期密集课程", now, cpiLessonNote);
      UpsertLesson(context, schoolId, "TOEIC Regular", 4, 960m, "托业备考，适合求职、升学或企业英语需求", now, cpiLessonNote);
      UpsertLesson(context, schoolId, "IELTS Regular", 4, 960m, "雅思备考，适合目标分数学生", now, cpiLessonNote);
      UpsertLesson(context, schoolId, "IELTS Guarantee", 4, 1096m, "雅思保证班方向，需按入学门槛和周数确认", now, cpiLessonNote);
      UpsertLesson(context, schoolId, "Speaking Master", 4, 960m, "口语强化，适合想提升开口量和表达反应", now, cpiLessonNote);
      UpsertLesson(context, schoolId, "Business English", 4, 960m, "商务沟通、会议、演示和职场表达", now, cpiLessonNote);
      UpsertLesson(context, schoolId, "Junior Program", 4, 960m, "青少年课程，年龄和监护规则需提前确认", now, cpiLessonNote);
      UpsertLesson(context, schoolId, "Guardian Program", 4, 696m, "家长课程，适合亲子同行家长", now, cpiLessonNote);

      UpsertRoom(context, schoolId, "Superior 单人房", 4, 1240m, "隐私最好，预算较高，热门档期需早确认", now);
      UpsertRoom(context, schoolId, "Superior 双人房", 4, 720m, "适合朋友同行或希望兼顾预算与舒适度", now);
      UpsertRoom(context, schoolId, "Superior 三人房", 4, 600m, "多人房中预算较平衡", now);
      UpsertRoom(context, schoolId, "Superior 四人房", 4, 520m, "默认报价参考，预算压力较低", now);
      UpsertRoom(context, schoolId, "Superior 六人房", 4, 520m, "女性六人房方向，空房需单独确认", now);
      UpsertRoom(context, schoolId, "Executive 单人房", 4, 1400m, "更高住宿规格，预算较高", now);
      UpsertRoom(context, schoolId, "Executive 双人房", 4, 1000m, "高规格双人房，适合重视住宿舒适度", now);
      UpsertRoom(context, schoolId, "Executive 三人房", 4, 880m, "高规格多人房，预算和舒适度较平衡", now);
      UpsertRoom(context, schoolId, "Family 双人房", 4, 800m, "亲子或同行家庭房方向，规则需确认", now);
      UpsertRoom(context, schoolId, "Family 三人房", 4, 680m, "家庭同行参考房型，热门档期需早确认", now);

      UpsertFee(context, schoolId, "注册费", 100m, UsdCurrencyId, "前期支付费用；一次性报名注册费", now);
      UpsertFee(context, schoolId, "旺季附加费", 30m, UsdCurrencyId, "前期支付费用；旺季期间参考 USD 30 / 周，具体档期以学校确认为准", now);
      UpsertFee(context, schoolId, "SSP", 6800m, PhpCurrencyId, "到校支付费用；特别学习许可，通常到校支付", now);
      UpsertFee(context, schoolId, "SSP E-card", 4000m, PhpCurrencyId, "到校支付费用；以学校现场收费为准", now);
      UpsertFee(context, schoolId, "管理费", 7000m, PhpCurrencyId, "到校支付费用；4周参考", now);
      UpsertFee(context, schoolId, "水电费", 2000m, PhpCurrencyId, "到校支付费用；4周参考，按实际或学校规则调整", now);
      UpsertFee(context, schoolId, "教材费", 1000m, PhpCurrencyId, "到校支付费用；按课程和实际购买教材调整", now);
      UpsertFee(context, schoolId, "学生证", 200m, PhpCurrencyId, "到校支付费用；一次性费用参考", now);
      UpsertFee(context, schoolId, "设施维护费", 1000m, PhpCurrencyId, "到校支付费用；4周参考", now);
      UpsertFee(context, schoolId, "接机费", 1000m, PhpCurrencyId, "到校支付费用；团体接机参考，个人接机可能不同", now);
      UpsertFee(context, schoolId, "保证金", 3000m, PhpCurrencyId, "到校支付费用；退房检查后按学校规则退还", now);
      UpsertFee(context, schoolId, "ACR I-card", 3500m, PhpCurrencyId, "到校支付费用；长期学习或延签时通常需要", now);

      await context.SaveChangesAsync();
    }

    private static async Task SeedCpilsPricingAsync(AppDbContext context)
    {
      var now = DateTime.UtcNow;
      var school = context.Schools.FirstOrDefault(x => x.Id == CpilsSchoolId || x.Name == CpilsSchoolName || x.Name == LegacyCpilsSchoolName);

      if (school == null)
      {
        school = new XiaoJuanSchoolPayment.Server.Data.Models.School
        {
          Id = CpilsSchoolId,
          Name = CpilsSchoolName,
          CreatedDate = new DateTime(2001, 1, 1, 0, 0, 0, DateTimeKind.Utc),
        };
        context.Schools.Add(school);
      }
      else
      {
        school.Name = CpilsSchoolName;
        if (school.CreatedDate == default)
        {
          school.CreatedDate = new DateTime(2001, 1, 1, 0, 0, 0, DateTimeKind.Utc);
        }
      }

      var schoolId = school.Id;
      const string cpilsLessonNote = "CPILS 2026年4周费用拆分参考；最终以学校正式报价为准";

      UpsertLesson(context, schoolId, "General ESL", 4, 1060m, "基础综合英语，适合第一次游学和稳步提升", now, cpilsLessonNote);
      UpsertLesson(context, schoolId, "General ESL Plus", 4, 1060m, "综合英语加强方向，适合想增加输出训练的学生", now, cpilsLessonNote);
      UpsertLesson(context, schoolId, "General ESL Light", 4, 980m, "较轻量综合英语，适合想保留生活弹性的学生", now, cpilsLessonNote);
      UpsertLesson(context, schoolId, "Premier Sparta", 4, 1160m, "斯巴达学习强度，适合需要纪律推动的学生", now, cpilsLessonNote);
      UpsertLesson(context, schoolId, "IELTS Course", 4, 1215m, "雅思备考与目标分数训练", now, cpilsLessonNote);
      UpsertLesson(context, schoolId, "TOEIC Course", 4, 1160m, "托业备考，适合求职、升学或企业英语需求", now, cpilsLessonNote);
      UpsertLesson(context, schoolId, "TOEFL Course", 4, 1160m, "托福备考，适合北美升学或考试目标学生", now, cpilsLessonNote);
      UpsertLesson(context, schoolId, "Business English", 4, 1160m, "商务沟通、会议、演示和职场表达", now, cpilsLessonNote);
      UpsertLesson(context, schoolId, "Power Speaking and Modern Communication", 4, 1160m, "口语表达、沟通自信和现代沟通训练", now, cpilsLessonNote);
      UpsertLesson(context, schoolId, "Parent-Child Program", 4, 1160m, "亲子课程方向，需按年龄、监护和房型确认", now, cpilsLessonNote);

      UpsertRoom(context, schoolId, "四人房", 4, 530m, "默认报价参考，预算压力较低", now);
      UpsertRoom(context, schoolId, "三人房", 4, 605m, "多人房中预算较平衡", now);
      UpsertRoom(context, schoolId, "双人房", 4, 670m, "适合朋友同行或希望兼顾预算与舒适度", now);
      UpsertRoom(context, schoolId, "单人房", 4, 825m, "隐私最好，预算较高，热门档期需早确认", now);

      UpsertFee(context, schoolId, "注册费", 125m, UsdCurrencyId, "前期支付费用；一次性报名注册费", now);
      UpsertFee(context, schoolId, "旺季附加费", 0m, UsdCurrencyId, "前期支付费用；是否收取及金额需按入学档期由顾问确认", now);
      UpsertFee(context, schoolId, "SSP", 6800m, PhpCurrencyId, "到校支付费用；特别学习许可，通常到校支付", now);
      UpsertFee(context, schoolId, "SSP E-card", 4000m, PhpCurrencyId, "到校支付费用；以学校现场收费为准", now);
      UpsertFee(context, schoolId, "水电费", 2000m, PhpCurrencyId, "到校支付费用；公开资料示例为每周预收 PHP 500，4周 PHP 2,000，多退少补", now);
      UpsertFee(context, schoolId, "教材费", 2000m, PhpCurrencyId, "到校支付费用；按课程和实际购买教材调整", now);
      UpsertFee(context, schoolId, "管理费", 1000m, PhpCurrencyId, "到校支付费用；4周参考，最终以学校现场收费为准", now);
      UpsertFee(context, schoolId, "学生证", 300m, PhpCurrencyId, "到校支付费用；一次性费用参考", now);
      UpsertFee(context, schoolId, "宿舍押金", 3000m, PhpCurrencyId, "到校支付费用；退房检查后按学校规则退还", now);
      UpsertFee(context, schoolId, "接机费", 1200m, PhpCurrencyId, "到校支付费用；宿务机场接机参考", now);
      UpsertFee(context, schoolId, "ACR I-card", 4000m, PhpCurrencyId, "到校支付费用；长期学习或延签时通常需要", now);
      UpsertFee(context, schoolId, "洗衣费", 500m, PhpCurrencyId, "到校支付费用；按实际使用和衣物重量调整", now);

      await context.SaveChangesAsync();
    }

    private static async Task SeedFellaPricingAsync(AppDbContext context)
    {
      var now = DateTime.UtcNow;
      var school = context.Schools.FirstOrDefault(x => x.Id == FellaSchoolId || x.Name == FellaSchoolName || x.Name == LegacyFellaSchoolName);

      if (school == null)
      {
        school = new XiaoJuanSchoolPayment.Server.Data.Models.School
        {
          Id = FellaSchoolId,
          Name = FellaSchoolName,
          CreatedDate = new DateTime(2006, 1, 1, 0, 0, 0, DateTimeKind.Utc),
        };
        context.Schools.Add(school);
      }
      else
      {
        school.Name = FellaSchoolName;
        if (school.CreatedDate == default)
        {
          school.CreatedDate = new DateTime(2006, 1, 1, 0, 0, 0, DateTimeKind.Utc);
        }
      }

      var schoolId = school.Id;
      const string fellaLessonNote = "English Fella 2026年4周费用拆分参考；最终以学校正式报价为准";

      UpsertLesson(context, schoolId, "Guardian / GEC", 4, 1000m, "监护人课程，适合亲子同行家长或监护人", now, fellaLessonNote);
      UpsertLesson(context, schoolId, "PIC-4", 4, 1150m, "基础综合英语，适合第一次游学和稳步提升", now, fellaLessonNote);
      UpsertLesson(context, schoolId, "PIC-5", 4, 1250m, "一对一课时更多，适合想增加输出训练的学生", now, fellaLessonNote);
      UpsertLesson(context, schoolId, "PIC-6", 4, 1350m, "更高一对一比例，适合短期口语强化", now, fellaLessonNote);
      UpsertLesson(context, schoolId, "IELTS / PIRC", 4, 1350m, "雅思备考与目标分数训练", now, fellaLessonNote);
      UpsertLesson(context, schoolId, "TOEIC / ESL+TOEIC", 4, 1250m, "托业备考或ESL+TOEIC混合课程", now, fellaLessonNote);
      UpsertLesson(context, schoolId, "TOEFL", 4, 1250m, "托福备考，适合北美升学或考试目标学生", now, fellaLessonNote);
      UpsertLesson(context, schoolId, "Business English", 4, 1350m, "商务沟通、会议、演示和职场表达", now, fellaLessonNote);
      UpsertLesson(context, schoolId, "Junior / JEC", 4, 1250m, "儿童和青少年课程，年龄、监护和校区需确认", now, fellaLessonNote);
      UpsertLesson(context, schoolId, "Silver Speaking Course", 4, 1250m, "50岁以上口语强化课程，适合银发成人学习者", now, fellaLessonNote);

      UpsertRoom(context, schoolId, "三人房", 4, 550m, "默认报价参考，预算压力较低", now);
      UpsertRoom(context, schoolId, "双人房", 4, 650m, "适合朋友同行或希望兼顾预算与舒适度", now);
      UpsertRoom(context, schoolId, "标准单人房", 4, 850m, "隐私较好，预算较高，热门档期需早确认", now);
      UpsertRoom(context, schoolId, "豪华单人房", 4, 950m, "更高住宿规格，空房和校区需单独确认", now);

      UpsertFee(context, schoolId, "注册费", 100m, UsdCurrencyId, "前期支付费用；一次性报名注册费", now);
      UpsertFee(context, schoolId, "旺季附加费", 0m, UsdCurrencyId, "前期支付费用；是否收取及金额需按入学档期由顾问确认", now);
      UpsertFee(context, schoolId, "SSP", 6800m, PhpCurrencyId, "到校支付费用；特别学习许可，官方费用页显示截至2023年3月为 PHP 6,800", now);
      UpsertFee(context, schoolId, "SSP E-card", 3600m, PhpCurrencyId, "到校支付费用；官方费用页显示截至2024年7月为 PHP 3,600", now);
      UpsertFee(context, schoolId, "水电费", 2500m, PhpCurrencyId, "到校支付费用；官方计算器说明4周每人 PHP 2,500", now);
      UpsertFee(context, schoolId, "空调费", 20m, PhpCurrencyId, "到校支付费用；官方计算器说明按 PHP 20 / 1KW 计算", now);
      UpsertFee(context, schoolId, "教材费", 2000m, PhpCurrencyId, "到校支付费用；按课程和实际购买教材调整", now);
      UpsertFee(context, schoolId, "宿舍押金", 3000m, PhpCurrencyId, "到校支付费用；退房检查后按学校规则退还", now);
      UpsertFee(context, schoolId, "接机费", 1000m, PhpCurrencyId, "到校支付费用；官方费用页显示接机费 PHP 1,000", now);
      UpsertFee(context, schoolId, "ACR I-card", 4000m, PhpCurrencyId, "到校支付费用；金额会按停留周期和汇率调整", now);
      UpsertFee(context, schoolId, "签证延签", 4140m, PhpCurrencyId, "到校支付费用；按学习周数和菲律宾签证规则调整", now);
      UpsertFee(context, schoolId, "监管费", 0m, PhpCurrencyId, "到校支付费用；15-17岁独自就读或亲子规则需由顾问确认", now);

      await context.SaveChangesAsync();
    }

    private static async Task SeedPhilinterPricingAsync(AppDbContext context)
    {
      var now = DateTime.UtcNow;
      var school = context.Schools.FirstOrDefault(x => x.Id == PhilinterSchoolId || x.Name == PhilinterSchoolName || x.Name == LegacyPhilinterSchoolName);

      if (school == null)
      {
        school = new XiaoJuanSchoolPayment.Server.Data.Models.School
        {
          Id = PhilinterSchoolId,
          Name = PhilinterSchoolName,
          CreatedDate = new DateTime(2003, 1, 1, 0, 0, 0, DateTimeKind.Utc),
        };
        context.Schools.Add(school);
      }
      else
      {
        school.Name = PhilinterSchoolName;
        if (school.CreatedDate == default)
        {
          school.CreatedDate = new DateTime(2003, 1, 1, 0, 0, 0, DateTimeKind.Utc);
        }
      }

      var schoolId = school.Id;
      const string philinterLessonNote = "Philinter 2026年4周费用拆分参考；最终以学校正式报价为准";

      UpsertLesson(context, schoolId, "Light ESL", 4, 1060m, "轻量综合英语，适合短期体验或希望保留生活弹性的学生", now, philinterLessonNote);
      UpsertLesson(context, schoolId, "General ESL", 4, 1160m, "半斯巴达综合英语，适合第一次游学和稳步提升", now, philinterLessonNote);
      UpsertLesson(context, schoolId, "Intensive ESL", 4, 1280m, "斯巴达强度更高，适合想加快综合英文提升的学生", now, philinterLessonNote);
      UpsertLesson(context, schoolId, "Intensive Power Speaking", 4, 1410m, "强化口说与表达流利度，适合短期口语突破", now, philinterLessonNote);
      UpsertLesson(context, schoolId, "IELTS Intensive", 4, 1370m, "雅思专项备考，适合目标分数学生", now, philinterLessonNote);
      UpsertLesson(context, schoolId, "TOEFL", 4, 1370m, "托福备考，适合北美升学或考试目标学生", now, philinterLessonNote);
      UpsertLesson(context, schoolId, "TOEIC Regular", 4, 1280m, "托业备考，适合升学、求职或企业英语需求", now, philinterLessonNote);
      UpsertLesson(context, schoolId, "Advanced Business", 4, 1410m, "商务沟通、演示、会议和职场表达", now, philinterLessonNote);
      UpsertLesson(context, schoolId, "Basic Business", 4, 1280m, "商务基础英文，适合职场入门或转职准备", now, philinterLessonNote);
      UpsertLesson(context, schoolId, "Focused Industry", 4, 1410m, "行业主题英文，需按目标行业和开课档期确认", now, philinterLessonNote);
      UpsertLesson(context, schoolId, "Primary English", 4, 1510m, "7-11岁儿童英文，需家长陪同和规则确认", now, philinterLessonNote);
      UpsertLesson(context, schoolId, "Junior ESL", 4, 1610m, "12-17岁青少年综合英文，年龄和监护规则需确认", now, philinterLessonNote);
      UpsertLesson(context, schoolId, "Junior IELTS", 4, 1670m, "12-17岁青少年雅思方向，需按水平和目标确认", now, philinterLessonNote);
      UpsertLesson(context, schoolId, "IELTS Guarantee 8 Weeks", 4, 1680m, "雅思保证班方向，需按入学分数、周数和规则确认", now, philinterLessonNote);
      UpsertLesson(context, schoolId, "IELTS Guarantee 12 Weeks", 4, 1520m, "雅思保证班方向，需按入学分数、周数和规则确认", now, philinterLessonNote);

      UpsertRoom(context, schoolId, "校内三人房", 4, 520m, "默认报价参考，预算压力较低", now);
      UpsertRoom(context, schoolId, "校内双人房", 4, 630m, "适合朋友同行或希望兼顾预算与舒适度", now);
      UpsertRoom(context, schoolId, "校内单人房", 4, 960m, "隐私最好，预算较高，热门档期需早确认", now);
      UpsertRoom(context, schoolId, "校外公寓单人房", 4, 1160m, "校外Azon Condo方向，接送、门禁和空房需顾问确认", now);
      UpsertRoom(context, schoolId, "校外公寓双人房", 4, 780m, "校外公寓方向，适合重视生活品质的成人或家庭", now);

      UpsertFee(context, schoolId, "注册费", 100m, UsdCurrencyId, "前期支付费用；一次性报名注册费", now);
      UpsertFee(context, schoolId, "旺季附加费", 0m, UsdCurrencyId, "前期支付费用；是否收取及金额需按入学档期由顾问确认", now);
      UpsertFee(context, schoolId, "SSP", 6800m, PhpCurrencyId, "到校支付费用；特别学习许可，最终以学校现场收费为准", now);
      UpsertFee(context, schoolId, "SSP E-card", 4000m, PhpCurrencyId, "到校支付费用；以学校现场收费为准", now);
      UpsertFee(context, schoolId, "接机费", 1200m, PhpCurrencyId, "到校支付费用；周末接机参考，平日接机通常更高", now);
      UpsertFee(context, schoolId, "平日接机费", 1500m, PhpCurrencyId, "到校支付费用；平日抵达参考，以学校安排为准", now);
      UpsertFee(context, schoolId, "水电费", 2500m, PhpCurrencyId, "到校支付费用；4周参考，按实际或学校规则调整", now);
      UpsertFee(context, schoolId, "教材费", 2000m, PhpCurrencyId, "到校支付费用；按课程和实际购买教材调整", now);
      UpsertFee(context, schoolId, "管理费", 1000m, PhpCurrencyId, "到校支付费用；4周参考，最终以学校现场收费为准", now);
      UpsertFee(context, schoolId, "宿舍押金", 3000m, PhpCurrencyId, "到校支付费用；退房检查后按学校规则退还", now);
      UpsertFee(context, schoolId, "学生证", 300m, PhpCurrencyId, "到校支付费用；一次性费用参考", now);
      UpsertFee(context, schoolId, "ACR I-card", 4000m, PhpCurrencyId, "到校支付费用；长期学习或延签时通常需要", now);
      UpsertFee(context, schoolId, "签证延签", 4140m, PhpCurrencyId, "到校支付费用；按学习周数和菲律宾签证规则调整", now);

      await context.SaveChangesAsync();
    }

    private static async Task SeedPinesPricingAsync(AppDbContext context)
    {
      var now = DateTime.UtcNow;
      var school = context.Schools.FirstOrDefault(x => x.Id == PinesSchoolId || x.Name == PinesSchoolName || x.Name == LegacyPinesSchoolName);

      if (school == null)
      {
        school = new XiaoJuanSchoolPayment.Server.Data.Models.School
        {
          Id = PinesSchoolId,
          Name = PinesSchoolName,
          CreatedDate = new DateTime(2001, 1, 1, 0, 0, 0, DateTimeKind.Utc),
        };
        context.Schools.Add(school);
      }
      else
      {
        school.Name = PinesSchoolName;
        if (school.CreatedDate == default)
        {
          school.CreatedDate = new DateTime(2001, 1, 1, 0, 0, 0, DateTimeKind.Utc);
        }
      }

      var schoolId = school.Id;
      const string pinesLessonNote = "PINES 2026年4周USD费用参考；课程、校区、房型和优惠以学校正式报价为准";

      UpsertLesson(context, schoolId, "Light ESL 4", 4, 850m, "轻量一对一ESL，适合预算优先和基础提升", now, pinesLessonNote);
      UpsertLesson(context, schoolId, "Power Speaking", 4, 930m, "口语强化，适合开口量和表达训练", now, pinesLessonNote);
      UpsertLesson(context, schoolId, "Intensive ESL", 4, 1020m, "5节一对一，短期强化更合适", now, pinesLessonNote);
      UpsertLesson(context, schoolId, "Power ESL 5", 4, 980m, "一对一比例更高，适合目标明确学生", now, pinesLessonNote);
      UpsertLesson(context, schoolId, "Power ESL 7", 4, 1220m, "高强度一对一，适合集中突破", now, pinesLessonNote);
      UpsertLesson(context, schoolId, "TOEIC / TOEIC Speaking", 4, 980m, "多益方向，适合求职或升学需求", now, pinesLessonNote);
      UpsertLesson(context, schoolId, "Business English Practical", 4, 1080m, "商务沟通实践方向", now, pinesLessonNote);
      UpsertLesson(context, schoolId, "Business English Executive", 4, 1080m, "商务高阶沟通方向", now, pinesLessonNote);
      UpsertLesson(context, schoolId, "Parents Course", 4, 750m, "亲子同行家长课程", now, pinesLessonNote);
      UpsertLesson(context, schoolId, "Junior Family Course", 4, 1500m, "青少年亲子课程，规则需提前确认", now, pinesLessonNote);
      UpsertLesson(context, schoolId, "Pre-IELTS", 4, 1100m, "雅思入门，适合还未直接进入Regular的学生", now, pinesLessonNote);
      UpsertLesson(context, schoolId, "IELTS Regular", 4, 1100m, "雅思常规备考", now, pinesLessonNote);
      UpsertLesson(context, schoolId, "IELTS Speaking & Writing Intensive", 4, 1200m, "雅思口写强化", now, pinesLessonNote);
      UpsertLesson(context, schoolId, "IELTS Guarantee 8 Weeks", 4, 1450m, "8周USD 2,900折算4周；需符合入学与出勤规则", now, pinesLessonNote);
      UpsertLesson(context, schoolId, "IELTS Guarantee 12 Weeks", 4, 1350m, "12周USD 4,050折算4周；需符合入学与出勤规则", now, pinesLessonNote);

      UpsertRoom(context, schoolId, "六人房", 4, 570m, "Main Campus可选，预算压力最低，需确认空房", now);
      UpsertRoom(context, schoolId, "5B Solo", 4, 650m, "2026年8月23日起Main可选，兼顾预算和相对私密", now);
      UpsertRoom(context, schoolId, "四人房", 4, 700m, "多人房中预算与舒适度较平衡", now);
      UpsertRoom(context, schoolId, "双人房B", 4, 840m, "适合同伴同行或希望更少室友", now);
      UpsertRoom(context, schoolId, "双人房A", 4, 870m, "双人房更舒适，热门档期需早确认", now);
      UpsertRoom(context, schoolId, "单人房C", 4, 970m, "单人房入门选择，适合重视隐私", now);
      UpsertRoom(context, schoolId, "单人房B", 4, 1150m, "男性限定资料较常见，需按校区和档期确认", now);
      UpsertRoom(context, schoolId, "单人房A", 4, 1250m, "隐私和舒适度最高，预算较高", now);

      UpsertFee(context, schoolId, "注册费", 130m, UsdCurrencyId, "前期支付费用；一次性报名注册费", now);
      UpsertFee(context, schoolId, "旺季附加费", 40m, UsdCurrencyId, "前期支付费用；2026/6/28-8/22、2027/6/27-8/22期间按 USD 40 / 周计算", now);
      UpsertFee(context, schoolId, "SSP", 7800m, PhpCurrencyId, "到校支付费用；特别学习许可，通常到校支付", now);
      UpsertFee(context, schoolId, "SSP I-Card", 4500m, PhpCurrencyId, "到校支付费用；以学校现场收费为准", now);
      UpsertFee(context, schoolId, "ACR I-Card", 4000m, PhpCurrencyId, "到校支付费用；长期学习或延签时通常需要", now);
      UpsertFee(context, schoolId, "签证延签", 4940m, PhpCurrencyId, "到校支付费用；8周首次延签参考，周数越长金额越高", now);
      UpsertFee(context, schoolId, "教材费", 1100m, PhpCurrencyId, "到校支付费用；4周5本以下参考", now);
      UpsertFee(context, schoolId, "教材费（6册以上）", 1500m, PhpCurrencyId, "到校支付费用；4周6本以上参考", now);
      UpsertFee(context, schoolId, "水电费", 3000m, PhpCurrencyId, "到校支付费用；4周参考，按学校规则调整", now);
      UpsertFee(context, schoolId, "宿舍保证金", 4000m, PhpCurrencyId, "到校支付费用；退房检查后按学校规则退还", now);
      UpsertFee(context, schoolId, "洗衣费", 150m, PhpCurrencyId, "到校支付费用；单次7kg以内参考", now);
      UpsertFee(context, schoolId, "指定接机", 3000m, PhpCurrencyId, "到校支付费用；马尼拉或克拉克指定接机日参考", now);

      await context.SaveChangesAsync();
    }

    private static async Task SeedBeciPricingAsync(AppDbContext context)
    {
      var now = DateTime.UtcNow;
      var school = context.Schools.FirstOrDefault(x => x.Id == BeciSchoolId || x.Name == BeciSchoolName || x.Name == LegacyBeciSchoolName || x.Name == ApiBeciSchoolName);

      if (school == null)
      {
        school = new XiaoJuanSchoolPayment.Server.Data.Models.School
        {
          Id = BeciSchoolId,
          Name = BeciSchoolName,
          CreatedDate = new DateTime(2002, 1, 1, 0, 0, 0, DateTimeKind.Utc),
        };
        context.Schools.Add(school);
      }
      else
      {
        school.Name = BeciSchoolName;
        if (school.CreatedDate == default)
        {
          school.CreatedDate = new DateTime(2002, 1, 1, 0, 0, 0, DateTimeKind.Utc);
        }
      }

      var schoolId = school.Id;
      const string beciLessonNote = "API BECI 2026年4周USD费用参考；EOP、Sparta、City校区、房型、优惠以学校正式报价为准";

      UpsertLesson(context, schoolId, "EOP Lite ESL", 4, 670m, "EOP轻量课程，适合基础弱、想保留复习时间", now, beciLessonNote);
      UpsertLesson(context, schoolId, "EOP SPEED ESL", 4, 870m, "EOP半斯巴达旗舰课程，适合多数综合提升学生", now, beciLessonNote);
      UpsertLesson(context, schoolId, "EOP Sparta ESL", 4, 900m, "EOP强度更高，含SP和晚间学习", now, beciLessonNote);
      UpsertLesson(context, schoolId, "EOP Working Holiday", 4, 1000m, "工作假期准备方向，适合海外打工度假规划", now, beciLessonNote);
      UpsertLesson(context, schoolId, "Sparta 24 ESL", 4, 900m, "Sparta强管理口语冲刺，含晚间义务学习与测试", now, beciLessonNote);
      UpsertLesson(context, schoolId, "Sparta TOEIC", 4, 850m, "多益基础与刷题方向，适合考试目标学生", now, beciLessonNote);
      UpsertLesson(context, schoolId, "Sparta IELTS", 4, 900m, "雅思基础与考试策略，适合强管理备考", now, beciLessonNote);
      UpsertLesson(context, schoolId, "City LITE ESL", 4, 670m, "City轻量成人ESL，适合弹性学习", now, beciLessonNote);
      UpsertLesson(context, schoolId, "City SPEED ESL", 4, 870m, "City综合ESL，适合成人系统提升", now, beciLessonNote);
      UpsertLesson(context, schoolId, "City FLEXI LITE ESL", 4, 670m, "夜间一对一加团体，适合工作者", now, beciLessonNote);
      UpsertLesson(context, schoolId, "City FLEXI SPEED ESL", 4, 870m, "夜间课时更多，适合边工作边学习", now, beciLessonNote);
      UpsertLesson(context, schoolId, "City BizSpeak", 4, 800m, "商务表达、演示和职场沟通方向", now, beciLessonNote);
      UpsertLesson(context, schoolId, "City Native ESL", 4, 950m, "含外教方向，适合发音与表达反馈", now, beciLessonNote);
      UpsertLesson(context, schoolId, "City Unlimited ESL", 4, 950m, "最多8节一对一，科目组合弹性高", now, beciLessonNote);
      UpsertLesson(context, schoolId, "City IELTS", 4, 900m, "City成人雅思方向，适合弹性备考", now, beciLessonNote);

      UpsertRoom(context, schoolId, "EOP 校内四人房", 4, 570m, "默认预算参考，适合控制总价", now);
      UpsertRoom(context, schoolId, "EOP 校内三人房", 4, 670m, "预算与室友数量较平衡", now);
      UpsertRoom(context, schoolId, "EOP 校内双人房", 4, 750m, "公开表标注男性房型，需按档期确认", now);
      UpsertRoom(context, schoolId, "EOP 校内单人房", 4, 950m, "公开表标注女性房型，热门档期需早确认", now);
      UpsertRoom(context, schoolId, "EOP Mansion Regular Single", 4, 950m, "Mansion房型，公开表标注男性方向", now);
      UpsertRoom(context, schoolId, "EOP Mansion Master Single", 4, 1100m, "Mansion更高规格单人房，需确认性别与空房", now);
      UpsertRoom(context, schoolId, "Sparta 四人房", 4, 700m, "Sparta预算入口，仍需遵守校区强管理规则", now);
      UpsertRoom(context, schoolId, "Sparta 3+1 Buddy 房", 4, 800m, "3名学生 + 1名老师同住，英语环境更强", now);
      UpsertRoom(context, schoolId, "City Studio 四人房", 4, 600m, "City预算入口，适合成人弹性学习", now);
      UpsertRoom(context, schoolId, "City Studio 双人房", 4, 800m, "仅限兄弟姐妹、同性朋友或夫妻等条件使用", now);
      UpsertRoom(context, schoolId, "City Semi Single", 4, 900m, "兼顾隐私与预算的City房型", now);
      UpsertRoom(context, schoolId, "City Semi Master Single", 4, 1050m, "City更高规格单人方向", now);
      UpsertRoom(context, schoolId, "City Studio 单人房", 4, 1250m, "City独立空间最高，预算较高", now);

      UpsertFee(context, schoolId, "注册费", 100m, UsdCurrencyId, "前期支付费用；一次性报名注册费", now);
      UpsertFee(context, schoolId, "旺季附加费", 40m, UsdCurrencyId, "前期支付费用；2026/6/28-8/22、2027/6/27-8/22期间按 USD 40 / 周计算", now);
      UpsertFee(context, schoolId, "SSP", 7800m, PhpCurrencyId, "到校支付费用；特别学习许可，通常到校支付", now);
      UpsertFee(context, schoolId, "SSP E-Card", 4500m, PhpCurrencyId, "到校支付费用；与SSP相关的电子卡申请费用", now);
      UpsertFee(context, schoolId, "ACR I-Card", 4000m, PhpCurrencyId, "到校支付费用；长期学习或延签时通常需要", now);
      UpsertFee(context, schoolId, "签证延签", 4940m, PhpCurrencyId, "到校支付费用；8周首次延签参考，周数越长金额越高", now);
      UpsertFee(context, schoolId, "签证延签第二次", 11150m, PhpCurrencyId, "到校支付费用；12周第二次延签参考", now);
      UpsertFee(context, schoolId, "签证延签第三次", 15390m, PhpCurrencyId, "到校支付费用；16周第三次延签参考", now);
      UpsertFee(context, schoolId, "签证延签第四次", 19630m, PhpCurrencyId, "到校支付费用；20周第四次延签参考", now);
      UpsertFee(context, schoolId, "签证延签第五次", 23870m, PhpCurrencyId, "到校支付费用；24周第五次延签参考", now);
      UpsertFee(context, schoolId, "ID Card", 200m, PhpCurrencyId, "到校支付费用；学生证或校内识别费用参考", now);
      UpsertFee(context, schoolId, "教材费（Lite/BizSpeak）", 1000m, PhpCurrencyId, "到校支付费用；Lite ESL、BizSpeak每4周参考", now);
      UpsertFee(context, schoolId, "教材费（Speed/Working Holiday/Native）", 1500m, PhpCurrencyId, "到校支付费用；SPEED ESL、Working Holiday、Native ESL每4周参考", now);
      UpsertFee(context, schoolId, "教材费（Sparta/IELTS/TOEIC/Unlimited）", 2000m, PhpCurrencyId, "到校支付费用；SPARTA ESL、24 ESL、Unlimited ESL、IELTS、TOEIC每4周参考", now);
      UpsertFee(context, schoolId, "宿舍保证金", 3000m, PhpCurrencyId, "到校支付费用；退房检查后按学校规则退还", now);
      UpsertFee(context, schoolId, "水电费", 3000m, PhpCurrencyId, "到校支付费用；4周参考，按学校规则调整", now);
      UpsertFee(context, schoolId, "维护费", 1000m, PhpCurrencyId, "到校支付费用；4周参考", now);
      UpsertFee(context, schoolId, "洗衣费（EOP/Sparta）", 1500m, PhpCurrencyId, "到校支付费用；EOP与Sparta每4周参考", now);
      UpsertFee(context, schoolId, "洗衣费（City）", 1600m, PhpCurrencyId, "到校支付费用；City每4周参考", now);
      UpsertFee(context, schoolId, "指定接机", 3000m, PhpCurrencyId, "到校支付费用；马尼拉或克拉克指定接机日参考", now);
      UpsertFee(context, schoolId, "个别接机", 12000m, PhpCurrencyId, "到校支付费用；非指定日或个人接机费用起点，最终以学校确认为准", now);
      UpsertFee(context, schoolId, "送机到克拉克", 1500m, PhpCurrencyId, "到校支付费用；BESA送机到克拉克参考", now);

      await context.SaveChangesAsync();
    }

    private static async Task SeedJicPricingAsync(AppDbContext context)
    {
      var now = DateTime.UtcNow;
      var school = context.Schools.FirstOrDefault(x => x.Id == JicSchoolId || x.Name == JicSchoolName || x.Name == LegacyJicSchoolName || x.Name == JicAcademyBaguioName);

      if (school == null)
      {
        school = new XiaoJuanSchoolPayment.Server.Data.Models.School
        {
          Id = JicSchoolId,
          Name = JicSchoolName,
          CreatedDate = new DateTime(2002, 1, 1, 0, 0, 0, DateTimeKind.Utc),
        };
        context.Schools.Add(school);
      }
      else
      {
        school.Name = JicSchoolName;
        if (school.CreatedDate == default)
        {
          school.CreatedDate = new DateTime(2002, 1, 1, 0, 0, 0, DateTimeKind.Utc);
        }
      }

      var schoolId = school.Id;
      const string jicLessonNote = "Baguio JIC Academy 2026年4周USD费用参考；JIC日元公开表按固定JPY145/USD折算，最终以学校正式报价为准";

      UpsertLesson(context, schoolId, "Challenger ESL Flex", 4, 580m, "Challenger轻量ESL，适合低预算或先适应校区节奏", now, jicLessonNote);
      UpsertLesson(context, schoolId, "Challenger ESL Lite", 4, 760m, "Challenger基础综合ESL，适合多数入门和稳步提升学生", now, jicLessonNote);
      UpsertLesson(context, schoolId, "Challenger ESL Core", 4, 860m, "一对一课时更多，适合想加强输出和纠错的人", now, jicLessonNote);
      UpsertLesson(context, schoolId, "Challenger ESL Standard", 4, 960m, "高课时ESL，适合短期集中提升", now, jicLessonNote);
      UpsertLesson(context, schoolId, "Challenger IELTS Lite", 4, 960m, "IELTS入门或基础备考路线", now, jicLessonNote);
      UpsertLesson(context, schoolId, "Challenger IELTS Core", 4, 1010m, "IELTS课时更密集，适合阶段性冲分", now, jicLessonNote);
      UpsertLesson(context, schoolId, "Challenger IELTS Standard", 4, 1060m, "标准IELTS备考路线，适合明确分数目标", now, jicLessonNote);
      UpsertLesson(context, schoolId, "Challenger IELTS Guarantee", 4, 1060m, "IELTS保证班，另需确认保证班规则与参加费", now, jicLessonNote);
      UpsertLesson(context, schoolId, "Premium Speaking Starter", 4, 800m, "初学者友好口语课程，适合建立开口信心", now, jicLessonNote);
      UpsertLesson(context, schoolId, "Premium Speaking Pro", 4, 975m, "口语输出量更高，适合提升流利度与表达结构", now, jicLessonNote);
      UpsertLesson(context, schoolId, "Premium Speaking Master", 4, 1150m, "高密度口语与表达训练，适合演讲、讨论和流利度目标", now, jicLessonNote);
      UpsertLesson(context, schoolId, "Premium TEP ESL 8", 4, 800m, "主题式ESL入门，适合生活化英语学习", now, jicLessonNote);
      UpsertLesson(context, schoolId, "Premium TEP ESL 9", 4, 900m, "主题式ESL进阶，团体互动比重高", now, jicLessonNote);
      UpsertLesson(context, schoolId, "Premium TEP ESL 10", 4, 1000m, "主题式ESL高课时，适合想增加一对一训练的人", now, jicLessonNote);
      UpsertLesson(context, schoolId, "Premium Working Holiday", 4, 900m, "打工度假、面试和工作场景英语准备", now, jicLessonNote);
      UpsertLesson(context, schoolId, "Premium TOEIC", 4, 900m, "多益考试与职场英语基础", now, jicLessonNote);
      UpsertLesson(context, schoolId, "Premium Business Master", 4, 1150m, "商务会议、邮件、演示和职场表达强化", now, jicLessonNote);

      UpsertRoom(context, schoolId, "Challenger 单人房", 4, 1300m, "隐私最高，热门档期需提前确认", now);
      UpsertRoom(context, schoolId, "Challenger 双人房", 4, 800m, "预算与隐私较平衡的Challenger房型", now);
      UpsertRoom(context, schoolId, "Challenger 四人房Loft", 4, 750m, "Loft房型，适合控制总价", now);
      UpsertRoom(context, schoolId, "Challenger 四人房Studio", 4, 600m, "默认预算参考，适合先做总价估算", now);
      UpsertRoom(context, schoolId, "Premium 单人房A Balcony", 4, 1450m, "Premium高规格单人房，舒适度和预算都最高", now);
      UpsertRoom(context, schoolId, "Premium Semi Single / 1F Single Use", 4, 1250m, "兼顾隐私与预算的Premium单人方向", now);
      UpsertRoom(context, schoolId, "Premium 双人房A Balcony", 4, 950m, "带阳台双人房，适合重视生活舒适度", now);
      UpsertRoom(context, schoolId, "Premium 双人房B No Balcony", 4, 850m, "无阳台双人房，价格比A房型低", now);
      UpsertRoom(context, schoolId, "Premium 四人房A Balcony", 4, 750m, "Premium预算与设施平衡，带阳台", now);
      UpsertRoom(context, schoolId, "Premium 四人房B No Balcony", 4, 650m, "Premium预算入口，无阳台房型", now);

      UpsertFee(context, schoolId, "注册费", 100m, UsdCurrencyId, "前期支付费用；一次性报名注册费，JIC公开日元表为JPY 14,500", now);
      UpsertFee(context, schoolId, "旺季附加费", 34.5m, UsdCurrencyId, "前期支付费用；JIC以JPY 5,000/周收取，按固定JPY145/USD折算；2026/6/28-8/22、2027/6/27-8/22期间参考", now);
      UpsertFee(context, schoolId, "SSP", 7800m, PhpCurrencyId, "到校支付费用；特别学习许可，通常到校支付", now);
      UpsertFee(context, schoolId, "SSP I-Card", 4500m, PhpCurrencyId, "到校支付费用；与SSP相关的I-Card申请费用", now);
      UpsertFee(context, schoolId, "ACR I-Card", 4000m, PhpCurrencyId, "到校支付费用；长期学习或延签时通常需要", now);
      UpsertFee(context, schoolId, "签证延签", 4940m, PhpCurrencyId, "到校支付费用；8周首次延签参考，周数越长金额越高", now);
      UpsertFee(context, schoolId, "签证延签第二次", 11150m, PhpCurrencyId, "到校支付费用；12周第二次延签参考", now);
      UpsertFee(context, schoolId, "签证延签第三次", 15390m, PhpCurrencyId, "到校支付费用；16周第三次延签参考", now);
      UpsertFee(context, schoolId, "签证延签第四次", 19630m, PhpCurrencyId, "到校支付费用；20周第四次延签参考", now);
      UpsertFee(context, schoolId, "签证延签第五次", 23870m, PhpCurrencyId, "到校支付费用；24周第五次延签参考", now);
      UpsertFee(context, schoolId, "ID Card", 200m, PhpCurrencyId, "到校支付费用；学生证或校内识别费用参考", now);
      UpsertFee(context, schoolId, "宿舍保证金", 3000m, PhpCurrencyId, "到校支付费用；退房检查后按学校规则退还", now);
      UpsertFee(context, schoolId, "水电费", 3000m, PhpCurrencyId, "到校支付费用；4周参考，按学校规则调整", now);
      UpsertFee(context, schoolId, "洗衣费", 1200m, PhpCurrencyId, "到校支付费用；4周参考", now);
      UpsertFee(context, schoolId, "管理费", 1000m, PhpCurrencyId, "到校支付费用；4周参考", now);
      UpsertFee(context, schoolId, "教材费（ESL Lite）", 1500m, PhpCurrencyId, "到校支付费用；Challenger ESL Lite每4周参考", now);
      UpsertFee(context, schoolId, "教材费（ESL Core）", 1600m, PhpCurrencyId, "到校支付费用；Challenger ESL Core每4周参考", now);
      UpsertFee(context, schoolId, "教材费（ESL Standard / TOEIC Lite）", 1700m, PhpCurrencyId, "到校支付费用；ESL Standard或TOEIC Lite每4周参考", now);
      UpsertFee(context, schoolId, "教材费（TOEIC Standard）", 1800m, PhpCurrencyId, "到校支付费用；TOEIC Standard每4周参考", now);
      UpsertFee(context, schoolId, "教材费（IELTS）", 1900m, PhpCurrencyId, "到校支付费用；IELTS每4周参考", now);
      UpsertFee(context, schoolId, "IELTS保证班参加费", 18000m, PhpCurrencyId, "到校支付费用；IELTS Guarantee相关，需确认保证班规则", now);
      UpsertFee(context, schoolId, "指定接机", 3000m, PhpCurrencyId, "到校支付费用；马尼拉或克拉克指定接机日参考", now);

      await context.SaveChangesAsync();
    }

    private static async Task SeedMonolPricingAsync(AppDbContext context)
    {
      var now = DateTime.UtcNow;
      var school = context.Schools.FirstOrDefault(x => x.Id == MonolSchoolId || x.Name == MonolSchoolName || x.Name == LegacyMonolSchoolName || x.Name == MonolFullSchoolName);

      if (school == null)
      {
        school = new XiaoJuanSchoolPayment.Server.Data.Models.School
        {
          Id = MonolSchoolId,
          Name = MonolSchoolName,
          CreatedDate = new DateTime(2003, 1, 1, 0, 0, 0, DateTimeKind.Utc),
        };
        context.Schools.Add(school);
      }
      else
      {
        school.Name = MonolSchoolName;
        if (school.CreatedDate == default)
        {
          school.CreatedDate = new DateTime(2003, 1, 1, 0, 0, 0, DateTimeKind.Utc);
        }
      }

      var schoolId = school.Id;
      const string monolLessonNote = "MONOL官方Admission页4周USD费用参考；除注册费外，课程和住宿费用以4周为单位，最终以学校正式报价为准";

      UpsertLesson(context, schoolId, "General ESL", 4, 900m, "官方4周课程费，适合基础和综合英文提升", now, monolLessonNote);
      UpsertLesson(context, schoolId, "IELTS", 4, 1000m, "官方4周课程费USD900 + Academic Admin Fee USD100", now, monolLessonNote);
      UpsertLesson(context, schoolId, "LEAP English", 4, 1150m, "官方4周课程费USD900 + Academic Admin Fee USD250", now, monolLessonNote);

      UpsertRoom(context, schoolId, "Premium Single Room", 4, 1100m, "最高规格单人房，适合长期学习和重视隐私的人", now);
      UpsertRoom(context, schoolId, "Single Room", 4, 750m, "标准单人房，隐私与价格较平衡", now);
      UpsertRoom(context, schoolId, "Deluxe Room", 4, 700m, "带厨房，适合家庭或想自理餐食的人", now);
      UpsertRoom(context, schoolId, "Semi-Single Room", 4, 650m, "独立房间、共用浴室，兼顾隐私与预算", now);
      UpsertRoom(context, schoolId, "Triple Room", 4, 500m, "多人房型，适合控制总预算", now);
      UpsertRoom(context, schoolId, "Capsule Six Room", 4, 300m, "默认预算参考，适合先做最低总价估算", now);

      UpsertFee(context, schoolId, "注册费", 100m, UsdCurrencyId, "前期支付费用；官方Admission页列出的一次性注册费", now);
      UpsertFee(context, schoolId, "追加一对一（ESL）", 150m, UsdCurrencyId, "前期支付费用；Additional One-on-One Classes，ESL 4周参考", now);
      UpsertFee(context, schoolId, "追加一对一（IELTS）", 165m, UsdCurrencyId, "前期支付费用；Additional One-on-One Classes，IELTS 4周参考", now);
      UpsertFee(context, schoolId, "追加一对一（LEAP）", 180m, UsdCurrencyId, "前期支付费用；Additional One-on-One Classes，LEAP 4周参考", now);
      UpsertFee(context, schoolId, "Security Deposit", 4000m, PhpCurrencyId, "到校支付费用；官方列为USD 100或PHP 4,000，完成学习后按学校规则退还", now);
      UpsertFee(context, schoolId, "SSP Application", 7800m, PhpCurrencyId, "到校支付费用；特别学习许可，有效期6个月", now);
      UpsertFee(context, schoolId, "SSP ACR I-Card", 4500m, PhpCurrencyId, "到校支付费用；申请SSP时支付", now);
      UpsertFee(context, schoolId, "TVV ACR I-Card", 3500m, PhpCurrencyId, "到校支付费用；首次签证延签时支付", now);
      UpsertFee(context, schoolId, "签证延签8周", 2500m, PhpCurrencyId, "到校支付费用；Waiver参考", now);
      UpsertFee(context, schoolId, "签证延签12周", 9700m, PhpCurrencyId, "到校支付费用；Waiver + 第一次延签含TVV ACR I-Card参考", now);
      UpsertFee(context, schoolId, "签证延签16周", 10500m, PhpCurrencyId, "到校支付费用；Waiver + 第一次延签含TVV ACR I-Card参考", now);
      UpsertFee(context, schoolId, "签证延签20周", 12300m, PhpCurrencyId, "到校支付费用；Waiver + 第一次 + 第二次延签参考", now);
      UpsertFee(context, schoolId, "签证延签24周", 13000m, PhpCurrencyId, "到校支付费用；Waiver + 第一次 + 第二次延签参考", now);
      UpsertFee(context, schoolId, "马尼拉团体接机", 3000m, PhpCurrencyId, "到校支付费用；Group pickup from Manila Airport", now);
      UpsertFee(context, schoolId, "马尼拉个人接机", 12000m, PhpCurrencyId, "到校支付费用；Individual pickup from Manila Airport", now);
      UpsertFee(context, schoolId, "克拉克团体接机", 2500m, PhpCurrencyId, "到校支付费用；Group pickup from Clark Airport", now);
      UpsertFee(context, schoolId, "克拉克个人接机", 7000m, PhpCurrencyId, "到校支付费用；Individual pickup from Clark Airport", now);

      await context.SaveChangesAsync();
    }

    private static async Task SeedWalesPricingAsync(AppDbContext context)
    {
      var now = DateTime.UtcNow;
      var school = context.Schools.FirstOrDefault(x =>
        x.Id == WalesSchoolId ||
        x.Name == WalesSchoolName ||
        x.Name == LegacyWalesSchoolName ||
        x.Name == WalesFullSchoolName ||
        x.Name == WalesShortSchoolName);

      if (school == null)
      {
        school = new XiaoJuanSchoolPayment.Server.Data.Models.School
        {
          Id = WalesSchoolId,
          Name = WalesSchoolName,
          CreatedDate = new DateTime(2006, 1, 1, 0, 0, 0, DateTimeKind.Utc),
        };
        context.Schools.Add(school);
      }
      else
      {
        school.Name = WalesSchoolName;
        if (school.CreatedDate == default)
        {
          school.CreatedDate = new DateTime(2006, 1, 1, 0, 0, 0, DateTimeKind.Utc);
        }
      }

      var schoolId = school.Id;
      const string walesLessonNote = "WALES 2026年4周USD费用参考；课程费与住宿费分开列示，最终以学校正式报价为准";

      UpsertLesson(context, schoolId, "EEP Lite", 4, 650m, "1:1×3，适合轻量沟通和生活英文", now, walesLessonNote);
      UpsertLesson(context, schoolId, "EEP", 4, 800m, "1:1×4 + Group×1，适合生活口语与基础沟通", now, walesLessonNote);
      UpsertLesson(context, schoolId, "Infinity Lite", 4, 750m, "1:1×3 + Group×1，适合四项基础提升", now, walesLessonNote);
      UpsertLesson(context, schoolId, "Infinity Standard", 4, 880m, "1:1×4 + Group×2，适合多数综合英文学习", now, walesLessonNote);
      UpsertLesson(context, schoolId, "Infinity Intensive", 4, 1000m, "1:1×5 + Group×3，适合高课时综合强化", now, walesLessonNote);
      UpsertLesson(context, schoolId, "Infinity Pro", 4, 1200m, "1:1×4 + Group×3，适合更高强度和目标导向学习", now, walesLessonNote);
      UpsertLesson(context, schoolId, "IELTS Intro", 4, 880m, "1:1×3 + Group×3，适合IELTS Starter阶段", now, walesLessonNote);
      UpsertLesson(context, schoolId, "IELTS Standard", 4, 880m, "1:1×2 + Group×4，适合IELTS Academic或General Training", now, walesLessonNote);
      UpsertLesson(context, schoolId, "Junior ESL", 4, 1300m, "青少年ESL课程，需确认年龄和监护规则", now, walesLessonNote);
      UpsertLesson(context, schoolId, "Junior IELTS", 4, 1400m, "青少年IELTS课程，需确认目标分数和基础", now, walesLessonNote);

      UpsertRoom(context, schoolId, "Lower Studio Single", 4, 1000m, "Studio单人房，生活设备完整，适合重视隐私的人", now);
      UpsertRoom(context, schoolId, "Upper Studio Single", 4, 1100m, "楼层/房型不同，空房需提前确认", now);
      UpsertRoom(context, schoolId, "Premium Studio Single", 4, 1400m, "Premium单人房，设备更完整，预算较高", now);
      UpsertRoom(context, schoolId, "Premium Studio Twin Share", 4, 1000m, "Premium双人共享，适合同行或希望平衡预算的人", now);
      UpsertRoom(context, schoolId, "Condo Semi Single", 4, 1200m, "Condo半单人，兼顾隐私与公寓型生活", now);
      UpsertRoom(context, schoolId, "Condo Single with Window", 4, 950m, "带窗Condo单人房，适合重视采光的人", now);
      UpsertRoom(context, schoolId, "Condo Single", 4, 850m, "Condo单人房，2026公开价格表常用比较参考", now);
      UpsertRoom(context, schoolId, "Condo Twin Share", 4, 750m, "默认预算参考，适合先做最低总价估算", now);

      UpsertFee(context, schoolId, "报名费（金额需确认）", 0m, UsdCurrencyId, "前期支付费用；WALES官方流程提到需支付enrollment fee以保留注册和房间，公开金额需顾问确认", now);
      UpsertFee(context, schoolId, "SSP", 12300m, PhpCurrencyId, "到校支付费用；特别学习许可，4周也需准备", now);
      UpsertFee(context, schoolId, "ACR I-Card", 4000m, PhpCurrencyId, "到校支付费用；12周及以上通常需要，短期学生以学校确认规则为准", now);
      UpsertFee(context, schoolId, "签证延签8周", 4940m, PhpCurrencyId, "到校支付费用；8周首次延签参考", now);
      UpsertFee(context, schoolId, "签证延签12周", 11150m, PhpCurrencyId, "到校支付费用；12周延签参考，通常叠加ACR I-Card", now);
      UpsertFee(context, schoolId, "签证延签16周", 15300m, PhpCurrencyId, "到校支付费用；16周延签参考", now);
      UpsertFee(context, schoolId, "签证延签20周", 19630m, PhpCurrencyId, "到校支付费用；20周延签参考", now);
      UpsertFee(context, schoolId, "签证延签24周", 24140m, PhpCurrencyId, "到校支付费用；24周延签参考", now);
      UpsertFee(context, schoolId, "水电费", 3500m, PhpCurrencyId, "到校支付费用；4周参考，周数越长按学校规则递增", now);
      UpsertFee(context, schoolId, "维护费", 1000m, PhpCurrencyId, "到校支付费用；4周参考", now);
      UpsertFee(context, schoolId, "宿舍保证金", 5000m, PhpCurrencyId, "到校支付费用；退房检查后按学校规则退还", now);
      UpsertFee(context, schoolId, "School ID", 300m, PhpCurrencyId, "到校支付费用；学生证或校内识别费用参考", now);

      await context.SaveChangesAsync();
    }

    private static async Task SeedEgPricingAsync(AppDbContext context)
    {
      var now = DateTime.UtcNow;
      var school = context.Schools.FirstOrDefault(x =>
        x.Id == EgSchoolId ||
        x.Name == EgSchoolName ||
        x.Name == LegacyEgSchoolName ||
        x.Name == EgFullSchoolName);

      if (school == null)
      {
        school = new XiaoJuanSchoolPayment.Server.Data.Models.School
        {
          Id = EgSchoolId,
          Name = EgSchoolName,
          CreatedDate = new DateTime(2013, 4, 1, 0, 0, 0, DateTimeKind.Utc),
        };
        context.Schools.Add(school);
      }
      else
      {
        school.Name = EgSchoolName;
        if (school.CreatedDate == default)
        {
          school.CreatedDate = new DateTime(2013, 4, 1, 0, 0, 0, DateTimeKind.Utc);
        }
      }

      var schoolId = school.Id;
      const string egLessonNote = "EG Academy官网2025-01-01韩文价目表KRW参考；注册费KRW100,000另计，1/2/3周按4周课程+住宿总额40%/65%/85%计算，最终以学校正式报价为准";

      UpsertLesson(context, schoolId, "ESL 4", 4, 950000m, "4节一对一 + 2节团体课，适合预算优先和基础口语提升", now, egLessonNote, KrwCurrencyId);
      UpsertLesson(context, schoolId, "ESL 6", 4, 1270000m, "6节一对一 + 2节团体课，适合短期强化输出", now, egLessonNote, KrwCurrencyId);
      UpsertLesson(context, schoolId, "ESL Native Plus", 4, 1370000m, "ESL搭配Native课程，适合发音、自然表达和外教互动", now, egLessonNote, KrwCurrencyId);
      UpsertLesson(context, schoolId, "ESL Native Complete", 4, 1520000m, "Native比例更高，适合重视欧美表达和口语反馈的学生", now, egLessonNote, KrwCurrencyId);
      UpsertLesson(context, schoolId, "Pre-IELTS", 4, 1220000m, "雅思入门方向，适合还需要先补英语基础的人", now, egLessonNote, KrwCurrencyId);
      UpsertLesson(context, schoolId, "IELTS + Native", 4, 1320000m, "雅思备考搭配Native课程，需确认目标分和模考安排", now, egLessonNote, KrwCurrencyId);
      UpsertLesson(context, schoolId, "IELTS Score Guarantee", 4, 1370000m, "雅思保证班方向，通常需按保证班周数和入学门槛确认", now, egLessonNote, KrwCurrencyId);
      UpsertLesson(context, schoolId, "TOEIC + Native", 4, 1320000m, "多益与Native表达训练，适合求职或升学需求", now, egLessonNote, KrwCurrencyId);
      UpsertLesson(context, schoolId, "TOEFL + Native", 4, 1320000m, "托福与Native表达训练，适合北美升学或考试目标", now, egLessonNote, KrwCurrencyId);
      UpsertLesson(context, schoolId, "Business + Native", 4, 1320000m, "商务英语与Native沟通训练，适合职场表达、会议和面试", now, egLessonNote, KrwCurrencyId);
      UpsertLesson(context, schoolId, "Golf + ESL", 4, 1350000m, "英语课程搭配高尔夫练习，适合Clark特色体验", now, egLessonNote, KrwCurrencyId);
      UpsertLesson(context, schoolId, "Golf Special", 4, 1950000m, "高尔夫课时更重的组合方向，需同步确认球场和教练安排", now, egLessonNote, KrwCurrencyId);
      UpsertLesson(context, schoolId, "Junior ESL", 4, 1280000m, "青少年ESL，需确认年龄、监护与家庭同行规则", now, egLessonNote, KrwCurrencyId);
      UpsertLesson(context, schoolId, "Junior Native", 4, 1480000m, "青少年Native课程，适合重视发音和外教互动的家庭", now, egLessonNote, KrwCurrencyId);
      UpsertLesson(context, schoolId, "Junior IELTS", 4, 1400000m, "青少年雅思方向，需确认基础、目标分和学习强度", now, egLessonNote, KrwCurrencyId);
      UpsertLesson(context, schoolId, "Guardian ESL", 4, 780000m, "家长陪读课程，适合亲子同行时一起学习", now, egLessonNote, KrwCurrencyId);

      UpsertRoom(context, schoolId, "一人房", 4, 1000000m, "官网韩文价目表4周宿舍费参考，隐私最高，热门档期需提前确认", now, KrwCurrencyId);
      UpsertRoom(context, schoolId, "二人房", 4, 800000m, "官网韩文价目表4周宿舍费参考，兼顾预算和舒适度", now, KrwCurrencyId);
      UpsertRoom(context, schoolId, "四人房", 4, 600000m, "官网韩文价目表4周宿舍费参考，默认低预算估算房型", now, KrwCurrencyId);
      UpsertRoom(context, schoolId, "家庭三人房", 4, 700000m, "家庭/青少年方向常用参考房型，需按同行人数和空房确认", now, KrwCurrencyId);
      UpsertRoom(context, schoolId, "特别四人房", 4, 1100000m, "特别房型方向，适合家庭同行或需要更大生活空间的人", now, KrwCurrencyId);
      UpsertRoom(context, schoolId, "特别五人房", 4, 950000m, "特别房型方向，需确认开放状态和家庭人数", now, KrwCurrencyId);
      UpsertRoom(context, schoolId, "特别六人房", 4, 800000m, "特别房型方向，适合家庭或团体预算估算", now, KrwCurrencyId);

      UpsertFee(context, schoolId, "注册费", 100000m, KrwCurrencyId, "前期支付费用；EG Academy官网韩文价目表列为KRW100,000，且表格说明不包含注册费", now);
      UpsertFee(context, schoolId, "教材费（4周）", 2000m, PhpCurrencyId, "到校支付费用；官网价目表4周参考，按课程和实际教材调整", now);
      UpsertFee(context, schoolId, "School ID", 200m, PhpCurrencyId, "到校支付费用；学生证参考", now);
      UpsertFee(context, schoolId, "宿舍保证金", 5000m, PhpCurrencyId, "到校支付费用；退房检查后按学校规则退还，家庭方向通常需另行确认", now);
      UpsertFee(context, schoolId, "Clark / Mabalacat接机", 1000m, PhpCurrencyId, "到校支付费用；官网价目表个人接机参考", now);
      UpsertFee(context, schoolId, "马尼拉接机", 5000m, PhpCurrencyId, "到校支付费用；官网价目表个人接机参考，家庭接机通常PHP6,000", now);
      UpsertFee(context, schoolId, "家庭接机（Clark）", 1500m, PhpCurrencyId, "到校支付费用；官网价目表家庭接机参考，4人以上每增加1人加PHP200", now);
      UpsertFee(context, schoolId, "SSP", 6800m, PhpCurrencyId, "到校支付费用；特别学习许可参考，有效规则以学校现场为准", now);
      UpsertFee(context, schoolId, "SSP E-Card", 3500m, PhpCurrencyId, "到校支付费用；与SSP相关的E-Card费用参考", now);
      UpsertFee(context, schoolId, "ACR I-Card", 4000m, PhpCurrencyId, "到校支付费用；长期学习或延签时通常需要", now);
      UpsertFee(context, schoolId, "ECC Clearance", 2000m, PhpCurrencyId, "到校支付费用；长期停留离境清关费用参考", now);
      UpsertFee(context, schoolId, "签证延签8周", 3830m, PhpCurrencyId, "到校支付费用；官网价目表8周延签参考", now);
      UpsertFee(context, schoolId, "签证延签12周", 8830m, PhpCurrencyId, "到校支付费用；官网价目表12周延签参考", now);
      UpsertFee(context, schoolId, "签证延签16周", 12360m, PhpCurrencyId, "到校支付费用；官网价目表16周延签参考", now);
      UpsertFee(context, schoolId, "签证延签20周", 15890m, PhpCurrencyId, "到校支付费用；官网价目表20周延签参考", now);
      UpsertFee(context, schoolId, "签证延签24周", 19420m, PhpCurrencyId, "到校支付费用；官网价目表24周延签参考", now);
      UpsertFee(context, schoolId, "Golf追加课（每周5次）", 10000m, PhpCurrencyId, "到校支付费用；EG Golf官方页列出每周5次课程参考", now);
      UpsertFee(context, schoolId, "Golf追加课（每周3次）", 6000m, PhpCurrencyId, "到校支付费用；EG Golf官方页列出每周3次课程参考", now);
      UpsertFee(context, schoolId, "Golf练习球", 60m, PhpCurrencyId, "到校支付费用；EG Golf官方页列出50颗球一盒参考", now);
      UpsertFee(context, schoolId, "Golf月票（EG学生）", 4500m, PhpCurrencyId, "到校支付费用；EG Golf官方页列出EG学生月票参考", now);

      await context.SaveChangesAsync();
    }

    private static async Task SeedEnderunPricingAsync(AppDbContext context)
    {
      var now = DateTime.UtcNow;
      var school = context.Schools.FirstOrDefault(x =>
        x.Id == EnderunSchoolId ||
        x.Name == EnderunSchoolName ||
        x.Name == LegacyEnderunSchoolName);

      if (school == null)
      {
        school = new XiaoJuanSchoolPayment.Server.Data.Models.School
        {
          Id = EnderunSchoolId,
          Name = EnderunSchoolName,
          CreatedDate = new DateTime(2005, 1, 1, 0, 0, 0, DateTimeKind.Utc),
        };
        context.Schools.Add(school);
      }
      else
      {
        school.Name = EnderunSchoolName;
        if (school.CreatedDate == default)
        {
          school.CreatedDate = new DateTime(2005, 1, 1, 0, 0, 0, DateTimeKind.Utc);
        }
      }

      var schoolId = school.Id;
      const string enderunLessonNote = "Enderun Extension官网英语项目PHP费用参考；General/Business按月费，Academic为4个月项目，IELTS为30小时线上密集课程，最终以学校正式报价为准";

      UpsertLesson(context, schoolId, "General English 1-2 Months", 4, 40000m, "月费；BLP混合学习，适合日常英语和社交表达", now, enderunLessonNote, PhpCurrencyId);
      UpsertLesson(context, schoolId, "General English 3-5 Months", 4, 30000m, "月费；较长报名周期月费降低", now, enderunLessonNote, PhpCurrencyId);
      UpsertLesson(context, schoolId, "General English 6-8 Months", 4, 25000m, "月费；适合中长期城市英语补强", now, enderunLessonNote, PhpCurrencyId);
      UpsertLesson(context, schoolId, "General English 9-12 Months", 4, 20000m, "月费；长期报名月费参考", now, enderunLessonNote, PhpCurrencyId);
      UpsertLesson(context, schoolId, "Business English 1-2 Months", 4, 40000m, "月费；商务沟通、邮件、跨文化和演示表达", now, enderunLessonNote, PhpCurrencyId);
      UpsertLesson(context, schoolId, "Business English 3-5 Months", 4, 30000m, "月费；适合职场英语持续训练", now, enderunLessonNote, PhpCurrencyId);
      UpsertLesson(context, schoolId, "Business English 6-8 Months", 4, 25000m, "月费；适合企业或成人中长期目标", now, enderunLessonNote, PhpCurrencyId);
      UpsertLesson(context, schoolId, "Business English 9-12 Months", 4, 20000m, "月费；长期报名月费参考", now, enderunLessonNote, PhpCurrencyId);
      UpsertLesson(context, schoolId, "Academic English 4-Month Program", 16, 120000m, "4个月项目；适合大学或研究生学习准备", now, enderunLessonNote, PhpCurrencyId);
      UpsertLesson(context, schoolId, "IELTS Test Preparation 30 Hours", 4, 6499m, "30小时线上密集雅思备考，需按当期开课日期确认", now, enderunLessonNote, PhpCurrencyId);

      UpsertRoom(context, schoolId, "住宿自理", 4, 0m, "Enderun Extension不是传统寄宿制ESL学校；酒店、公寓或亲友住宿需另行安排", now, PhpCurrencyId);

      UpsertFee(context, schoolId, "Book Fee参考低值", 6000m, PhpCurrencyId, "官网说明Book fee通常不包含在课程费内，约PHP6,000-8,700，按课程确认", now);
      UpsertFee(context, schoolId, "Book Fee参考高值", 8700m, PhpCurrencyId, "官网说明Book fee通常不包含在课程费内，约PHP6,000-8,700，按课程确认", now);
      UpsertFee(context, schoolId, "One-on-One Top-Up 1-2 Months", 1400m, PhpCurrencyId, "额外一对一课每小时参考；官网Top-Up Packages页面", now);
      UpsertFee(context, schoolId, "One-on-One Top-Up 3-5 Months", 1200m, PhpCurrencyId, "额外一对一课每小时参考；官网Top-Up Packages页面", now);
      UpsertFee(context, schoolId, "One-on-One Top-Up 6-8 Months", 1000m, PhpCurrencyId, "额外一对一课每小时参考；官网Top-Up Packages页面", now);
      UpsertFee(context, schoolId, "One-on-One Top-Up 9-12 Months", 850m, PhpCurrencyId, "额外一对一课每小时参考；官网Top-Up Packages页面", now);
      UpsertFee(context, schoolId, "SSP / Visa Review", 0m, PhpCurrencyId, "官网FAQ说明入学后由Visa Team按护照和签证状态判断是否需要SSP，金额需当期确认", now);

      await context.SaveChangesAsync();
    }

    private static async Task SeedAmericanEnglishPricingAsync(AppDbContext context)
    {
      var now = DateTime.UtcNow;
      var school = context.Schools.FirstOrDefault(x =>
        x.Id == AmericanEnglishSchoolId ||
        x.Name == AmericanEnglishSchoolName ||
        x.Name == LegacyAmericanEnglishSchoolName ||
        x.Name == "American English Skills Development Center Inc." ||
        x.Name == "American English");

      if (school == null)
      {
        school = new XiaoJuanSchoolPayment.Server.Data.Models.School
        {
          Id = AmericanEnglishSchoolId,
          Name = AmericanEnglishSchoolName,
          CreatedDate = new DateTime(2006, 3, 1, 0, 0, 0, DateTimeKind.Utc),
        };
        context.Schools.Add(school);
      }
      else
      {
        school.Name = AmericanEnglishSchoolName;
        if (school.CreatedDate == default)
        {
          school.CreatedDate = new DateTime(2006, 3, 1, 0, 0, 0, DateTimeKind.Utc);
        }
      }

      var schoolId = school.Id;
      const string americanEnglishLessonNote = "American English官网PHP费用参考；课程按团体课、一对一、40小时项目或企业定制区分，最终以学校正式报价为准";

      UpsertLesson(context, schoolId, "Online Business Conversational English 40 Hours", 4, 14800m, "40小时线上团体课；最大10人，需确认当期开班", now, americanEnglishLessonNote, PhpCurrencyId);
      UpsertLesson(context, schoolId, "Basic Conversational English Low", 4, 19700m, "官网Programs页公开Basic Conversational English价格区间低值", now, americanEnglishLessonNote, PhpCurrencyId);
      UpsertLesson(context, schoolId, "Basic Conversational English High", 4, 29500m, "官网Programs页公开Basic Conversational English价格区间高值", now, americanEnglishLessonNote, PhpCurrencyId);
      UpsertLesson(context, schoolId, "Business Conversational English Low", 4, 19700m, "官网公开Business Conversational English团体课价格区间低值", now, americanEnglishLessonNote, PhpCurrencyId);
      UpsertLesson(context, schoolId, "Business Conversational English High", 4, 48000m, "官网公开Business Conversational English团体课价格区间高值", now, americanEnglishLessonNote, PhpCurrencyId);
      UpsertLesson(context, schoolId, "Assertive Communication Low", 4, 19700m, "官网公开Assertive Communication团体课价格区间低值", now, americanEnglishLessonNote, PhpCurrencyId);
      UpsertLesson(context, schoolId, "Assertive Communication High", 4, 48000m, "官网公开Assertive Communication团体课价格区间高值", now, americanEnglishLessonNote, PhpCurrencyId);
      UpsertLesson(context, schoolId, "Excellence in English Communication Low", 4, 12800m, "官网公开一对一Excellence in English Communication价格区间低值", now, americanEnglishLessonNote, PhpCurrencyId);
      UpsertLesson(context, schoolId, "Excellence in English Communication High", 4, 98800m, "官网公开一对一Excellence in English Communication价格区间高值", now, americanEnglishLessonNote, PhpCurrencyId);
      UpsertLesson(context, schoolId, "Excellence in Business Writing Low", 4, 12800m, "官网公开Excellence in Business Writing价格区间低值", now, americanEnglishLessonNote, PhpCurrencyId);
      UpsertLesson(context, schoolId, "Excellence in Business Writing High", 4, 98800m, "官网公开Excellence in Business Writing价格区间高值", now, americanEnglishLessonNote, PhpCurrencyId);
      UpsertLesson(context, schoolId, "Business English One-on-One 40 Hours", 4, 48000m, "官网Business English产品页公开40小时一对一起价参考", now, americanEnglishLessonNote, PhpCurrencyId);
      UpsertLesson(context, schoolId, "Business English One-on-One 120 Hours", 12, 155904m, "官网Business English产品页公开120小时高值参考", now, americanEnglishLessonNote, PhpCurrencyId);

      UpsertRoom(context, schoolId, "住宿自理", 4, 0m, "American English不是传统寄宿制ESL学校；酒店、公寓或亲友住宿需另行安排", now, PhpCurrencyId);

      UpsertFee(context, schoolId, "Pre-assessment / Needs Assessment", 0m, PhpCurrencyId, "入学前或企业培训前的英语水平/需求评估，费用和形式需按课程确认", now);
      UpsertFee(context, schoolId, "教材 / 课程资料", 0m, PhpCurrencyId, "按实际课程、小时数和定制内容确认", now);
      UpsertFee(context, schoolId, "Corporate Training Quote", 0m, PhpCurrencyId, "企业课程需先做Training Needs Analysis，再按人数、模块和交付方式报价", now);
      UpsertFee(context, schoolId, "住宿 / 餐食 / 通勤", 0m, PhpCurrencyId, "城市课程不含宿舍和三餐，Makati住宿与通勤需自行规划", now);
      UpsertFee(context, schoolId, "签证 / 保险 / 停留", 0m, PhpCurrencyId, "国际学生按停留时间、护照和行程另行确认", now);

      await context.SaveChangesAsync();
    }

    private static void UpsertLesson(
      AppDbContext context,
      Guid schoolId,
      string name,
      int week,
      decimal price,
      string description,
      DateTime lastUpdated,
      string note = "CIA 2026年4周课程费参考；最终以学校正式报价为准",
      int currencyId = UsdCurrencyId)
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
          CurrencyId = currencyId,
          Description = description,
          Note = note,
          LastUpdated = lastUpdated,
        });
        return;
      }

      lesson.Price = price;
      lesson.CurrencyId = currencyId;
      lesson.Description = description;
      lesson.Note = note;
      lesson.LastUpdated = lastUpdated;
    }

    private static void UpsertRoom(
      AppDbContext context,
      Guid schoolId,
      string name,
      int week,
      decimal price,
      string description,
      DateTime lastUpdated,
      int currencyId = UsdCurrencyId)
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
          CurrencyId = currencyId,
          Description = description,
          LastUpdated = lastUpdated,
        });
        return;
      }

      room.Price = price;
      room.CurrencyId = currencyId;
      room.Description = description;
      room.LastUpdated = lastUpdated;
    }

    private static void RemoveRoom(AppDbContext context, Guid schoolId, string name, int week)
    {
      var room = context.SchoolRooms.FirstOrDefault(x => x.SchoolId == schoolId && x.Name == name && x.Week == week);

      if (room != null)
      {
        context.SchoolRooms.Remove(room);
      }
    }

    private static void RemoveLesson(AppDbContext context, Guid schoolId, string name, int week)
    {
      var lesson = context.SchoolLessons.FirstOrDefault(x => x.SchoolId == schoolId && x.Name == name && x.Week == week);

      if (lesson != null)
      {
        context.SchoolLessons.Remove(lesson);
      }
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
