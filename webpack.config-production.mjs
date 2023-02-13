import CopyPlugin from 'copy-webpack-plugin';
import Handlebars from 'handlebars';
import path from 'node:path';
import { merge } from 'webpack-merge';

import packageJSON from './package.json' assert { type: 'json' };
import baseConfig from './webpack.config-base.mjs';

const __dirname = new URL('.', import.meta.url).pathname;

const prodConfig = merge(baseConfig, {
    name: 'prod',
    mode: 'production',
    devtool: false,
    module: {
        rules: [
            {
                test: /\.scss$/,
                exclude: /node_modules/,
                type: 'asset/resource',
                generator: {
                    filename: 'styles/module.css',
                },
                use: [
                    {
                        loader: 'sass-loader',
                        // don't compress the output
                        options: {
                            sassOptions: {
                                outputStyle: 'expanded',
                            },
                        },
                    },
                ],
            },
        ],
    },
    plugins: [
        new CopyPlugin({
            patterns: [
                {
                    from: path.join(__dirname, './src/module.json.hbs'),
                    to: path.join(__dirname, './module/module.json'),
                    transform(content) {
                        const contentString = content.toString('utf8');
                        const template = Handlebars.compile(contentString);
                        const output = template({
                            release_version: packageJSON.version,
                        });
                        return Buffer.from(output, 'utf-8');
                    },
                },
            ],
        }),
    ],
});

export default prodConfig;
