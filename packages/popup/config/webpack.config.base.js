const path = require('path')
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin')
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin')

const paths = require('./paths')

const publicPath = './'
const publicUrl = ''

const getClientEnvironment = require('./env')
getClientEnvironment(publicUrl)

const translateEnvToMode = env => {
  if (env === 'production') {
    return 'production'
  }
  return 'development'
}

module.exports = env => {
  return {
    bail: translateEnvToMode(env) === 'production',
    mode: translateEnvToMode(env),
    cache: true,
    // stats: 'errors-only',
    entry: {
      index: [require.resolve('./polyfills'), paths.appIndexJs]
    },
    output: {
      path: paths.appBuild,
      pathinfo: false,
      filename: 'static/js/bundle.[hash:8].js',
      publicPath: publicPath,
      devtoolModuleFilenameTemplate: info => path.resolve(info.absoluteResourcePath).replace(/\\/g, '/')
    },
    node: {
      __dirname: false,
      __filename: false
    },
    resolve: {
      modules: ['../../node_modules'],
      extensions: ['.mjs', '.web.ts', '.ts', '.web.tsx', '.tsx', '.web.js', '.js', '.json', '.web.jsx', '.jsx', 'css'],
      alias: {
        images: path.join(paths.appSrc, 'images'),
        '@': paths.appSrc
      },
      plugins: [new TsconfigPathsPlugin({ configFile: paths.appTsConfig })]
    },
    module: {
      strictExportPresence: true,
      rules: [
        {
          test: /\.(js|jsx|mjs)$/,
          loader: require.resolve('source-map-loader'),
          enforce: 'pre',
          include: paths.appSrc
        }
      ]
    },
    plugins: [new FriendlyErrorsWebpackPlugin({ clearConsole: env === 'development' })]
  }
}
