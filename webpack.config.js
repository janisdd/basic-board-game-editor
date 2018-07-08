// `CheckerPlugin` is optional. Use it if you want async error reporting.
// We need this plugin to detect a `--watch` mode. It may be removed later
// after https://github.com/webpack/webpack/issues/3460 will be resolved.
//const { CheckerPlugin } = require('awesome-typescript-loader')
const path = require('path')
const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: './src/index.tsx',
  output: {
    path: path.resolve(__dirname, './dist'),
    publicPath: '/',
    filename: 'app.js'
  },
  module: {
    loaders: [
      {
        test: /\.(png|svg)$/,
        loader: "url-loader",
        options: {}
      },
      // {test: /\.(jpe?g|gif|png|svg|woff|ttf|wav|mp3)$/, loader: "file-loader"}, //|css
      {test: /\.tsx?$/, loader: "awesome-typescript-loader", exclude: /node_modules/},

      {enforce: "pre", test: /\.js$/, exclude: /node_modules/}, // loader: "source-map-loader",
      {
        test: /\.(woff|woff2|eot|ttf)$/,
        loader: 'url-loader?limit=100000'
      },
      {
        test: /\.css$/,
        loaders: [
          'style-loader?sourceMap',
          'css-loader'
        ]
      },
      {
        test: /\.styl$/,
        loader: ExtractTextPlugin.extract({
          fallback: {loader: 'style-loader?sourceMap'},
          use: [
            'css-loader', {
              loader: 'stylus-loader',
              options: {}
            }
          ]
        })
      },
      {
        test: /\.md$/,
        loader: 'raw-loader'
      }
      /*
       {
       test: /\.js$/,
       exclude: /(node_modules|REMOVE|_surveys_|VERSION|libs)/,
       loader: 'babel',
       query: {
       presets: ['es2015'],
       plugins: ['transform-runtime']
       }
       }
       */
    ]
  },

  plugins: [
    new ExtractTextPlugin("styles.css"),
    new HtmlWebpackPlugin({
      hash: true,
      filename: 'index.html',
      template: 'htmlTemplates/index.ejs',
      inject: false,
      cache: false,
      //this is only for the template file
      minify: {
        caseSensitive: true,
        minifyCSS: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true,
        removeComments: true
      }
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': '"development"'
    }),
  ],
  resolve: {
    // Add '.ts' and '.tsx' as resolvable extensions.
    extensions: [".ts", ".tsx", ".js", ".json", ".css"]
  },
  externals: {
    //better include this via cdn... (too big or no module version)
    'createjs': 'createjs',
    "react": "React",
    "react-dom": "ReactDOM"
  },
  devtool: '#eval-source-map'
}