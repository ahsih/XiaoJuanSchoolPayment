using XiaoJuanSchoolPayment.Server.Data.DTO;

namespace XiaoJuanSchoolPayment.Server.Interface
{
  public interface ISchoolService
  {
    public Task SaveSchool(SchoolDTO school, CancellationToken cancellationToken);
  }
}
