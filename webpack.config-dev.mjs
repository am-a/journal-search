import { URL } from 'node:url';
import path from 'node:path';
import { merge } from 'webpack-merge';

import baseConfig from './webpack.config-base.mjs';

const __dirname = new URL('.', import.meta.url).pathname;

const devConfig = merge(baseConfig, {
    name: 'dev',
    mode: 'development',
    devtool: 'eval-source-map',
    devServer: {
        hot: true,
        client: false,
        devMiddleware: {
            writeToDisk: false,
        },
        port: 30001,
        static: {
            directory: path.resolve(__dirname, 'module/scripts'),
        },
        proxy: [
            {
                changeOrigin: true,
                context: (pathname) => !pathname.match('^/sockjs'),
                target: 'http://localhost:30000',
                ws: true,
            },
        ],
    },
});

export default devConfig;
