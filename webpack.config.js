/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
const path = require('path');
const argv = require('minimist')(process.argv.slice(2));

const packageJson = require('./package.json');

const VERSION = JSON.stringify(packageJson.version).replace(/"/g, '');

function config(env) {
    const folder = argv.folder || 'build';
    const ext = (env === 'production') ? '.min' : '';
    const filename = `engine.${VERSION}.[contentHash]${ext}.js`;

    const isTest = env === 'test';
    if (env === 'test') {
        env = 'development';
    }

    const mode = env || 'development';

    const configuration = {
        mode,
        entry: './src/bundle.ts',
        output: {
            path: path.resolve(__dirname, folder),
            filename,
            library: 'HelloLib',
            libraryTarget: 'umd',
            umdNamedDefine: true
        },
        resolve: {
            extensions: ['.js', '.ts', '.json']
        },
        optimization: {
            splitChunks: {
                cacheGroups: {
                    commons: {
                        test: /[\\/]node_modules[\\/]/,
                        name: 'vendors',
                        chunks: 'all'
                    }
                }
            }
        },
        module: {
            rules: [
                {
                    test: /\.ts$/,
                    use: 'ts-loader'
                }
            ]
        }
    };

    if (mode === 'development') {
        configuration.devtool = 'inline-source-map';
    }

    if (isTest) {
        configuration.module.rules.push(
            {
                test: /\.ts$/,
                exclude: [path.resolve(__dirname, 'test')],
                enforce: 'post',
                use: {
                    loader: 'istanbul-instrumenter-loader',
                    options: { esModules: true }
                }
            }
        );
    }

    return configuration;
}

module.exports = env => config(env);
