import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Animated, PanResponder, Text, TouchableOpacity } from 'react-native';
import styles from './Event.styles';

const UPDATE_EVENT_ANIMATION_DURATION = 150;

const hasMovedEnough = (gestureState) => {
  const { dx, dy } = gestureState;
  return Math.abs(dx) > 2 || Math.abs(dy) > 2;
};

const Event = ({
  event,
  onPress,
  onLongPress,
  position,
  EventComponent,
  containerStyle,
  onDrag,
}) => {
  const isDragEnabled = () => {
    return !!onDrag;
  };

  const isPressDisabled = () => {
    return !onPress && !onLongPress;
  };

  const onDragRelease = (dx, dy) => {
    if (!onDrag) {
      return;
    }

    const newX = position.left + position.width / 2 + dx;
    const newY = position.top + dy;
    onDrag(event, newX, newY);
  };

  const translatedByDrag = useRef(new Animated.ValueXY()).current;
  const currentWidth = useRef(new Animated.Value(position.width)).current;
  const currentLeft = useRef(new Animated.Value(position.left)).current;
  useEffect(() => {
    translatedByDrag.setValue({ x: 0, y: 0 });
    const { left, width } = position;
    const animations = [
      Animated.timing(currentWidth, {
        toValue: width,
        duration: UPDATE_EVENT_ANIMATION_DURATION,
        useNativeDriver: false,
      }),
      Animated.timing(currentLeft, {
        toValue: left,
        duration: UPDATE_EVENT_ANIMATION_DURATION,
        useNativeDriver: false,
      }),
    ];
    Animated.parallel(animations).start();
  }, [position]);
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => isDragEnabled(),
      onStartShouldSetPanResponderCapture: () =>
        isPressDisabled() && isDragEnabled(),
      onMoveShouldSetPanResponder: (_, gestureState) =>
        isDragEnabled() && hasMovedEnough(gestureState),
      onMoveShouldSetPanResponderCapture: (_, gestureState) =>
        isPressDisabled() && isDragEnabled() && hasMovedEnough(gestureState),
      onPanResponderMove: Animated.event(
        [
          null,
          {
            dx: translatedByDrag.x,
            dy: translatedByDrag.y,
          },
        ],
        {
          useNativeDriver: false,
        },
      ),
      onPanResponderTerminationRequest: () => false,
      onPanResponderRelease: (_, gestureState) => {
        const { dx, dy } = gestureState;
        onDragRelease(dx, dy);
      },
      onPanResponderTerminate: () => {
        translatedByDrag.setValue({ x: 0, y: 0 });
      },
    }),
  ).current;
  return (
    <Animated.View
      style={[
        styles.container,
        {
          top: position.top,
          left: currentLeft,
          height: position.height,
          width: currentWidth,
          backgroundColor: event.color,
          transform: translatedByDrag.getTranslateTransform(),
          borderWidth: 1,
          borderRadius: 8,
          borderStyle: event.borderStyle,
          borderColor: event.borderColor,
        },
        containerStyle,
      ]}
      /* eslint-disable react/jsx-props-no-spreading */
      {...panResponder.panHandlers}
    >
      <TouchableOpacity
        onPress={() => onPress && onPress(event)}
        onLongPress={() => onLongPress && onLongPress(event)}
        style={styles.touchableContainer}
        disabled={!onPress && !onLongPress}
      >
        {EventComponent ? (
          <EventComponent event={event} position={position} />
        ) : (
          <Text style={styles.description}>{event.description}</Text>
        )}
      </TouchableOpacity>
    </Animated.View>
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
