import React, { useContext } from 'react';
import { FlatList } from 'react-native';
import Animated, {
  useAnimatedRef,
  useAnimatedReaction,
  scrollTo,
  useSharedValue,
  useAnimatedScrollHandler,
  runOnJS,
} from 'react-native-reanimated';

const HeaderRefContext = React.createContext(null);

export const useHeaderRefContext = () => {
  const value = useContext(HeaderRefContext);
  return value;
};

export const HeaderRefContextProvider = ({ children }) => {
  const headerRef = useAnimatedRef();
  return (
    <HeaderRefContext.Provider value={headerRef}>
      {children}
    </HeaderRefContext.Provider>
  );
};

const ReanimatedFlatList = Animated.createAnimatedComponent(FlatList);

export const HorizontalSyncFlatList = React.forwardRef(
  ({ horizontalScrollEnded, ...props }, ref) => {
    const headerRef = useHeaderRefContext();

    const gridScrollOffset = useSharedValue(0);
    useAnimatedReaction(
      () => gridScrollOffset.value,
      (newScrollOffset) => {
        if (headerRef) {
          scrollTo(headerRef, newScrollOffset, 0, true);
        }
      },
    );

    const callbackWrapper = (...args) => {
      horizontalScrollEnded(...args);
    };
    const isScrollingHorizontal = useSharedValue(false); // avoid calling multiple times
    const scrollHandler = useAnimatedScrollHandler({
      onScroll: (scrollEvent) => {
        gridScrollOffset.value = scrollEvent.contentOffset.x;
      },
      onMomentumBegin: () => {
        isScrollingHorizontal.value = true;
      },
      onMomentumEnd: (scrollEvent) => {
        if (!isScrollingHorizontal.value) {
          return;
        }
        const { contentOffset } = scrollEvent;
        const { x: newXPosition } = contentOffset;
        // NOTE: we're passing the least information possible thru the bridge
        runOnJS(callbackWrapper)(newXPosition);
        isScrollingHorizontal.value = false;
      },
    });

    return (
      <ReanimatedFlatList
        onScroll={scrollHandler}
        horizontal
        ref={ref}
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...props}
      />
    );
  },
);
