import path from 'node:path';
import { URL } from 'node:url';

const __dirname = new URL('.', import.meta.url).pathname;

export default {
    entry: ['./src/index.ts'],
    output: {
        filename: 'scripts/module.js',
        path: path.join(__dirname, 'module/'),
    },
    module: {
        rules: [
            {
                test: /.tsx?$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'ts-loader',
                        options: {
                            transpileOnly: true,
                        },
                    },
                ],
            },
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js', '.scss'],
        conditionNames: ['es2015', 'import'],
        mainFields: ['es2015', 'module', 'main'],
    },
    devtool: false,
};
