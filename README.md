# 思达启航教育网站

This repository contains the public website and admin system for 思达启航教育 (Sida Qihang Education). It is a Chinese-language education consultancy platform covering Ireland study applications, Philippines English-study schools and pricing, online English, overseas study tours, contact enquiries, and school quote generation.

The application has two projects:

- `xiaojuanschoolpayment.client`: Angular 19 frontend with public content pages, school calculators, authentication, and admin screens.
- `XiaoJuanSchoolPayment.Server`: ASP.NET Core 8 API using EF Core, MySQL, ASP.NET Identity/JWT, SMTP email delivery, and local school-photo storage.

For an architecture map, local setup, change workflows, verification commands, and guidance for AI coding assistants, read [AGENTS.md](AGENTS.md) before making changes.

## Quick start

Prerequisites are Node.js 22, the .NET 8 SDK, and a running MySQL-compatible database.

```powershell
npm --prefix xiaojuanschoolpayment.client ci
dotnet run --project XiaoJuanSchoolPayment.Server --launch-profile https
```

The server applies EF Core migrations and seed data at startup. The development frontend normally opens at `https://localhost:53747`, and Swagger is available at `https://localhost:7209/swagger`.

Use environment variables or .NET user secrets for the database connection, JWT key, registration access code, and SMTP settings. Do not add credentials to source control.

## Verification

```powershell
npm --prefix xiaojuanschoolpayment.client run build
dotnet build XiaoJuanSchoolPayment.Server/XiaoJuanSchoolPayment.Server.csproj
```

The production `Dockerfile` builds both projects and serves the Angular output from ASP.NET Core on port 8080. An external MySQL database and persistent storage for `wwwroot/uploads` are required in production.
