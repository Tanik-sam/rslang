const path = require('path');
const { merge } = require('webpack-merge');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const EslingPlugin = require('eslint-webpack-plugin');

const baseConfig = {
    entry: {
        index: path.resolve(__dirname, './src/index.ts'),
        textbook: path.resolve(__dirname, './src/view/textbook/textbook.ts'),
        'audio-challenge': path.resolve(__dirname, './src/view/audio-challenge/audio-challenge.ts'),
        registration: path.resolve(__dirname, './src/view/registration/registration.ts'),
        login: path.resolve(__dirname, './src/view/login/login.ts'),
        sprint: path.resolve(__dirname, './src/view/sprint/sprint.ts'),
        about: path.resolve(__dirname, './src/view/about/about.ts'),
        statistics: path.resolve(__dirname, './src/view/statistics/statistics.ts'),
    },
    mode: 'development',
    module: {
        rules: [
            {
                test: /\.(scss|css)$/i,
                use: ['style-loader', 'css-loader', 'sass-loader'],
            },
            {
                test: /.ts$/i,
                use: 'ts-loader',
                //  exclude:'node_modules'
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: 'asset/resource',
            },
            {
                test: /\.(svg|eot|woff|woff2|ttf)$/,
                type: 'asset/resource',
                generator: {
                    // publicPath: '../fonts/',
                    filename: 'compiled/fonts/[hash][ext][query]',
                },
            },
        ],
    },
    resolve: {
        extensions: ['.ts', '.js', '.css', '.sass'],
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, './dist'),
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, './src/view/main/main.html'),
            filename: 'index.html',
        }),
        new HtmlWebpackPlugin({
            filename: 'textbook.html',
            template: path.resolve(__dirname, './src/view/textbook/textbook.html'),
            chunks: ['textbook'],
        }),
        new FaviconsWebpackPlugin({
            logo: path.resolve(__dirname, './src/assets/icons/favicon.png'),
            prefix: '',
            publicPath: '../favicons',
            outputPath: path.resolve(__dirname, 'dist/favicons'),
            inject: (htmlPlugin) => 
              path.basename(htmlPlugin.options.filename) === 'textbook.html',
        }),
        new HtmlWebpackPlugin({
            filename: 'audio-challenge.html',
            template: path.resolve(__dirname, './src/view/audio-challenge/audio-challenge.html'),
            chunks: ['audio-challenge'],
        }),
        new FaviconsWebpackPlugin({
            logo: path.resolve(__dirname, './src/assets/icons/favicon.png'),
            prefix: '',
            publicPath: '../favicons',
            outputPath: path.resolve(__dirname, 'dist/favicons'),
            inject: (htmlPlugin) => 
              path.basename(htmlPlugin.options.filename) === 'audio-challenge.html',
        }),
        new HtmlWebpackPlugin({
            filename: 'registration.html',
            template: path.resolve(__dirname, './src/view/registration/registration.html'),
            chunks: ['registration'],
        }),
        new FaviconsWebpackPlugin({
            logo: path.resolve(__dirname, './src/assets/icons/favicon.png'),
            prefix: '',
            publicPath: '../favicons',
            outputPath: path.resolve(__dirname, 'dist/favicons'),
            inject: (htmlPlugin) => 
              path.basename(htmlPlugin.options.filename) === 'registration.html',
        }),
        new HtmlWebpackPlugin({
            filename: 'login.html',
            template: path.resolve(__dirname, './src/view/login/login.html'),
            chunks: ['login'],
        }),
        new FaviconsWebpackPlugin({
            logo: path.resolve(__dirname, './src/assets/icons/favicon.png'),
            prefix: '',
            publicPath: '../favicons',
            outputPath: path.resolve(__dirname, 'dist/favicons'),
            inject: (htmlPlugin) => 
              path.basename(htmlPlugin.options.filename) === 'login.html',
        }),
        new HtmlWebpackPlugin({
            filename: 'sprint.html',
            template: path.resolve(__dirname, './src/view/sprint/sprint.html'),
            chunks: ['sprint'],
        }),
        new FaviconsWebpackPlugin({
            logo: path.resolve(__dirname, './src/assets/icons/favicon.png'),
            prefix: '',
            publicPath: '../favicons',
            outputPath: path.resolve(__dirname, 'dist/favicons'),
            inject: (htmlPlugin) => 
              path.basename(htmlPlugin.options.filename) === 'sprint.html',
        }),
        new HtmlWebpackPlugin({
            filename: 'about.html',
            template: path.resolve(__dirname, './src/view/about/about.html'),
            chunks: ['about'],
        }),
        new FaviconsWebpackPlugin({
            logo: path.resolve(__dirname, './src/assets/icons/favicon.png'),
            prefix: '',
            publicPath: '../favicons',
            outputPath: path.resolve(__dirname, 'dist/favicons'),
            inject: (htmlPlugin) => 
              path.basename(htmlPlugin.options.filename) === 'about.html',
        }),
        new HtmlWebpackPlugin({
          filename: 'statistics.html',
          template: path.resolve(__dirname, './src/view/statistics/statistics.html'),
          chunks: ['statistics'],
        }),
        new FaviconsWebpackPlugin({
            logo: path.resolve(__dirname, './src/assets/icons/favicon.png'),
            prefix: '',
            publicPath: '../favicons',
            outputPath: path.resolve(__dirname, 'dist/favicons'),
            inject: (htmlPlugin) => 
              path.basename(htmlPlugin.options.filename) === 'astatistics.html',
        }),
        new FaviconsWebpackPlugin({
            logo: path.resolve(__dirname, './src/assets/icons/favicon.png'),
            prefix: '',
            publicPath: '../favicons',
            outputPath: path.resolve(__dirname, 'dist/favicons'),
            inject: (htmlPlugin) => 
              path.basename(htmlPlugin.options.filename) === 'index.html',
          }),
        new CleanWebpackPlugin(),
        new EslingPlugin({ extensions: 'ts' }),
    ],
};
module.exports = ({ mode }) => {
    const isProductionMode = mode === 'prod';
    const envConfig = isProductionMode ? require('./webpack.prod.config') : require('./webpack.dev.config');
    return merge(baseConfig, envConfig);
};
