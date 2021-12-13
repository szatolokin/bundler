// Libraries
const path = require("path");
const webpack = require("webpack");
const WebpackNotifierPlugin = require("webpack-notifier");
const TerserPlugin = require("terser-webpack-plugin");
const globImporter = require("node-sass-glob-importer");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

// Files

// Configuration
module.exports = () => {
  return {
    context: path.resolve(__dirname, "../src"),
    entry: {
      app: "./app.js",
    },
    output: {
      path: path.resolve(__dirname, "../dist"),
      publicPath: "",
      filename: "[name].js",
    },
    devtool: false,
    resolve: {
      modules: [path.resolve(__dirname, "../src"), "node_modules"],
      extensions: [".js", ".css", ".scss"],
    },

    module: {
      rules: [
        {
          test: /\.(js|ts)$/,
          exclude: [/node_modules/],
          use: [
            {
              loader: "babel-loader",
              options: {
                presets: ["@babel/preset-env", "@babel/preset-typescript"],
              },
            },
          ],
        },
        {
          test: /\.css$/,
          use: [
            MiniCssExtractPlugin.loader,
            {
              loader: "css-loader",
              options: {
                importLoaders: 1,
                sourceMap: true,
              },
            },
          ],
        },
        {
          test: /\.scss$/,
          use: [
            MiniCssExtractPlugin.loader,
            {
              loader: "css-loader",
              options: { importLoaders: 1, sourceMap: true },
            },
            {
              loader: "sass-loader",
              options: {
                sassOptions: {
                  importer: globImporter(),
                },
                webpackImporter: true,
              },
            },
          ],
        },
        {
          test: /\.pug$/,
          use: [
            "pug-loader",
            {
              loader: "pug-html-loader",
            },
          ],
        },
        {
          test: /\.(png|jpe?g|gif|svg|ico)(\?.*)?$/,
          use: [
            {
              loader: "url-loader",
            },
          ],
        },
        {
          test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
          loader: "url-loader",
        },
        {
          test: /\.(mp4)(\?.*)?$/,
          loader: "url-loader",
        },
      ],
    },

    performance: {
      hints: false,
      maxEntrypointSize: 512000,
      maxAssetSize: 512000,
    },
    /*
      Loaders with configurations
    */
    optimization: {
      minimizer: [
        new TerserPlugin({
          cache: true,
          parallel: true,
          sourceMap: true,
        }),
      ],
      splitChunks: {
        cacheGroups: {
          default: false,
          vendors: false,
          // vendor chunk
          vendor: {
            filename: "vendor.js",
            // sync + async chunks
            chunks: "all",
            // import file path containing node_modules
            test: /node_modules/,
          },
        },
      },
    },

    plugins: [
      new MiniCssExtractPlugin({
        filename: "[name].css",
        chunkFilename: "vendors.css",
      }),

      new WebpackNotifierPlugin({
        title: "Bundler",
      }),
    ],
  };
};
