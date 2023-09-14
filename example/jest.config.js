module.exports = {
  preset: 'react-native',
  setupFiles: [
    './node_modules/react-native-gesture-handler/jestSetup.js',
    './__tests__/config.ts',
  ],
  testMatch: ['<rootDir>/__tests__/**/*.test.tsx'],
  transformIgnorePatterns: [
    'node_modules/(?!(@react-native|react-native|react-native-week-view))',
  ],
};
