// Mock Animated
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');
// // If testing with RN < 0.64.0, change for:
// jest.mock('react-native/Libraries/Animated/src/NativeAnimatedHelper');
// // See: https://stackoverflow.com/a/66915338/9951939

// Needed when using setTimeout (when showNowLine=true)
jest.useFakeTimers();
