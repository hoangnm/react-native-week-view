// Mock reanimated
require('react-native-reanimated/lib/reanimated2/jestUtils').setUpTests();

// Mock Animated
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');
// // If testing with RN < 0.64.0, change for:
// jest.mock('react-native/Libraries/Animated/src/NativeAnimatedHelper');
// // See: https://stackoverflow.com/a/66915338/9951939

// Needed when using setTimeout (when showNowLine=true)
jest.useFakeTimers();

jest.mock('react-native/Libraries/Interaction/InteractionManager', () => ({
  runAfterInteractions: jest.fn((task) => task()),
}));
