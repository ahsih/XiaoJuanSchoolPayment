namespace XiaoJuanSchoolPayment.Server.Data.DTO
{
  public class SchoolCommissionPolicyDTO
  {
    public Guid Id { get; set; }
    public Guid SchoolId { get; set; }
    public string SchoolName { get; set; } = string.Empty;
    public string PolicyCode { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public DateTime EffectiveRegistrationDate { get; set; }
    public bool NewStudentsOnly { get; set; }
    public decimal CommissionRate { get; set; }
    public string CurrencyCode { get; set; } = string.Empty;
    public string FormulaNote { get; set; } = string.Empty;
    public string ScopeNote { get; set; } = string.Empty;
    public string Source { get; set; } = string.Empty;
    public string SourceNotice { get; set; } = string.Empty;
    public DateTime RecordedAt { get; set; }
    public IList<SchoolCommissionRoomBasisDTO> RoomBases { get; set; } = new List<SchoolCommissionRoomBasisDTO>();
  }

  public class SchoolCommissionRoomBasisDTO
  {
    public string RoomCode { get; set; } = string.Empty;
    public string RoomName { get; set; } = string.Empty;
    public decimal PublishedRoomPriceFourWeeks { get; set; }
    public decimal CommissionBasisFourWeeks { get; set; }
    public string? Note { get; set; }
  }
}
