const glob = require('glob');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const extractSASS = new ExtractTextPlugin(
  'build/resources/main/assets/css/main.css'
);

const getAppEntries = () => glob
  .sync('./src/main/resources/assets/{js/apps/*.js,css/main.scss}')
  .filter(file => !/\.test\.js/.test(file))
  .reduce((acc, file) => {
    const path = file.split('/src/main/resources/')[1];
    const output = `build/resources/main/${path.replace(/\.js$/, '.min.js')}`;
    acc[output] = file;
    return acc;
  }, {});

module.exports = {
  entry: getAppEntries(),
  output: {
    path: __dirname,
    filename: '[name]',
  },
  mode: 'development',
  module: {
    rules: [{
      test: /\.jsx?$/,
      exclude: /node_modules/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env'],
        },
      },
    }, {
      test: /\.scss$/,
      use: extractSASS.extract({
        use: [{
          loader: 'css-loader',
        }, {
          loader: 'sass-loader',
        }],
      }),
    }],
  },
  plugins: [ extractSASS ],
}
