const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const nodeEnv = process.env.NODE_ENV || "development";

const isProduction = nodeEnv === "production";

module.exports = {
  mode: isProduction ? "production" : "development",
  devtool: isProduction ? "source-map" : "eval-source-map",
  entry: {
    main: "./client/index.js"
  },
  output: {
    path: path.resolve("build"),
    filename: isProduction ? "[name].[chunkhash].js" : "[name].js",
    chunkFilename: isProduction ? "[chunkhash].js" : "[id].js",
    publicPath: "/"
  },
  devServer: isProduction
    ? {}
    : {
        disableHostCheck: true,
        host: "localhost",
        port: 3000,
        historyApiFallback: true,
        stats: "errors-only",
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods":
            "GET, POST, PUT, DELETE, PATCH, OPTIONS",
          "Access-Control-Allow-Headers":
            "X-Requested-With, content-type, Authorization"
        }
      },
  module: {
    rules: [
      {
        test: /\.js?$/,
        use: [
          {
            loader: require.resolve("babel-loader")
          }
        ]
      }
    ]
  },
  plugins: [new HtmlWebpackPlugin()],
  optimization: {
    splitChunks: {
      chunks: "async",
      minSize: 30000,
      maxSize: 0,
      minChunks: 1,
      maxAsyncRequests: 5,
      maxInitialRequests: 3,
      automaticNameDelimiter: "~",
      name: true,
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true
        }
      }
    }
  }
};
