// Note: import explicitly to use the types shiped with jest.
import {jest} from '@jest/globals';

// For now, mocks copied from root dir:
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');
jest.useFakeTimers();
