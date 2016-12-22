module.exports = {
    entry: './lib/wxParser.core.js',
    output: {
        filename: 'wxParser.js'
    },
    module: {
        loaders: [{
            test: /\.js$/,exclude: /node_modules/,loader: "babel-loader"
        }]
    }
}