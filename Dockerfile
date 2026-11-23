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
COPY --from=client-build /src/xiaojuanschoolpayment.client/dist/xiaojuanschoolpayment.client/browser ./XiaoJuanSchoolPayment.Server/wwwroot

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

EXPOSE 8080
ENTRYPOINT ["dotnet", "XiaoJuanSchoolPayment.Server.dll"]
