module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('@angular-devkit/build-angular/plugins/karma'),
    ],
    reporters: ['progress'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    browsers: ['ChromeHeadlessSafe'],
    customLaunchers: {
      ChromeHeadlessSafe: {
        base: 'ChromeHeadless',
        flags: ['--no-sandbox', '--disable-gpu', '--disable-software-rasterizer', '--disable-dev-shm-usage', '--password-store=basic'],
      },
    },
    singleRun: true,
    restartOnFileChange: false,
    listenAddress: 'localhost',
    hostname: 'localhost',
  });
};
