import React from 'react';
import PropTypes from 'prop-types';
import { Text, TouchableOpacity } from 'react-native';
import styles from './Event.styles';

const Event = ({ event, onPress, style, EventComponent }) => {
  return (
    <TouchableOpacity
      onPress={() => onPress && onPress(event)}
      style={[
        styles.item,
        style,
        {
          backgroundColor: event.color,
        },
      ]}
      disabled={!onPress}
    >
      {EventComponent ? (
        <EventComponent event={event} position={style} />
      ) : (
        <Text style={styles.description}>{event.description}</Text>
      )}
    </TouchableOpacity>
  );
};

const eventPropTypes = PropTypes.shape({
  color: PropTypes.string,
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  description: PropTypes.string,
  startDate: PropTypes.instanceOf(Date).isRequired,
  endDate: PropTypes.instanceOf(Date).isRequired,
});

Event.propTypes = {
  event: eventPropTypes.isRequired,
  onPress: PropTypes.func,
  style: PropTypes.object,
};

export default Event;
