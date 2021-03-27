import React from 'react';
import PropTypes from 'prop-types';
import { Text, TouchableOpacity } from 'react-native';
import Draggable, { positionPropType } from '../Draggable/Draggable.js';
import styles from './Event.styles';

const Event = ({
  event,
  onPress,
  position,
  EventComponent,
  containerStyle,
  isDraggable,
  onDragEvent,
}) => {
  const child = EventComponent ? (
    <EventComponent event={event} position={position} />
  ) : (
    <Text style={styles.description}>{event.description}</Text>
  );
  if (!isDraggable || !onDragEvent) {
    return (
      <TouchableOpacity
        onPress={() => onPress && onPress(event)}
        style={[
          styles.item,
          position,
          {
            backgroundColor: event.color,
          },
          containerStyle,
        ]}
        disabled={!onPress}
      >
        {child}
      </TouchableOpacity>
    );
  }
  const onDragRelease = React.useCallback((newX, newY) => {
    onDragEvent(event, newX, newY);
  }, [event]);

  return (
    <Draggable
      position={position}
      style={[
        styles.item,
        {
          backgroundColor: event.color,
        },
        containerStyle,
      ]}
      onPress={() => onPress && onPress(event)}
      onDragRelease={onDragRelease}
      disabled={!onPress}
    >
      {child}
    </Draggable>
  );
};

const eventPropType = PropTypes.shape({
  color: PropTypes.string,
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  description: PropTypes.string,
  startDate: PropTypes.instanceOf(Date).isRequired,
  endDate: PropTypes.instanceOf(Date).isRequired,
});

Event.propTypes = {
  event: eventPropType.isRequired,
  onPress: PropTypes.func,
  position: positionPropType,
  containerStyle: PropTypes.object,
  EventComponent: PropTypes.elementType,
  isDraggable: PropTypes.bool,
  onDragEvent: PropTypes.func,
};

export default Event;
