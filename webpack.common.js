const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const { AureliaPlugin, ModuleDependenciesPlugin } = require("aurelia-webpack-plugin");
const optimize = webpack.optimize;

module.exports = {
	entry: {
		//main: "./src/main.ts",
		main: [ "aurelia-bootstrapper" ]
	},
	output: {
		path: path.resolve(__dirname, "dist"),
		filename: "[name].js"
	},
	resolve: {
		extensions: [".ts", ".js"],
		modules: ["src", "node_modules"].map(x => path.resolve(x))
	},
	devServer: {
		contentBase: path.resolve(__dirname, "dist"),
		// serve index.html for all 404 (required for push-state)
		historyApiFallback: true
	},
	mode: "development",
	devtool: "inline-source-map",
	optimization: {
		minimize: false
	},
	module: {
		rules: [
			{
				enforce: "pre",
				test: /.ts$/,
				use: "source-map-loader"
			},
			{
				test: /\.css$/i,
				use: [{
					loader: "css-loader",
					options: {
						sourceMap: true
					}
				}]
			},
			{
				test: /\.less$/i,
				use: [{
					loader: "css-loader",
					options: {
						sourceMap: true
					}
				},
				{
					loader: "less-loader",
					options: {
						sourceMap: true
					}
				}]
			},
			{
				test: /\.ts$/i,
				use: "ts-loader"
			},
			{
				test: /\.html$/i,
				use: "html-loader"
			},
			{
				test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
				use: [{
					loader: 'url-loader',
					options: {
						limit: 10000,
						mimetype: 'application/font-woff',
						name: 'fonts/[name].[ext]'
					}
				}]
			},
			{
				test: /\.(eot|svg|ttf)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
				use: [{
					loader: 'file-loader'
				}]
			}
		]
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: "./src/index.html"
		}),
        new CopyWebpackPlugin([{
            from: "src/data",
            to: "data"
        }]),
    	new AureliaPlugin()
	]
};