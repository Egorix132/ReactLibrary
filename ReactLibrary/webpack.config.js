const path = require("path");
const webpack = require("webpack");

module.exports = {
    entry: "./wwwroot/scripts/app.tsx",
    output: {
        path: path.resolve(__dirname, "wwwroot"),
        filename: "bundle.js",
        publicPath: "/"
    },
    plugins: [
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            Util: 'exports-loader?Util!bootstrap/js/dist/util'
        })
    ],
    module: {
        rules: [
            {
                test: /\.(ts|tsx)$/,
                use: "ts-loader"
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            }
        ]
    }
};