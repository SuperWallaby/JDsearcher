const path = require('path');
const glob = require('glob');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
	entry: {
		'bundle.js': glob.sync('build/static/?(js|css)/*.*.?(js|css)').map((f) => path.resolve(__dirname, f))
	},
	output: {
		filename: 'jdresv.min.js'
	},
	module: {
		rules: [
			{
				test: /\.css$/,
				use: [ 'style-loader', 'css-loader' ]
			}
		]
	},
	plugins: [ new UglifyJsPlugin() ]
};
