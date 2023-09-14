const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

const path = require('path');
const weekViewModules = path.resolve(__dirname, '..', 'node_modules');

/**
 * Metro configuration
 * https://facebook.github.io/metro/docs/configuration
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = {
  resolver: {
    // Avoid conflicts between example/ and root folder
    blockList: [
      new RegExp(`${weekViewModules}/react-native/.*`),
      new RegExp(`${weekViewModules}/react(-test-rendered)?/.*`),
    ],
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
