using System.Collections.ObjectModel;

namespace XiaoJuanSchoolPayment.Server.Data.Models
{
  public class School : AuditableEntity
  {
    public required string Name { get; set; }
    public DateTime CreatedDate { get; set; }
    public required ICollection<SchoolRoom> SchoolRooms { get; set; } = new Collection<SchoolRoom>();
    public required ICollection<SchoolLesson> SchoolLessons { get; set; } = new Collection<SchoolLesson>();
    public required ICollection<SchoolNote> SchoolNotes { get; set; } = new Collection<SchoolNote>();
    public required ICollection<SchoolFee> SchoolFees { get; set; } = new Collection<SchoolFee>();
  }
}
