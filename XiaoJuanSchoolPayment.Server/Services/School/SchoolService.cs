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
  }
}
