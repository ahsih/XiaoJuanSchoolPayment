const path = require('node:path');
const fs = require('node:fs');
module.exports = config => {
  require('../xiaojuanschoolpayment.client/karma.conf.js')(config);
  const captureFactory = () => (req, res, next) => {
    const match = /^\/quote-comparison\/(courses-1|courses-3|courses-4|overview)\.png$/.exec(req.url);
    if (req.method !== 'POST' || !match) return next();
    const chunks = [];
    req.on('data', chunk => chunks.push(chunk));
    req.on('end', () => {
      fs.writeFileSync(path.join(__dirname, `cg-banilad-16weeks-${match[1]}.png`), Buffer.concat(chunks));
      res.end('saved');
    });
  };
  captureFactory.$inject = [];
  config.set({
    basePath: path.resolve(__dirname, '../xiaojuanschoolpayment.client'),
    plugins: [...config.plugins, { 'middleware:quoteComparison': ['factory', captureFactory] }],
    middleware: ['quoteComparison'],
    client: { jasmine: { random: false } },
    customLaunchers: { QuoteHeadless: { base: 'ChromeHeadless', flags: ['--no-sandbox', '--disable-gpu'] } },
  });
};
