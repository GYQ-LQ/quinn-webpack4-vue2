/*
 * @Author: Quinn
 * @Date: 2020-12-03 18:13:40
 * @LastEditTime: 2021-03-26 16:14:28
 * @LastEditTime: 2021-03-23 17:56:37
 * @LastEditors: quinn
 * @Description:
 */
const webpack = require('webpack')
const merge = require('webpack-merge')
const TerserWebpackPlugin = require('terser-webpack-plugin')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const SpeedMeasurePlugin = require('speed-measure-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CompressionWebpackPlugin = require('compression-webpack-plugin');
const {
    CleanWebpackPlugin
} = require('clean-webpack-plugin')
// 打包速度分析
const smp = new SpeedMeasurePlugin();
// 打包体积分析
const {
    BundleAnalyzerPlugin
} = require('webpack-bundle-analyzer');
const utils = require('./utils');
const common = require('./webpack.base.conf')
// 获取当前时间戳
const TIME_STAMP = new Date().getTime()
const env = require('./env/' + process.env.env_config + '.env')

const prodWebpackConf = merge(common, {
    mode: 'production',
    output: {
        path: utils.build.assetsRoot,
        filename: utils.assetsPath('js/[name].[chunkhash:6].js'),
        chunkFilename: utils.assetsPath('js/[id].[chunkhash:6].js'),
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': env
        }),
        // 打包体积分析，本地打包分析时使用
        // new BundleAnalyzerPlugin(),
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            filename: utils.build.index,
            template: 'index.html',
            inject: true,
            favicon: 'favicon.ico',
            minify: {
                collapseWhitespace: true,
                removeComments: true,
                removeRedundantAttributes: true,
                removeScriptTypeAttributes: true,
                removeStyleLinkTypeAttributes: true,
                useShortDoctype: true
            },
        }),
        new OptimizeCssAssetsPlugin({
            assetNameRegExp: /\.optimize\.css$/g,
            cssProcessor: require('cssnano'),
            cssProcessorPluginOptions: {
                preset: ['default', {
                    discardComments: {
                        removeAll: true
                    }
                }],
            },
            canPrint: true
        }),
        new CopyWebpackPlugin({
            patterns: [{
                from: utils.resolve('static'),
                to: utils.build.assetsSubDirectory,
                globOptions: {
                    ignore: ['.*']
                }
            }],
        }),
        // Gzip压缩
        new CompressionWebpackPlugin({
            algorithm: 'gzip', //算法
            test: new RegExp('\\.(js|css|svg)$'),
            threshold: 10 * 1024, //超过多少字节进行压缩
            minRatio: 0.8 //至少压缩到原来体积的0.8,才会进行压缩
        }),
    ],
    optimization: {
        minimize: true,
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
        splitChunks: {
            chunks: 'all',
            // maxAsyncRequests: 8,
            // maxInitialRequests: 6,
            // minSize: 10000,
            // cacheGroups: {
            //     react: {
            //         name: 'chunk-vue',
            //         test: /[\\/]node_modules[\\/](vue)[\\/]/,
            //         priority: 20
            //     },
            //     vendors: {
            //         name: 'chunk-vendors',
            //         test: /[\\/]node_modules[\\/]/,
            //         priority: -10,
            //         chunks: 'initial'
            //     },
            //     common: {
            //         name: 'chunk-common',
            //         minChunks: 2,
            //         priority: -20,
            //         chunks: 'initial',
            //         reuseExistingChunk: true
            //     }
            // }
        }
    },
})

// 打包时间速度分析，本地打包分析时使用
// module.exports = smp.wrap(prodWebpackConf)

module.exports = prodWebpackConf
