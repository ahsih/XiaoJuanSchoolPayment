using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using XiaoJuanSchoolPayment.Server.Data.Models;

namespace XiaoJuanSchoolPayment.Server.Data
{
  public class AppDbContext : IdentityDbContext<SchoolUser>
  {
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    // Tables
    public DbSet<School> Schools { get; set; }
    public DbSet<SchoolRoom> SchoolRooms { get; set; } 
    public DbSet<SchoolLesson> SchoolLessons { get; set; }
    public DbSet<SchoolNote> SchoolNotes { get; set; }
    public DbSet<SchoolFee> SchoolFees { get; set; }
  }
}
