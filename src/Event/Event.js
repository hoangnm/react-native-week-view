import React from 'react';
import PropTypes from 'prop-types';
import { View, Text } from 'react-native';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  runOnJS,
  useDerivedValue,
} from 'react-native-reanimated';
import styles, { circleStyles } from './Event.styles';
import {
  EventPropType,
  EditEventConfigPropType,
  DragEventConfigPropType,
} from '../utils/types';
import { RunGesturesOnJSContext } from '../utils/gestures';
import {
  computeHeight,
  computeWidth,
  computeLeft,
  computeTop,
} from '../pipeline/position';
import { useVerticalDimensionContext } from '../utils/VerticalDimContext';

const DEFAULT_COLOR = 'red';
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

const DRAG_STATUS = {
  STATIC: 0,
  PRESSING: 1,
  MOVING: 2,
};

const Event = ({
  event,
  boxStartTimestamp,
  boxEndTimestamp,
  lane,
  nLanes,
  stackPosition,
  dayWidth,
  onPress,
  onLongPress,
  EventComponent,
  containerStyle,
  textStyle,
  onDrag,
  onEdit,
  editingEventId,
  editEventConfig,
  dragEventConfig,
}) => {
  const dragAfterLongPress =
    (dragEventConfig && dragEventConfig.afterLongPressDuration) || 0;
  const isEditing =
    dragAfterLongPress === 0 && !!onEdit && editingEventId === event.id;
  const isDragEnabled =
    !!onDrag && editingEventId == null && !event.disableDrag;

  const runGesturesOnJS = React.useContext(RunGesturesOnJSContext);
  const { verticalResolution, beginAgendaAt } = useVerticalDimensionContext();

  // Wrappers are needed due to RN-reanimated runOnJS behavior. See docs:
  // https://docs.swmansion.com/react-native-reanimated/docs/api/miscellaneous/runOnJS
  const onPressWrapper = () => onPress && onPress(event);
  const onLongPressWrapper = () => onLongPress && onLongPress(event);
  const onDragWrapper = (newX, newY, width) =>
    onDrag && onDrag(event, newX, newY, width);
  const onEditWrapper = (side, newPosition) =>
    onEdit && onEdit(event, side, newPosition);

  const resizeByEdit = {
    bottom: useSharedValue(0),
    right: useSharedValue(0),
    top: useSharedValue(0),
    left: useSharedValue(0),
  };

  const translatedByDrag = useSharedValue({ x: 0, y: 0 });
  const currentWidth = useDerivedValue(() =>
    computeWidth(
      boxStartTimestamp,
      boxEndTimestamp,
      nLanes,
      stackPosition,
      dayWidth,
    ),
  );
  const currentLeft = useDerivedValue(
    () => computeLeft(lane, nLanes, stackPosition, dayWidth),
    [boxStartTimestamp, lane, nLanes, stackPosition, dayWidth],
  );
  const currentTop = useDerivedValue(() =>
    computeTop(boxStartTimestamp, verticalResolution, beginAgendaAt),
  );
  const currentHeight = useDerivedValue(() =>
    computeHeight(boxStartTimestamp, boxEndTimestamp, verticalResolution),
  );

  const dragStatus = useSharedValue(DRAG_STATUS.STATIC);
  const isPressing = useSharedValue(false);
  const isLongPressing = useSharedValue(false);

  const currentOpacity = useDerivedValue(() => {
    if (dragAfterLongPress !== 0 && dragStatus.value === DRAG_STATUS.MOVING) {
      return 0.2;
    }
    if (
      isPressing.value ||
      isLongPressing.value ||
      dragStatus.value !== DRAG_STATUS.STATIC
    ) {
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

  const dragGesture = Gesture.Pan()
    .enabled(isDragEnabled)
    .withTestId(`dragGesture-${event.id}`)
    .runOnJS(runGesturesOnJS)
    .onTouchesDown(() => {
      dragStatus.value = DRAG_STATUS.PRESSING;
    })
    .onStart(() => {
      dragStatus.value = DRAG_STATUS.MOVING;
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

      // NOTE: do not delete these auxiliar variables
      // currentDimension.value might be updated asyncly in some cases
      const newX = currentLeft.value + translationX;
      const newY = currentTop.value + translationY;
      const width = currentWidth.value;

      currentTop.value += translationY;
      currentLeft.value += translationX;
      translatedByDrag.value = { x: 0, y: 0 };

      runOnJS(onDragWrapper)(newX, newY, width);
    })
    .onFinalize(() => {
      dragStatus.value = DRAG_STATUS.STATIC;
    });

  /**
   * Wrapper for RNGH version compatibility.
   *
   * Only RNGH >= 2.6.0 supports `activateAfterLongPress()`,
   * i.e. if using RNGH < 2.6.0, user must provide `dragAfterLongPress = 0`
   * and no errors are thrown.
   */
  const wrappedDragGesture =
    dragAfterLongPress > 0
      ? dragGesture.activateAfterLongPress(dragAfterLongPress)
      : dragGesture;

  const longPressGesture = Gesture.LongPress()
    .enabled(
      dragAfterLongPress === 0 && !!onLongPress && !event.disableLongPress,
    )
    .runOnJS(runGesturesOnJS)
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
    .enabled(!!onPress && !event.disablePress)
    .runOnJS(runGesturesOnJS)
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
    wrappedDragGesture,
    longPressGesture,
    pressGesture,
  );

  const buildCircleGesture = (side) =>
    Gesture.Pan()
      .runOnJS(runGesturesOnJS)
      .onUpdate((panEvt) => {
        const { translationX, translationY } = panEvt;
        switch (side) {
          case 'top':
            if (translationY < currentHeight.value) {
              resizeByEdit.top.value = translationY;
            }
            break;
          case 'bottom':
            if (translationY > -currentHeight.value) {
              resizeByEdit.bottom.value = translationY;
            }
            break;
          case 'left':
            if (translationX < currentWidth.value) {
              resizeByEdit.left.value = translationX;
            }
            break;
          case 'right':
            if (translationX > -currentWidth.value) {
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
        let newPosition = 0;

        switch (side) {
          case 'top':
            newPosition = currentTop.value + resizedAmount;

            currentTop.value += resizedAmount;
            currentHeight.value -= resizedAmount;
            break;
          case 'bottom':
            newPosition =
              currentTop.value + currentHeight.value + resizedAmount;

            currentHeight.value += resizedAmount;
            break;
          case 'left':
            newPosition = currentLeft.value + resizedAmount;

            currentLeft.value += resizedAmount;
            currentWidth.value -= resizedAmount;
            break;
          case 'right':
            newPosition =
              currentLeft.value + currentWidth.value + resizedAmount;

            currentWidth.value += resizedAmount;
            break;
          default:
        }

        runOnJS(onEditWrapper)(side, newPosition);
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
          <EventComponent event={event} />
        ) : (
          <Text style={[styles.description, textStyle, event.textStyle]}>
            {event.description}
          </Text>
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

Event.propTypes = {
  event: EventPropType.isRequired,
  boxStartTimestamp: PropTypes.number.isRequired,
  boxEndTimestamp: PropTypes.number.isRequired,
  lane: PropTypes.number,
  nLanes: PropTypes.number,
  stackPosition: PropTypes.number,
  dayWidth: PropTypes.number.isRequired,
  onPress: PropTypes.func,
  onLongPress: PropTypes.func,
  containerStyle: PropTypes.object,
  textStyle: PropTypes.object,
  EventComponent: PropTypes.elementType,
  dragEventConfig: DragEventConfigPropType,
  onDrag: PropTypes.func,
  onEdit: PropTypes.func,
  editingEventId: PropTypes.number,
  editEventConfig: EditEventConfigPropType,
};

export default React.memo(Event);
