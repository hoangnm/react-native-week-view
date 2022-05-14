/**
 * Metro configuration for React Native
 * https://github.com/facebook/react-native
 *
 * @format
 */

const path = require('path');
const weekViewModules = path.resolve(__dirname, '..', 'node_modules');

module.exports = {
  resolver: {
    // Avoid conflicts between example/ and root folder
    blockList: [
      new RegExp(`${weekViewModules}/react-native/.*`),
      new RegExp(`${weekViewModules}/react(-test-rendered)?/.*`),
    ],
  },
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
  },
};
