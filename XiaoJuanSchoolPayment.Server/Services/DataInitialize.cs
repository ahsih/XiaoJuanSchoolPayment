using XiaoJuanSchoolPayment.Server.Data;

using XiaoJuanSchoolPayment.Server.Data.Models;

namespace XiaoJuanSchoolPayment.Server.Services
{
  public static class DataInitialize
  {
    private const int UsdCurrencyId = 1;
    private const int PhpCurrencyId = 5;
    private const int KrwCurrencyId = 6;
    private const int JpyCurrencyId = 7;
    private const int NtdCurrencyId = 8;
    private static readonly Guid CiaSchoolId = Guid.Parse("2f6a6d78-b2f1-4b84-9ac4-1d3b3bd10c1a");
    private static readonly Guid EvSchoolId = Guid.Parse("d48cd1f9-d76b-4b52-9960-e9db057f577d");
    private static readonly Guid CpiSchoolId = Guid.Parse("8c5d52f6-cfe1-45d9-9b66-1c5c0cdb2a6d");
    private static readonly Guid BCebuSchoolId = Guid.Parse("f7d8a312-4c91-46e9-87a1-2d63c89b0e54");
    private static readonly Guid CpilsSchoolId = Guid.Parse("6d0bcf03-e6d7-41b3-b14f-1467e762747d");
    private static readonly Guid FellaSchoolId = Guid.Parse("ec6d3456-b310-46b8-9f4c-f7173c2a4e7c");
    private static readonly Guid PhilinterSchoolId = Guid.Parse("7a2e4b6c-8d51-42e7-9f3b-0a2d9f4c5b31");
    private static readonly Guid PinesSchoolId = Guid.Parse("3e72d4cb-9f12-4f21-9d7b-6b356a99f019");
    private static readonly Guid BeciSchoolId = Guid.Parse("8fa41c8c-0bb4-4bf3-a0c2-e28f07fd0c62");
    private static readonly Guid JicSchoolId = Guid.Parse("b9eb0a1e-1b2a-4e9f-8f63-0bd6f0c4417a");
    private static readonly Guid MonolSchoolId = Guid.Parse("2d7c4bd9-0f3b-4b2d-9fb7-d53c2d6a90df");
    private static readonly Guid WalesSchoolId = Guid.Parse("6b825ff8-4f79-4b65-9447-2f4e7abef0a1");
    private static readonly Guid EgSchoolId = Guid.Parse("82cbcbad-1162-4088-823d-ea100bfee689");
    private static readonly Guid WeSchoolId = Guid.Parse("783171c4-90e8-448c-91a4-2caf09e65c03");
    private static readonly Guid HelpSchoolId = Guid.Parse("a4c3183e-b569-4b1f-b854-fcdd019b4d1a");
    private static readonly Guid AelcSchoolId = Guid.Parse("65762fe8-70e4-4491-abfc-c636a0e707f9");
    private static readonly Guid EnderunSchoolId = Guid.Parse("d63f8a4e-27e2-45e9-b1cc-a5223e5d118f");
    private static readonly Guid AmericanEnglishSchoolId = Guid.Parse("4f0709fe-2a93-4dd5-8d0f-2819115f0288");
    private static readonly Guid BerlitzSchoolId = Guid.Parse("f5635f19-41a2-4d23-99ab-9cb2c05af112");
    private static readonly Guid MbcSchoolId = Guid.Parse("51f7d253-0f88-4a2b-bd68-640253ef8cbc");
    private static readonly Guid GlcSchoolId = Guid.Parse("f16a6538-19a2-46c5-a93e-5cd0f19c60f7");
    private static readonly Guid IuSchoolId = Guid.Parse("bc2606e1-7dc1-4f15-8a47-6424ea15936f");
    private const string CiaSchoolName = "CIA Cebu International Academy";
    private const string EvSchoolName = "EV Academy";
    private const string CpiSchoolName = "菲律宾宿务CPI语言学校";
    private const string LegacyCpiSchoolName = "CPI Cebu Pelis Institute";
    private const string BCebuSchoolName = "菲律宾宿务B'Cebu语言学校";
    private const string LegacyBCebuSchoolName = "BECI B'Cebu";
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
    private const string WeSchoolName = "菲律宾克拉克WE Academy语言学校";
    private const string LegacyWeSchoolName = "Clark WE Academy";
    private const string WeShortSchoolName = "WE Academy";
    private const string HelpSchoolName = "菲律宾克拉克HELP English语言学校";
    private const string LegacyHelpSchoolName = "HELP English Clark";
    private const string HelpClarkSchoolName = "HELP Clark";
    private const string AelcSchoolName = "菲律宾克拉克AELC语言学校";
    private const string LegacyAelcSchoolName = "AELC / Native-focused Clark Schools";
    private const string AelcFullSchoolName = "American English Learning Center";
    private const string EnderunSchoolName = "菲律宾马尼拉Enderun语言学校";
    private const string LegacyEnderunSchoolName = "Enderun Extension";
    private const string AmericanEnglishSchoolName = "菲律宾马尼拉American-English-Skill语言学校";
    private const string LegacyAmericanEnglishSchoolName = "American English Skills Development Center";
    private const string BerlitzSchoolName = "菲律宾马尼拉Berlitz语言学校";
    private const string LegacyBerlitzSchoolName = "Berlitz Philippines";
    private const string MbcSchoolName = "菲律宾马尼拉Business College学校";
    private const string LegacyMbcSchoolName = "Manila Business College";
    private const string GlcSchoolName = "菲律宾宿务Global Language Cebu";
    private const string IuSchoolName = "菲律宾宿务IU English Academy";

    public static async Task SeedAsync(IServiceProvider services)
    {
      using var scope = services.CreateScope();
      var provider = scope.ServiceProvider;
      var context = provider.GetRequiredService<AppDbContext>();

      await SeedCurrenciesAsync(context);
      await SeedCiaPricingAsync(context);
      await SeedEvPricingAsync(context);
      await SeedCpiPricingAsync(context);
      await SeedBCebuPricingAsync(context);
      await SeedCpilsPricingAsync(context);
      await SeedFellaPricingAsync(context);
      await SeedPhilinterPricingAsync(context);
      await SeedPinesPricingAsync(context);
      await SeedBeciPricingAsync(context);
      await SeedJicPricingAsync(context);
      await SeedMonolPricingAsync(context);
      await SeedWalesPricingAsync(context);
      await SeedEgPricingAsync(context);
      await SeedWePricingAsync(context);
      await SeedHelpPricingAsync(context);
      await SeedAelcPricingAsync(context);
      await SeedEnderunPricingAsync(context);
      await SeedAmericanEnglishPricingAsync(context);
      await SeedBerlitzPricingAsync(context);
      await SeedMbcPricingAsync(context);
      await SeedGlcPricingAsync(context);
      await SeedIuPricingAsync(context);
      await SeedRegionalStartingPricesAsync(context);
    }

    private static async Task SeedIuPricingAsync(AppDbContext context)
    {
      var now = DateTime.UtcNow;
      var school = context.Schools.FirstOrDefault(x =>
        x.Id == IuSchoolId ||
        x.Name == IuSchoolName ||
        x.Name == "IU English Academy");

      if (school == null)
      {
        school = new XiaoJuanSchoolPayment.Server.Data.Models.School
        {
          Id = IuSchoolId,
          Name = IuSchoolName,
          CreatedDate = new DateTime(2024, 1, 1, 0, 0, 0, DateTimeKind.Utc),
        };
        context.Schools.Add(school);
      }

      var schoolId = school.Id;
      const string lessonNote = "IU 2026年4周课程费参考；最短接受3周报名，3周按4周价格的80%计算；不提供1-2周方案";

      AddLessonIfMissing(context, schoolId, "Light ESL", 750m, "一对一4课时", lessonNote, now, 4);
      AddLessonIfMissing(context, schoolId, "Power Speaking 4", 850m, "一对一4课时 + 团体课4课时", lessonNote, now, 4);
      AddLessonIfMissing(context, schoolId, "Power Speaking 6", 1000m, "一对一6课时 + 团体课2课时", lessonNote, now, 4);
      AddLessonIfMissing(context, schoolId, "Power Speaking 8", 1150m, "一对一8课时", lessonNote, now, 4);
      AddLessonIfMissing(context, schoolId, "TOEIC", 950m, "一对一4课时 + 团体课4课时 + 自习课1课时 + 晚课2课时", lessonNote, now, 4);
      AddLessonIfMissing(context, schoolId, "IELTS", 1000m, "一对一4课时 + 团体课4课时 + 自习课1课时 + 晚课2课时", lessonNote, now, 4);
      AddLessonIfMissing(context, schoolId, "6周 IELTS保证班", 1200m, "一对一6课时 + 团体课2课时 + 自习课1课时 + 晚课2课时", lessonNote, now, 4);
      AddLessonIfMissing(context, schoolId, "12周 IELTS保证班", 1133m, "一对一6课时 + 团体课2课时 + 自习课1课时 + 晚课2课时", lessonNote, now, 4);
      AddLessonIfMissing(context, schoolId, "商务英语4", 950m, "一对一4课时 + 团体课4课时", lessonNote, now, 4);
      AddLessonIfMissing(context, schoolId, "商务英语6", 1100m, "一对一6课时 + 团体课2课时", lessonNote, now, 4);
      AddLessonIfMissing(context, schoolId, "儿童（7~12岁）", 900m, "一对一4课时 + 团体课2课时 + 活动课2课时", lessonNote, now, 4);
      AddLessonIfMissing(context, schoolId, "青少年（13~15岁）", 900m, "一对一4课时 + 团体课4课时", lessonNote, now, 4);
      AddLessonIfMissing(context, schoolId, "健身英文", 1050m, "一对一4课时 + 健身课3课时", lessonNote, now, 4);
      AddLessonIfMissing(context, schoolId, "监护人", 0m, "仅预订住宿，家长不上课", lessonNote, now, 4);

      AddRoomIfMissing(context, schoolId, "校内单人房", 950m, "隐私最好，热门档期需尽早确认", now, 4);
      AddRoomIfMissing(context, schoolId, "校内双人房", 800m, "适合同伴同行或想减少室友人数", now, 4);
      AddRoomIfMissing(context, schoolId, "校内三人房", 700m, "预算和生活空间比较平衡", now, 4);
      AddRoomIfMissing(context, schoolId, "校内四人房", 600m, "仅限家庭", now, 4);
      AddRoomIfMissing(context, schoolId, "校外单人房", 1400m, "校外宿舍单人方案，预算最高", now, 4);
      AddRoomIfMissing(context, schoolId, "校外双人房", 950m, "需确认交通、餐食和空房", now, 4);

      AddFeeIfMissing(context, schoolId, "注册费", 100m, UsdCurrencyId, "前期支付费用；一次性报名注册费", now);

      await context.SaveChangesAsync();
    }

    private static async Task SeedGlcPricingAsync(AppDbContext context)
    {
      var now = DateTime.UtcNow;
      var school = context.Schools.FirstOrDefault(x =>
        x.Id == GlcSchoolId ||
        x.Name == GlcSchoolName ||
        x.Name == "Global Language Cebu" ||
        x.Name == "GLC");

      if (school == null)
      {
        school = new XiaoJuanSchoolPayment.Server.Data.Models.School
        {
          Id = GlcSchoolId,
          Name = GlcSchoolName,
          CreatedDate = new DateTime(2011, 1, 1, 0, 0, 0, DateTimeKind.Utc),
        };
        context.Schools.Add(school);
      }

      var schoolId = school.Id;
      AddLessonIfMissing(context, schoolId, "Light Power Speaking", 165m, "1:1三节 + 小组两节（选修课）", "15岁以上；住宿费另加。", now);
      AddLessonIfMissing(context, schoolId, "Power Speaking", 215m, "1:1四节 + 小组两节（选修课）", "适合第一次游学、基础听说训练和想平衡学习与自由时间的学生。", now);
      AddLessonIfMissing(context, schoolId, "Intensive Power Speaking", 270m, "1:1五节 + 小组两节（选修课）", "适合想增加一对一比例、短期集中补弱项和提高输出频率的学生。", now);
      AddLessonIfMissing(context, schoolId, "Ultra7 Power Speaking", 375m, "1:1七节 + 小组一节（选修课）", "适合时间有限、想让课程几乎全部围绕个人弱点安排的学生。", now);
      AddLessonIfMissing(context, schoolId, "Ultra Sparta ESL", 280m, "1:1五节 + 小组三节 + 词汇/写作测试 + 晚课两节 + 自习一节", "含周六上午课程；斯巴达管理学生只能选择副楼住宿。", now);
      AddLessonIfMissing(context, schoolId, "Family Package 2", 410m, "1:1八节（青少年与监护人共享）+ 监护人小组两节", "小孩5-11岁，青少年12-14岁。", now);
      AddLessonIfMissing(context, schoolId, "Family Package 3", 590m, "1:1十二节（青少年与监护人共享）+ 监护人小组两节", "小孩5-11岁，青少年12-14岁。", now);
      AddLessonIfMissing(context, schoolId, "Family Package 4", 775m, "1:1十六节（青少年与监护人共享）+ 监护人小组两节", "小孩5-11岁，青少年12-14岁。", now);
      AddLessonIfMissing(context, schoolId, "Kids English 6", 335m, "1:1六节", "适合5-11岁儿童。", now);
      AddLessonIfMissing(context, schoolId, "Kids English 7", 400m, "1:1七节", "适合5-11岁儿童。", now);
      AddLessonIfMissing(context, schoolId, "Kids English 8", 465m, "1:1八节", "适合5-11岁儿童。", now);
      AddLessonIfMissing(context, schoolId, "Junior Power Speaking 6", 325m, "1:1六节", "适合12-14岁青少年。", now);
      AddLessonIfMissing(context, schoolId, "Junior Power Speaking 7", 375m, "1:1七节", "适合12-14岁青少年。", now);
      AddLessonIfMissing(context, schoolId, "Junior Power Speaking 8", 430m, "1:1八节", "适合12-14岁青少年。", now);
      AddLessonIfMissing(context, schoolId, "General IELTS", 240m, "1:1四节 + 小组两节 + 选修课", "需确认英文程度、教材和开课安排。", now);
      AddLessonIfMissing(context, schoolId, "Intensive IELTS", 300m, "1:1五节 + 小组两节 + 选修课", "需确认英文程度、教材和开课安排。", now);
      AddLessonIfMissing(context, schoolId, "Ultra8 IELTS", 430m, "1:1八节 + 选修课", "需确认英文程度、教材和开课安排。", now);
      AddLessonIfMissing(context, schoolId, "Ultra IELTS斯巴达", 355m, "1:1五节 + 强制小组三节 + 测试、晚课与自习", "含周六上午模考；斯巴达管理学生只能选择副楼住宿。", now);
      AddLessonIfMissing(context, schoolId, "Business course", 300m, "1:1四节 + 小组两节（选修课）", "住宿费与当地费用另加。", now);
      AddLessonIfMissing(context, schoolId, "Ultra7 Business", 465m, "1:1七节 + 小组一节（选修课）", "住宿费与当地费用另加。", now);

      AddRoomIfMissing(context, schoolId, "主楼豪华单人间", 645m, "斯巴达管理学生不能选择主楼住宿。", now);
      AddRoomIfMissing(context, schoolId, "主楼单人间", 385m, "斯巴达管理学生不能选择主楼住宿。", now);
      AddRoomIfMissing(context, schoolId, "主楼双人间", 270m, "斯巴达管理学生不能选择主楼住宿。", now);
      AddRoomIfMissing(context, schoolId, "主楼三人间", 220m, "适合控制预算；斯巴达管理学生不能选择主楼住宿。", now);
      AddRoomIfMissing(context, schoolId, "副楼双人间", 250m, "斯巴达管理学生只能选择副楼住宿。", now);
      AddRoomIfMissing(context, schoolId, "副楼单人间", 360m, "斯巴达管理学生只能选择副楼住宿。", now);

      AddFeeIfMissing(context, schoolId, "注册费", 120m, UsdCurrencyId, "前期支付费用；一次性报名注册费", now);

      await context.SaveChangesAsync();
    }

    private static async Task SeedCurrenciesAsync(AppDbContext context)
    {
      UpsertCurrency(context, UsdCurrencyId, "USD", "$");
      UpsertCurrency(context, 2, "GBP", "£");
      UpsertCurrency(context, 3, "CNY", "¥");
      UpsertCurrency(context, 4, "EUR", "€");
      UpsertCurrency(context, PhpCurrencyId, "PHP", "₱");
      UpsertCurrency(context, KrwCurrencyId, "KRW", "₩");
      UpsertCurrency(context, JpyCurrencyId, "JPY", "¥");
      UpsertCurrency(context, NtdCurrencyId, "NTD", "NT$");

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

      const string evLessonNote = "EV 2025年4周课程费参考；1周40%、2周65%、3周85%；最终以学校正式报价为准";
      UpsertLesson(context, schoolId, "ESL Classic", 4, 930m, "4节一对一 + 2节小团体课 + 2节大团体课", now, evLessonNote);
      UpsertLesson(context, schoolId, "Senior ESL", 4, 1120m, "4节一对一 + 2节小团体课 + 2节大团体课", now, evLessonNote);
      UpsertLesson(context, schoolId, "强化口说6", 4, 1120m, "6节一对一 + 1节小团体课 + 1节大团体课", now, evLessonNote);
      UpsertLesson(context, schoolId, "强化口说8", 4, 1300m, "8节一对一", now, evLessonNote);

      const string evRoomNote = "热门房型建议提前6个月预定";
      UpsertRoom(context, schoolId, "单人间", 4, 1750m, evRoomNote, now);
      UpsertRoom(context, schoolId, "双人间A（面对泳池）", 4, 1150m, evRoomNote, now);
      UpsertRoom(context, schoolId, "双人间B", 4, 1050m, evRoomNote, now);
      UpsertRoom(context, schoolId, "三人间", 4, 910m, evRoomNote, now);
      UpsertRoom(context, schoolId, "四人间", 4, 860m, evRoomNote, now);

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
      const string cpiLessonNote = "CPI 2026年4周课程费参考；1/2/3周分别按4周价格的37.5%/65%/90%计算；最终以学校正式报价为准";

      RemoveLesson(context, schoolId, "General English", 4);
      RemoveLesson(context, schoolId, "Intensive English", 4);
      RemoveLesson(context, schoolId, "Rapid 30", 4);
      RemoveLesson(context, schoolId, "Rapid 60", 4);
      RemoveLesson(context, schoolId, "TOEIC Regular", 4);
      RemoveLesson(context, schoolId, "IELTS Regular", 4);
      RemoveLesson(context, schoolId, "IELTS Guarantee", 4);
      RemoveLesson(context, schoolId, "Speaking Master", 4);
      RemoveLesson(context, schoolId, "Business English", 4);
      RemoveLesson(context, schoolId, "Junior Program", 4);
      RemoveLesson(context, schoolId, "Guardian Program", 4);

      UpsertLesson(context, schoolId, "ESL GENERAL（15岁以上）", 4, 900m, "4节一对一 + 2节小组课 + 1节小团体课；15岁以上", now, cpiLessonNote);
      UpsertLesson(context, schoolId, "ESL INTENSIVE", 4, 1020m, "5节一对一 + 2节小组课 + 1节小团体课", now, cpiLessonNote);
      UpsertLesson(context, schoolId, "TOEIC PREPARATORY", 4, 950m, "托业预备课程；4节一对一 + 2节小组课 + 1节小团体课", now, cpiLessonNote);
      UpsertLesson(context, schoolId, "TOEFL PREPARATORY", 4, 950m, "托福预备课程；4节一对一 + 2节小组课 + 1节小团体课", now, cpiLessonNote);
      UpsertLesson(context, schoolId, "IELTS PREPARATORY", 4, 950m, "雅思预备课程；ESL与雅思一对一及团体课组合", now, cpiLessonNote);
      UpsertLesson(context, schoolId, "TOEIC GENERAL", 4, 1020m, "托业常规课程；4节一对一 + 2节小组课 + 2节考试课程", now, cpiLessonNote);
      UpsertLesson(context, schoolId, "TOEFL GENERAL", 4, 1020m, "托福常规课程；4节一对一 + 2节小组课 + 2节考试课程", now, cpiLessonNote);
      UpsertLesson(context, schoolId, "IELTS GENERAL", 4, 1020m, "雅思常规课程；4节一对一 + 2节小组课 + 2节考试课程", now, cpiLessonNote);
      UpsertLesson(context, schoolId, "TOEIC INTENSIVE", 4, 1070m, "托业强化课程；5节一对一 + 2节小组课 + 2节考试课程", now, cpiLessonNote);
      UpsertLesson(context, schoolId, "TOEFL INTENSIVE", 4, 1070m, "托福强化课程；5节一对一 + 2节小组课 + 2节考试课程", now, cpiLessonNote);
      UpsertLesson(context, schoolId, "IELTS INTENSIVE", 4, 1070m, "雅思强化课程；5节一对一 + 2节小组课 + 2节考试课程", now, cpiLessonNote);
      UpsertLesson(context, schoolId, "IELTS GUARANTEE", 4, 1120m, "雅思保证班；入学门槛、目标分数和最低周数需确认", now, cpiLessonNote);
      UpsertLesson(context, schoolId, "TOEFL GUARANTEE", 4, 1120m, "托福保证班；入学门槛、目标分数和最低周数需确认", now, cpiLessonNote);
      UpsertLesson(context, schoolId, "TOEIC GUARANTEE", 4, 1120m, "托业保证班；入学门槛、目标分数和最低周数需确认", now, cpiLessonNote);
      UpsertLesson(context, schoolId, "JUNIOR（6-15岁）", 4, 1320m, "5节一对一 + 1节小组课 + 1节小团体课；可申请将1节一对一转给家长", now, cpiLessonNote);
      UpsertLesson(context, schoolId, "PARENTS", 4, 780m, "家长课程；2节一对一 + 1节小组课 + 1节小团体课", now, cpiLessonNote);
      UpsertLesson(context, schoolId, "ESP BRIDGE", 4, 950m, "ESL与商务英语衔接课程", now, cpiLessonNote);
      UpsertLesson(context, schoolId, "ESP GENERAL", 4, 1020m, "商务英语常规课程", now, cpiLessonNote);

      RemoveRoom(context, schoolId, "Superior 单人房", 4);
      RemoveRoom(context, schoolId, "Superior 双人房", 4);
      RemoveRoom(context, schoolId, "Superior 三人房", 4);
      RemoveRoom(context, schoolId, "Superior 四人房", 4);
      RemoveRoom(context, schoolId, "Superior 六人房", 4);
      RemoveRoom(context, schoolId, "Executive 单人房", 4);
      RemoveRoom(context, schoolId, "Executive 双人房", 4);
      RemoveRoom(context, schoolId, "Executive 三人房", 4);
      RemoveRoom(context, schoolId, "Family 双人房", 4);
      RemoveRoom(context, schoolId, "Family 三人房", 4);

      UpsertRoom(context, schoolId, "A栋单人间", 4, 1445m, "A栋单人房；隐私较高，热门档期需尽早确认", now);
      UpsertRoom(context, schoolId, "A栋双人间", 4, 960m, "A栋双人房；适合朋友同行或兼顾预算与舒适度", now);
      UpsertRoom(context, schoolId, "A栋三人间", 4, 840m, "A栋三人房；多人房中预算较平衡", now);
      UpsertRoom(context, schoolId, "A栋四人间（上下铺）", 4, 770m, "A栋四人上下铺；默认报价参考房型", now);
      UpsertRoom(context, schoolId, "B栋单人间", 4, 1595m, "B栋单人房；隐私较高，热门档期需尽早确认", now);
      UpsertRoom(context, schoolId, "B栋双人间A", 4, 1160m, "B栋双人房A", now);
      UpsertRoom(context, schoolId, "B栋双人间B", 4, 1110m, "B栋双人房B", now);
      UpsertRoom(context, schoolId, "B栋三人间", 4, 950m, "B栋三人房", now);
      UpsertRoom(context, schoolId, "B栋四人间（3张床）", 4, 890m, "家庭房型；四人入住、3张床，空房需单独确认", now);
      UpsertRoom(context, schoolId, "B栋六人间", 4, 770m, "仅限女生；空房需单独确认", now);

      UpsertFee(context, schoolId, "注册费", 100m, UsdCurrencyId, "前期支付费用；一次性报名注册费", now);
      UpsertFee(context, schoolId, "旺季附加费", 30m, UsdCurrencyId, "前期支付费用；旺季期间参考 USD 30 / 周，具体档期以学校确认为准", now);
      UpsertFee(context, schoolId, "B区304套房（适合四人）", 5000m, PhpCurrencyId, "住宿特别房型；每晚 PHP 5,000，按实际入住晚数计算，不参与4周USD宿舍估算", now);
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

    private static async Task SeedBCebuPricingAsync(AppDbContext context)
    {
      var now = DateTime.UtcNow;
      var school = context.Schools.FirstOrDefault(x => x.Id == BCebuSchoolId || x.Name == BCebuSchoolName || x.Name == LegacyBCebuSchoolName || x.Name == "B'Cebu");

      if (school == null)
      {
        school = new XiaoJuanSchoolPayment.Server.Data.Models.School
        {
          Id = BCebuSchoolId,
          Name = BCebuSchoolName,
          CreatedDate = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc),
        };
        context.Schools.Add(school);
      }
      else
      {
        school.Name = BCebuSchoolName;
        if (school.CreatedDate == default)
        {
          school.CreatedDate = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc);
        }
      }

      var schoolId = school.Id;
      const string bCebuLessonNote = "B'Cebu 2026年4周课程费参考；1/2/3周分别按4周价格的40%/60%/80%计算；最终以学校正式报价为准";

      UpsertLesson(context, schoolId, "Speed ESL", 4, 900m, "4节一对一 + 2节小组课 + 2节晚课（选修）；适合初级到高级学生", now, bCebuLessonNote);
      UpsertLesson(context, schoolId, "Intensive ESL", 4, 1050m, "6节一对一 + 2节晚课（选修）；适合希望增加一对一课程的学生", now, bCebuLessonNote);
      UpsertLesson(context, schoolId, "IELTS", 4, 1000m, "4节一对一 + 2节团体课 + 1节选修早课 + 2节模拟测试（选修）", now, bCebuLessonNote);
      UpsertLesson(context, schoolId, "IELTS Sparta", 4, 1050m, "4节一对一 + 2节团体课 + 1节早课 + 2节模拟测试 + 自习；22:00结束", now, bCebuLessonNote);
      UpsertLesson(context, schoolId, "IELTS GUARANTEE", 4, 1150m, "4节一对一 + 2节团体课 + 1节选修早课 + 2节模拟测试；入学需雅思成绩，12周起报", now, bCebuLessonNote);
      UpsertLesson(context, schoolId, "B'SPARTA", 4, 1050m, "5节一对一 + 2节小组课 + 3节强制晚课 + 2节强制自习；斯巴达模式", now, bCebuLessonNote);
      UpsertLesson(context, schoolId, "商务英语", 4, 1050m, "4节一对一 + 2节小组课 + 2节必修课", now, bCebuLessonNote);
      UpsertLesson(context, schoolId, "Junior ESL", 4, 1250m, "6节一对一；适合6-16岁青少年学生", now, bCebuLessonNote);
      UpsertLesson(context, schoolId, "Lite ESL4", 4, 750m, "4节一对一；适合喜欢慢节奏学习方式的学生", now, bCebuLessonNote);
      UpsertLesson(context, schoolId, "Lite ESL2（40岁以上）", 4, 400m, "2节一对一；仅适用于40岁以上学生", now, bCebuLessonNote);
      UpsertLesson(context, schoolId, "幼儿园", 4, 950m, "08:30-12:20 / 13:30-17:00；适合3-6岁儿童", now, bCebuLessonNote);

      UpsertRoom(context, schoolId, "单人间外景（马克坦新城）", 4, 1400m, "50岁以上学生只能选择单人间", now);
      UpsertRoom(context, schoolId, "单人间内景（校内花园）", 4, 1350m, "50岁以上学生只能选择单人间", now);
      UpsertRoom(context, schoolId, "双人间", 4, 950m, "标准双人房", now);
      UpsertRoom(context, schoolId, "双人间+客厅", 4, 1250m, "仅限夫妻、兄弟姐妹或同行朋友共同报名，不接受个人入住", now);
      UpsertRoom(context, schoolId, "双人间+客厅（加床亲子3人）", 4, 1000m, "亲子三人入住参考房型", now);
      UpsertRoom(context, schoolId, "2+1宿舍（上下铺）", 4, 900m, "只限女生，仅在淡季开放", now);
      UpsertRoom(context, schoolId, "三人间（上下铺）", 4, 750m, "上下铺多人房；周六下午4点后可免费入住", now);

      UpsertFee(context, schoolId, "注册费", 100m, UsdCurrencyId, "前期支付费用；一次性报名注册费", now);

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

      UpsertLesson(context, schoolId, "General ESL", 4, 935m, "基础综合英语，适合第一次游学和稳步提升", now, cpilsLessonNote);
      UpsertLesson(context, schoolId, "General ESL Plus", 4, 935m, "综合英语加强方向，适合想增加输出训练的学生", now, cpilsLessonNote);
      UpsertLesson(context, schoolId, "General ESL Light", 4, 600m, "较轻量综合英语，适合想保留生活弹性的学生", now, cpilsLessonNote);
      UpsertLesson(context, schoolId, "Premier Sparta", 4, 1040m, "斯巴达学习强度，适合需要纪律推动的学生", now, cpilsLessonNote);
      UpsertLesson(context, schoolId, "TOEIC Course", 4, 1040m, "托业备考，适合求职、升学或企业英语需求", now, cpilsLessonNote);
      UpsertLesson(context, schoolId, "TOEIC Guarantee", 4, 1132m, "托业保证班；听力和阅读每月安排2次模拟考试", now, cpilsLessonNote);
      UpsertLesson(context, schoolId, "Pre-IELTS Course", 4, 1097m, "雅思3分以下学生的预备课程，最少报名4周", now, cpilsLessonNote);
      UpsertLesson(context, schoolId, "IELTS Course", 4, 1097m, "雅思备考与目标分数训练，最少报名4周", now, cpilsLessonNote);
      UpsertLesson(context, schoolId, "IELTS Guarantee 8 Weeks", 4, 1247.5m, "雅思保证班8周方案；8周起报并赠送机考", now, cpilsLessonNote);
      UpsertLesson(context, schoolId, "IELTS Guarantee 12 Weeks", 4, 1189.7m, "雅思保证班12周方案；12周起报", now, cpilsLessonNote);
      UpsertLesson(context, schoolId, "TOEFL Course", 4, 1040m, "托福备考，适合北美升学或考试目标学生", now, cpilsLessonNote);
      UpsertLesson(context, schoolId, "Business English", 4, 1040m, "商务沟通、会议、演示和职场表达；4周起报", now, cpilsLessonNote);
      UpsertLesson(context, schoolId, "Power Speaking and Modern Communication", 4, 1040m, "PMC演讲与现代沟通训练；4周起报", now, cpilsLessonNote);
      RemoveLesson(context, schoolId, "Parent-Child Program", 4);

      UpsertRoom(context, schoolId, "单人房", 4, 995m, "隐私最好，预算较高，热门档期需早确认", now);
      UpsertRoom(context, schoolId, "双人房", 4, 840m, "适合朋友同行或希望兼顾预算与舒适度", now);
      UpsertRoom(context, schoolId, "三人房", 4, 775m, "多人房中预算较平衡", now);
      UpsertRoom(context, schoolId, "四人房", 4, 700m, "默认报价参考，预算压力较低", now);
      UpsertRoom(context, schoolId, "无对外窗单人房", 4, 995m, "无对外窗房型，空房和采光条件需提前确认", now);
      UpsertRoom(context, schoolId, "无对外窗双人房", 4, 840m, "无对外窗房型，适合两人同行", now);
      UpsertRoom(context, schoolId, "高级单人房", 4, 1085m, "高级房型，隐私和住宿规格更高", now);
      UpsertRoom(context, schoolId, "高级双人房", 4, 910m, "高级双人房，适合重视住宿舒适度的学生", now);
      UpsertRoom(context, schoolId, "高级三人房", 4, 850m, "高级多人房，兼顾预算与住宿规格", now);
      UpsertRoom(context, schoolId, "高级四人房", 4, 780m, "高级多人房中预算压力较低", now);

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
      const string fellaLessonNote = "English Fella所附课程费表的4周价格；最终以学校正式报价为准";

      RemoveLesson(context, schoolId, "Guardian / GEC", 4);
      RemoveLesson(context, schoolId, "PIC-4", 4);
      RemoveLesson(context, schoolId, "PIC-5", 4);
      RemoveLesson(context, schoolId, "PIC-6", 4);
      RemoveLesson(context, schoolId, "IELTS / PIRC", 4);
      RemoveLesson(context, schoolId, "TOEIC / ESL+TOEIC", 4);
      RemoveLesson(context, schoolId, "TOEFL", 4);
      RemoveLesson(context, schoolId, "Business English", 4);
      RemoveLesson(context, schoolId, "Junior / JEC", 4);
      RemoveLesson(context, schoolId, "Silver Speaking Course", 4);

      UpsertLesson(context, schoolId, "PIC-4 一般英语课程", 4, 950m, "第一、第二校区；一对一4节 + 四人团体2节 + 八人团体1节 + 选修课", now, fellaLessonNote);
      UpsertLesson(context, schoolId, "PIC-5 一般英语课程", 4, 1000m, "第一、第二校区；一对一5节 + 四人团体1节 + 八人团体1节 + 选修课", now, fellaLessonNote);
      UpsertLesson(context, schoolId, "PIC-6 Power Speaking", 4, 1050m, "第一、第二校区；一对一6节 + 八人团体1节 + 选修课", now, fellaLessonNote);
      UpsertLesson(context, schoolId, "TOEIC ESL 托业入门班", 4, 1050m, "第一、第二校区；托业一对一2节 + ESL一对一2节 + 团体课 + 选修课", now, fellaLessonNote);
      UpsertLesson(context, schoolId, "TOEIC 托业实战班", 4, 1050m, "第一、第二校区；一对一4节 + 四人团体2节 + 八人团体1节 + 选修课", now, fellaLessonNote);
      UpsertLesson(context, schoolId, "TOEIC 托业保证班", 4, 1100m, "第一校区；一对一4节 + 四人团体2节 + 八人团体1节 + 强制晚自习及词汇测试", now, fellaLessonNote);
      UpsertLesson(context, schoolId, "PIFT-E 雅思实战班", 4, 1050m, "第一、第二校区；入学参考1–2分", now, fellaLessonNote);
      UpsertLesson(context, schoolId, "PIFT 雅思实战班", 4, 1050m, "第一、第二校区；入学参考2.5分以上", now, fellaLessonNote);
      UpsertLesson(context, schoolId, "PIRC 雅思培训班", 4, 1100m, "第一、第二校区；一对一5节 + 四人团体2节 + 选修课，入学参考2.5分以上", now, fellaLessonNote);
      UpsertLesson(context, schoolId, "PIGI 雅思保证班", 4, 1100m, "第一校区；一对一4节 + 四人团体2节 + 八人团体1节 + 强制晚自习及词汇测试", now, fellaLessonNote);
      UpsertLesson(context, schoolId, "PPT 托福入门班", 4, 1050m, "第一、第二校区；托福一对一2节 + ESL一对一2节 + 团体课 + 选修课", now, fellaLessonNote);
      UpsertLesson(context, schoolId, "PTFT 托福实战班", 4, 1050m, "第一、第二校区；托福一对一4节 + ESL团体课 + 选修课", now, fellaLessonNote);
      UpsertLesson(context, schoolId, "SSC 乐龄会话课", 4, 1100m, "第二校区自律型；一对一6节 + 选修课", now, fellaLessonNote);
      UpsertLesson(context, schoolId, "P-JEC 儿童课程", 4, 1100m, "第二校区；5–6岁，一对一4节 + 选修课", now, fellaLessonNote);
      UpsertLesson(context, schoolId, "JEC 儿童课程", 4, 1100m, "第二校区；7–15岁，一对一4节 + 四人团体2节 + 选修课", now, fellaLessonNote);
      UpsertLesson(context, schoolId, "GEC 家长课程", 4, 800m, "第二校区；一对一3节 + 选修课", now, fellaLessonNote);
      UpsertLesson(context, schoolId, "EBC 商业英文课程", 4, 1050m, "第二校区；一对一5节 + 四人团体2节 + 选修课", now, fellaLessonNote);

      RemoveRoom(context, schoolId, "三人房", 4);
      RemoveRoom(context, schoolId, "双人房", 4);
      RemoveRoom(context, schoolId, "标准单人房", 4);
      RemoveRoom(context, schoolId, "豪华单人房", 4);

      UpsertRoom(context, schoolId, "Premium 1P 单人间", 4, 1200m, "最高规格单人房；适用校区和空房需确认", now);
      UpsertRoom(context, schoolId, "1A 单人间", 4, 1000m, "单人房；适用校区和空房需确认", now);
      UpsertRoom(context, schoolId, "1B’ 单人间", 4, 950m, "单人房；适用校区和空房需确认", now);
      UpsertRoom(context, schoolId, "2A 双人间", 4, 850m, "适合朋友同行或希望兼顾预算与舒适度", now);
      UpsertRoom(context, schoolId, "3A 三人间", 4, 750m, "默认报价参考，住宿预算最低", now);

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
      const string philinterLessonNote = "Philinter 2026年4周课程费参考；1/2/3周分别按4周课程费和住宿费的40%/65%/85%计算；最终以学校正式报价为准";

      RemoveLesson(context, schoolId, "TOEFL", 4);
      RemoveLesson(context, schoolId, "Focused Industry", 4);
      RemoveLesson(context, schoolId, "Primary English", 4);
      RemoveLesson(context, schoolId, "Junior ESL", 4);
      RemoveLesson(context, schoolId, "Junior IELTS", 4);

      UpsertLesson(context, schoolId, "Light ESL", 4, 790m, "2节一对一 + 2节小团体 + 2节大团体选修 + 选修活动", now, philinterLessonNote);
      UpsertLesson(context, schoolId, "General ESL", 4, 900m, "3节一对一 + 1节小团体 + 2节小团体 + 2节大团体选修 + 选修活动", now, philinterLessonNote);
      UpsertLesson(context, schoolId, "Intensive ESL", 4, 1030m, "4节一对一 + 1节小团体 + 2节精品团体 + 1节大团体 + 2节选修夜间辅导 + 选修活动", now, philinterLessonNote);
      UpsertLesson(context, schoolId, "Intensive Power Speaking", 4, 1170m, "4节一对一 + 2节小团体 + 2节精品小团体 + 2节选修夜间自习 + 选修活动", now, philinterLessonNote);
      UpsertLesson(context, schoolId, "IELTS Intensive", 4, 1200m, "4节一对一 + 4节小团体 + 2节强制夜间辅导 + 每周六上午模拟测试", now, philinterLessonNote);
      UpsertLesson(context, schoolId, "IELTS Guarantee 8 Weeks", 4, 1580m, "雅思保证班8周方向；需按入学分数、出勤、模考和校规确认", now, philinterLessonNote);
      UpsertLesson(context, schoolId, "IELTS Guarantee 12 Weeks", 4, 1420m, "雅思保证班12周方向；需按入学分数、出勤、模考和校规确认", now, philinterLessonNote);
      UpsertLesson(context, schoolId, "TOEIC Regular", 4, 1100m, "4节一对一 + 2节小团体 + 2节大团体 + 选修活动 + 每周五模拟测试", now, philinterLessonNote);
      UpsertLesson(context, schoolId, "Focus Industry（可定制）", 4, 1280m, "行业主题英文，需按目标行业和开课档期确认", now, philinterLessonNote);
      UpsertLesson(context, schoolId, "Basic Business", 4, 1150m, "商务基础英文；入学要求雅思3分", now, philinterLessonNote);
      UpsertLesson(context, schoolId, "Advanced Business", 4, 1200m, "商务沟通、演示、会议和职场表达；入学要求雅思3.5至4分", now, philinterLessonNote);
      UpsertLesson(context, schoolId, "Speaking", 4, 1400m, "8节口语团体课 + 2节晚课 + 2节选修课；最长8周", now, philinterLessonNote);
      UpsertLesson(context, schoolId, "Junior Speaking", 4, 1400m, "7节口语团体课 + 2节晚课 + 2节选修课；最长8周", now, philinterLessonNote);

      UpsertRoom(context, schoolId, "校内三人房", 4, 810m, "上下铺三人房；默认报价参考，预算压力较低", now);
      UpsertRoom(context, schoolId, "校内双人房", 4, 970m, "适合朋友同行或希望兼顾预算与舒适度", now);
      UpsertRoom(context, schoolId, "校内单人房", 4, 1400m, "隐私最好，预算较高，热门档期需早确认", now);
      UpsertRoom(context, schoolId, "校外公寓单人房", 4, 1690m, "Azon Condo单人房；接送、门禁和空房需顾问确认", now);
      UpsertRoom(context, schoolId, "校外公寓双人房", 4, 1100m, "Azon Condo双人房；适合重视生活品质的成人或家庭", now);
      UpsertRoom(context, schoolId, "校外公寓三人房", 4, 890m, "Azon Condo三人房；接送、门禁和空房需顾问确认", now);

      UpsertFee(context, schoolId, "注册费", 220m, UsdCurrencyId, "前期支付费用；课程注册费USD 120 + 住宿注册费USD 100", now);
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
      UpsertFee(context, schoolId, "额外住宿", 3000m, PhpCurrencyId, "到校支付费用；每晚 PHP 3,000，按实际额外入住晚数计算", now);
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

    private static async Task SeedWePricingAsync(AppDbContext context)
    {
      var now = DateTime.UtcNow;
      var school = context.Schools.FirstOrDefault(x =>
        x.Id == WeSchoolId ||
        x.Name == WeSchoolName ||
        x.Name == LegacyWeSchoolName ||
        x.Name == WeShortSchoolName);

      if (school == null)
      {
        school = new XiaoJuanSchoolPayment.Server.Data.Models.School
        {
          Id = WeSchoolId,
          Name = WeSchoolName,
          CreatedDate = new DateTime(2016, 1, 1, 0, 0, 0, DateTimeKind.Utc),
        };
        context.Schools.Add(school);
      }
      else
      {
        school.Name = WeSchoolName;
        if (school.CreatedDate == default)
        {
          school.CreatedDate = new DateTime(2016, 1, 1, 0, 0, 0, DateTimeKind.Utc);
        }
      }

      var schoolId = school.Id;
      const string weLessonNote = "WE Academy官网课程结构参考；官网公开页面未直接列出完整学费住宿表，课程和住宿费用需按入学日、周数、房型、年龄和学校正式回函确认";

      UpsertLesson(context, schoolId, "ESL Course", 4, 0m, "基础综合英语；完整费用需按周数、房型和入学日确认", now, weLessonNote, PhpCurrencyId);
      UpsertLesson(context, schoolId, "Native Mix 1 Class", 4, 0m, "每日1节Native一对一，适合先加入外教反馈", now, weLessonNote, PhpCurrencyId);
      UpsertLesson(context, schoolId, "Native Mix 2 Classes", 4, 0m, "每日2节Native一对一，适合发音和自然表达强化", now, weLessonNote, PhpCurrencyId);
      UpsertLesson(context, schoolId, "Native Mix 3 Classes", 4, 0m, "每日3节Native一对一，适合短期高口语目标", now, weLessonNote, PhpCurrencyId);
      UpsertLesson(context, schoolId, "Junior ESL Course", 4, 0m, "小学到初中学生基础英语，需确认年龄和监护", now, weLessonNote, PhpCurrencyId);
      UpsertLesson(context, schoolId, "Junior ESL Native Course", 4, 0m, "青少年课程中含Native一对一，适合重视发音", now, weLessonNote, PhpCurrencyId);
      UpsertLesson(context, schoolId, "Guardian ESL Course", 4, 0m, "陪读家长课程，官网说明每日3节菲律宾老师一对一", now, weLessonNote, PhpCurrencyId);
      UpsertLesson(context, schoolId, "WE Kindergarten", 4, 0m, "4岁到学龄前，英语、数学、艺术和活动课程", now, weLessonNote, PhpCurrencyId);
      UpsertLesson(context, schoolId, "Solo Junior High Support", 4, 0m, "13-15岁独自留学支持，需逐项确认规则", now, weLessonNote, PhpCurrencyId);
      UpsertLesson(context, schoolId, "English + Golf Practice Course", 4, 0m, "英语课 + 校内高尔夫练习，课程包需报价", now, weLessonNote, PhpCurrencyId);
      UpsertLesson(context, schoolId, "English + Golf Round Course", 4, 0m, "练习课 + 每周球场field lesson，green fee、caddie fee和cart rental现场另付", now, weLessonNote, PhpCurrencyId);
      UpsertLesson(context, schoolId, "Swimming Lessons", 4, 0m, "游泳课按单次或小组人数另计", now, weLessonNote, PhpCurrencyId);

      UpsertRoom(context, schoolId, "Campus Dormitory / 校内宿舍", 4, 0m, "官网说明宿舍在校园内，房型和价格需按空房确认", now, PhpCurrencyId);
      UpsertRoom(context, schoolId, "Family Room / 家庭房", 4, 0m, "亲子同行常用方向，需确认人数、床型、餐食和卫浴", now, PhpCurrencyId);
      UpsertRoom(context, schoolId, "New Residence / 新宿舍", 4, 0m, "官网Notice有New Residence信息，开放状态和价格需当期确认", now, PhpCurrencyId);
      UpsertRoom(context, schoolId, "Accommodation To Confirm", 4, 0m, "用于先建预算清单，正式报价前不写死金额", now, PhpCurrencyId);

      UpsertFee(context, schoolId, "Registration Fee", 0m, PhpCurrencyId, "前期支付费用；一次性报名注册费，官网公开页未直接列出金额", now);
      UpsertFee(context, schoolId, "SSP / SSP E-Card", 0m, PhpCurrencyId, "到校支付费用；菲律宾特别学习许可及相关卡费，按周数和学校规则确认", now);
      UpsertFee(context, schoolId, "Textbook / Materials", 0m, PhpCurrencyId, "到校支付费用；按课程、级别和实际教材收取", now);
      UpsertFee(context, schoolId, "Dormitory Deposit / Utilities", 0m, PhpCurrencyId, "到校支付费用；住宿押金、水电、维护或清洁费用需按房型和周数确认", now);
      UpsertFee(context, schoolId, "Golf Private Class", 750m, PhpCurrencyId, "官网Golf页公开：Private Class 1人 PHP750/次", now);
      UpsertFee(context, schoolId, "Swimming Private Class", 700m, PhpCurrencyId, "官网Swimming页公开：Private Class 1人 PHP700/次", now);
      UpsertFee(context, schoolId, "Swimming Small Group", 600m, PhpCurrencyId, "官网Swimming页公开：Small Group PHP600/次", now);
      UpsertFee(context, schoolId, "Swimming Big Group", 500m, PhpCurrencyId, "官网Swimming页公开：3-5人 Big Group PHP500/次", now);
      UpsertFee(context, schoolId, "Green / Caddie / Cart Fees", 0m, PhpCurrencyId, "Golf Round Course的green fee、caddie fee和cart rental现场另付", now);
      UpsertFee(context, schoolId, "Pickup / Activities", 0m, PhpCurrencyId, "Clark或Manila接机、周末活动与亲子外出按当期安排确认", now);

      await context.SaveChangesAsync();
    }

    private static async Task SeedHelpPricingAsync(AppDbContext context)
    {
      var now = DateTime.UtcNow;
      var school = context.Schools.FirstOrDefault(x =>
        x.Id == HelpSchoolId ||
        x.Name == HelpSchoolName ||
        x.Name == LegacyHelpSchoolName ||
        x.Name == HelpClarkSchoolName ||
        x.Name == "HELP Clark Campus" ||
        x.Name == "HELP English Academy");

      if (school == null)
      {
        school = new XiaoJuanSchoolPayment.Server.Data.Models.School
        {
          Id = HelpSchoolId,
          Name = HelpSchoolName,
          CreatedDate = new DateTime(2011, 1, 1, 0, 0, 0, DateTimeKind.Utc),
        };
        context.Schools.Add(school);
      }
      else
      {
        school.Name = HelpSchoolName;
        if (school.CreatedDate == default)
        {
          school.CreatedDate = new DateTime(2011, 1, 1, 0, 0, 0, DateTimeKind.Utc);
        }
      }

      var schoolId = school.Id;
      const string helpLessonNote = "HELP English官网Tuition and Fees页面4周USD课程费参考；最终以学校正式报价为准";

      UpsertLesson(context, schoolId, "ESL", 4, 900m, "Communication English；4周基础沟通英语课程费", now, helpLessonNote);
      UpsertLesson(context, schoolId, "ESL Intensive", 4, 1040m, "Intensive Communication English；一对一课时更密集", now, helpLessonNote);
      UpsertLesson(context, schoolId, "Business English", 4, 1050m, "商务沟通、演讲、邮件和职场场景英语", now, helpLessonNote);
      UpsertLesson(context, schoolId, "Family Program", 4, 1000m, "Family Communication English；亲子同行需确认年龄、房型和监护规则", now, helpLessonNote);
      UpsertLesson(context, schoolId, "IELTS / TOEIC Basic", 4, 1050m, "官方级别参考IELTS 3.0-4.5或TOEIC基础段", now, helpLessonNote);
      UpsertLesson(context, schoolId, "IELTS / TOEIC Intermediate", 4, 1050m, "官方级别参考IELTS 4.5-5.5或TOEIC中级段", now, helpLessonNote);
      UpsertLesson(context, schoolId, "IELTS / TOEIC Advanced", 4, 1150m, "官方级别参考IELTS 5.5以上或TOEIC进阶段", now, helpLessonNote);

      UpsertRoom(context, schoolId, "Quadra Room / 四人房", 4, 600m, "4周宿舍费；官方说明含校内餐食和饮用水", now);
      UpsertRoom(context, schoolId, "Triple Room / 三人房", 4, 680m, "4周宿舍费；空房需按入学日确认", now);
      UpsertRoom(context, schoolId, "Double Room / 双人房", 4, 780m, "4周宿舍费；适合朋友同行或兼顾舒适度", now);
      UpsertRoom(context, schoolId, "Single Room / 单人房", 4, 1030m, "4周宿舍费；隐私最好，热门档期需提前确认", now);

      UpsertFee(context, schoolId, "Registration Fee", 0m, UsdCurrencyId, "前期支付费用；HELP通用课程住宿表未单独列出注册费，若学校回函列出则以当期文件为准", now);
      UpsertFee(context, schoolId, "Deposit", 3000m, PhpCurrencyId, "到校支付费用；Clark当地费用表4周参考，退房后按罚款、损坏、电费或超额洗衣扣除后退还", now);
      UpsertFee(context, schoolId, "Visa Extension / 4 weeks", 0m, PhpCurrencyId, "到校支付费用；Clark当地费用表4周参考，6周及以上会产生延签费用", now);
      UpsertFee(context, schoolId, "SSP", 7800m, PhpCurrencyId, "到校支付费用；特别学习许可，Clark当地费用表参考", now);
      UpsertFee(context, schoolId, "Water", 600m, PhpCurrencyId, "到校支付费用；Clark当地费用表4周水费参考", now);
      UpsertFee(context, schoolId, "Electricity Deposit", 1000m, PhpCurrencyId, "到校支付费用；Clark当地费用表4周用电押金参考，按学校规则扣除", now);
      UpsertFee(context, schoolId, "Maintenance", 1000m, PhpCurrencyId, "到校支付费用；Clark当地费用表4周维护费参考", now);
      UpsertFee(context, schoolId, "Laundry", 1000m, PhpCurrencyId, "到校支付费用；Clark当地费用表4周洗衣参考，超过16kg另收PHP35/kg", now);
      UpsertFee(context, schoolId, "ACR I-Card / 4 weeks", 0m, PhpCurrencyId, "到校支付费用；4周参考为0，长期学习或延签时通常需要", now);
      UpsertFee(context, schoolId, "E I Card / SSP E-Card", 4500m, PhpCurrencyId, "到校支付费用；Clark当地费用表列示项目", now);
      UpsertFee(context, schoolId, "Learning Materials", 1700m, PhpCurrencyId, "到校支付费用；Clark当地费用表4周教材/学习材料参考", now);
      UpsertFee(context, schoolId, "ID", 200m, PhpCurrencyId, "到校支付费用；学生证办理参考", now);
      UpsertFee(context, schoolId, "Local Fee Total / 4 weeks", 20800m, PhpCurrencyId, "到校支付费用；HELP Clark官方当地费用表4周总额", now);
      UpsertFee(context, schoolId, "CRTV", 1410m, PhpCurrencyId, "到校支付费用；长期停留许可参考，适用于超过6个月停留时按规则确认", now);
      UpsertFee(context, schoolId, "ECC", 500m, PhpCurrencyId, "到校支付费用；离境清关参考，适用条件需按停留时间确认", now);
      UpsertFee(context, schoolId, "Airport Pickup", 0m, PhpCurrencyId, "到校支付费用；按Clark或Manila机场、指定接机日和学校LOA确认", now);

      await context.SaveChangesAsync();
    }

    private static async Task SeedAelcPricingAsync(AppDbContext context)
    {
      var now = DateTime.UtcNow;
      var school = context.Schools.FirstOrDefault(x =>
        x.Id == AelcSchoolId ||
        x.Name == AelcSchoolName ||
        x.Name == LegacyAelcSchoolName ||
        x.Name == AelcFullSchoolName ||
        x.Name == "AELC");

      if (school == null)
      {
        school = new XiaoJuanSchoolPayment.Server.Data.Models.School
        {
          Id = AelcSchoolId,
          Name = AelcSchoolName,
          CreatedDate = new DateTime(2007, 1, 1, 0, 0, 0, DateTimeKind.Utc),
        };
        context.Schools.Add(school);
      }
      else
      {
        school.Name = AelcSchoolName;
        if (school.CreatedDate == default)
        {
          school.CreatedDate = new DateTime(2007, 1, 1, 0, 0, 0, DateTimeKind.Utc);
        }
      }

      var schoolId = school.Id;
      const string aelcLessonNote = "AELC公开学校资料页历史4周USD课程住宿套餐参考；AELC旧官方域名目前无法解析，当前招生、校区、房型和最新报价必须以学校回函确认";

      UpsertLesson(context, schoolId, "Center 1 LITE / 2人房基准套餐", 4, 1288m, "4周课程住宿参考；Native与菲律宾老师混合课表", now, aelcLessonNote);
      UpsertLesson(context, schoolId, "Center 1 ESL / 2人房基准套餐", 4, 1486m, "4周课程住宿参考；综合ESL与Native课搭配", now, aelcLessonNote);
      UpsertLesson(context, schoolId, "Center 1 Semi Intensive / 2人房基准套餐", 4, 1535m, "4周课程住宿参考；ESL或Business方向", now, aelcLessonNote);
      UpsertLesson(context, schoolId, "Center 1 TOEIC一般 / 2人房基准套餐", 4, 1387m, "4周课程住宿参考；TOEIC考试方向", now, aelcLessonNote);
      UpsertLesson(context, schoolId, "Center 1 TOEIC 800+ / 2人房基准套餐", 4, 1486m, "4周课程住宿参考；LC/RC 800 + Speaking Lv.6方向", now, aelcLessonNote);
      UpsertLesson(context, schoolId, "Center 1 TOEIC 900+ / 2人房基准套餐", 4, 1486m, "4周课程住宿参考；LC/RC 900 + Speaking Lv.7方向", now, aelcLessonNote);
      UpsertLesson(context, schoolId, "Center 1 AELC Intensive A / 2人房基准套餐", 4, 1682m, "4周课程住宿参考；Native课比例更高", now, aelcLessonNote);
      UpsertLesson(context, schoolId, "Center 1 AELC Intensive B / 2人房基准套餐", 4, 1865m, "4周课程住宿参考；更高Native一对一强度", now, aelcLessonNote);
      UpsertLesson(context, schoolId, "Center 2 LITE / 4人房基准套餐", 4, 1292m, "4周课程住宿参考；亲子或长期规划校区方向", now, aelcLessonNote);
      UpsertLesson(context, schoolId, "Center 2 ESL / 4人房基准套餐", 4, 1490m, "4周课程住宿参考；综合ESL", now, aelcLessonNote);
      UpsertLesson(context, schoolId, "Center 2 Semi Intensive / 4人房基准套餐", 4, 1540m, "4周课程住宿参考；ESL或Business方向", now, aelcLessonNote);
      UpsertLesson(context, schoolId, "Center 2 IELTS 5.5/6.0 / 4人房基准套餐", 4, 1490m, "4周课程住宿参考；需确认保证班门槛", now, aelcLessonNote);
      UpsertLesson(context, schoolId, "Center 2 IELTS 6.5/7.0 / 4人房基准套餐", 4, 1637m, "4周课程住宿参考；高分目标需确认入学分数", now, aelcLessonNote);
      UpsertLesson(context, schoolId, "Center 2 Intensive A / 4人房基准套餐", 4, 1688m, "4周课程住宿参考；Native强化方向", now, aelcLessonNote);
      UpsertLesson(context, schoolId, "Center 2 Intensive B / 4人房基准套餐", 4, 1871m, "4周课程住宿参考；Native比例更高，价格需复核", now, aelcLessonNote);

      UpsertRoom(context, schoolId, "基准多人房已含", 4, 0m, "Center 1为2人房基准，Center 2为4人房基准；报价时需按校区选择房型", now);
      UpsertRoom(context, schoolId, "Center 1 单人房加价", 4, 198m, "多数Center 1课程单人房与2人房差额约USD198-203，正式以学校报价为准", now);
      UpsertRoom(context, schoolId, "Center 2 三人房加价", 4, 99m, "多数Center 2课程三人房与4人房差额约USD99-102，正式以学校报价为准", now);
      UpsertRoom(context, schoolId, "Center 2 双人房加价", 4, 198m, "多数Center 2课程双人房与4人房差额约USD198-204，正式以学校报价为准", now);

      UpsertFee(context, schoolId, "Registration Fee", 100m, UsdCurrencyId, "前期支付费用；公开资料页列出入学金USD100，不退还", now);
      UpsertFee(context, schoolId, "SSP", 6000m, PhpCurrencyId, "到校支付费用；Special Study Permit公开资料参考", now);
      UpsertFee(context, schoolId, "ACR I-Card", 3000m, PhpCurrencyId, "到校支付费用；长期停留或延签时通常需要，规则以学校和菲律宾当地政策为准", now);
      UpsertFee(context, schoolId, "Visa Extension / 4 weeks", 0m, PhpCurrencyId, "到校支付费用；公开资料页列出4周以内为PHP0", now);
      UpsertFee(context, schoolId, "Visa Extension / 8 weeks", 3630m, PhpCurrencyId, "到校支付费用；公开资料页8周参考", now);
      UpsertFee(context, schoolId, "Visa Extension / 12 weeks", 8530m, PhpCurrencyId, "到校支付费用；公开资料页12周参考", now);
      UpsertFee(context, schoolId, "Visa Extension / 16 weeks", 11660m, PhpCurrencyId, "到校支付费用；公开资料页16周参考", now);
      UpsertFee(context, schoolId, "Visa Extension / 20 weeks", 14790m, PhpCurrencyId, "到校支付费用；公开资料页20周参考", now);
      UpsertFee(context, schoolId, "Visa Extension / 24 weeks", 17920m, PhpCurrencyId, "到校支付费用；公开资料页24周参考", now);
      UpsertFee(context, schoolId, "Textbook / Materials", 0m, PhpCurrencyId, "到校支付费用；公开资料页列出PHP250-400/本，按课程和实际教材确认", now);
      UpsertFee(context, schoolId, "Electricity", 15m, PhpCurrencyId, "到校支付费用；公开资料页列出PHP15/kWh，按用量支付", now);
      UpsertFee(context, schoolId, "Student Management Fee", 0m, PhpCurrencyId, "到校支付费用；公开资料页列出约PHP375-500/周，按房型和学校规则确认", now);
      UpsertFee(context, schoolId, "Dormitory Deposit", 3000m, PhpCurrencyId, "到校支付费用；退房检查后按损坏或欠费扣除后退还", now);
      UpsertFee(context, schoolId, "Airport Pickup", 0m, PhpCurrencyId, "到校支付费用；Clark或Manila机场、指定接机日和同行人数需当期确认", now);

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

    private static async Task SeedBerlitzPricingAsync(AppDbContext context)
    {
      var now = DateTime.UtcNow;
      var school = context.Schools.FirstOrDefault(x =>
        x.Id == BerlitzSchoolId ||
        x.Name == BerlitzSchoolName ||
        x.Name == LegacyBerlitzSchoolName ||
        x.Name == "Berlitzph" ||
        x.Name == "Berlitz");

      if (school == null)
      {
        school = new XiaoJuanSchoolPayment.Server.Data.Models.School
        {
          Id = BerlitzSchoolId,
          Name = BerlitzSchoolName,
          CreatedDate = new DateTime(2020, 6, 9, 0, 0, 0, DateTimeKind.Utc),
        };
        context.Schools.Add(school);
      }
      else
      {
        school.Name = BerlitzSchoolName;
        if (school.CreatedDate == default)
        {
          school.CreatedDate = new DateTime(2020, 6, 9, 0, 0, 0, DateTimeKind.Utc);
        }
      }

      var schoolId = school.Id;
      const string berlitzLessonNote = "Berlitz Philippines官网费用参考；Starter Course有公开PHP公告价，常规私教、小组、企业、测评和TELC项目以学校正式报价为准";

      UpsertLesson(context, schoolId, "Berlitz Starter Course", 1, 3200m, "官网2025 Starter Course公告公开费用，A1绝对初学者入门课，含学习材料；当前是否开放需当期确认", now, berlitzLessonNote, PhpCurrencyId);
      UpsertLesson(context, schoolId, "Public English Group Class", 4, 0m, "官网Class Schedules列出English线上/面授公开课时段，最低人数开班；费用需当期确认", now, berlitzLessonNote, PhpCurrencyId);
      UpsertLesson(context, schoolId, "Private Language Classes", 4, 0m, "一对一课程可线上或Makati面授，按语言、级别、目标和课时包报价", now, berlitzLessonNote, PhpCurrencyId);
      UpsertLesson(context, schoolId, "Group Language Classes", 4, 0m, "小组课按语言、级别、人数、固定课表和学习中心安排报价", now, berlitzLessonNote, PhpCurrencyId);
      UpsertLesson(context, schoolId, "Business English Short Courses", 1, 0m, "官网Business English公告列出Negotiations、Email and Business Writing、Presentation、Customer Service、English in the Workplace等模块；费用需确认", now, berlitzLessonNote, PhpCurrencyId);
      UpsertLesson(context, schoolId, "Corporate Language Training", 4, 0m, "企业语言培训按员工人数、行业词汇、岗位目标、交付方式和预算定制报价", now, berlitzLessonNote, PhpCurrencyId);
      UpsertLesson(context, schoolId, "Berlitz Connect 6 Months", 24, 0m, "官网Self-paced页列出6个月订阅，含24/7材料、10次实时口语练习和30+练习主题；费用需确认", now, berlitzLessonNote, PhpCurrencyId);
      UpsertLesson(context, schoolId, "Berlitz Connect 12 Months", 48, 0m, "官网Self-paced页列出12个月订阅，含24/7材料、25次实时口语练习和30+练习主题；费用需确认", now, berlitzLessonNote, PhpCurrencyId);
      UpsertLesson(context, schoolId, "Language Testing and Assessment", 1, 0m, "官网说明测评可覆盖口语、写作、听读、SOPI和企业评估；费用按项目确认", now, berlitzLessonNote, PhpCurrencyId);
      UpsertLesson(context, schoolId, "TELC Exam Preparation and Testing", 1, 0m, "TELC备考、考试日期、报名费和名额需按当期考试安排确认", now, berlitzLessonNote, PhpCurrencyId);

      UpsertRoom(context, schoolId, "住宿自理", 4, 0m, "Berlitz Philippines不是传统寄宿制ESL学校；酒店、公寓或亲友住宿需另行安排", now, PhpCurrencyId);

      UpsertFee(context, schoolId, "Placement / Proficiency Check", 0m, PhpCurrencyId, "Learning Cycle会先了解学习目标、水平和需求；费用和形式需按课程确认", now);
      UpsertFee(context, schoolId, "教材 / Student Portal", 0m, PhpCurrencyId, "按课程材料、学生门户、自学平台和练习资源规则确认", now);
      UpsertFee(context, schoolId, "Corporate Customization", 0m, PhpCurrencyId, "企业课程按员工人数、岗位、行业词汇、交付方式和预算报价", now);
      UpsertFee(context, schoolId, "Testing / TELC", 0m, PhpCurrencyId, "语言测评、TELC报名、证书和备考费用需按考试月份和项目确认", now);
      UpsertFee(context, schoolId, "住宿 / 餐食 / 通勤", 0m, PhpCurrencyId, "Makati城市课程不含宿舍、三餐和接送，需自行规划", now);
      UpsertFee(context, schoolId, "签证 / 保险 / 停留", 0m, PhpCurrencyId, "国际学生按停留时间、护照和行程另行确认", now);

      await context.SaveChangesAsync();
    }

    private static async Task SeedMbcPricingAsync(AppDbContext context)
    {
      var now = DateTime.UtcNow;
      var school = context.Schools.FirstOrDefault(x =>
        x.Id == MbcSchoolId ||
        x.Name == MbcSchoolName ||
        x.Name == LegacyMbcSchoolName ||
        x.Name == "MBC" ||
        x.Name == "Manila Business College Foundation");

      if (school == null)
      {
        school = new XiaoJuanSchoolPayment.Server.Data.Models.School
        {
          Id = MbcSchoolId,
          Name = MbcSchoolName,
          CreatedDate = new DateTime(2000, 9, 15, 0, 0, 0, DateTimeKind.Utc),
        };
        context.Schools.Add(school);
      }
      else
      {
        school.Name = MbcSchoolName;
      }

      var schoolId = school.Id;
      const string mbcLessonNote = "Manila Business College官网资料参考；官网未公开完整国际学生学费表，常规课程、杂费、住宿和签证协助需以学校当期书面回复为准";

      UpsertLesson(context, schoolId, "Senior High School ABM Track", 4, 0m, "官网列出Grade 11 ABM Track；学费、杂费、年级资格和国际学生材料需当期确认", now, mbcLessonNote, PhpCurrencyId);
      UpsertLesson(context, schoolId, "BSBA Major in Marketing", 16, 0m, "官网本科方向；Marketing覆盖产品、品牌、销售、市场规划和公关，费用需当期确认", now, mbcLessonNote, PhpCurrencyId);
      UpsertLesson(context, schoolId, "BSBA Major in Management", 16, 0m, "官网本科方向；Management覆盖Accounting、Finance、Management、Marketing等商科领域，费用需当期确认", now, mbcLessonNote, PhpCurrencyId);
      UpsertLesson(context, schoolId, "B.S. Accountancy", 16, 0m, "官网本科方向；会计、审计、行业和政府财务路线，费用和入学门槛需确认", now, mbcLessonNote, PhpCurrencyId);
      UpsertLesson(context, schoolId, "B.S. Hospitality Management", 16, 0m, "官网本科方向；酒店运营、旅游、餐饮和服务业管理，费用需当期确认", now, mbcLessonNote, PhpCurrencyId);
      UpsertLesson(context, schoolId, "B.S. Information Systems", 16, 0m, "官网本科方向；ICT应用设计、开发、测试、实施和维护，费用需当期确认", now, mbcLessonNote, PhpCurrencyId);
      UpsertLesson(context, schoolId, "Night Class - BSBA Management", 4, 0m, "官网列出Tuesday-Friday 6-9pm，Modular 1 Subject at a Time；是否仍开放和费用需确认", now, mbcLessonNote, PhpCurrencyId);
      UpsertLesson(context, schoolId, "Weekend Class - BS Hospitality Management", 4, 0m, "官网列出Saturday-Sunday，Modular 1 Subject at a Time；是否仍开放和费用需确认", now, mbcLessonNote, PhpCurrencyId);
      UpsertLesson(context, schoolId, "TESDA Courses", 4, 0m, "官网列出TESDA Courses入口；具体项目、证书、名额、实习和费用需当期确认", now, mbcLessonNote, PhpCurrencyId);
      UpsertLesson(context, schoolId, "Scholarship Programs", 4, 0m, "官网列出USP、KEI、YEP；公开金额多附本地学生资格条件，国际学生需单独确认", now, mbcLessonNote, PhpCurrencyId);

      UpsertRoom(context, schoolId, "Dormitory / 住宿需确认", 4, 0m, "官网介绍提到dormitories，但未公开房型、价格、餐食、门禁、押金和空位；申请前需单独核对", now, PhpCurrencyId);

      UpsertFee(context, schoolId, "Tuition and Miscellaneous Fees", 0m, PhpCurrencyId, "常规学费和杂费未公开完整国际学生价目表；按学年、课程、学生身份和付款节点核价", now);
      UpsertFee(context, schoolId, "International Student Documents", 0m, PhpCurrencyId, "Admission页列出认证学历、无犯罪证明、个人历史陈述、护照/签证、资金证明、良民证明和照片等", now);
      UpsertFee(context, schoolId, "Passport / Visa Assistance", 0m, PhpCurrencyId, "Admission页说明Passport/Visa可由MBC协助处理；费用和责任范围需书面确认", now);
      UpsertFee(context, schoolId, "Dormitory / Meals / Commute", 0m, PhpCurrencyId, "住宿、餐食、通勤和押金不能只凭官网dormitories描述估算", now);
      UpsertFee(context, schoolId, "USP Chairman Registration Fee Reference", 500m, PhpCurrencyId, "官网奖学金页公开：Free Tuition & Fees = Php 0/term，To Pay Php 500 Registration Fee；含本地资格条件", now);
      UpsertFee(context, schoolId, "USP Freshmen Fixed Term Reference", 12000m, PhpCurrencyId, "官网奖学金页公开：USP Freshmen Fixed Php 12k/term；国际学生不可自动套用", now);
      UpsertFee(context, schoolId, "USP Freshmen Down Payment Reference", 3000m, PhpCurrencyId, "官网奖学金页公开：DP = Php 3k + Php 500 Registration Fee；国际学生不可自动套用", now);
      UpsertFee(context, schoolId, "Scholarship Registration Fee Reference", 500m, PhpCurrencyId, "官网奖学金页公开的注册费参考；奖学金资格需按学校规则确认", now);

      await context.SaveChangesAsync();
    }

    private static async Task SeedRegionalStartingPricesAsync(AppDbContext context)
    {
      var now = DateTime.UtcNow;
      static DateTime Established(int year) => new(year, 1, 1, 0, 0, 0, DateTimeKind.Utc);

      var startingPrices = new[]
      {
        new RegionalStartingPriceSeed("菲律宾宿务 CIA 语言学校", 660m, UsdCurrencyId, "USD 660 / 1周起", Established(2003), new[] { CiaSchoolName, "菲律宾宿务CIA语言学校" }),
        new RegionalStartingPriceSeed("菲律宾宿务First English Global College", 198000m, JpyCurrencyId, "JPY 198,000 / 4周起", Established(2013), new[] { "First English Global College", "First English" }),
        new RegionalStartingPriceSeed("菲律宾宿务CIEC", 1650m, UsdCurrencyId, "USD 1,650 / 4周起", Established(2012), new[] { "CIEC", "CIEC Global" }),
        new RegionalStartingPriceSeed("菲律宾宿务ELSA International Language School", 334800m, JpyCurrencyId, "JPY 334,800 / 4周起", Established(2004), new[] { "ELSA International Language School", "ELSA" }),
        new RegionalStartingPriceSeed("菲律宾宿务ETHOS Language School", 1438m, UsdCurrencyId, "USD 1,438 / 4周起", Established(2013), new[] { "ETHOS Language School", "ETHOS" }),
        new RegionalStartingPriceSeed("菲律宾宿务IMS Academy", 1500m, UsdCurrencyId, "USD 1,500 / 4周起", Established(2015), new[] { "IMS Academy" }),
        new RegionalStartingPriceSeed("菲律宾宿务TARGET Global English Academy", 1430m, UsdCurrencyId, "USD 1,430 / 4周起", Established(2013), new[] { "TARGET Global English Academy", "TARGET" }),
        new RegionalStartingPriceSeed("菲律宾宿务CIJ Academy（Premium Campus）", 1300m, UsdCurrencyId, "USD 1,300 / 4周起", Established(2003), new[] { "CIJ Academy Premium Campus", "CIJ Premium Campus" }),
        new RegionalStartingPriceSeed("菲律宾宿务Curious World Academy", 1550m, UsdCurrencyId, "USD 1,550 / 4周起", Established(2022), new[] { "Curious World Academy", "CWA" }),
        new RegionalStartingPriceSeed("菲律宾宿务Global Language Cebu", 1720m, UsdCurrencyId, "USD 1,720 / 4周起", Established(2011), new[] { "Global Language Cebu", "GLC" }),
        new RegionalStartingPriceSeed("菲律宾宿务QQEnglish（Beachfront Campus）", 1395m, UsdCurrencyId, "USD 1,395 / 4周起（胶囊学生寮+餐食套餐）", Established(2009), new[] { "QQEnglish Beachfront Campus", "QQEnglish" }),
        new RegionalStartingPriceSeed("菲律宾宿务STARGATE Global Education", 1350m, UsdCurrencyId, "USD 1,350 / 4周起", Established(2017), new[] { "STARGATE Global Education", "STARGATE" }),
        new RegionalStartingPriceSeed("菲律宾宿务Winning English Academy", 1095m, UsdCurrencyId, "USD 1,095 / 4周起（Ocean Cambridge ESL2 Backpacker 8人房）", Established(2015), new[] { "Winning English Academy" }),
        new RegionalStartingPriceSeed("菲律宾宿务GLANT English Academy语言学校", 303m, UsdCurrencyId, "USD 303 / 1周起", Established(2023), new[] { "GLANT English Academy", "GLANT" }),
        new RegionalStartingPriceSeed("菲律宾宿务ICL English Academy", 1350m, UsdCurrencyId, "USD 1,350 / 4周起", Established(2022), new[] { "ICL English Academy", "I Crazy Learning Academy" }),
        new RegionalStartingPriceSeed("菲律宾宿务3D Academy", 1189m, UsdCurrencyId, "USD 1,189 / 4周起（课程 + 住宿）", Established(2002), new[] { "3D Academy", "3D Universal English Institute" }),
        new RegionalStartingPriceSeed("菲律宾宿务CELLA Uni Sparta Campus", 1630m, UsdCurrencyId, "USD 1,630 / 4周起（食宿主价）", Established(2006), new[] { "CELLA Uni Sparta Campus", "CELLA Uni" }),
        new RegionalStartingPriceSeed("菲律宾宿务CG Academy（Sparta Campus）", 1550m, UsdCurrencyId, "USD 1,550 / 4周起", Established(2004), new[] { "CG Academy Sparta Campus", "CG Sparta" }),
        new RegionalStartingPriceSeed("菲律宾宿务CG Academy（Banilad Campus）", 1400m, UsdCurrencyId, "USD 1,400 / 4周起（含注册费）", Established(2004), new[] { "CG Academy Banilad Campus", "CG Banilad" }),
        new RegionalStartingPriceSeed("菲律宾宿务SMEAG Capital语言学校", 1580m, UsdCurrencyId, "USD 1,580 / 4周起", Established(2006), new[] { "SMEAG Capital", "SMEAG Capital Campus" }),
        new RegionalStartingPriceSeed("菲律宾宿务Genius English Academy语言学校", 1400m, UsdCurrencyId, "USD 1,400 / 4周起", Established(2013), new[] { "Genius English Academy" }),
        new RegionalStartingPriceSeed("菲律宾宿务Howdy English Academy语言学校", 874m, UsdCurrencyId, "USD 874 / 1周起", Established(2014), new[] { "Howdy English Academy", "Howdy" }),
        new RegionalStartingPriceSeed("菲律宾宿务I.BREEZE语言学校", 1490m, UsdCurrencyId, "USD 1,490 / 4周起", Established(2012), new[] { "I.BREEZE", "I.BREEZE International Language Center", "IBREEZE" }),
        new RegionalStartingPriceSeed("菲律宾宿务IU English Academy", 1350m, UsdCurrencyId, "USD 1,350 / 4周起", Established(2024), new[] { "IU English Academy" }),
        new RegionalStartingPriceSeed("菲律宾宿务Lapulapu", 2080m, UsdCurrencyId, "USD 2,080 / 4周起", Established(2024), new[] { "Lapulapu", "LCIC" }),
        new RegionalStartingPriceSeed("菲律宾宿务Cebu Blue Ocean Academy", 1820m, UsdCurrencyId, "USD 1,820 / 4周起", Established(2015), new[] { "Cebu Blue Ocean Academy", "CBOA" }),
        new RegionalStartingPriceSeed("菲律宾宿务CELLA Premium Campus", 1580m, UsdCurrencyId, "USD 1,580 / 4周起", Established(2006), new[] { "CELLA Premium Campus", "CELLA Premium" }),
        new RegionalStartingPriceSeed("菲律宾宿务EV语言学校", 716m, UsdCurrencyId, "USD 716 / 1周起", Established(2002), new[] { EvSchoolName, "菲律宾宿务EV Academy" }),
        new RegionalStartingPriceSeed(CpiSchoolName, 1670m, UsdCurrencyId, "USD 1,670 / 4周起（ESL GENERAL + A栋四人间）", Established(2015), new[] { LegacyCpiSchoolName }),
        new RegionalStartingPriceSeed(BCebuSchoolName, 1650m, UsdCurrencyId, "USD 1,650 / 4周起（Speed ESL + 三人间）", Established(2026), new[] { LegacyBCebuSchoolName, "B'Cebu" }),
        new RegionalStartingPriceSeed(CpilsSchoolName, 1635m, UsdCurrencyId, "USD 1,635 / 4周起", Established(2001), new[] { LegacyCpilsSchoolName }),
        new RegionalStartingPriceSeed(FellaSchoolName, 1550m, UsdCurrencyId, "USD 1,550 / 4周起", Established(2006), new[] { LegacyFellaSchoolName }),
        new RegionalStartingPriceSeed(PhilinterSchoolName, 1600m, UsdCurrencyId, "USD 1,600 / 4周主费起（注册费另计）", Established(2003), new[] { LegacyPhilinterSchoolName }),

        new RegionalStartingPriceSeed(PinesSchoolName, 1420m, UsdCurrencyId, "课程+住宿4周USD 1,420起", Established(2001), new[] { LegacyPinesSchoolName }),
        new RegionalStartingPriceSeed(BeciSchoolName, 1170m, UsdCurrencyId, "EOP 4周约USD 1,170起", Established(2002), new[] { LegacyBeciSchoolName }),
        new RegionalStartingPriceSeed("菲律宾碧瑶API BECI（City Campus）", 1270m, UsdCurrencyId, "USD 1,270 / 4周起（Light ESL + Studio Quad）", Established(2022), new[] { "API BECI City Campus", "APIBECI City Campus" }),
        new RegionalStartingPriceSeed(JicSchoolName, 1460m, UsdCurrencyId, "Challenger 4周约USD 1,460起", Established(2002), new[] { LegacyJicSchoolName, JicAcademyBaguioName }),
        new RegionalStartingPriceSeed(MonolSchoolName, 1300m, UsdCurrencyId, "4周约USD 1,300起", Established(2003), new[] { LegacyMonolSchoolName, MonolFullSchoolName }),
        new RegionalStartingPriceSeed(WalesSchoolName, 1400m, UsdCurrencyId, "4周约USD 1,400起", Established(2006), new[] { LegacyWalesSchoolName, WalesFullSchoolName, WalesShortSchoolName }),
        new RegionalStartingPriceSeed("菲律宾碧瑶A&J e-Edu English Academy", 1450m, UsdCurrencyId, "4周约USD 1,450起", Established(2008), new[] { "A&J e-Edu English Academy", "A&J" }),
        new RegionalStartingPriceSeed("HELP English（Longlong Campus）", 1500m, UsdCurrencyId, "4周USD 1,500起", Established(1996), new[] { "HELP English Longlong Campus", "HELP Longlong" }),

        new RegionalStartingPriceSeed("菲律宾克拉克 CIP语言学校", 1668m, UsdCurrencyId, "USD 1,668 / 4周起参考", Established(2007), new[] { "CIP", "CIP English", "CIP English Kepos" }),
        new RegionalStartingPriceSeed(EgSchoolName, 1550000m, KrwCurrencyId, "KRW 1,550,000 + 注册费 / 4周起参考", Established(2013), new[] { LegacyEgSchoolName, EgFullSchoolName }),
        new RegionalStartingPriceSeed("菲律宾克拉克TALK Academy语言学校", 1280m, UsdCurrencyId, "USD 1,280 / 4周主费起参考", Established(2022), new[] { "TALK Academy Clark", "Clark TALK Academy" }),
        new RegionalStartingPriceSeed(HelpSchoolName, 1500m, UsdCurrencyId, "USD 1,500 / 4周起参考", Established(1996), new[] { LegacyHelpSchoolName, HelpClarkSchoolName }),
        new RegionalStartingPriceSeed(AelcSchoolName, 1387m, UsdCurrencyId, "USD 1,387 / 4周起历史参考", Established(2008), new[] { LegacyAelcSchoolName, AelcFullSchoolName }),
        new RegionalStartingPriceSeed("菲律宾克拉克HANA Academy", 1470m, UsdCurrencyId, "USD 1,470 + 注册费 / 4周起参考", Established(2016), new[] { "HANA Academy", "Clark HANA Academy" }),

        new RegionalStartingPriceSeed(EnderunSchoolName, 40000m, PhpCurrencyId, "PHP 40,000 / 月起参考", Established(2005), new[] { LegacyEnderunSchoolName }),
        new RegionalStartingPriceSeed(AmericanEnglishSchoolName, 14800m, PhpCurrencyId, "PHP 14,800 / 40小时起参考", Established(2006), new[] { LegacyAmericanEnglishSchoolName }),
        new RegionalStartingPriceSeed(BerlitzSchoolName, 3200m, PhpCurrencyId, "PHP 3,200 Starter Course公告价；常规课需核价", Established(2020), new[] { LegacyBerlitzSchoolName }),

        new RegionalStartingPriceSeed("菲律宾伊洛伊洛WE Academy", 1100m, UsdCurrencyId, "USD 1,100起 + 注册费", Established(2003), new[] { "WE Academy Iloilo", "We Academy Iloilo" }),
        new RegionalStartingPriceSeed("菲律宾伊洛伊洛MK Language Training Center", 1210m, UsdCurrencyId, "USD 1,210 + PHP当地费起", Established(2002), new[] { "MK Language Training Center", "MK Education", "Metro Korea Language Training Center" }),
        new RegionalStartingPriceSeed("菲律宾怡朗GITC College International Language Center", 930m, UsdCurrencyId, "USD 930起 + 注册费", Established(2003), new[] { "GITC College International Language Center", "Green International Technological College Language Center" }),

        new RegionalStartingPriceSeed("菲律宾长滩岛Boracay Coco English Academy", 1300m, UsdCurrencyId, "USD 1,300起含注册费", Established(2018), new[] { "Boracay Coco English Academy" }),
        new RegionalStartingPriceSeed("菲律宾长滩岛Paradise English Boracay Language Institute", 1072m, UsdCurrencyId, "USD 1,072起含注册费", Established(2005), new[] { "Paradise English Boracay Language Institute", "Paradise English Language Institute", "Paradise English Boracay" }),
      };

      var knownSchools = context.Schools.ToList();

      foreach (var startingPrice in startingPrices)
      {
        var school = FindSchoolByNames(knownSchools, startingPrice);

        if (school == null)
        {
          school = new XiaoJuanSchoolPayment.Server.Data.Models.School
          {
            Id = Guid.NewGuid(),
            Name = startingPrice.SchoolName,
            CreatedDate = startingPrice.CreatedDate,
          };
          context.Schools.Add(school);
          knownSchools.Add(school);
        }
        else if (school.CreatedDate == default)
        {
          school.CreatedDate = startingPrice.CreatedDate;
        }

        UpsertFee(
          context,
          school.Id,
          "页面起始价",
          startingPrice.Amount,
          startingPrice.CurrencyId,
          $"城市或学校页面显示的起始价格：{startingPrice.PriceText}；用于后台维护页面参考价，正式报价仍需按学校当期invoice确认",
          now);
      }

      await context.SaveChangesAsync();
    }

    private static XiaoJuanSchoolPayment.Server.Data.Models.School? FindSchoolByNames(
      IEnumerable<XiaoJuanSchoolPayment.Server.Data.Models.School> schools,
      RegionalStartingPriceSeed startingPrice)
    {
      var names = new[] { startingPrice.SchoolName }
        .Concat(startingPrice.Aliases)
        .Where(x => !string.IsNullOrWhiteSpace(x))
        .Distinct(StringComparer.OrdinalIgnoreCase)
        .ToArray();

      return schools.FirstOrDefault(school => names.Contains(school.Name, StringComparer.OrdinalIgnoreCase));
    }

    private sealed record RegionalStartingPriceSeed(
      string SchoolName,
      decimal Amount,
      int CurrencyId,
      string PriceText,
      DateTime CreatedDate,
      string[] Aliases);

    private static void AddLessonIfMissing(
      AppDbContext context,
      Guid schoolId,
      string name,
      decimal price,
      string description,
      string note,
      DateTime lastUpdated)
    {
      if (context.SchoolLessons.Any(x => x.SchoolId == schoolId && x.Name == name && x.Week == 1))
      {
        return;
      }

      context.SchoolLessons.Add(new SchoolLesson
      {
        Id = Guid.NewGuid(),
        SchoolId = schoolId,
        Name = name,
        Week = 1,
        Price = price,
        CurrencyId = UsdCurrencyId,
        Description = description,
        Note = note,
        LastUpdated = lastUpdated,
      });
    }

    private static void AddLessonIfMissing(
      AppDbContext context,
      Guid schoolId,
      string name,
      decimal price,
      string description,
      string note,
      DateTime lastUpdated,
      int week)
    {
      if (context.SchoolLessons.Any(x => x.SchoolId == schoolId && x.Name == name && x.Week == week))
      {
        return;
      }

      context.SchoolLessons.Add(new SchoolLesson
      {
        Id = Guid.NewGuid(),
        SchoolId = schoolId,
        Name = name,
        Week = week,
        Price = price,
        CurrencyId = UsdCurrencyId,
        Description = description,
        Note = note,
        LastUpdated = lastUpdated,
      });
    }

    private static void AddRoomIfMissing(
      AppDbContext context,
      Guid schoolId,
      string name,
      decimal price,
      string description,
      DateTime lastUpdated)
    {
      if (context.SchoolRooms.Any(x => x.SchoolId == schoolId && x.Name == name && x.Week == 1))
      {
        return;
      }

      context.SchoolRooms.Add(new SchoolRoom
      {
        Id = Guid.NewGuid(),
        SchoolId = schoolId,
        Name = name,
        Week = 1,
        Price = price,
        CurrencyId = UsdCurrencyId,
        Description = description,
        LastUpdated = lastUpdated,
      });
    }

    private static void AddRoomIfMissing(
      AppDbContext context,
      Guid schoolId,
      string name,
      decimal price,
      string description,
      DateTime lastUpdated,
      int week)
    {
      if (context.SchoolRooms.Any(x => x.SchoolId == schoolId && x.Name == name && x.Week == week))
      {
        return;
      }

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
    }

    private static void AddFeeIfMissing(
      AppDbContext context,
      Guid schoolId,
      string name,
      decimal fee,
      int currencyId,
      string description,
      DateTime lastUpdated)
    {
      if (context.SchoolFees.Any(x => x.SchoolId == schoolId && x.Name == name))
      {
        return;
      }

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
    }

    private static void UpsertLesson(
      AppDbContext context,
      Guid schoolId,
      string name,
      int week,
      decimal price,
      string description,
      DateTime lastUpdated,
      string note = "CIA 2026年4周课程费参考；1/2/3周分别按4周课程费和住宿费的40%/60%/80%计算；最终以学校正式报价为准",
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
