using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace XiaoJuanSchoolPayment.Server.Data
{
  public class AppDbContextFactory : IDesignTimeDbContextFactory<AppDbContext>
  {
    public AppDbContext CreateDbContext(string[] args)
    {
      var currentDirectory = Directory.GetCurrentDirectory();
      var configuration = new ConfigurationBuilder()
        .SetBasePath(currentDirectory)
        .AddJsonFile("appsettings.json", optional: true)
        .AddJsonFile(Path.Combine("XiaoJuanSchoolPayment.Server", "appsettings.json"), optional: true)
        .AddEnvironmentVariables()
        .Build();

      var connectionString = configuration.GetConnectionString("DefaultConnection")
        ?? "server=localhost;port=3306;database=SchoolPayment;user=root;password=";
      var options = new DbContextOptionsBuilder<AppDbContext>()
        .UseMySql(connectionString, new MySqlServerVersion(new Version(8, 0, 0)))
        .Options;

      return new AppDbContext(options);
    }
  }
}
