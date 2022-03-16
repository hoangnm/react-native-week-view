/**
 * Patch a react-native-gesture-handler (RNGH) issue.
 *
 * Goal: replacing <TouchableWithoutFeedback/> with the version from RNGH, so it behaves
 *   correctly with the other gestures (event dragging, pressing, etc)
 *
 * RNGH provides these replacements, e.g.:
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
 *
 * The hoc withTouchableGestures() could also be used to add the onPress and onLongPress callback to
 *   other components (though I do not see the point right now).
 *
 * Note: I'm not sure if this is too different from createNativeWrapper():
 *   https://docs.swmansion.com/react-native-gesture-handler/docs/gesture-handlers/api/create-native-wrapper
 *   That hoc works with the old RNGH API that uses
 *   components (e.g. <TapGestureHandler />, etc)
 */
import React from 'react';
import { View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { runOnJS } from 'react-native-reanimated';


const withTouchableGestures = (Component) => {
  const _viewWithTouchable = ({ onPress, onLongPress, ...other }) => {
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
        <Component {...other}/>
      </GestureDetector>
    )
  };
  return _viewWithTouchable;
};

export const ViewWithTouchable = withTouchableGestures(View);
