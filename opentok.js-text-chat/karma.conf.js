module.exports = function(config) {
    var configuration = {
        basePath: '',
        frameworks: ['mocha'],
        files: [
          'https://static.opentok.com/v2/js/opentok.min.js',
          'https://code.jquery.com/jquery-1.10.2.js',
          'https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.8.3/underscore-min.js'
        ],
        exclude: [
        ],
        preprocessors: {
            'test/*.html': ['html2js'],
            'src/*.js': ['coverage']
        },
        reporters: ['progress', 'coverage'],
        port: 9877,
        colors: true,
        autoWatch: true,
        browsers: [],
        browserNoActivityTimeout: 20000,
        singleRun: true,
        logLevel: config.LOG_INFO,
        coverageReporter: {
            dir: 'test/coverage',
            instrumenter: {
                'src/*.js': ['istanbul']
            },
            reporters: [
                { type: 'html', subdir: 'report-html' },
                { type: 'lcov', subdir: 'report-lcov' },
                { type: 'lcovonly', subdir: '.', file: 'report-lcovonly.txt' }
            ]
        },
        customLaunchers: {
            Chrome_travis_ci: {
              base: 'Chrome',
              flags: ['--no-sandbox']
            }
        }
    };

    if (process.env.TRAVIS) {
      configuration.browsers = ['Chrome_travis_ci'];
    }
    config.set(configuration);
};
