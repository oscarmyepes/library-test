const webpackCommon = require("./webpack.common");
const webpack = require("webpack");

module.exports = {
  ...webpackCommon,
  mode: "development",
  devtool: "inline-source-map",
  devServer: {
    contentBase: "./dist",
    hot: true,
    port: 8080,
    historyApiFallback: true,
    host: "0.0.0.0"
  },
  plugins: [
    ...webpackCommon.plugins,
    new webpack.DefinePlugin({
      PRODUCTION: JSON.stringify(false)
    })
  ]
};
