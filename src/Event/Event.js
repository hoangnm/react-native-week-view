import React from 'react';
import PropTypes from 'prop-types';
import {
  Animated,
  PanResponder,
  Text,
  TouchableOpacity,
} from 'react-native';
import styles from './Event.styles';

const hasMovedEnough = (gestureState) => {
  const { dx, dy } = gestureState;
  const hasMovedEnough = Math.abs(dx) > 2 || Math.abs(dy) > 2;
  return hasMovedEnough;
};

class Event extends React.Component {
  translatedByDrag = new Animated.ValueXY();

  panResponder = PanResponder.create({
    // If the press is disabled, the drag-gesture will be handled in the capture phase
    // If the press is enabled, will be handled in the bubbling phase
    onStartShouldSetPanResponder: () => this.isDragEnabled(),
    onStartShouldSetPanResponderCapture: () => this.isPressDisabled()
      && this.isDragEnabled(),
    onMoveShouldSetPanResponder: (_, gestureState) => this.isDragEnabled()
      && hasMovedEnough(gestureState),
    onMoveShouldSetPanResponderCapture: (_, gestureState) => this.isPressDisabled()
      && this.isDragEnabled()
      && hasMovedEnough(gestureState),
    onPanResponderMove: Animated.event(
      [
        null,
        {
          dx: this.translatedByDrag.x,
          dy: this.translatedByDrag.y,
        },
      ],
      {
        useNativeDriver: false,
      }
    ),
    onPanResponderRelease: (_, gestureState) => {
      const { dx, dy } = gestureState;
      this.onDragRelease(dx, dy);
    },
    onPanResponderTerminate: () => {
      this.translatedByDrag.setValue({ x: 0, y: 0 });
    },
  });

  componentDidUpdate(prevProps) {
    if (prevProps.position !== this.props.position) {
      this.translatedByDrag.setValue({ x: 0, y: 0 });
    }
  }

  isPressDisabled = () => {
    return !this.props.onPress;
  }

  isDragEnabled = () => {
    const { isDraggable, onDrag } = this.props;
    return isDraggable && onDrag;
  }

  onDragRelease = (dx, dy) => {
    const { position, onDrag } = this.props;
    if (!onDrag) {
      return;
    }

    const newX = (position.left + position.width / 2) + dx;
    const newY = position.top + dy;
    onDrag(this.props.event, newX, newY);
  }

  render() {
    const {
      event,
      onPress,
      position,
      EventComponent,
      containerStyle,
    } = this.props;

    return (
      <Animated.View
        style={[
          styles.container,
          position,
          this.translatedByDrag.getTranslateTransform(),
          {
            backgroundColor: event.color,
          },
          containerStyle,
        ]}
        {...this.panResponder.panHandlers}
      >
        <TouchableOpacity
          style={styles.touchableContainer}
          disabled={!onPress}
          onPress={() => onPress && onPress(event)}
        >
          {EventComponent ? (
            <EventComponent event={event} position={position} />
          ) : (
            <Text style={styles.description}>{event.description}</Text>
          )}
        </TouchableOpacity>
      </Animated.View>
    );
  }
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
  onPress: PropTypes.func,
  position: positionPropType,
  containerStyle: PropTypes.object,
  EventComponent: PropTypes.elementType,
  isDraggable: PropTypes.bool,
  onDrag: PropTypes.func,
};

export default Event;
