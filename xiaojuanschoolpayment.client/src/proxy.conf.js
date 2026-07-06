const { LogLevel } = require("@angular/compiler-cli");
const { env } = require("process");

const urls = env.ASPNETCORE_URLS?.split(";") ?? [];
const httpUrl = urls.find((url) => url.startsWith("http://"));

const target = httpUrl ?? "http://localhost:5023";

const PROXY_CONFIG = [
  {
    context: ["/weatherforecast", "/auth", "/school", "/Account", "/currency", "/contact-form", "/uploads"],
    target,
    secure: false,
    logLevel: "debug",
  },
];

module.exports = PROXY_CONFIG;
