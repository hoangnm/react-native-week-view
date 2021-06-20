import React from 'react';
import PropTypes from 'prop-types';
import { Text, TouchableOpacity } from 'react-native';
import styles from './Event.styles';

const Event = ({
  event,
  onPress,
  onLongPress,
  position,
  EventComponent,
  containerStyle,
}) => {
  return (
    <TouchableOpacity
      onPress={() => onPress && onPress(event)}
      onLongPress={() => onLongPress && onLongPress(event)}
      style={[
        styles.item,
        position,
        {
          backgroundColor: event.color,
        },
        containerStyle,
      ]}
      disabled={!onPress && !onLongPress}
    >
      {EventComponent ? (
        <EventComponent event={event} position={position} />
      ) : (
        <Text style={styles.description}>{event.description}</Text>
      )}
    </TouchableOpacity>
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
  onPress: PropTypes.func,
  onLongPress: PropTypes.func,
  position: positionPropType,
  containerStyle: PropTypes.object,
  EventComponent: PropTypes.elementType,
};

export default Event;
