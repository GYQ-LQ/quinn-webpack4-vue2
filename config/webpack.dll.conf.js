/*
 * @Author: Quinn
 * @Date: 2020-12-02 15:09:26
 * @LastEditTime: 2021-04-16 10:41:40
 * @LastEditors: quinn
 * @Description:
 */
const path = require('path');
const webpack = require('webpack');
const TerserWebpackPlugin = require('terser-webpack-plugin')

module.exports = {
    mode: 'production',
    entry: {
        // 需要打包的第三方类库
        vendor: [
            'axios',
            'element-ui',
            'vue',
            'vue-router',
            'vuex',
        ]
    },
    // 打包到 /static/js/vendor.dll.js
    // vendor.dll.js就是一个动态连接库
    output: {
        filename: '[name].dll.js',
        path: path.join(__dirname, '../static/js'),
        library: '[name]_library'
    },
    // vendor-manifest.json 是描述文件（映射文件）
    // 打包时通过映射文件到动态连接库里使用已经打包好了的第三方类库
    plugins: [
        new webpack.DllPlugin({
            name: '[name]_library',
            path: path.join(__dirname, '.', '[name]-manifest.json'),
        }),
    ],
    optimization: {
        minimizer: [
            new TerserWebpackPlugin({
                parallel: false, // 使用多进程提高构建速度
                extractComments: false, // 禁止生成license文件
                cache: true,
                terserOptions: {
                    warnings: false,
                    compress: { // 删除console.log代码
                        drop_console: true,
                        pure_funcs: ['console.log']
                    },
                    output: {
                        comments: false // 删除注释代码
                    }
                }
            }),
        ],
    },
    performance: {
        hints: false
    }
};