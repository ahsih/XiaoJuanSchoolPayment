const path = require('node:path');
const fs = require('node:fs');
module.exports = config => {
  require('../xiaojuanschoolpayment.client/karma.conf.js')(config);
  const captureFactory = () => (req, res, next) => {
    if (req.method !== 'POST' || req.url !== '/quote-layout-capture/cg-banilad-8weeks.png') return next();
    const chunks = [];
    req.on('data', chunk => chunks.push(chunk));
    req.on('end', () => {
      fs.writeFileSync(path.join(__dirname, 'cg-banilad-8weeks-layout-preview.png'), Buffer.concat(chunks));
      res.end('saved');
    });
  };
  captureFactory.$inject = [];
  config.set({
    basePath: path.resolve(__dirname, '../xiaojuanschoolpayment.client'),
    plugins: [...config.plugins, { 'middleware:quoteLayoutCapture': ['factory', captureFactory] }],
    middleware: ['quoteLayoutCapture'],
    files: [{ pattern: path.join(__dirname, 'quote-layout-capture.js'), included: true, watched: false }],
    client: { jasmine: { random: false } },
    customLaunchers: { QuoteHeadless: { base: 'ChromeHeadless', flags: ['--no-sandbox', '--disable-gpu'] } },
  });
};
