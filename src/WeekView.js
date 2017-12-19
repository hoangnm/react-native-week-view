import React, { Component } from 'react';
import {
  Text,
  View,
  ScrollView,
} from 'react-native';

import styles from './styles';

const TIME_LABELS_COUNT = 48;

const TimeRow = () => {
  return (
    <View style={styles.timeRow}>
      <View style={styles.timeLabelLine} />
    </View>
  );
};

const TimeLabel = ({ time }) => { // eslint-disable-line react/prop-types
  return (
    <View style={styles.timeLabel}>
      <Text style={styles.timeText}>{time}</Text>
    </View>
  );
};

class WeekView extends Component {
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
    const times = this.generateTimes();

    return (
      <View style={styles.container}>
        <ScrollView>
          <View style={styles.timeLineContainer}>
            <View style={styles.timeColumn}>
              {times.map((time) => {
                return (<TimeLabel key={`${time}`} time={time} />);
              })}
            </View>
            <View style={styles.eventColumn}>
              {times.map((time) => {
                return (<TimeRow key={time} time={time} />);
              })}
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }
}

export default WeekView;
