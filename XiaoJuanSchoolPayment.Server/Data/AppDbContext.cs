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
    public DbSet<SchoolPhoto> SchoolPhotos { get; set; }
    public DbSet<Currency> SchoolCurrency { get; set; }
    public DbSet<StudentApplication> StudentApplications { get; set; }
    public DbSet<StudentApplicationDocument> StudentApplicationDocuments { get; set; }
    public DbSet<InvitationCode> InvitationCodes { get; set; }

    protected override void OnModelCreating(ModelBuilder builder)
    {
      base.OnModelCreating(builder);

      builder.Entity<StudentApplication>()
        .HasOne(x => x.StudentUser)
        .WithMany()
        .HasForeignKey(x => x.StudentUserId)
        .OnDelete(DeleteBehavior.Restrict);

      builder.Entity<StudentApplication>()
        .HasOne(x => x.School)
        .WithMany()
        .HasForeignKey(x => x.SchoolId)
        .OnDelete(DeleteBehavior.Restrict);

      builder.Entity<StudentApplicationDocument>()
        .HasOne(x => x.StudentApplication)
        .WithMany(x => x.Documents)
        .HasForeignKey(x => x.StudentApplicationId)
        .OnDelete(DeleteBehavior.Cascade);

      builder.Entity<InvitationCode>()
        .HasIndex(x => x.CodeHash)
        .IsUnique();

      builder.Entity<InvitationCode>()
        .HasIndex(x => x.CreatedByUserId);
    }
  }
}
