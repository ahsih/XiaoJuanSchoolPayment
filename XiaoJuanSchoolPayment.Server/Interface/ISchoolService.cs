using XiaoJuanSchoolPayment.Server.Data.DTO;

namespace XiaoJuanSchoolPayment.Server.Interface
{
  public interface ISchoolService
  {
    public Task<bool> SaveSchool(SchoolDTO school, CancellationToken cancellationToken);
    public Task<IList<SchoolDTO>> GetSchools(CancellationToken cancellationToken);
    public Task<IList<SchoolLessonDTO>> GetSchoolLessons(CancellationToken cancellationToken);
  }
}
