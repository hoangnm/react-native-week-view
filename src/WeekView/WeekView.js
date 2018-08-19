import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  View,
} from 'react-native';

import Events from '../Events/Events';
import styles from './WeekView.styles';

class WeekView extends Component {
  render() {
    const {
      events,
      selectedDate,
      numberOfDays,
      times,
      onEventPress,
    } = this.props;
    const date = selectedDate || new Date();
    return (
      <View style={styles.container}>
        <Events
          times={times}
          events={events}
          numberOfDays={numberOfDays}
          onEventPress={onEventPress}
          selectedDate={date}
        />
      </View>
    );
  }
}

WeekView.propTypes = {
  numberOfDays: PropTypes.oneOf([1, 3, 7]).isRequired,
  events: Events.propTypes.events,
  onEventPress: PropTypes.func,
  selectedDate: PropTypes.instanceOf(Date),
};

WeekView.defaultProps = {
  events: [],
};

export default WeekView;
