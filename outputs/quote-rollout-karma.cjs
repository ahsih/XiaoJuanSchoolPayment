const path = require('node:path');
const fs = require('node:fs');
module.exports = config => {
  require('../xiaojuanschoolpayment.client/karma.conf.js')(config);
  const factory = () => (req, res, next) => {
    const match = /^\/quote-rollout\/(cia|cg-banilad|smeag-capital|cpi|cpils)-(1|3|4|1c-3r|3c-1r)\.png$/.exec(req.url);
    if (req.method !== 'POST' || !match) return next();
    const chunks = [];
    req.on('data', chunk => chunks.push(chunk));
    req.on('end', () => {
      fs.writeFileSync(path.join(__dirname, `quote-approved-aligned-${match[1]}-${match[2]}.png`), Buffer.concat(chunks));
      res.end('saved');
    });
  };
  factory.$inject = [];
  config.set({
    basePath: path.resolve(__dirname, '../xiaojuanschoolpayment.client'),
    plugins: [...config.plugins, { 'middleware:quoteRollout': ['factory', factory] }],
    middleware: ['quoteRollout'],
    client: { args: ['capture-rollout'], jasmine: { random: false } },
    customLaunchers: { QuoteHeadless: { base: 'ChromeHeadless', flags: ['--no-sandbox', '--disable-gpu'] } },
  });
};
