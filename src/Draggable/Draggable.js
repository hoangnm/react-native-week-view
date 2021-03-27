import React from 'react';
import {
  PanResponder,
  Animated,
  TouchableOpacity,
  ViewPropTypes,
} from 'react-native';
import PropTypes from 'prop-types';
import styles from './Draggable.styles';

const Draggable = (props) => {
  const {
    children,
    style,
    position,
    onPress,
    onDragRelease,
  } = props;

  const pan = React.useRef(new Animated.ValueXY());

  const pressDisabled = !onPress;

  React.useLayoutEffect(() => {
    pan.current.setValue({ x: 0, y: 0 });
  }, [position]);

  const panResponder = React.useMemo(() => PanResponder.create({
    // If the TouchableOpacity is disabled, the Animated.View should start to take the gestures
    onStartShouldSetPanResponder: () => pressDisabled,
    onStartShouldSetPanResponderCapture: () => pressDisabled,
    onMoveShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponderCapture: () => true,
    onPanResponderMove: Animated.event(
      [
        null,
        {
          dx: pan.current.x,
          dy: pan.current.y,
        },
      ],
      {
        useNativeDriver: false,
      }
    ),
    onPanResponderRelease: (_, gestureState) => {
      const { dx, dy } = gestureState;
      const newX = (position.left + position.width / 2) + dx;
      const newY = position.top + dy;
      onDragRelease(newX, newY);
    },
  }), [position, onDragRelease]);

  return (
    <Animated.View
      pointerEvents="box-none"
      style={[style, position, pan.current.getTranslateTransform()]}
      {...panResponder.panHandlers}
    >
      <TouchableOpacity
        style={styles.touchableContainer}
        disabled={pressDisabled}
        onPress={onPress}
      >
        {children}
      </TouchableOpacity>
    </Animated.View>
  );
}

export const positionPropType = PropTypes.shape({
  height: PropTypes.number,
  width: PropTypes.number,
  top: PropTypes.number,
  left: PropTypes.number,
});

Draggable.propTypes = {
  children: PropTypes.element.isRequired,
  position: positionPropType.isRequired,
  style: ViewPropTypes.style,
  onPress: PropTypes.func,
  onDragRelease: PropTypes.func.isRequired,
};

export default Draggable;