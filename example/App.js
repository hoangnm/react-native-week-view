/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {SafeAreaView, StyleSheet, StatusBar, Alert} from 'react-native';

import WeekView, { createFixedWeekDate } from 'react-native-week-view';

const generateDates = (hours, minutes) => {
  const date = new Date();
  date.setHours(date.getHours() + hours);
  if (minutes != null) {
    date.setMinutes(minutes);
  }
  return date;
};

const sampleEvents = [
  {
    id: 1,
    description: 'Event 1',
    startDate: generateDates(0),
    endDate: generateDates(2),
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

const sampleFixedEvents = [
  {
    id: 1,
    description: 'Event 1',
    startDate: createFixedWeekDate('Monday', 12),
    endDate: createFixedWeekDate(1, 14),
    color: 'blue',
  },
  {
    id: 2,
    description: 'Event 2',
    startDate: createFixedWeekDate('wed', 16),
    endDate: createFixedWeekDate(3, 17, 30),
    color: 'red',
  },
];

// For debugging purposes
const showFixedComponent = true;

class App extends React.Component {
  state = {
    events: showFixedComponent ? sampleFixedEvents : sampleEvents,
    selectedDate: new Date(),
  };

  onEventPress = ({id, color, startDate, endDate}) => {
    Alert.alert(
      `event ${color} - ${id}`,
      `start: ${startDate}\nend: ${endDate}`,
    );
  };

  onGridClick = (event, startHour, date) => {
    const dateStr = date.toISOString().split('T')[0];
    Alert.alert(`Date: ${dateStr}\nStart hour: ${startHour}`);
  };

  render() {
    const {events, selectedDate} = this.state;
    return (
      <>
        <StatusBar barStyle="dark-content" />
        <SafeAreaView style={styles.container}>
          <WeekView
            ref={r => {
              this.componentRef = r;
            }}
            events={events}
            selectedDate={selectedDate}
            numberOfDays={7}
            onEventPress={this.onEventPress}
            onGridClick={this.onGridClick}
            headerStyle={styles.header}
            headerTextStyle={styles.headerText}
            hourTextStyle={styles.hourText}
            eventContainerStyle={styles.eventContainer}
            formatDateHeader={showFixedComponent ? "ddd" : "ddd DD"}
            hoursInDisplay={12}
            startHour={8}
            fixedHorizontally={showFixedComponent}
            showTitle={!showFixedComponent}
          />
        </SafeAreaView>
      </>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    paddingTop: 22,
  },
  header: {
    backgroundColor: '#4286f4',
    borderColor: '#fff',
  },
  headerText: {
    color: 'white',
  },
  hourText: {
    color: 'black',
  },
  eventContainer: {
    borderWidth: 1,
    borderColor: 'black',
  },
});

export default App;
