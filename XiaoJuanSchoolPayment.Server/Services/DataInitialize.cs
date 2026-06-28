using XiaoJuanSchoolPayment.Server.Data;

using XiaoJuanSchoolPayment.Server.Data.Models;

namespace XiaoJuanSchoolPayment.Server.Services
{
  public static class DataInitialize
  {
    private const int UsdCurrencyId = 1;
    private const int PhpCurrencyId = 5;
    private static readonly Guid CiaSchoolId = Guid.Parse("2f6a6d78-b2f1-4b84-9ac4-1d3b3bd10c1a");
    private static readonly Guid EvSchoolId = Guid.Parse("d48cd1f9-d76b-4b52-9960-e9db057f577d");
    private static readonly Guid CpiSchoolId = Guid.Parse("8c5d52f6-cfe1-45d9-9b66-1c5c0cdb2a6d");
    private static readonly Guid CpilsSchoolId = Guid.Parse("6d0bcf03-e6d7-41b3-b14f-1467e762747d");
    private const string CiaSchoolName = "CIA Cebu International Academy";
    private const string EvSchoolName = "EV Academy";
    private const string CpiSchoolName = "CPI Cebu Pelis Institute";
    private const string CpilsSchoolName = "CPILS";

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
      UpsertLesson(context, schoolId, "ESL Classic", 4, 780m, "半斯巴达综合英语，适合学习与生活平衡", now, evLessonNote);
      UpsertLesson(context, schoolId, "Intensive ESL", 4, 900m, "斯巴达强度更高，适合想被学习节奏推动的学生", now, evLessonNote);
      UpsertLesson(context, schoolId, "Power Speaking 6", 4, 980m, "每天更多一对一口语训练，适合短期口语突破", now, evLessonNote);
      UpsertLesson(context, schoolId, "Power Speaking 8", 4, 1080m, "高一对一比例，适合明确口语冲刺目标", now, evLessonNote);
      UpsertLesson(context, schoolId, "IELTS", 4, 1000m, "雅思备考与模考训练，适合目标分数学生", now, evLessonNote);
      UpsertLesson(context, schoolId, "TOEIC", 4, 950m, "托业备考，适合升学、求职或企业英语需求", now, evLessonNote);
      UpsertLesson(context, schoolId, "Business", 4, 950m, "商务沟通、会议、演示和职场表达", now, evLessonNote);

      UpsertRoom(context, schoolId, "单人房", 4, 1600m, "隐私最好，预算较高，热门档期需早确认", now);
      UpsertRoom(context, schoolId, "双人房", 4, 1230m, "适合朋友同行或希望兼顾预算与舒适度", now);
      UpsertRoom(context, schoolId, "三人房", 4, 1150m, "多人房中预算较平衡", now);
      UpsertRoom(context, schoolId, "四人房", 4, 1100m, "默认报价参考，预算压力较低", now);

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
      var school = context.Schools.FirstOrDefault(x => x.Id == CpiSchoolId || x.Name == CpiSchoolName);

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
      var school = context.Schools.FirstOrDefault(x => x.Id == CpilsSchoolId || x.Name == CpilsSchoolName);

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

    private static void UpsertLesson(
      AppDbContext context,
      Guid schoolId,
      string name,
      int week,
      decimal price,
      string description,
      DateTime lastUpdated,
      string note = "CIA 2026年4周课程费参考；最终以学校正式报价为准")
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
          Note = note,
          LastUpdated = lastUpdated,
        });
        return;
      }

      lesson.Price = price;
      lesson.CurrencyId = UsdCurrencyId;
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

    private static void RemoveRoom(AppDbContext context, Guid schoolId, string name, int week)
    {
      var room = context.SchoolRooms.FirstOrDefault(x => x.SchoolId == schoolId && x.Name == name && x.Week == week);

      if (room != null)
      {
        context.SchoolRooms.Remove(room);
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
