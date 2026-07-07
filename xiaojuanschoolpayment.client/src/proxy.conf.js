const { LogLevel } = require("@angular/compiler-cli");
const { env } = require("process");

const urls = env.ASPNETCORE_URLS?.split(";") ?? [];
const httpsUrl = urls.find((url) => url.startsWith("https://"));
const httpUrl = urls.find((url) => url.startsWith("http://"));

const target = httpsUrl ?? httpUrl ?? "https://localhost:7209";

const PROXY_CONFIG = [
  {
    context: ["/weatherforecast", "/auth", "/school", "/Account", "/currency", "/contact-form", "/quote-email", "/uploads"],
    target,
    secure: false,
    logLevel: "debug",
  },
];

module.exports = PROXY_CONFIG;
