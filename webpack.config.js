const webpack = require('webpack')
const path = require('path')
const mode = process.env.NODE_ENV || 'development'
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin')

const config = {
  bail: true,
  mode,
  devtool: 'none',
  performance: {
    maxAssetSize: 550000,
    maxEntrypointSize: 550000
  },
  target: 'web',
  entry: './index.ts',
  stats: 'errors-only',
  cache: true,
  resolve: {
    extensions: ['.ts', '.js'],
    plugins: [],
    modules: ['../../node_modules']
  },
  externals: ['bindings'],
  plugins: [
    new webpack.ContextReplacementPlugin(/bindings$/, /^$/),
    new HardSourceWebpackPlugin({
      info: {
        level: 'error'
      },
      configHash: function(webpackConfig) {
        // node-object-hash on npm can be used to build this.
        return require('node-object-hash')({ sort: false }).hash(webpackConfig)
      }
    })
  ],
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: 'awesome-typescript-loader',
        exclude: [/node_modules/, /build/, /popup/],
        query: {
          declaration: false,
          configFileName: path.resolve(__dirname, 'tsconfig.json'),
          useCache: true
        }
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            plugins: ['@babel/plugin-transform-runtime']
          }
        }
      }
    ]
  }
}

module.exports = config
