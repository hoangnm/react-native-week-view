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
  StatusBar,
  Alert,
  ActivityIndicator,
} from 'react-native';

import WeekView, {createFixedWeekDate} from 'react-native-week-view';

const generateDates = (hours, minutes) => {
  const date = new Date();
  date.setHours(date.getHours() + hours);
  if (minutes != null) {
    date.setMinutes(minutes);
  }
  return date;
};

const makeBuilder = () => {
  let index = 0;

  return (start, duration, color) => {
    index += 1;
    return {
      id: index,
      description: `Event ${index}`,
      startDate: generateDates(start),
      endDate: generateDates(start + duration),
      color,
    };
  };
};
const buildEvent = makeBuilder();

const sampleEvents = [
  // Previous week
  buildEvent(-24 * 7 - 5, 2, 'pink'),
  buildEvent(-24 * 7 - 14, 3, 'lightblue'),

  // This week
  buildEvent(0, 2, 'blue'),
  buildEvent(1, 3, 'red'),
  buildEvent(-18, 4, 'green'),

  // Next week
  buildEvent(24 * 7, 2, 'magenta'),
  buildEvent(24 * 7 - 48, 3, 'lightblue'),
  buildEvent(24 * 7 + 6, 6, 'brown'),

  // Two more weeks
  buildEvent(48 * 7, 2, 'pink'),
  buildEvent(48 * 7 - 54, 4, 'green'),
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
const showFixedComponent = false;

const MyRefreshComponent = ({style}) => (
  // Just an example
  <ActivityIndicator style={style} color="red" size="large" />
);

class App extends React.Component {
  state = {
    events: showFixedComponent ? sampleFixedEvents : sampleEvents,
    selectedDate: new Date(),
    numberOfDays: 7,
  };

  onEventPress = ({id, color, startDate, endDate}) => {
    Alert.alert(
      `event ${color} - ${id}`,
      `start: ${startDate}\nend: ${endDate}`,
    );
  };

  onGridClick = (event, startHour, date) => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1; // zero-based
    const day = date.getDate();
    const hour = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();

    Alert.alert(`${year}-${month}-${day} ${hour}:${minutes}:${seconds}`);
  };

  onDragEvent = (event, newStartDate, newEndDate) => {
    // Here you should update the event in your DB with the new date and hour
    this.setState({
      events: [
        ...this.state.events.filter(e => e.id !== event.id),
        {
          ...event,
          startDate: newStartDate,
          endDate: newEndDate,
        },
      ],
    });
  };

  onDayPress = (date, formattedDate) => {
    console.log('Day: ', date, formattedDate);
  };

  onMonthPress = (date, formattedDate) => {
    console.log('Month: ', date, formattedDate);
  };

  onTimeScrolled = date => {
    console.log(`New start time: ${date.getHours()}:${date.getMinutes()}`);
  };

  render() {
    const {events, selectedDate, numberOfDays} = this.state;
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
            numberOfDays={numberOfDays}
            onEventPress={this.onEventPress}
            onGridClick={this.onGridClick}
            headerStyle={styles.header}
            headerTextStyle={styles.headerText}
            hourTextStyle={styles.hourText}
            eventContainerStyle={styles.eventContainer}
            gridColumnStyle={styles.gridColumn}
            gridRowStyle={styles.gridRow}
            formatDateHeader={showFixedComponent ? 'ddd' : 'ddd DD'}
            hoursInDisplay={12}
            timeStep={60}
            startHour={8}
            fixedHorizontally={showFixedComponent}
            showTitle={!showFixedComponent}
            showNowLine
            onDragEvent={this.onDragEvent}
            isRefreshing={false}
            RefreshComponent={MyRefreshComponent}
            onDayPress={this.onDayPress}
            onMonthPress={this.onMonthPress}
            onTimeScrolled={this.onTimeScrolled}
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
  gridRow: {
    borderTopWidth: 1,
    borderColor: '#E9EDF0',
  },
  gridColumn: {
    borderLeftWidth: 1,
    borderColor: '#E9EDF0',
  },
});

export default App;
