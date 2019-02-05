const path = require('path')
const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

let pathsToClean = [
  'distReferee'
]

let cleanOptions = {
  verbose: true
}

module.exports = {
  entry: './referee/index.ts',
  output: {
    path: path.resolve(__dirname, './distReferee'),
    publicPath: '',
    filename: 'app.js',
    library: 'bbge',
    libraryTarget: 'umd',
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
    new CleanWebpackPlugin(pathsToClean, cleanOptions),
    // new CircularDependencyPlugin({
    //   // exclude detection of files based on a RegExp
    //   exclude: /a\.js|node_modules/,
    //   // add errors to webpack instead of warnings
    //   failOnError: true,
    //   // set the current working directory for displaying module paths
    //   cwd: process.cwd(),
    // }),
    new ExtractTextPlugin("styles.css"),
    new HtmlWebpackPlugin({
      hash: true,
      filename: 'index.html',
      template: 'referee/index_deploy.ejs',
      inject: true,
      cache: false,
      //this is only for the template file
      minify: false
    }),
    new CopyWebpackPlugin([
      {
        from: 'node_modules/createjs-easeljs/lib/easeljs-0.8.2.min.js',
        to: 'easeljs-0.8.2.combined.js',
      },
      {
        from: 'node_modules/semantic-ui-css/semantic.min.css',
        to: 'semantic.min.css',
      },
      {
        from: 'referee/init.js',
        to: 'init.js',
      },
      //required semantic ui css icons
      {
        from: 'referee/libs/opencv.js',
        to: 'opencv.js',
      },

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
  },
}
