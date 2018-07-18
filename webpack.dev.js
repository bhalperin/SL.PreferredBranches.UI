const path = require("path");
const webpack = require("webpack");
const webpackMerge = require("webpack-merge");
const commonConfig = require("./webpack.common.js");
const DashboardPlugin = require('webpack-dashboard/plugin');

module.exports = webpackMerge(commonConfig, {
	devServer: {
		port: 4444
	},
	plugins: [
		new DashboardPlugin()
	]
});