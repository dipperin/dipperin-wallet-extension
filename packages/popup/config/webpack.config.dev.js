const webpack = require('webpack')
const merge = require('webpack-merge')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin')
const base = require('./webpack.config.base')
const paths = require('./paths')

const publicUrl = ''

const getClientEnvironment = require('./env')
const globalEnv = getClientEnvironment(publicUrl)

module.exports = merge.smart(base('development'), {
  devtool: 'none',
  module: {
    rules: [
      {
        oneOf: [
          {
            test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/, /\.woff$/, /\.woff2$/],
            loader: require.resolve('url-loader'),
            options: {
              limit: 10000,
              name: 'static/media/[name].[hash:8].[ext]'
            }
          },
          {
            test: /\.(js|jsx|mjs)$/,
            include: paths.appSrc,
            loader: require.resolve('babel-loader'),
            options: {
              compact: true
            }
          },
          {
            test: /\.(ts|tsx)$/,
            // include: paths.appSrc,
            use: [
              {
                loader: require.resolve('awesome-typescript-loader'),
                options: {
                  declaration: false,
                  useCache: true,
                  forceIsolatedModules: true
                }
              }
            ]
          },
          {
            test: /\.css$/,
            use: [
              require.resolve('style-loader'),
              {
                loader: require.resolve('css-loader'),
                options: {
                  importLoaders: 1
                }
              },
              {
                loader: require.resolve('postcss-loader'),
                options: {
                  ident: 'postcss',
                  plugins: () => [
                    require('postcss-flexbugs-fixes'),
                    require('postcss-nested'),
                    require('cssnano')({
                      preset: 'advanced',
                      autoprefixer: true,
                      'postcss-zindex': false
                    })
                  ]
                }
              }
            ]
          },
          {
            exclude: [/\.(ts|tsx)$/, /\.(js|jsx|mjs)$/, /\.html$/, /\.json$/],
            loader: require.resolve('file-loader'),
            options: {
              name: 'static/media/[name].[hash:8].[ext]'
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      inject: true,
      template: paths.appHtml
    }),
    new HardSourceWebpackPlugin({
      info: {
        level: 'error'
      }
    }),
    new webpack.DefinePlugin(globalEnv.stringified),
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    new ForkTsCheckerWebpackPlugin({
      async: false,
      watch: paths.appSrc,
      tsconfig: paths.appTsConfig,
      tslint: paths.appTsLint
    })
  ]
})
