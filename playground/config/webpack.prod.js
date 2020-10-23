const webpackCommon = require("./webpack.common");
const WorkboxPlugin = require("workbox-webpack-plugin");
const webpack = require("webpack");

module.exports = {
  ...webpackCommon,
  mode: "production",
  plugins: [
    ...webpackCommon.plugins,
    new WorkboxPlugin.GenerateSW({
      // these options encourage the ServiceWorkers to get in there fast
      // and not allow any straggling "old" SWs to hang around
      clientsClaim: true,
      skipWaiting: true
    }),
    new webpack.DefinePlugin({
      PRODUCTION: JSON.stringify(true)
    })
  ],
  optimization: {
    ...webpackCommon.optimization,
    minimize: true
  }
};
