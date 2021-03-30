/*
 * @Author: Quinn
 * @Date: 2020-12-08 16:24:42
 * @LastEditTime: 2021-03-25 09:34:23
 * @LastEditors: quinn
 * @Description: 热模块替换 - 页面局部更新 推荐
 */
const express = require('express');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const ora = require('ora')
const opn = require('opn');

const app = express();
const devWebpackConfig = require('./webpack.dev.conf.js'); // 引入配置文件
devWebpackConfig.entry.app.push('webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000&noInfo=false&quiet=true')


const compiler = webpack(devWebpackConfig); // 初始化编译器

// Starting the application server...
const spinner = ora('Loading...')
spinner.start()

const HOST = "localhost"
// const HOST = "0.0.0.0"
const PORT = "8000"

const devMidWare = webpackDevMiddleware(compiler, {
    publicPath: devWebpackConfig.output.publicPath
})
// 使用webpack-dev-middleware中间件
app.use(devMidWare);
// 开启完毕
devMidWare.waitUntilValid(() => {
    spinner.stop()
    // 浏览器自动打开
    // opn(`http://${HOST}:${PORT}`)
    opn(`http://${HOST}:${PORT}/system.html`)
    console.log('Your application is running at here: http://%s:%s', HOST, PORT);
});
const hotMidWare = webpackHotMiddleware(compiler, {
    log: console.log,
    path: '/__webpack_hmr',
    heartbeat: 10 * 1000
})
// 使用webpack-hot-middleware中间件，配置在console台输出日志
app.use(hotMidWare);

// 使用静态资源目录，才能访问到/dist/idndex.html
app.use(express.static(devWebpackConfig.output.path))

app.listen(PORT, HOST);
