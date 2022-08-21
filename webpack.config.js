const path = require('path');
const { merge } = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const EslingPlugin = require('eslint-webpack-plugin');


const baseConfig = {
  entry: {
    index: path.resolve(__dirname, './src/index.ts'),
    'textbook': path.resolve(__dirname, './src/view/textbook/textbook.ts'),
    'audio-challenge': path.resolve(__dirname, './src/view/audio-challenge/audio-challenge.ts'),
    'registration': path.resolve(__dirname, './src/view/registration/registration.ts'),
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
     /* подключение fontawesome {
        test: /\.(svg|eot|woff|woff2|ttf)$/,
        type: 'asset/inline'
    },*/
    {
      test: /\.(svg|eot|woff|woff2|ttf)$/,
      type: 'asset/resource',
      generator: {
        //publicPath: '../fonts/',
        filename: 'compiled/fonts/[hash][ext][query]'
      }
   },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js','.css','.sass'],
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
      chunks: ['textbook']
    }),
    new HtmlWebpackPlugin({
      filename: 'audio-challenge.html',
      template: path.resolve(__dirname, './src/view/audio-challenge/audio-challenge.html'),
      chunks: ['audio-challenge']
    }),
    new HtmlWebpackPlugin({
      filename: 'registration.html',
      template: path.resolve(__dirname, './src/view/registration/registration.html'),
      chunks: ['registration']
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