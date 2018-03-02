'use strict';

let glob = require('glob');
let ExtractTextPlugin = require('extract-text-webpack-plugin');
let extractSASS = new ExtractTextPlugin('build/resources/main/assets/css/main.css');

let getAppEntries = () => {
    return glob.sync('./src/main/resources/assets/{js/apps/*.js,css/main.scss}').reduce((acc, file) => {
        let [ root, path ] = file.split('/src/main/resources/');
        let output = `build/resources/main/${path.replace(/\.js$/, '.min.js')}`;
        acc[output] = file;
        return acc;
    }, {});
};

module.exports = {
    entry: getAppEntries(),
    output: {
        path: __dirname,
        filename: '[name]'
    },
    mode: 'development',
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['babel-preset-env']
                    }
                }
            },
            {
                test: /\.scss$/,
                use: extractSASS.extract({
                    use: [
                        {
                            loader: 'css-loader'
                        },
                        {
                            loader: 'sass-loader'
                        }
                    ]
                })
            }
        ]
    },
    plugins: [
        extractSASS
    ]
}
