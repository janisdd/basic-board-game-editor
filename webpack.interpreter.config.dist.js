// `CheckerPlugin` is optional. Use it if you want async error reporting.
// We need this plugin to detect a `--watch` mode. It may be removed later
// after https://github.com/webpack/webpack/issues/3460 will be resolved.
//const { CheckerPlugin } = require('awesome-typescript-loader')
const path = require('path')
const webpack = require('webpack')

//from https://remarkablemark.org/blog/2016/09/22/webpack-build-umd/
module.exports = {
  entry: './simulation/machine/AbstractMachine.ts',
  output: {
    path: path.resolve(__dirname, './distMisc/interpreter'),
    filename: 'bbgi.js',
    // export to AMD, CommonJS, or window
    libraryTarget: 'umd',
    // the name exported to window
    library: 'bbgi' //basic board game interpreter
  },
  module: {
    loaders: [
      {test: /\.tsx?$/, loader: "awesome-typescript-loader", exclude: /node_modules/},
      {enforce: "pre", test: /\.js$/, exclude: /node_modules/}, // loader: "source-map-loader",
    ]
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': '"development"'
    }),
  ],
  resolve: {
    extensions: [".ts", ".tsx", ".js"]
  }
}