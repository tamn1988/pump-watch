const HtmlWebPackPlugin = require("html-webpack-plugin");
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  entry: "./src/scripts/index.js",

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: "html-loader",
            options: { minimize: true }
          }
        ]
      },
      {
        test: /\.css$/,
        // AND WE USE IT HERE
        use: ExtractTextPlugin.extract({
          use: ["css-loader", "postcss-loader"],
          fallback: 'style-loader'
        })
        // test: /\.css$/,
        // exclude: /node_modules/,
        // use:
        //   [
        //     {
        //       loader: 'style-loader',
        //     },
        //     {
        //       loader: 'css-loader',
        //       options: {
        //         importLoaders: 1,
        //       }
        //     },
        //     {
        //       loader: 'postcss-loader'
        //     }
        //   ]
      }
    ]
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: "./src/index.html",
      filename: "./index.html"
    }),
    new ExtractTextPlugin({
      filename: "styles.css"
    })
  ]
};