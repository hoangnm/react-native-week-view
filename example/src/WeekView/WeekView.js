import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Text,
  View,
  ScrollView,
} from 'react-native';

import Events from '../Events/Events';

import styles from './WeekView.styles';

const TIME_LABELS_COUNT = 48;

const TimeLabel = ({ time }) => {
  return (
    <View style={styles.timeLabel}>
      <Text style={styles.timeText}>{time}</Text>
    </View>
  );
};

class WeekView extends Component {
  constructor(props) {
    super(props);

    this.times = this.generateTimes();
  }

  onEventPress = (item) => {
    const { onEventPress } = this.props;
    if (onEventPress) {
      onEventPress(item.data);
    }
  };

  generateTimes = () => {
    const times = [];
    for (let i = 0; i < TIME_LABELS_COUNT; i += 1) {
      const minutes = i % 2 === 0 ? '00' : '30';
      const hour = Math.floor(i / 2);
      const time = `${hour}:${minutes}`;
      times.push(time);
    }
    return times;
  };

  render() {
    const {
      events,
      selectedDate,
      numberOfDays,
      style,
    } = this.props;
    return (
      <View style={styles.container}>
        <Events
          times={this.times}
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
  style: View.propTypes.style,
  selectedDate: PropTypes.instanceOf(Date),
};

WeekView.defaultProps = {
  events: [],
  selectedDate: new Date(),
};

export default WeekView;
