/**
 * Patch a react-native-gesture-handler (RNGH) issue.
 *
 * Goal: using a <TouchableWithoutFeedback/> that behaves correctly
 *   with the other gestures from RNGH (dragging, pressing, etc).
 *
 * RNGH provides replacements, e.g.:
 *   import { TouchableWithoutFeedback } from 'react-native-gesture-handler'
 *   (see here:
 *   https://docs.swmansion.com/react-native-gesture-handler/docs/api/components/touchables)
 *   But they do not work well some times with flexbox, see these issues:
 *   https://github.com/software-mansion/react-native-gesture-handler/issues/1163
 *   https://github.com/software-mansion/react-native-gesture-handler/issues/864
 *   (I'm using RNGH version 2.3.2 at this moment)
 *
 * This utils-gestures.js file provides the <ViewWithTouchable/> component:
 *   a simple View plus onPress and onLongPress callbacks for receiving touches.
 *   The view provides no visual feedback, but uses gestures of RNGH, so it fits our goal.
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
