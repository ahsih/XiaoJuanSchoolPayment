using XiaoJuanSchoolPayment.Server.Data.DTO;

namespace XiaoJuanSchoolPayment.Server.Interface
{
  public interface ISchoolService
  {
    public Task<bool> SaveSchool(SchoolDTO school, CancellationToken cancellationToken);
    public Task<bool> SaveSchoolLesson(SchoolLessonDTO lesson, CancellationToken cancellationToken);
    public Task<bool> SaveSchoolRoom(SchoolRoomDTO room, CancellationToken cancellationToken);
    public Task<bool> SaveSchoolFee(SchoolFeeDTO feeDto, CancellationToken cancellationToken);
    public Task<bool> SaveSchoolNote(SchoolNoteDTO note, CancellationToken cancellationToken);
    public Task<IList<SchoolDTO>> GetSchools(CancellationToken cancellationToken);
    public Task<IList<SchoolLessonDTO>> GetSchoolLessons(CancellationToken cancellationToken);
    public Task<IList<SchoolRoomDTO>> GetSchoolRooms(CancellationToken cancellationToken);
    public Task<IList<SchoolFeeDTO>> GetSchoolFees(CancellationToken cancellationToken);
    public Task<IList<SchoolNoteDTO>> GetSchoolNotes(CancellationToken cancellationToken);
  }
}
