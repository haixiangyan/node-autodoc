const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const templatesDir = path.resolve(__dirname, 'lib/templates');
const distDir = path.resolve(__dirname, 'dist');

module.exports = {
  entry: './lib/index.js',
  mode: 'production',
  target: 'node',
  output: {
    path: distDir,
    filename: 'index.js',
    library: {
      name: 'node-autodoc',
      type: 'umd',
    },
  },
  plugins: [
    new CleanWebpackPlugin(),
    new CopyPlugin({
      patterns: [
        { from: templatesDir, to: path.resolve(distDir, 'templates') },
      ],
    }),
  ],
};
