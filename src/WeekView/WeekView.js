import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  View,
} from 'react-native';

import Events from '../Events/Events';
import styles from './WeekView.styles';

class WeekView extends Component {
  onEventPress = (item) => {
    const { onEventPress } = this.props;
    if (onEventPress) {
      onEventPress(item.data);
    }
  };

  render() {
    const {
      events,
      selectedDate,
      numberOfDays,
      times,
    } = this.props;
    return (
      <View style={styles.container}>
        <Events
          times={times}
          events={events}
          numberOfDays={numberOfDays}
          onEventPress={this.onEventPress}
          selectedDate={selectedDate}
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
  selectedDate: new Date(),
};

export default WeekView;
