/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  Alert
} from 'react-native';

import {
  Header,
} from 'react-native/Libraries/NewAppScreen';

import WeekView from 'react-native-week-view';

const App: () => React$Node = () => {
  const selectedDate = new Date();
  const generateDates = (hours, minutes) => {
    const date = new Date();
    date.setHours(date.getHours() + hours);
    if (minutes != null) {
      date.setMinutes(minutes);
    }
    return date;
  };
  const events = [
    {
      id: 1,
      description: 'Event 1',
      startDate: generateDates(0),
      endDate:generateDates(2),
      color: 'blue',
    },
    {
      id: 2,
      description: 'Event 2',
      startDate: generateDates(1),
      endDate: generateDates(4),
      color: 'red',
    },
    {
      id: 3,
      description: 'Event 3',
      startDate: generateDates(-5),
      endDate: generateDates(-3),
      color: 'green',
    },
  ];
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={styles.container}>
        <WeekView
          events={events}
          selectedDate={this.selectedDate}
          numberOfDays={3}
          onEventPress={(event) => Alert.alert('eventId:' + event.id)}
          headerStyle={styles.headerStyle}
          headerTextColor="#fff"
          formatDateHeader="MMM D"
        />
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    paddingTop: 22,
  },
  headerStyle: {
    backgroundColor: '#4286f4',
  },
});

export default App;
