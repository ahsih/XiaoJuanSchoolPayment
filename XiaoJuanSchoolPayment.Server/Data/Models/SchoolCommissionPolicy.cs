using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;

namespace XiaoJuanSchoolPayment.Server.Data.Models
{
  // Internal settlement data. Never include this entity in public school-content DTOs.
  public class SchoolCommissionPolicy : AuditableEntity
  {
    public Guid SchoolId { get; set; }
    public School? School { get; set; }

    [MaxLength(80)]
    public string PolicyCode { get; set; } = string.Empty;

    [MaxLength(200)]
    public string Title { get; set; } = string.Empty;

    public DateTime EffectiveRegistrationDate { get; set; }
    public bool NewStudentsOnly { get; set; }

    [Precision(5, 4)]
    public decimal CommissionRate { get; set; }

    [MaxLength(10)]
    public string CurrencyCode { get; set; } = "USD";

    [MaxLength(500)]
    public string FormulaNote { get; set; } = string.Empty;

    [MaxLength(1000)]
    public string ScopeNote { get; set; } = string.Empty;

    [MaxLength(200)]
    public string Source { get; set; } = string.Empty;

    public string SourceNotice { get; set; } = string.Empty;
    public DateTime RecordedAt { get; set; }

    public ICollection<SchoolCommissionRoomBasis> RoomBases { get; set; } = new List<SchoolCommissionRoomBasis>();
  }

  public class SchoolCommissionRoomBasis : AuditableEntity
  {
    public Guid SchoolCommissionPolicyId { get; set; }
    public SchoolCommissionPolicy? SchoolCommissionPolicy { get; set; }

    [MaxLength(100)]
    public string RoomCode { get; set; } = string.Empty;

    [MaxLength(200)]
    public string RoomName { get; set; } = string.Empty;

    [Precision(18, 2)]
    public decimal PublishedRoomPriceFourWeeks { get; set; }

    [Precision(18, 2)]
    public decimal CommissionBasisFourWeeks { get; set; }

    [MaxLength(500)]
    public string? Note { get; set; }
  }
}
