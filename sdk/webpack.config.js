// const TerserPlugin = require('terser-webpack-plugin');

// module.exports = {
//   entry: './src/index.js',
//   output: {
//     filename: 'sdk.js',
//     library: 'MonitoringSDK',
//     libraryTarget: 'umd',
//     globalObject: 'this'
//   },
//   mode: 'production',
//   optimization: {
//     minimize: true,
//     minimizer: [new TerserPlugin({
//       terserOptions: {
//         format: {
//           comments: false,
//         },
//       },
//       extractComments: false,
//     })],
//   },
// };

const path = require('path');

module.exports = {
  // Entry point of your SDK
  entry: './src/index.js',
  
  // Output configuration
  output: {
    // Path to the output directory
    path: path.resolve(__dirname, 'dist'),
    // The filename of the bundled SDK
    filename: 'sdk.js',
    // The name of the global variable the SDK will be exposed as
    library: 'MonitoringSDK',
    // The type of library to create (umd is the most versatile)
    libraryTarget: 'umd',
    // This makes it compatible with both browser and server environments
    globalObject: 'this',
    // Clean the dist folder before each build
    clean: true, 
  },
  
  // Set the mode to 'production' for minification or 'development' for debugging
  mode: 'production', 
};