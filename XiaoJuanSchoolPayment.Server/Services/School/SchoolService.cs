using Microsoft.EntityFrameworkCore;
using XiaoJuanSchoolPayment.Server.Data;
using XiaoJuanSchoolPayment.Server.Data.DTO;
using XiaoJuanSchoolPayment.Server.Interface;

namespace XiaoJuanSchoolPayment.Server.Services.School
{
  public class SchoolService : ISchoolService
  {
    private readonly AppDbContext _appDbContext;
    public SchoolService(AppDbContext context) {
      _appDbContext = context;
    }
    public async Task<bool> SaveSchool(SchoolDTO school, CancellationToken cancellationToken)
    {
      if (school.Id == Guid.Empty)
      {
        _appDbContext.Schools.Add(new Data.Models.School
        { Name = school.Name, CreatedDate = school.CreatedDate });
      }
      else
      {
        var dbSchool = await _appDbContext.Schools.FirstOrDefaultAsync(x => x.Id == school.Id, cancellationToken);
        if (dbSchool != null)
        {
          dbSchool.Name = school.Name;
          dbSchool.CreatedDate = school.CreatedDate;
        }
      }
      await _appDbContext.SaveChangesAsync();
      return true;
    }

    public async Task<IList<SchoolDTO>> GetSchools(CancellationToken cancellationToken)
    {
      var result = await _appDbContext.Schools
      .AsNoTracking()
      .Select(x => new SchoolDTO
      {
        Id = x.Id,
        CreatedDate = x.CreatedDate,
        Name = x.Name
      })
      .ToListAsync(cancellationToken);
      return result;
    }

    public async Task<bool> SaveSchoolLesson(SchoolLessonDTO lesson, CancellationToken cancellationToken)
    {
      if (lesson.Id == Guid.Empty)
      {
        _appDbContext.SchoolLessons.Add(new Data.Models.SchoolLesson
        { 
          Name = lesson.Name,
          SchoolId = lesson.SchoolId,
          Week = lesson.Week,
          Price = lesson.Price,
          Note = lesson.Note,
          Description = lesson.Description,
          CurrencyId = lesson.CurrencyId,
          LastUpdated = DateTime.UtcNow,
        });
      }
      else
      {
        var dbLesson = await _appDbContext.SchoolLessons.FirstOrDefaultAsync(x => x.Id == lesson.Id, cancellationToken);
        if (dbLesson != null)
        {
          dbLesson.Name = lesson.Name;
        }
      }
      await _appDbContext.SaveChangesAsync();
      return true;
    }

    public async Task<IList<SchoolLessonDTO>> GetSchoolLessons(CancellationToken ct)
    {
      var result = await _appDbContext.SchoolLessons.AsNoTracking()
        .Include(x => x.School)
        .Select(x => new SchoolLessonDTO
        {
          Id = x.Id,
          SchoolId = x.SchoolId,
          Name = x.Name,
          SchoolName = x.School.Name,
          Description = x.Description,
          Note = x.Note,
          Price = x.Price,
          Week = x.Week,
        }).ToListAsync(ct);
      return result;
    }
  }
}
