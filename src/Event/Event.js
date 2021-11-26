import React, { useRef, useEffect, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Animated, PanResponder, Text, TouchableOpacity, View } from 'react-native';
import styles from './Event.styles';

const UPDATE_EVENT_ANIMATION_DURATION = 150;
const EDITING_OPACITY = 0.8

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
  onEditEndDate,
  editingEventId,
  onStartEditingEvent,
  editingInteraction,
}) => {
  const isEditing = onEditEndDate && editingEventId === event.id;

  const isDragEnabled = !!onDrag && !isEditing;

  const [onPressContainer, onLongPressContainer] = useMemo(() => {
    // Case 1
    const noEditEnabled = !onEditEndDate || !editingInteraction;
    if (noEditEnabled) return [onPress, onLongPress];

    // Case 2
    const isEditingOtherEvent = !isEditing && editingEventId != null;
    if (isEditingOtherEvent) return [onPress, onLongPress];

    // Case 3
    if (isEditing) {
      // Any touch exits editing mode
      const stopEditing = () => onStartEditingEvent(null);
      return [stopEditing, stopEditing];
    }

    // Case 4
    if (editingInteraction === 'press') return [onStartEditingEvent, onLongPress];

    // Case 5
    return [onPress, onStartEditingEvent]; // editingInteraction === 'longPress'
  }, [
    isEditing,
    editingEventId,
    onPress,
    onLongPress,
    onEditEndDate,
    onStartEditingEvent,
    editingInteraction,
  ]);

  const isPressDisabled = !onPressContainer && !onLongPressContainer;

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

  const translatedByDrag = useRef(new Animated.ValueXY()).current;
  const currentWidth = useRef(new Animated.Value(position.width)).current;
  const currentLeft = useRef(new Animated.Value(position.left)).current;
  const currentHeight = useRef(new Animated.Value(0)).current;

  const onEditRelease = useCallback((position, dy) => {
    if (!onEditEndDate) {
      return;
    }

    const newY = position.top + position.height + dy;
    if (newY <= position.top) {
      currentHeight.setOffset(position.height);
      currentHeight.setValue(0);
      return;
    }
    onEditEndDate(event, newY);
  }, [event, onEditEndDate]);

  useEffect(() => {
    translatedByDrag.setValue({ x: 0, y: 0 });
    const { left, width, height } = position;

    // No animation, only changes by dragging
    currentHeight.setOffset(height);
    currentHeight.setValue(0);

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

  const containerPanResponder = useMemo(() => {
    return PanResponder.create({
      onStartShouldSetPanResponder: () => isDragEnabled,
      onStartShouldSetPanResponderCapture: () =>
        isPressDisabled && isDragEnabled,
      onMoveShouldSetPanResponder: (_, gestureState) =>
        isDragEnabled && hasMovedEnough(gestureState),
      onMoveShouldSetPanResponderCapture: (_, gestureState) =>
        isPressDisabled && isDragEnabled && hasMovedEnough(gestureState),
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
    });
  }, [onDragRelease, isDragEnabled, isPressDisabled]);

  const editCirclePanResponder = useMemo(() =>
    PanResponder.create({
      onStartShouldSetPanResponder: () => isEditing,
      onStartShouldSetPanResponderCapture: () => isEditing,
      onMoveShouldSetPanResponder: () => isEditing,
      onMoveShouldSetPanResponderCapture: () => isEditing,
      onPanResponderMove: Animated.event(
        [
          null,
          {
            dy: currentHeight,
          },
        ],
        {
          useNativeDriver: false,
        },
      ),
      onPanResponderTerminationRequest: () => false,
      onPanResponderRelease: (_, gestureState) => {
        const { dy } = gestureState;
        onEditRelease(position, dy);
        onStartEditingEvent(null);
      },
      onPanResponderTerminate: () => {
        currentHeight.setOffset(position.height);
        currentHeight.setValue(0);
        onStartEditingEvent(null);
      },
    }), [isEditing, position, onEditRelease, onStartEditingEvent]);

  return (
    <Animated.View
      style={[
        styles.container,
        {
          top: position.top,
          left: currentLeft,
          height: currentHeight,
          width: currentWidth,
          backgroundColor: event.color,
          transform: translatedByDrag.getTranslateTransform(),
        },
        containerStyle,
        isEditing && { opacity: EDITING_OPACITY },
      ]}
      /* eslint-disable react/jsx-props-no-spreading */
      {...containerPanResponder.panHandlers}
    >
      <TouchableOpacity
        onPress={() => onPressContainer && onPressContainer(event)}
        onLongPress={() => onLongPressContainer && onLongPressContainer(event)}
        style={styles.touchableContainer}
        disabled={isPressDisabled}
      >
        {EventComponent ? (
          <EventComponent event={event} position={position} />
        ) : (
          <Text style={styles.description}>{event.description}</Text>
        )}
      </TouchableOpacity>
      {isEditing && (
        <View
          style={styles.circle}
          hitSlop={{ bottom: 10, left: 10, right: 10, top: 10 }}
          /* eslint-disable react/jsx-props-no-spreading */
          {...editCirclePanResponder.panHandlers}
        />
      )}
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
  onEditEndDate: PropTypes.func,
  editingEventId: PropTypes.number,
  onStartEditingEvent: PropTypes.func,
  editingInteraction: PropTypes.oneOf(['press', 'longPress']),
};

export default Event;
