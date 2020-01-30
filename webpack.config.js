/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
const path = require('path');
const argv = require('minimist')(process.argv.slice(2));
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const packageJson = require('./package.json');

const TEST = 'test';
const DEV = 'development';
const PROD = 'production';
const VERSION = JSON.stringify(packageJson.version).replace(/"/g, '');

function getCommonConfig(mode, ext, target) {
    const folder = argv.folder || 'build';
    const fileExt = target === 'modern' ? 'mjs' : 'js';

    const configuration = {
        mode,
        entry: './src/bundle.ts',
        output: {
            path: path.resolve(__dirname, folder),
            filename: `[name].[contenthash].${VERSION}${ext}.${fileExt}`,
            library: 'HelloLib',
            libraryTarget: 'umd',
            umdNamedDefine: true
        },
        resolve: {
            extensions: ['.js', '.ts', '.json']
        },
        module: {
            rules: [
                {
                    test: /\.(js|ts)$/,
                    exclude: [/node_modules/],
                    use: {
                        loader: 'babel-loader',
                        options: {
                            envName: target
                        }
                    }
                }
            ]
        },
        plugins: [
            new CleanWebpackPlugin()
        ]
    };

    if (target === 'modern') {
        configuration.plugins = [
            // Create index.html automatically
            new HtmlWebpackPlugin({
                title: 'TypeScript starter'
            })
        ]
    }

    if (mode === DEV) {
        configuration.devtool = 'inline-source-map';
    }

    return configuration;
}

function getProdConfig(configuration) {
    return {
        ...configuration,
        optimization: {
            moduleIds: 'hashed',
            runtimeChunk: 'single',
            splitChunks: {
                chunks: 'all',
                maxInitialRequests: Infinity,
                minSize: 0,
                cacheGroups: {
                    // All third-party libraries appear as separate vendor modules
                    vendor: {
                        test: /[\\/]node_modules[\\/]/,
                        name(module) {
                            // Get the name, e.g., node_modules/packageName/part.js
                            // or node_modules/packageName
                            const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];

                            // npm package names are URL-safe, but some servers don't like @ symbols
                            return `${packageName.replace('@', '')}`;
                        }
                    }
                }
            }
        }
    };
}

function config(env) {
    const ext = (env === PROD) ? '.min' : '';

    const isTest = env === TEST;
    if (isTest) {
        env = DEV;
    }

    const mode = env || DEV;

    if (isTest) {
        return getCommonConfig(mode, ext, 'test');
    }

    let legacyConfig = getCommonConfig(mode, ext, 'legacy');
    let modernConfig = getCommonConfig(mode, ext, 'modern');

    if (mode === PROD) {
        legacyConfig = getProdConfig(legacyConfig);
        modernConfig = getProdConfig(modernConfig);
    }

    return [legacyConfig, modernConfig];
}

module.exports = env => config(env);
