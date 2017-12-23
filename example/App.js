/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Alert,
} from 'react-native';
import WeekView from 'react-native-week-view';

export default class App extends Component<{}> {
  generateDates = (hours, minutes) => {
    const date = new Date();
    date.setHours(date.getHours() + hours);
    if (minutes != null) {
      date.setMinutes(0);
    }
    return date;
  };

  render() {
    const events = [
      {
        id: 1,
        description: 'Truck 1',
        startDate: this.generateDates(0),
        endDate: this.generateDates(2),
        color: 'blue',
      },
      {
        id: 2,
        description: 'Truck 2',
        startDate: this.generateDates(1),
        endDate: this.generateDates(4),
        color: 'red',
      },
      {
        id: 3,
        description: 'Truck 3',
        startDate: this.generateDates(-5),
        endDate: this.generateDates(-3),
        color: 'green',
      },
    ];

    return (
      <View style={styles.container}>
        <WeekView events={events} numberOfDays={3} onEventPress={() => Alert.alert('select')} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    paddingTop: 22,
  },
});
