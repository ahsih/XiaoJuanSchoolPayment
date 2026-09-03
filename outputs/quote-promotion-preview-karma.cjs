const path = require('node:path');
const fs = require('node:fs');
module.exports = config => {
  require('../xiaojuanschoolpayment.client/karma.conf.js')(config);
  const factory = () => (req, res, next) => {
    if (req.method !== 'POST' || req.url !== '/promotion-preview.png') return next();
    const chunks = [];
    req.on('data', chunk => chunks.push(chunk));
    req.on('end', () => {
      fs.writeFileSync(path.join(__dirname, 'cpils-8weeks-aligned-preview.png'), Buffer.concat(chunks));
      res.end('saved');
    });
  };
  factory.$inject = [];
  config.set({
    basePath: path.resolve(__dirname, '../xiaojuanschoolpayment.client'),
    plugins: [...config.plugins, { 'middleware:promotionPreview': ['factory', factory] }],
    middleware: ['promotionPreview'],
    client: { args: ['capture-promotion-preview'] },
    customLaunchers: { QuoteHeadless: { base: 'ChromeHeadless', flags: ['--no-sandbox', '--disable-gpu'] } },
  });
};
