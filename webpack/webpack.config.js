// Libraries
const path = require("path");
const webpack = require("webpack");
const WebpackNotifierPlugin = require("webpack-notifier");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const globImporter = require("node-sass-glob-importer");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlBeautifyPlugin = require("beautify-html-webpack-plugin");
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");

// Files
const utils = require("./utils");

// Configuration
module.exports = (env) => {
  return {
    context: path.resolve(__dirname, "../src"),
    entry: {
      app: "./app.js",
    },
    output: {
      path: path.resolve(__dirname, "../dist"),
      publicPath: "",
      filename: "assets/[name].js",
    },
    devServer: {
      contentBase: path.resolve(__dirname, "../src"),
      openPage: "index",
    },
    devtool: env.NODE_ENV === "development" ? "source-map" : false,
    resolve: {
      modules: [path.resolve(__dirname, "../src"), "node_modules"],
      extensions: [".js", ".css", ".scss"],
    },

    performance: {
      hints: false,
      maxEntrypointSize: 512000,
      maxAssetSize: 512000,
    },
    /*
      Loaders with configurations
    */
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
            env.NODE_ENV === "development"
              ? "style-loader"
              : MiniCssExtractPlugin.loader,
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
            env.NODE_ENV === "development"
              ? "style-loader"
              : MiniCssExtractPlugin.loader,
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
              options: {
                data: {
                  data: require("../src/views/data/data.json"),
                },
              },
            },
          ],
        },
        {
          test: /\.(png|jpe?g|gif|svg|ico)(\?.*)?$/,
          use: [
            {
              loader: "url-loader",
              options: {
                limit: 3000,
                name: "assets/images/[name].[hash:7].[ext]",
              },
            },
          ],
        },
        {
          test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
          loader: "url-loader",
          options: {
            limit: 5000,
            name: "assets/fonts/[name].[hash:7].[ext]",
          },
        },
        {
          test: /\.(mp4)(\?.*)?$/,
          loader: "url-loader",
          options: {
            limit: 10000,
            name: "assets/videos/[name].[hash:7].[ext]",
          },
        },
      ],
    },
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
            filename: "assets/vendor.js",
            // sync + async chunks
            chunks: "all",
            // import file path containing node_modules
            test: /node_modules/,
          },
          styles: {
            name: "styles",
            test: /\.css$/,
            chunks: "all",
            enforce: true,
          },
        },
      },
    },

    plugins: [
      new CopyWebpackPlugin({
        patterns: [
          { from: "assets/images", to: "assets/images" },
          { from: "assets/fonts", to: "assets/fonts" },
          { from: "assets/videos", to: "assets/videos" },
        ],
      }),

      new ImageMinimizerPlugin({
        minimizerOptions: {
          cache: true,
          plugins: [
            ["gifsicle", { interlaced: true }],
            ["mozjpeg", { quality: 70 }],
            ["optipng", { optimizationLevel: 5 }],
          ],
        },
      }),

      new MiniCssExtractPlugin({
        filename: "[name].css",
        chunkFilename: "vendors.css",
      }),

      /*
        Pages
      */
      ...utils.pages(env.NODE_ENV),

      new HtmlBeautifyPlugin({
        end_with_newline: true,
        indent_size: 2,
        indent_with_tabs: true,
        indent_inner_html: true,
        preserve_newlines: true,
      }),

      new WebpackNotifierPlugin({
        title: "Bundler",
      }),
    ],
  };
};
