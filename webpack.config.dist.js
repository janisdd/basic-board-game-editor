// `CheckerPlugin` is optional. Use it if you want async error reporting.
// We need this plugin to detect a `--watch` mode. It may be removed later
// after https://github.com/webpack/webpack/issues/3460 will be resolved.
//const { CheckerPlugin } = require('awesome-typescript-loader')
const path = require('path')
const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: './src/index.tsx',
  output: {
    path: path.resolve(__dirname, './dist'),
    publicPath: '',
    filename: 'app.js'
  },
  module: {
    loaders: [

      {test: /\.(jpe?g|gif|png|svg|woff|ttf|wav|mp3)$/, loader: "file-loader"}, //|css
      {test: /\.tsx?$/, loader: "awesome-typescript-loader", exclude: /node_modules/},

      {enforce: "pre", test: /\.js$/, exclude: /node_modules/},
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
          fallback: {loader: 'style-loader'},
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
      template: 'htmlTemplates/index_deploy.ejs',
      inject: true,
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
    new webpack.optimize.UglifyJsPlugin({
      compress: {warnings: false},
      uglifyOptions: {
        ie8: false,
        mangle: true,
        compress: {
          properties: true,
          dead_code: true,
          conditionals: true,
          comparisons: true,
          evaluate: true,
          booleans: true,
          loops: true,
          unused: true,
          if_return: true,
          join_vars: true,
          collapse_vars: true,
          reduce_vars: true,
          negate_iife: true,
          warnings: true
        }
      }
    }),
    new CopyWebpackPlugin([
      {
        from: 'node_modules/react/dist/react.min.js',
        to: 'react.js',
      },
      {
        from: 'node_modules/react-dom/dist/react-dom.min.js',
        to: 'react-dom.js',
      },
      {
        from: 'node_modules/createjs-easeljs/lib/easeljs-0.8.2.min.js',
        to: 'easeljs-0.8.2.combined.js',
      },
      {
        from: 'libs/SVGExporter/SVGExporter.js',
        to: 'SVGExporter.js',
      },
      {
        from: 'node_modules/ace-builds/src/ace.js',
        to: 'ace-builds/src/ace.js',
      },
      {
        from: 'node_modules/ace-builds/src/theme-chrome.js',
        to: 'ace-builds/src/theme-chrome.js',
      },
      {
        from: 'libs/ace-editor/bbgel-mode.js',
        to: 'ace-builds/bbgel-mode.js',
      },
      {
        from: 'node_modules/semantic-ui-css/semantic.min.css',
        to: 'semantic.min.css',
      },
      //required semantic ui css icons
      {
        from: 'node_modules/semantic-ui-css/themes/default/assets/images/flags.png',
        to: 'themes/default/assets/images/flags.png',
      },
      {
        from: 'node_modules/semantic-ui-css/themes/default/assets/fonts/brand-icons.woff2',
        to: 'themes/default/assets/fonts/brand-icons.woff2',
      },
      {
        from: 'node_modules/semantic-ui-css/themes/default/assets/fonts/icons.woff2',
        to: 'themes/default/assets/fonts/icons.woff2',
      },
      {
        from: 'node_modules/semantic-ui-css/themes/default/assets/fonts/outline-icons.woff2',
        to: 'themes/default/assets/fonts/outline-icons.woff2',
      },
      //do we need these??
      {
        from: 'node_modules/semantic-ui-css/themes/default/assets/fonts/brand-icons.woff',
        to: 'themes/default/assets/fonts/brand-icons.woff',
      },
      {
        from: 'node_modules/semantic-ui-css/themes/default/assets/fonts/icons.woff',
        to: 'themes/default/assets/fonts/icons.woff',
      },
      {
        from: 'node_modules/semantic-ui-css/themes/default/assets/fonts/outline-icons.woff',
        to: 'themes/default/assets/fonts/outline-icons.woff',
      }
    ]),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': '"production"'
    }),
  ],
  resolve: {
    // Add '.ts' and '.tsx' as resolvable extensions.
    extensions: [".ts", ".tsx", ".js", ".json", ".css"]
  },
  externals: {
    "react": "React",
    "react-dom": "ReactDOM"
  },
}
