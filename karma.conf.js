/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
const webpackConfig = require('./webpack.config');
const path = require('path');

const ENV = process.env.npm_lifecycle_event;
const isTestWatch = ENV === 'test-watch';

module.exports = (config) => {
    const configuration = {
        browsers: ['ChromeLocal'],
        frameworks: ['jasmine'],
        reporters: ['mocha'],
        customLaunchers: {
            ChromeLocal: {
                base: 'ChromeHeadless',
                flags: ['--disable-translate', '--disable-extensions']
            },
            ChromeTravisCi: {
                base: 'Chrome',
                flags: ['--no-sandbox']
            }
        },
        files: [
            'test/index.ts'
        ],
        preprocessors: {
            'test/index.ts': ['webpack', 'sourcemap'],
        },
        mime: {
            'text/x-typescript': ['ts', 'tsx'],
        },
        webpack: webpackConfig('test'),
        webpackMiddleware: {
            noInfo: true
        },
    };

    if (!isTestWatch) {
        configuration.reporters.push('coverage');

        configuration.coverageReporter = {
            dir: path.join(__dirname, 'coverage'),
            reporters: [
                { type: 'text' },
                { type: 'text-summary' },
                { type: 'lcovonly' }
            ]
        };
    }

    if (config.travis) {
        configuration.browsers = ['ChromeTravisCi'];
    }

    config.set(configuration);
};
