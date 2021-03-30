/*
 * @Author: Quinn
 * @Date: 2021-01-15 14:03:18
 * @LastEditTime: 2021-03-25 09:38:08
 * @LastEditors: quinn
 * @Description:
 */
const merge = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base.conf')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const utils = require('./utils');
module.exports = merge(baseWebpackConfig, {
    mode: 'development',
    devtool: utils.dev.devtool,
    output: {
        filename: 'js/[name].js',
        chunkFilename: 'js/[name].js',
    },
    stats: 'errors-only',
    plugins: [
        new webpack.DefinePlugin({
            'process.env': require('./env/dev.env')
        }),
        new webpack.HotModuleReplacementPlugin(),
        new HtmlWebpackPlugin({
            filename: utils.build.index,
            template: 'index.html',
            inject: true,
            favicon: 'favicon.ico',
        }),
    ]
})
