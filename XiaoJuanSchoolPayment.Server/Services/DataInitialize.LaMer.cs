using System.Text.Json;
using XiaoJuanSchoolPayment.Server.Data;
using XiaoJuanSchoolPayment.Server.Data.Models;

namespace XiaoJuanSchoolPayment.Server.Services;

public static partial class DataInitialize
{
    private static async Task SeedLaMerPricingAsync(AppDbContext context)
    {
        var baselineId = Guid.Parse("578d438f-2974-4cf9-872c-e67e8253e8da");
        const string name = "EV Academy La Mer";
        var school = context.Schools.FirstOrDefault(s => s.Id == baselineId || s.Name == name || s.Name == "EV La Mer" || s.Name == "菲律宾宿务EV La Mer校区");
        if (school == null)
        {
            school = new Data.Models.School { Id = baselineId, Name = name, CreatedDate = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc) };
            context.Schools.Add(school);
        }
        var now = DateTime.UtcNow;
        using var stream = typeof(DataInitialize).Assembly.GetManifestResourceStream("XiaoJuanSchoolPayment.Server.Data.Seed.ev-la-mer-content.json")
            ?? throw new InvalidOperationException("La Mer initial content resource is missing.");
        using var reader = new StreamReader(stream);
        var json = await reader.ReadToEndAsync();
        using var document = JsonDocument.Parse(json);
        var root = document.RootElement;
        foreach (var course in root.GetProperty("courses").EnumerateArray())
        {
            var courseName = course.GetProperty("name").GetString()!;
            if (!context.SchoolLessons.Any(x => x.SchoolId == school.Id && x.Name == courseName && x.Week == 4))
                UpsertLesson(context, school.Id, courseName, 4, course.GetProperty("tuition").GetDecimal(), course.GetProperty("schedule").GetString()!, now,
                    "La Mer 2025普通价目表继续有效；课程与住宿分列，注册费每人只计一次。已发布的版本化配置优先。");
        }
        foreach (var room in root.GetProperty("rooms").EnumerateArray())
        {
            var roomName = room.GetProperty("name").GetString()!;
            if (!context.SchoolRooms.Any(x => x.SchoolId == school.Id && x.Name == roomName && x.Week == 4))
                UpsertRoom(context, school.Id, roomName, 4, room.GetProperty("fee").GetDecimal(), room.GetProperty("note").GetString()!, now);
        }
        foreach (var fee in root.GetProperty("localFees").EnumerateArray())
        {
            var feeName = fee.GetProperty("name").GetString()!;
            if (!context.SchoolFees.Any(x => x.SchoolId == school.Id && x.Name == feeName))
                UpsertFee(context, school.Id, feeName, fee.GetProperty("amount").GetDecimal(), PhpCurrencyId, fee.GetProperty("note").GetString()!, now);
        }
        if (!context.SchoolFees.Any(x => x.SchoolId == school.Id && x.Name == "注册费"))
            UpsertFee(context, school.Id, "注册费", 100m, UsdCurrencyId, "普通课程每人一次；亲子整包不重复收取。", now);
        // Insert a reviewable baseline only. Never replace an employee draft or published revision.
        if (!context.SchoolContentRevisions.Any(r => r.SchoolId == school.Id))
            context.SchoolContentRevisions.Add(new SchoolContentRevision {
                Id = Guid.NewGuid(), SchoolId = school.Id, Version = 1, Status = "Draft", ContentJson = json,
                ChangeSummary = "依据La Mer完整学校资料及用户确认规则建立初始内容，等待员工审核发布。",
                UpdatedByUserId = "system-seed", UpdatedByName = "学校资料初始化", CreatedAt = now, UpdatedAt = now,
            });
        await context.SaveChangesAsync();
    }
}
