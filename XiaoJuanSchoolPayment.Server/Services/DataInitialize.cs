using XiaoJuanSchoolPayment.Server.Data;

namespace XiaoJuanSchoolPayment.Server.Services
{
  public static class DataInitialize
  {
    public static async Task SeedAsync(IServiceProvider services)
    {
      using var scope = services.CreateScope();
      var provider = scope.ServiceProvider;
      var context = provider.GetRequiredService<AppDbContext>();

      if(!context.SchoolCurrency.Any(x => x.Id == 1))
      {
        context.SchoolCurrency.Add(new Data.Models.Currency { Id = 1, CurrencyCode = "USD", Symbol = "$" });
        await context.SaveChangesAsync();
      }
      if (!context.SchoolCurrency.Any(x => x.Id == 2))
      {
        context.SchoolCurrency.Add(new Data.Models.Currency { Id = 2, CurrencyCode = "GBP", Symbol = "£" });
        await context.SaveChangesAsync();
      }
      if (!context.SchoolCurrency.Any(x => x.Id == 3))
      {
        context.SchoolCurrency.Add(new Data.Models.Currency { Id = 3, CurrencyCode = "CNY", Symbol = "¥" });
        await context.SaveChangesAsync();
      }
      if (!context.SchoolCurrency.Any(x => x.Id == 4))
      {
        context.SchoolCurrency.Add(new Data.Models.Currency { Id = 4, CurrencyCode = "EUR", Symbol = "€" });
        await context.SaveChangesAsync();
      }
      if (!context.SchoolCurrency.Any(x => x.Id == 5))
      {
        context.SchoolCurrency.Add(new Data.Models.Currency { Id = 5, CurrencyCode = "PESO", Symbol = "₱" });
        await context.SaveChangesAsync();
      }
    }
  }
}
