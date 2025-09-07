using Microsoft.EntityFrameworkCore;
using XiaoJuanSchoolPayment.Server.Data.Models;

namespace XiaoJuanSchoolPayment.Server.Data
{
  public class AppDbContext : DbContext
  {
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    // Tables
    public DbSet<School> Schools { get; set; }
  }
}
