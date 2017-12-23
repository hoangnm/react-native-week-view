import React from 'react';
import PropTypes from 'prop-types';
import {
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import styles from './Event.styles';

const Event = ({ event, onPress, style }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.item, style, {
        backgroundColor: event.color,
      }]}
    >
      <Text style={styles.description}>{event.description}</Text>
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
  style: View.propTypes.style,
};

Event.defaultProps = {
  onPress: null,
  style: null,
};

export default Event;
