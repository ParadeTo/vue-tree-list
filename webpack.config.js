var webpack = require('webpack');
var path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'vue-tree-list.min.js',
    library: 'VueTreeList',
    libraryTarget: 'umd'
  },
  module: {
    loaders: [
      {
        test: /\.vue$/,
        loader: 'vue'
      },
      {
        test: /\.js$/,
        loader: 'babel',
        include: [path.join(__dirname, 'src')],
        exclude: /node_modules/
      },
      {
        test: /\.(woff2?|eot|ttf|otf|svg)(\?.*)?$/,
        loader: 'url-loader',
        query: {
          limit: 10000,
          name: 'fonts/[name].[hash:7].[ext]'
        }
      }
    ]
  },
  vue: {
    loaders: {
      less: 'vue-style!css!less'
    },
    postcss: [
      require('autoprefixer')({
        browsers: ['iOS >= 7', 'Android >= 4.1']
      })
    ]
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    })
  ]
}
