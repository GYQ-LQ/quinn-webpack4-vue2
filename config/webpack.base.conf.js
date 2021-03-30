const path = require('path')
const webpack = require('webpack')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin');
const utils = require('./utils');
const IS_PROD = process.env.NODE_ENV === 'production'
// const cssTest = /\.css$/
const styTest = /\.styl(us)?$/
const cssTest = /\.(sa|c)ss$/
const lessTest = /\.less$/
const scssTest = /\.scss$/
const cssModuleTest = /\.module\.css$/
const lessModuleTest = /\.module\.less$/
// const baseCssUse = [
//   MiniCssExtractPlugin.loader,
//   'css-loader',
//   'postcss-loader'
// ]
const styly_loader = IS_PROD ? {
    loader: MiniCssExtractPlugin.loader,
    options: {
        // locals 报错解决
        esModule: false,
        publicPath: utils.build.assetsPublicPath
    }
} : 'style-loader'
const css_loader = {
    loader: 'css-loader',
    options: {
        modules: {
            localIdentName: "[name]_[local]__[hash:5]"
        }
    },
}
const baseCssUse = ['vue-style-loader', styly_loader, 'css-loader', 'postcss-loader']
const baseCssModuleUse = ['vue-style-loader', styly_loader, css_loader, 'postcss-loader']
// 多进程
const multiProLoader = utils.build.multiProcess ? [{
    loader: 'thread-loader',
    options: {
        workers: 3,
    },
}] : []

// 获取当前时间戳
const TIME_STAMP = new Date().getTime()

module.exports = {
    entry: {
        app: ['./src/main.js']
    },
    output: {
        path: utils.build.assetsRoot,
        filename: '[name].js',
        publicPath: IS_PROD ? utils.build.assetsPublicPath : utils.dev.assetsPublicPath
    },
    resolve: {
        extensions: ['.js', '.vue', '.json'],
        symlinks: false,
        alias: {
            vue$: 'vue/dist/vue.esm.js',
            '@': utils.resolve('src'),
            static: utils.resolve('static')
        }
    },
    plugins: [
        new webpack.DllReferencePlugin({
            context: path.resolve(__dirname, '..'),
            manifest: path.resolve(__dirname, ".", "vendor-manifest.json")
        }),
        new VueLoaderPlugin(),
        new AddAssetHtmlPlugin([{
            filepath: utils.resolve('static/js/vendor.dll.js'),
            outputPath: utils.assetsPath('js'),
            publicPath: path.posix.join('./', 'static/js'),
            includeSourcemap: false,
            hash: true,
        }]),
        new CopyWebpackPlugin({
            patterns: [{
                    from: utils.resolve('edu.sellermotor.com'),
                    to: './',
                },
                {
                    from: utils.resolve('edu.sellermotor.en.com'),
                    to: './en',
                },
            ]
        }),
        new MiniCssExtractPlugin({
            filename: utils.assetsPath('css/[name].[contenthash:6].css'),
            chunkFilename: utils.assetsPath('css/[name].[contenthash:6].css'),
            ignoreOrder: true
        }),
    ],
    module: {
        rules: [
            // 加载 vue
            {
                test: /\.vue$/,
                loader: 'vue-loader',
            },
            {
                test: /\.(js|jsx)?$/,
                exclude: /node_modules/,
                include: [utils.resolve('src'), utils.resolve('test')],
                use: [{
                        loader: 'babel-loader',
                        options: {
                            cacheDirectory: true
                        },
                    },
                    ...multiProLoader
                ]
            },
            {
                test: cssTest,
                exclude: cssModuleTest,
                use: [...baseCssUse, 'sass-loader']
            },
            {
                test: scssTest,
                use: [...baseCssUse, 'sass-loader',
                    {
                        loader: 'sass-resources-loader',
                        options: {
                            sourceMap: true,
                            resources: [utils.resolve('src/assets/style/theme.scss')]
                        },
                    },
                ],
            },
            {
                test: lessTest,
                exclude: lessModuleTest,
                use: [...baseCssUse, 'less-loader']
            },
            {
                test: styTest,
                use: [...baseCssUse, 'stylus-loader'],
            },
            {
                test: cssModuleTest,
                use: baseCssModuleUse
            },
            {
                test: lessModuleTest,
                use: [...baseCssModuleUse, 'less-loader']
            },
            {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/i,
                loader: 'url-loader',
                options: {
                    esModule: false,
                    limit: 8 * 1024,
                    name: utils.assetsPath('img/[name].[hash:7].[ext]')
                }
            },
            {
                test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    esModule: false,
                    limit: 8 * 1024,
                    name: utils.assetsPath('media/[name].[hash:7].[ext]')
                }
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    esModule: false,
                    limit: 8 * 1024,
                    name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
                }
            }
        ]
    },
    performance: {
        hints: false
    }
}
