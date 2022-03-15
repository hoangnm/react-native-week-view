import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { Text } from 'react-native';
import {GestureDetector, Gesture} from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle, useAnimatedReaction, useSharedValue, withTiming, runOnJS,
} from 'react-native-reanimated';
import styles from './Event.styles';

const UPDATE_EVENT_ANIMATION_DURATION = 150;


const Event = ({
  event,
  onPress,
  onLongPress,
  position,
  EventComponent,
  containerStyle,
  onDrag,
}) => {
  const isDragEnabled = !!onDrag;

  const isPressDisabled = !onPress && !onLongPress;

  const onDragRelease = useCallback(
    (dx, dy) => {
      if (!onDrag) {
        return;
      }

      const newX = position.left + position.width / 2 + dx;
      const newY = position.top + dy;
      onDrag(event, newX, newY);
    },
    [event, position, onDrag],
  );

  const translatedByDrag = useSharedValue({ x: 0, y: 0 });
  const currentWidth = useSharedValue(position.width);
  const currentLeft = useSharedValue(position.left);
  const currentTop = useSharedValue(position.top);
  const currentHeight = useSharedValue(position.height);

  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translatedByDrag.value.x },
        { translateY: translatedByDrag.value.y },
      ],
      width: currentWidth.value,
      left: currentLeft.value,
      top: currentTop.value,
      height: currentHeight.value,
    };
  });

  useAnimatedReaction(
    () => position,
    ({ top, left, height, width }) => {
      if (currentTop.value !== top) {
        currentTop.value = withTiming(top, {duration: UPDATE_EVENT_ANIMATION_DURATION});
      }
      if (currentLeft.value !== left) {
        currentLeft.value = withTiming(left, {duration: UPDATE_EVENT_ANIMATION_DURATION});
      }
      if (currentHeight.value !== height) {
        currentHeight.value = withTiming(height, {duration: UPDATE_EVENT_ANIMATION_DURATION});
      }
      if (currentWidth.value !== width) {
        currentWidth.value = withTiming(width, {duration: UPDATE_EVENT_ANIMATION_DURATION});
      }
    },
  );

  const dragGesture = Gesture.Pan()
    .enabled(isDragEnabled)
    .onUpdate(e => {
      translatedByDrag.value = {
        x: e.translationX,
        y: e.translationY,
      };
    })
    .onEnd((evt, success) => {
      if (!success) {
        translatedByDrag.value = { x: 0, y: 0 };
        return;
      }
      const { translationX, translationY } = evt;

      currentTop.value = currentTop.value + translationY;
      currentLeft.value = currentLeft.value + translationX;
      translatedByDrag.value = { x: 0, y: 0 };

      runOnJS(onDragRelease)(translationX, translationY);
    });

  return (
    <GestureDetector gesture={dragGesture}>
      <Animated.View
        style={[
          styles.container,
          {
            backgroundColor: event.color,
          },
          containerStyle,
          animatedStyles,
        ]}
      >
          {EventComponent ? (
            <EventComponent event={event} position={position} />
          ) : (
            <Text style={styles.description}>{event.description}</Text>
          )}
      </Animated.View>
    </GestureDetector>
  );
};

const eventPropType = PropTypes.shape({
  color: PropTypes.string,
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  description: PropTypes.string,
  startDate: PropTypes.instanceOf(Date).isRequired,
  endDate: PropTypes.instanceOf(Date).isRequired,
});

const positionPropType = PropTypes.shape({
  height: PropTypes.number,
  width: PropTypes.number,
  top: PropTypes.number,
  left: PropTypes.number,
});

Event.propTypes = {
  event: eventPropType.isRequired,
  position: positionPropType.isRequired,
  onPress: PropTypes.func,
  onLongPress: PropTypes.func,
  containerStyle: PropTypes.object,
  EventComponent: PropTypes.elementType,
  onDrag: PropTypes.func,
};

export default Event;
