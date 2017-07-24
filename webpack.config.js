var webpack = require('webpack');
var jsFilePrefix = "./tiles/segmented-images-grid-tile/public/javascripts";

module.exports = {
  entry: {
    "config": jsFilePrefix + "/jsx/config.js",
    "tileView": jsFilePrefix + "/jsx/tileView.js"
  },
  output:{
    path: jsFilePrefix,
    filename: '[name].js'
  },
  resolve:{
    extension: ['', '.js', '.jsx']
  },
  module: {
    loaders: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query:{
          presets:['react']
        }
      }
    ]
  }
};
