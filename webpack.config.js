module.exports = {  
  entry: {
    bundle:'./js/video.js'
  },
  output: {
    path: 'build',
    publicPath: '/',
    filename: '[name].js'
  },
  resolve: {
    extensions: ['', '.ts', '.js', '.css']
  },
  module: {
    loaders: [
      { test: /\.css$/, loader: 'style-loader!css-loader'},
      {test:/\.(png|jpg)$/,loader:'url?limit=40000'},
      {test: /\.js?$/,loader: 'babel', exclude: /node_modules/,  query: {compact: false,presets: ['es2015']}}
    ]
  }
}