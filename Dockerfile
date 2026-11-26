# syntax=docker/dockerfile:1

FROM node:22-alpine AS client-build
WORKDIR /src/xiaojuanschoolpayment.client

COPY xiaojuanschoolpayment.client/package*.json ./
RUN npm ci

COPY xiaojuanschoolpayment.client ./
# School pages are prerendered with the latest published prices read from the live site
# (scripts/prerender-school-pages.cjs). If the site cannot be reached, that step is skipped
# and those pages are rendered in the browser as before.
ENV SIDA_PRERENDER_API_ORIGIN=https://sidaqihang.com
RUN npm run build

FROM mcr.microsoft.com/dotnet/sdk:10.0 AS server-build
WORKDIR /src

COPY XiaoJuanSchoolPayment.Server ./XiaoJuanSchoolPayment.Server

# The Visual Studio SPA project reference is only needed for local development.
# The container builds Angular separately and serves the compiled files from wwwroot.
RUN sed -i '/<ProjectReference Include=.*xiaojuanschoolpayment.client.esproj/,/<\/ProjectReference>/d' ./XiaoJuanSchoolPayment.Server/XiaoJuanSchoolPayment.Server.csproj
RUN dotnet restore ./XiaoJuanSchoolPayment.Server/XiaoJuanSchoolPayment.Server.csproj
RUN dotnet publish ./XiaoJuanSchoolPayment.Server/XiaoJuanSchoolPayment.Server.csproj \
    --configuration Release \
    --output /app/publish \
    --no-restore

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS runtime
WORKDIR /app

ENV ASPNETCORE_URLS=http://0.0.0.0:8080
ENV ASPNETCORE_ENVIRONMENT=Production

COPY --from=server-build /app/publish ./
# The Angular build goes straight into wwwroot. It holds every photo and video (5.5 GB in November 2026), and
# every COPY stores them once more: passing them through the server build and `dotnet publish` as before kept
# five copies during a build, which filled the server's disk (2026-11-27). The server reads wwwroot from disk
# at run time (UseStaticFiles, SpaSeoHtmlRenderer), so it does not need these files when it is published.
COPY --from=client-build /src/xiaojuanschoolpayment.client/dist/xiaojuanschoolpayment.client/browser ./wwwroot

EXPOSE 8080
ENTRYPOINT ["dotnet", "XiaoJuanSchoolPayment.Server.dll"]
