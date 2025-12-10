const webpack = require("webpack");
const { merge } = require("webpack-merge");
const common = require("./webpack.common");

module.exports = merge(common, {
  mode: "development",
  devtool: "inline-source-map",
  devServer: {
    historyApiFallback: true,
    open: true,
    compress: true,
    port: 8082,
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      "process.env.API_URL": JSON.stringify(
        process.env.API_URL || "https://poling-backend.vercel.app/messages/unread",
      ),
    }),
  ],
});
