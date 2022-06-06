/**
 * Patch a react-native-gesture-handler (RNGH) issue.
 *
 * Goal: using a <TouchableWithoutFeedback/> that behaves correctly
 *   with the other gestures from RNGH (dragging, pressing, etc).
 *
 * RNGH provides component replacements:
 *   import { TouchableWithoutFeedback } from 'react-native-gesture-handler'
 *   https://docs.swmansion.com/react-native-gesture-handler/docs/api/components/touchables
 *
 * But are not enough for our use case:
 *     (1) the onPress and onLongPress callbacks do not provide pressEvent information
 *     (2) components have issues when using 'position: absolute' and flexbox
 *
 * This utils-gestures.js file provides the <ViewWithTouchable/> component:
 *   a simple View plus onPress and onLongPress callbacks for receiving touches.
 *   The view provides no visual feedback, but uses gestures of RNGH, so it fits our goal.
 *
 * ---
 *
 *
 * __Problem details:__
 *
 * (1) Press callbacks
 *   * We need pressEvent information to get the press location, but pressEvent is not provided.
 *   * See here: https://github.com/software-mansion/react-native-gesture-handler/discussions/2093
 *
 * (2) Position absolute and flexbox problems: the component does not show in the screen.
 *     For example:
 *     https://github.com/software-mansion/react-native-gesture-handler/issues/1163
 *     https://github.com/software-mansion/react-native-gesture-handler/issues/864
 *
 * I'm using RNGH version 2.4.1 at this moment.
 * Though I was able to make it work with absolute and flexbox:
 * ```js
 *   import { TouchableWithoutFeedback } from 'react-native-gesture-handler'
 *
 *   // ...
 *   <TouchableWithoutFeedback
 *     containerStyle={StyleSheet.absoluteFill} // outer button
 *     style={{ flex: 1, flexDirection: 'row' }} // inner Animated.View
 *     shouldActivateOnStart // was needed for some reason
 *
 *     // (but the callbacks problem persists)
 *   >
 * ```
 */
import React from 'react';
import { View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { runOnJS } from 'react-native-reanimated';

const withTouchableGestures = (Component) => {
  const viewWithTouchable = ({ onPress, onLongPress, ...other }) => {
    const pressGesture = Gesture.Tap()
      .enabled(!!onPress)
      .onEnd((evt, success) => {
        if (success) {
          runOnJS(onPress)(evt);
        }
      });

    const longPressGesture = Gesture.LongPress()
      .enabled(!!onLongPress)
      .onEnd((evt, success) => {
        if (success) {
          runOnJS(onLongPress)(evt);
        }
      });

    const composedGesture = Gesture.Exclusive(longPressGesture, pressGesture);
    return (
      <GestureDetector gesture={composedGesture}>
        {/* eslint-disable-next-line react/jsx-props-no-spreading */}
        <Component {...other} />
      </GestureDetector>
    );
  };
  return viewWithTouchable;
};

// eslint-disable-next-line import/prefer-default-export
export const ViewWithTouchable = withTouchableGestures(View);
