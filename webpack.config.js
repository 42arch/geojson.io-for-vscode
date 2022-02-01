//@ts-check

'use strict';

const path = require('path');

//@ts-check
/** @typedef {import('webpack').Configuration} WebpackConfig **/

/** @type WebpackConfig */
const extensionConfig = {
  target: 'node',
  entry: path.join(__dirname, 'app', 'index.tsx'),
  output: {
    path: path.resolve(__dirname, 'out', 'app'),
    filename: 'bundle.js',
    libraryTarget: 'commonjs2'
  },
  externals: {
    vscode: 'commonjs vscode'
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.css']
  },
  module: {
    rules: [
      {
        test: /\.tsx$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'ts-loader'
          }
        ]
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  devtool: 'nosources-source-map',
  infrastructureLogging: {
    level: "log"
  },
}
module.exports = [ extensionConfig ]




// const path = require('path');

// module.exports = {
//   entry: path.join(__dirname, 'app', 'index.tsx'),
//   resolve: {
//     extensions: ['.ts', '.tsx', '.js', '.jsx', '.css'],
//   },
//   devtool: 'inline-source-map',
//   module: {
//     rules: [
//       {
//         test: /\.tsx?$/,
//         use: 'ts-loader',
//         exclude: '/node_modules/',
//       },
//       {
//         test: /\.css$/,
//         use: ['style-loader', 'css-loader'],
//       },
//     ],
//   },
//   output: {
//     filename: 'bundle.js',
//     path: path.resolve(__dirname, 'out', 'app'),
//   },
// }