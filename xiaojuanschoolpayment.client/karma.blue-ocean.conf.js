const baseConfig = require('./karma.conf');

module.exports = function (config) {
  baseConfig({
    set(options) {
      config.set({
        ...options,
        customLaunchers: {
          ChromeHeadlessNoGpu: {
            base: 'ChromeHeadless',
            flags: [
              '--no-sandbox',
              '--disable-gpu',
              '--disable-software-rasterizer',
              '--disable-dev-shm-usage',
              '--disable-features=Vulkan,WebGPU,UseSkiaRenderer',
            ],
          },
        },
      });
    },
  });
};
