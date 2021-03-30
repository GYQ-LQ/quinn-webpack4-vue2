/*
 * @Author: Quinn
 * @Date: 2020-12-01 17:17:51
 * @LastEditTime: 2021-03-24 16:32:13
 * @LastEditors: quinn
 * @Description:  开发、生产环境相关参数配置
 */
const path = require('path')

const IS_PROD = process.env.NODE_ENV === 'production'

module.exports = {
    // dev 构建开发配置
    dev: {
        assetsPublicPath: '/',
        cssSourceMap: false, // 是否开启 sourceMap
        devtool: 'eval', // https://webpack.docschina.org/configuration/devtool/
        // 开发环境 eval, eval-source-map, cheap-eval-source-map, cheap-module-eval-source-map, cheap-module-source-map
        assetsSubDirectory: 'static'
    },
    // build 构建生产配置
    build: {
        // 是否开启多进程构建
        multiProcess: false,
        productionSourceMap: true, // 是否开启 sourceMap
        devtool: '', // https://webpack.docschina.org/configuration/devtool/
        // 生产环境 source-map hidden-source-map nosources-source-map
        index: path.resolve(__dirname, '../dist/system.html'),
        assetsRoot: path.resolve(__dirname, '../dist'),
        assetsSubDirectory: 'static',
        assetsPublicPath: '../../',
        productionGzip: true,
        productionGzipExtensions: ['js', 'css'],
        bundleAnalyzerReport: process.env.npm_config_report
    },
    assetsPath: function (_path = '') {
        const assetsSubDirectory = IS_PROD ? this.build.assetsSubDirectory : this.dev.assetsSubDirectory
        return path.posix.join(assetsSubDirectory, _path)
    },
    resolve: function (dir = '') {
        return path.join(__dirname, '..', dir)
    }
}
