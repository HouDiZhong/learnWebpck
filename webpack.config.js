const path = require('path');
const webpack = require('webpack');
const TerserJSPlugin = require('terser-webpack-plugin'); // 压缩js
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin'); // 压缩css

const CleanWebpackPlugin = require('clean-webpack-plugin');  // 清除文件

const reolve = paths => path.resolve(process.cwd(),paths); // 配clean-webpack-plugin

module.exports = {
    // mode: '', // production || development 
    entry: ['@babel/polyfill','./src/index'],
    output: {
        filename: 'build.[hash:8].js',
        path: reolve('dist'),
        // publicPath: '/', 公共路径会加在css，js，img
    },
    module: {
        rules: [
            {
                /*
                    loader 的功能单一，
                    css-loader负责解析@import这种语法
                    style-loader 负责将解析好的css 插入head标签中
                    loader 的执行顺序
                    从右向左，从下到上
                */
                test: /\.css$/,
                /*
                    单个使用字符串'style-loader',
                    多个使用数组['style-loader','css-loader']
                */
                use: [
                    // 作用是将css抽离成单独的css文件并引入html
                    MiniCssExtractPlugin.loader,
                    /* {
                        loader: 'style-loader',
                        options: {
                            insertAt: 'top' // 插入的位置 
                        }
                    }, */
                    'postcss-loader',
                    'css-loader'
                ]
            },
            {
                test: /\.less$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'postcss-loader',
                    'less-loader'
                ]
            },
            {
                test: /\.(png|jpg|gif)$/,
                use: {
                    loader: 'url-loader',
                    options: {
                        limit: 1,
                        outputpath: 'img/'
                    }
                }
            },
            {
                test: /\.js$/,
                use: [
                    {
                        loader: 'babel-loader'
                    }
                ],
                include: reolve('src'),
                exclude: /node_modules/
            }
            /* {
                test: /\.js$/,
                use: [
                    {
                        loader: 'eslint-loader',
                        options: {
                            // 执行顺序
                            enforce: 'pre', post(之后) || pre(之前)
                        }
                    }
                ],
                
                include: reolve('src'),
                exclude: /node_modules/
            } */
        ]
    },
    /* wacth: true,
    wacthOptions: {
        poll: 1000, // 每秒问我多少次
        aggregateTimeout: 500, // 防抖
        ignored: /node_modules/
    }, */
    plugins: [
        new HtmlWebpackPlugin({
            template: './index.html',
            filename: 'index.html',
            // hash: true 这个是在js文件后面加 ?1323434
            minify: {
                removeAttributeQuotes: true,
                collapseWhitespace: true
            }
        }),
        new MiniCssExtractPlugin({
            filename: 'css/main.css'
        }),
        /* new webpack.ProvidePlugin({ // 在每个模块中都注入jquery
            $: 'jquery'
        }) */
        new CleanWebpackPlugin(),
        new webpack.BannerPlugin('by zx 2019/5/1'),
        /* new webpack.DefinePlugin({
            
        }) */
        /* new webpack.DllReferencePlugin({ //动态链接库
            manifest: reolve('dist','manifest.json')
        }) */
        new webpack.NamedModulesPlugin(), // 打印更新模块路径
        new webpack.HotModuleReplacementPlugin() // 热更新插件
    ],
    optimization: { // 模式为生产模式才会启动 production
        minimizer: [ // 压缩文件
            new TerserJSPlugin({}), 
            new OptimizeCSSAssetsPlugin({})
        ],
        splitChunks: { // 分割代码块
            cacheGroups: {
                common: { // 公共模块
                    chunks: 'initial',
                    minSize: 0, //最小多少开始抽离
                    minChunks: 2 // 最小使用两次
                },
                vendor: {
                    priority: 1, // 权重
                    test: /node_modules/, // 第三方插件抽离
                    chunks: 'initial',
                    minSize: 0, //最小多少开始抽离
                    minChunks: 2 // 最小使用两次
                }
            }
        }
    },
    resolve: {
        modules: [reolve('node_modules')], // 查找第三方包在哪查找
        extensions: ['.js','.css','.json'], // 省略后缀
        alias: { // 别名
            '@css' : reolve('css')
        }
    },
    devServer:{
        port: 3000,
        hot: true, // 配合webpack plugin
        progress: true, // 进度条
        contentBase: './zx',
        compress: true, // 压缩 
        /* 代理
        proxy: {
            '/api': 'http://localhost:3000',
        } 
        proxy: {
            '/api': {
                target: 'http://localhost:3000',
                pathRewrite: {'/api': ''}
            }
        } 
        */
    },
    /* externals: { // 忽略打包文件，适用于页面cdn引入
        jquery: 'jQuery'  
    } */
    noParse: /jquery/ // 不去解析依赖关系。
}