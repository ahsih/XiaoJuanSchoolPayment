const { LogLevel } = require("@angular/compiler-cli");
const { env } = require("process");

const target = env.ASPNETCORE_HTTPS_PORT
  ? `https://localhost:${env.ASPNETCORE_HTTPS_PORT}`
  : env.ASPNETCORE_URLS
  ? env.ASPNETCORE_URLS.split(";")[0]
  : "https://localhost:7209";

const PROXY_CONFIG = [
  {
    context: ["/weatherforecast", "/auth", "/school", "/Account", "/currency"],
    target,
    secure: false,
    LogLevel: "debug",
  },
];

module.exports = PROXY_CONFIG;
