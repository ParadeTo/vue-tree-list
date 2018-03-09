var webpack = require('webpack')
var merge = require('webpack-merge')
var baseConfig = require('./webpack.base.conf')
var path = require('path')

var projectRoot = path.resolve(__dirname, '../')

module.exports = merge(baseConfig, {
  entry: './src/index.js',
  output: {
    path: path.resolve(projectRoot, 'dist'),
    filename: 'vue-tree-list.min.js',
    library: 'VueTreeList',
    libraryTarget: 'umd'
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    })
  ]
})
