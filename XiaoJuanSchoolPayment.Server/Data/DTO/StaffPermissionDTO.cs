namespace XiaoJuanSchoolPayment.Server.Data.DTO
{
  public class StaffSchoolPermissionDTO
  {
    public Guid SchoolId { get; set; }
    public string SchoolName { get; set; } = string.Empty;
    public bool SchoolContent { get; set; }
    public bool Pricing { get; set; }
    public bool QuoteImage { get; set; }
    public bool Media { get; set; }
    public bool Students { get; set; }
  }

  public class StaffPermissionUserDTO
  {
    public string UserId { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Account { get; set; } = string.Empty;
    public string EmployeeType { get; set; } = "Consultant";
    public bool CanPublish { get; set; }
    public IList<StaffSchoolPermissionDTO> Schools { get; set; } = [];
  }

  public class UpdateStaffPermissionsDTO
  {
    public IList<StaffSchoolPermissionDTO> Schools { get; set; } = [];
  }

  public class UpdateEmployeeTypeDTO
  {
    public string EmployeeType { get; set; } = "Consultant";
  }
}
