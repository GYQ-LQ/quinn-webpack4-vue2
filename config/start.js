/*
 * @Author: Quinn
 * @Date: 2020-12-07 13:46:21
 * @LastEditTime: 2020-12-08 18:55:24
 * @LastEditors: quinn
 * @Description: 热模块替换 - 整个页面刷新 不推荐
 */
const portfinder = require('portfinder')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const devConfig = require('./webpack.dev.conf')
const merge = require('webpack-merge')

const config = require('./config')

const HOST = 'localhost';
const PORT = 8000;

const devWebpackConfig = merge(devConfig, {
    devServer: {
        contentBase: './dist',
        historyApiFallback: true,
        overlay: false,
        host: HOST,
        port: PORT,
        open: true,
        compress: true,
        // hot: true,
        inline: true,
        stats: "errors-only",
        watchOptions: {
            poll: false
        },
        proxy: {
            [config.ROOT]: {
                target: config.PROXYROOT,
                secure: false,
                changeOrigin: true
            }
        }
    },
})
module.exports = new Promise((resolve, reject) => {
    portfinder.basePort = process.env.PORT || devWebpackConfig.devServer.port
    portfinder.getPort((err, port) => {
        if (err) {
            reject(err)
        } else {
            process.env.PORT = port
            devWebpackConfig.devServer.port = port

            devWebpackConfig.plugins.push(
                new FriendlyErrorsPlugin({
                    compilationSuccessInfo: {
                        messages: [
                            `Your application is running here: http://${devWebpackConfig.devServer.host}:${port}`
                        ]
                    },
                    onErrors: undefined
                })
            )
            resolve(devWebpackConfig)
        }
    })
})
