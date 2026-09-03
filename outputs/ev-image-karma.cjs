const path = require('node:path');
const fs = require('node:fs');
module.exports = config => {
  require('../xiaojuanschoolpayment.client/karma.conf.js')(config);
  const captureFactory = () => (req, res, next) => {
    const match = /^\/ev-image-capture\/([1-9][0-9]?)\.png$/.exec(req.url);
    if (req.method !== 'POST' || !match) return next();
    const chunks = [];
    req.on('data', chunk => chunks.push(chunk));
    req.on('end', () => {
      const dir = path.join(__dirname, 'ev-quote-images');
      fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(path.join(dir, `${match[1]}.png`), Buffer.concat(chunks));
      res.end('saved');
    });
  };
  captureFactory.$inject = [];
  config.set({
    basePath: path.resolve(__dirname, '../xiaojuanschoolpayment.client'),
    plugins: [...config.plugins, { 'middleware:evImageCapture': ['factory', captureFactory] }],
    middleware: ['evImageCapture'],
    files: [{ pattern: path.join(__dirname, 'ev-image-capture.js'), included: true, watched: false }],
    client: { jasmine: { random: false } },
    customLaunchers: { EvHeadless: { base: 'ChromeHeadless', flags: ['--no-sandbox', '--disable-gpu'] } },
  });
};
