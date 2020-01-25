module.exports = {
    env: {
        // This is the config we'll use to generate bundles for legacy browsers.
        legacy: {
            presets: [
                '@babel/preset-env',
                '@babel/preset-typescript'
            ],
            plugins: [
                '@babel/proposal-class-properties',
                '@babel/proposal-object-rest-spread'
            ]
        },

        // This is the config we'll use to generate bundles for modern browsers.
        modern: {
            presets: [
                [
                    '@babel/preset-env', {
                        modules: false,
                        targets: {
                            // This will target browsers which support ES modules.
                            esmodules: true
                        }
                    }
                ],
                ['@babel/preset-typescript']
            ],
            plugins: [
                '@babel/plugin-transform-runtime',
                '@babel/plugin-syntax-dynamic-import',
                '@babel/proposal-class-properties',
                '@babel/proposal-object-rest-spread'
            ]
        },

        // Test settings
        test: {
            presets: [
                '@babel/preset-env',
                '@babel/preset-typescript'
            ],
            plugins: [
                'istanbul'
            ]
        }
    }
};
