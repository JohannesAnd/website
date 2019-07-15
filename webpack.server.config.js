const path = require("path");
const fs = require("fs");

const nodeEnv = process.env.NODE_ENV || "development";
const isProduction = nodeEnv === "production";
const nodeExternals = require("webpack-node-externals");

const babelRc = JSON.parse(
  fs.readFileSync(path.resolve(".babelrc")).toString()
);

module.exports = function webpackServer() {
  const rules = [
    {
      test: /\.js?$/,
      use: [
        {
          loader: require.resolve("babel-loader"),
          options: {
            presets: [
              require.resolve("@babel/preset-env"),
              require.resolve("@babel/preset-react")
            ]
          }
        }
      ]
    }
  ];

  return {
    mode: isProduction ? "production" : "development",
    devtool: isProduction ? "source-map" : "eval-source-map",
    target: "node",
    externals: [nodeExternals()],
    performance: {
      hints: isProduction ? "warning" : false
    },
    entry: path.resolve("service", "index.js"),
    output: {
      path: path.resolve(),
      filename: "service.js"
    },
    module: {
      rules: rules
    },
    resolve: {
      alias: Object.keys(babelRc.plugins[1][1].alias).reduce((alias, key) => {
        alias[key] = path.resolve(__dirname, babelRc.plugins[1][1].alias[key]);

        return alias;
      }, {})
    }
  };
};
