import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { View, Text } from 'react-native';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useAnimatedReaction,
  useSharedValue,
  withTiming,
  withSpring,
  runOnJS,
  useDerivedValue,
} from 'react-native-reanimated';
import styles, { circleStyles } from './Event.styles';

const DEFAULT_COLOR = 'red';
const UPDATE_EVENT_ANIMATION_DURATION = 150;

const SIDES = ['bottom', 'top', 'left', 'right'];

const Circle = ({ side }) => (
  <View
    style={circleStyles[side]}
    hitSlop={{ bottom: 10, left: 10, right: 10, top: 10 }}
  />
);

const Circles = ({ isEditing, editEventConfig, buildCircleGesture }) =>
  isEditing
    ? SIDES.reduce((acc, side) => {
        if (editEventConfig[side]) {
          acc.push(
            <GestureDetector key={side} gesture={buildCircleGesture(side)}>
              <Circle side={side} />
            </GestureDetector>,
          );
        }
        return acc;
      }, [])
    : [];

const Event = ({
  event,
  onPress,
  onLongPress,
  position,
  EventComponent,
  containerStyle,
  onDrag,
  onEdit,
  editingEventId,
  editEventConfig,
}) => {
  const isEditing = !!onEdit && editingEventId === event.id;
  const isDragEnabled = !!onDrag && editingEventId == null;

  // Wrappers are needed due to RN-reanimated runOnJS behavior. See docs:
  // https://docs.swmansion.com/react-native-reanimated/docs/api/miscellaneous/runOnJS
  const onPressWrapper = useCallback(() => onPress && onPress(event), [
    event,
    onPress,
  ]);
  const onLongPressWrapper = useCallback(
    () => onLongPress && onLongPress(event),
    [event, onLongPress],
  );

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

  const onEditRelease = useCallback(
    (params) => onEdit && onEdit(event, params),
    [event, onEdit],
  );

  const resizeByEdit = {
    bottom: useSharedValue(0),
    right: useSharedValue(0),
    top: useSharedValue(0),
    left: useSharedValue(0),
  };

  const translatedByDrag = useSharedValue({ x: 0, y: 0 });
  const currentWidth = useSharedValue(position.width);
  const currentLeft = useSharedValue(position.left);
  const currentTop = useSharedValue(position.top);
  const currentHeight = useSharedValue(position.height);

  const isDragging = useSharedValue(false);
  const isPressing = useSharedValue(false);
  const isLongPressing = useSharedValue(false);

  const currentOpacity = useDerivedValue(() => {
    if (isDragging.value || isPressing.value || isLongPressing.value) {
      return 0.5;
    }
    return 1;
  });

  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translatedByDrag.value.x },
        { translateY: translatedByDrag.value.y },
      ],
      width:
        currentWidth.value + resizeByEdit.right.value - resizeByEdit.left.value,
      left: currentLeft.value + resizeByEdit.left.value,
      top: currentTop.value + resizeByEdit.top.value,
      height:
        currentHeight.value +
        resizeByEdit.bottom.value -
        resizeByEdit.top.value,
      opacity: withSpring(currentOpacity.value),
    };
  });

  useAnimatedReaction(
    () => position,
    (newPosition) => {
      const { top, left, height, width } = newPosition;
      if (currentTop.value !== top) {
        currentTop.value = withTiming(top, {
          duration: UPDATE_EVENT_ANIMATION_DURATION,
        });
      }
      if (currentLeft.value !== left) {
        currentLeft.value = withTiming(left, {
          duration: UPDATE_EVENT_ANIMATION_DURATION,
        });
      }
      if (currentHeight.value !== height) {
        currentHeight.value = withTiming(height, {
          duration: UPDATE_EVENT_ANIMATION_DURATION,
        });
      }
      if (currentWidth.value !== width) {
        currentWidth.value = withTiming(width, {
          duration: UPDATE_EVENT_ANIMATION_DURATION,
        });
      }
    },
  );

  const dragGesture = Gesture.Pan()
    .enabled(isDragEnabled)
    .withTestId(`dragGesture-${event.id}`)
    .onTouchesDown(() => {
      isDragging.value = true;
    })
    .onUpdate((e) => {
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

      currentTop.value += translationY;
      currentLeft.value += translationX;
      translatedByDrag.value = { x: 0, y: 0 };

      runOnJS(onDragRelease)(translationX, translationY);
    })
    .onFinalize(() => {
      isDragging.value = false;
    });

  const longPressGesture = Gesture.LongPress()
    .enabled(!!onLongPress)
    .maxDistance(20)
    .onTouchesDown(() => {
      isLongPressing.value = true;
    })
    .onEnd((evt, success) => {
      if (success) {
        runOnJS(onLongPressWrapper)();
      }
    })
    .onFinalize(() => {
      isLongPressing.value = false;
    });

  const pressGesture = Gesture.Tap()
    .enabled(!!onPress)
    .withTestId(`pressGesture-${event.id}`)
    .onTouchesDown(() => {
      isPressing.value = true;
    })
    .onEnd((evt, success) => {
      if (success) {
        runOnJS(onPressWrapper)();
      }
    })
    .onFinalize(() => {
      isPressing.value = false;
    });

  const composedGesture = Gesture.Race(
    dragGesture,
    longPressGesture,
    pressGesture,
  );

  const buildCircleGesture = (side) =>
    Gesture.Pan()
      .onUpdate((panEvt) => {
        const { translationX, translationY } = panEvt;
        const { height, width } = position;
        switch (side) {
          case 'top':
            if (translationY < height) {
              resizeByEdit.top.value = translationY;
            }
            break;
          case 'bottom':
            if (translationY > -height) {
              resizeByEdit.bottom.value = translationY;
            }
            break;
          case 'left':
            if (translationX < width) {
              resizeByEdit.left.value = translationX;
            }
            break;
          case 'right':
            if (translationX > -width) {
              resizeByEdit.right.value = translationX;
            }
            break;
          default:
        }
      })
      .onEnd((panEvt, success) => {
        if (!success) {
          resizeByEdit[side].value = 0;
          return;
        }
        const resizedAmount = resizeByEdit[side].value;
        resizeByEdit[side].value = 0;

        const params = {};
        switch (side) {
          case 'top':
            currentTop.value += resizedAmount;
            currentHeight.value -= resizedAmount;
            params.top = currentTop.value;
            break;
          case 'bottom':
            currentHeight.value += resizedAmount;
            params.bottom = currentTop.value + currentHeight.value;
            break;
          case 'left':
            currentLeft.value += resizedAmount;
            currentWidth.value -= resizedAmount;
            params.left = currentLeft.value;
            break;
          case 'right':
            currentWidth.value += resizedAmount;
            params.right = currentLeft.value + currentWidth.value;
            break;
          default:
        }

        runOnJS(onEditRelease)(params);
      });

  return (
    <GestureDetector gesture={composedGesture}>
      <Animated.View
        testID={`WeekViewEvent-${event.id}`}
        accessible
        accessibilityLabel={`Show event ${event.id}`}
        accessibilityHint={`Show event ${event.id}`}
        style={[
          styles.container,
          {
            backgroundColor: event.color || DEFAULT_COLOR,
          },
          containerStyle,
          event.style,
          animatedStyles,
        ]}
      >
        {EventComponent ? (
          <EventComponent event={event} position={position} />
        ) : (
          <Text style={styles.description}>{event.description}</Text>
        )}
        <Circles
          isEditing={isEditing}
          editEventConfig={editEventConfig}
          buildCircleGesture={buildCircleGesture}
        />
      </Animated.View>
    </GestureDetector>
  );
};

export const EditEventConfigPropType = PropTypes.shape({
  left: PropTypes.bool,
  top: PropTypes.bool,
  right: PropTypes.bool,
  bottom: PropTypes.bool,
});

export const eventPropType = PropTypes.shape({
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
  onEdit: PropTypes.func,
  editingEventId: PropTypes.number,
};

export default Event;
