import path from 'node:path';
import { URL } from 'node:url';

const __dirname = new URL('.', import.meta.url).pathname;

export default {
    entry: [
        './src/index.ts'
    ],
    output: {
        filename: 'module.js',
        path: path.join(__dirname, 'module/scripts'),
        publicPath: path.join(__dirname, 'module/'),
    },
    module: {
        rules: [
            {
                test: /.tsx?$/,
                exclude: /node_modules/,
                use: [{ loader: 'ts-loader', options: { transpileOnly: true } }],
            },
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.s[ac]ss$/i,
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
    resolve: {
        extensions: ['.tsx', '.ts', '.js', '.scss'],
    },
    devtool: false
};
