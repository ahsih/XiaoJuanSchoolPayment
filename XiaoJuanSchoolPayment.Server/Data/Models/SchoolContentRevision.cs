using System.ComponentModel.DataAnnotations;

namespace XiaoJuanSchoolPayment.Server.Data.Models
{
  public class SchoolContentRevision : AuditableEntity
  {
    public Guid SchoolId { get; set; }
    public School? School { get; set; }

    public int Version { get; set; }

    [MaxLength(20)]
    public string Status { get; set; } = "Draft";

    public string ContentJson { get; set; } = "{}";

    [MaxLength(500)]
    public string? ChangeSummary { get; set; }

    [MaxLength(450)]
    public string UpdatedByUserId { get; set; } = string.Empty;

    [MaxLength(256)]
    public string UpdatedByName { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public DateTime? PublishedAt { get; set; }
  }
}
