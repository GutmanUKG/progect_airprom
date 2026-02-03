const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

const isDev = process.env.NODE_ENV === 'development';
const isProd = !isDev;

module.exports = {
  mode: isDev ? 'development' : 'production',
  entry: './src/js/main.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'js/[name].min.js',
    clean: true,
    assetModuleFilename: 'assets/[name][ext]'
  },
  devServer: {
    static: [
      { directory: path.join(__dirname, 'dist') },
      { directory: path.join(__dirname, 'src/img'), publicPath: '/img' },
      { directory: path.join(__dirname, 'src/fonts'), publicPath: '/fonts' }
    ],
    hot: true,
    open: true,
    port: 3000,
    watchFiles: ['src/**/*', '*.html']
  },
  devtool: isDev ? 'source-map' : false,
  module: {
    rules: [
      // SCSS/CSS
      {
        test: /\.(scss|css)$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: ['autoprefixer']
              }
            }
          },
          {
            loader: 'sass-loader',
            options: {
              sassOptions: {
                silenceDeprecations: ['legacy-js-api', 'import', 'global-builtin', 'color-functions', 'if-function']
              }
            }
          }
        ]
      },
      // Изображения
      {
        test: /\.(png|jpg|jpeg|gif|webp)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'img/[name][ext]'
        }
      },
      // Шрифты
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'fonts/[name][ext]'
        }
      },
      // SVG как файлы
      {
        test: /\.svg$/i,
        type: 'asset/resource',
        generator: {
          filename: 'img/[name][ext]'
        }
      }
    ]
  },
  plugins: [
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery'
    }),
    new HtmlWebpackPlugin({
      template: './index.html',
      filename: 'index.html',
      minify: isProd
    }),
    new MiniCssExtractPlugin({
      filename: 'css/[name].min.css'
    }),
    new CopyPlugin({
      patterns: [
        {
          from: 'src/img',
          to: 'img',
          noErrorOnMissing: true
        },
        {
          from: 'src/fonts',
          to: 'fonts',
          noErrorOnMissing: true
        }
      ]
    })
  ],
  optimization: {
    minimizer: [
      new TerserPlugin(),
      new CssMinimizerPlugin()
    ],
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendor',
          chunks: 'all'
        }
      }
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  }
};
