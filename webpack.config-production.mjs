import { merge } from 'webpack-merge';

import baseConfig from './webpack.config-base.mjs';

const prodConfig = merge(baseConfig, {
    name: 'prod',
    mode: 'production',
    devtool: false
});

export default prodConfig;
