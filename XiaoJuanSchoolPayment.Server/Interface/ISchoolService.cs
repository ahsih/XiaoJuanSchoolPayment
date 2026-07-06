using XiaoJuanSchoolPayment.Server.Data.DTO;
using XiaoJuanSchoolPayment.Server.Data.Filter;

namespace XiaoJuanSchoolPayment.Server.Interface
{
  public interface ISchoolService
  {
    public Task<bool> SaveSchool(SchoolDTO school, CancellationToken cancellationToken);
    public Task<bool> SaveSchoolLesson(SchoolLessonDTO lesson, CancellationToken cancellationToken);
    public Task<bool> SaveSchoolRoom(SchoolRoomDTO room, CancellationToken cancellationToken);
    public Task<bool> SaveSchoolFee(SchoolFeeDTO feeDto, CancellationToken cancellationToken);
    public Task<bool> SaveSchoolNote(SchoolNoteDTO note, CancellationToken cancellationToken);
    public Task<SchoolPhotoDTO> UploadSchoolPhoto(SchoolPhotoUploadDTO photo, CancellationToken cancellationToken);
    public Task<bool> SaveSchoolPhoto(SchoolPhotoDTO photo, CancellationToken cancellationToken);
    public Task<bool> DeleteSchoolPhoto(Guid id, CancellationToken cancellationToken);
    public Task<IList<SchoolDTO>> GetSchools(SchoolFilter filter,CancellationToken cancellationToken);
    public Task<IList<SchoolLessonDTO>> GetSchoolLessons(LessonFilter filter,CancellationToken cancellationToken);
    public Task<IList<SchoolRoomDTO>> GetSchoolRooms(SchoolRoomFilter filter,CancellationToken cancellationToken);
    public Task<IList<SchoolFeeDTO>> GetSchoolFees(SchoolFeeFilter filter,CancellationToken cancellationToken);
    public Task<IList<SchoolNoteDTO>> GetSchoolNotes(SchoolNoteFilter filter,CancellationToken cancellationToken);
    public Task<IList<SchoolPhotoDTO>> GetSchoolPhotos(SchoolPhotoFilter filter, CancellationToken cancellationToken);
  }
}
