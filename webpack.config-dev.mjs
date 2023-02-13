import { URL } from 'node:url';
import path from 'node:path';
import { merge } from 'webpack-merge';

import baseConfig from './webpack.config-base.mjs';

const __dirname = new URL('.', import.meta.url).pathname;

const devConfig = merge(baseConfig, {
    name: 'dev',
    mode: 'development',
    devtool: 'eval-cheap-module-source-map',
    output: {
        publicPath: '/modules/journal-search/',
    },
    module: {
        rules: [
            {
                test: /\.s[ac]ss$/i,
                exclude: /node_modules/,
                use: [
                    // Creates `style` nodes from JS strings
                    'style-loader',
                    // Translates CSS into CommonJS
                    'css-loader',
                    // Compiles Sass to CSS
                    'sass-loader',
                ],
            },
        ],
    },
    devServer: {
        hot: true,
        port: 30001,
        static: [
            {
                directory: path.resolve(__dirname, 'module/styles'),
                publicPath: '/modules/journal-search/styles/',
            },
            {
                directory: path.resolve(__dirname, 'module/assets'),
                publicPath: '/modules/journal-search/assets/',
            },
            {
                directory: path.resolve(__dirname, 'module/lang'),
                publicPath: '/modules/journal-search/lang/',
            },
        ],
        proxy: [
            {
                context: (pathname) =>
                    !(
                        pathname.match(/^\/sockjs/) ||
                        pathname.match(/^\/modules\/journal-search/) ||
                        pathname.match(/^\/ws/)
                    ),
                target: 'http://localhost:30000',
                changeOrigin: true,
                ws: true,
            },
        ],
    },
});

export default devConfig;
