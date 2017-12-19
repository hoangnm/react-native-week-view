/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  StyleSheet,
  View,
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
        startDate: new Date(),
        endDate: this.generateDates(3),
        color: 'blue',
      },
      {
        id: 2,
        description: 'Truck 2',
        startDate: new Date(),
        endDate: this.generateDates(2),
        color: 'red',
      },
      {
        id: 3,
        description: 'Truck 3',
        startDate: this.generateDates(5),
        endDate: this.generateDates(8),
        color: 'green',
      },
    ];

    return (
      <View style={styles.container}>
        <WeekView events={events} />
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
