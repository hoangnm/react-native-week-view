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
    (translation) => onEdit && onEdit(event, translation),
    [event, onEdit],
  );

  const resizeByEdit = {
    bottom: useSharedValue(0),
    right: useSharedValue(0),
    top: useSharedValue(0),
    topPinOpposite: useSharedValue(0),
    left: useSharedValue(0),
    leftPinOpposite: useSharedValue(0),
  };

  // Used when exitAfterFirst: false
  const accumulatedEdit = {
    top: useSharedValue(0),
    left: useSharedValue(0),
    width: useSharedValue(0),
    height: useSharedValue(0),
  };

  const translatedByDrag = useSharedValue({ x: 0, y: 0 });
  const currentWidth = useDerivedValue(
    () =>
      position.width +
      resizeByEdit.right.value +
      resizeByEdit.leftPinOpposite.value +
      accumulatedEdit.width.value,
  );
  const currentLeft = useDerivedValue(
    () => position.left + resizeByEdit.left.value + accumulatedEdit.left.value,
  );
  const currentTop = useDerivedValue(
    () => position.top + resizeByEdit.top.value + accumulatedEdit.top.value,
  );

  const currentHeight = useDerivedValue(
    () =>
      position.height +
      resizeByEdit.bottom.value +
      resizeByEdit.topPinOpposite.value +
      accumulatedEdit.height.value,
  );

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
      width: currentWidth.value,
      left: currentLeft.value,
      top: currentTop.value,
      height: currentHeight.value,
      opacity: withSpring(currentOpacity.value),
    };
  });

  useAnimatedReaction(
    () => position,
    ({ top, left, height, width }) => {
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

  useAnimatedReaction(
    () => editingEventId,
    (targetEvent) => {
      if (targetEvent !== event.id) {
        Object.keys(resizeByEdit).forEach((key) => {
          if (resizeByEdit[key].value !== 0) {
            resizeByEdit[key].value = withTiming(0, {
              duration: UPDATE_EVENT_ANIMATION_DURATION,
            });
          }
        });
        Object.keys(accumulatedEdit).forEach((key) => {
          if (accumulatedEdit[key].value !== 0) {
            accumulatedEdit[key].value = withTiming(0, {
              duration: UPDATE_EVENT_ANIMATION_DURATION,
            });
          }
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
    .enabled(!!onLongPress && !isEditing)
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
    .enabled(!!onPress && !isEditing)
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
        switch (side) {
          case 'top':
            resizeByEdit.top.value = panEvt.translationY;
            resizeByEdit.topPinOpposite.value = -panEvt.translationY;
            break;
          case 'bottom':
            resizeByEdit.bottom.value = panEvt.translationY;
            break;
          case 'left':
            resizeByEdit.left.value = panEvt.translationX;
            resizeByEdit.leftPinOpposite.value = -panEvt.translationX;
            break;
          case 'right':
            resizeByEdit.right.value = panEvt.translationX;
            break;
          default:
        }
      })
      .onEnd((panEvt, success) => {
        if (!success) {
          resizeByEdit[side].value = 0;
          return;
        }
        const movedAmount = resizeByEdit[side].value;
        resizeByEdit[side].value = 0;

        if (!(editEventConfig && editEventConfig.exitAfterFirst)) {
          switch (side) {
            case 'top':
              accumulatedEdit.top.value += movedAmount;
              accumulatedEdit.height.value -= movedAmount;
              resizeByEdit.topPinOpposite.value = 0;
              break;
            case 'bottom':
              accumulatedEdit.height.value += movedAmount;
              break;
            case 'left':
              accumulatedEdit.left.value += movedAmount;
              accumulatedEdit.width.value -= movedAmount;
              resizeByEdit.leftPinOpposite.value = 0;
              break;
            case 'right':
              accumulatedEdit.width.value += movedAmount;
              break;
            default:
          }
        }

        runOnJS(onEditRelease)({ [side]: movedAmount });
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

// TODO: shape
// export const EditEventConfigPropType = PropTypes.object;

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
