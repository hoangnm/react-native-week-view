/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useState, useReducer, useRef, useCallback} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  StatusBar,
  Alert,
  ActivityIndicator,
} from 'react-native';

import WeekView, {createFixedWeekDate} from 'react-native-week-view';
import {buildDateCycler, makeBuilder} from './src/debug-utils';

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
const INITIAL_EVENTS = showFixedComponent ? sampleFixedEvents : sampleEvents;

const MyRefreshComponent = ({style}) => (
  // Just an example
  <ActivityIndicator style={style} color="red" size="large" />
);

const EDIT_EVENT_CONFIG = {
  top: true,
  bottom: true,
  left: true,
  right: true,
};

const eventsReducer = (prevEvents, actionPayload) => {
  const {event, newStartDate, newEndDate} = actionPayload;
  return [
    ...prevEvents.filter(e => e.id !== event.id),
    {
      ...event,
      startDate: newStartDate,
      endDate: newEndDate,
    },
  ];
};

const onDayPress = (date, formattedDate) => {
  console.log('Day: ', date, formattedDate);
};

const onTimeScrolled = date => {
  console.log(`New start time: ${date.getHours()}:${date.getMinutes()}`);
};

// Debug navigating through dates
const dateCycler = buildDateCycler([
  // // Example:
  // // selectedDate={new Date(2022, 7, 14)}
  new Date(2022, 7, 23),
  new Date(2022, 7, 18),
  new Date(2022, 7, 2),
]);

const App = ({}) => {
  const componentRef = useRef(null);

  const [events, updateEvent] = useReducer(eventsReducer, INITIAL_EVENTS);

  const onDragEvent = useCallback(
    (event, newStartDate, newEndDate) => {
      updateEvent({event, newStartDate, newEndDate});
    },
    [updateEvent],
  );

  const onEditEvent = useCallback(
    (event, newStartDate, newEndDate) => {
      console.log('Editing: ', event.id, newStartDate, newEndDate);
      updateEvent({event, newStartDate, newEndDate});
    },
    [updateEvent],
  );

  const [editingEvent, setEditEvent] = useState(null);

  const handleLongPressEvent = event => {
    if (editingEvent == null) {
      setEditEvent(event.id);
    } else {
      setEditEvent(null);
    }
  };

  const handlePressEvent = event => {
    if (editingEvent != null) {
      setEditEvent(null);
      return;
    }

    const {id, color, startDate, endDate} = event;
    Alert.alert(
      `Event press ${color} - ${id}`,
      `start: ${startDate}\nend: ${endDate}`,
    );
  };

  const handlePressGrid = (event, startHour, date) => {
    if (editingEvent != null) {
      setEditEvent(null);
      return;
    }

    const year = date.getFullYear();
    const month = date.getMonth() + 1; // zero-based
    const day = date.getDate();
    const hour = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();

    Alert.alert(`${year}-${month}-${day} ${hour}:${minutes}:${seconds}`);
  };

  const onMonthPress = useCallback((date, formattedDate) => {
    if (!componentRef || !componentRef.current) {
      return;
    }
    componentRef.current.goToDate(dateCycler.next());
  }, []);

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={styles.container}>
        <WeekView
          ref={componentRef}
          events={events}
          selectedDate={new Date(2022, 7, 14)}
          numberOfDays={1}
          onEventPress={handlePressEvent}
          onEventLongPress={handleLongPressEvent}
          onGridClick={handlePressGrid}
          headerStyle={styles.header}
          headerTextStyle={styles.headerText}
          hourTextStyle={styles.hourText}
          eventContainerStyle={styles.eventContainer}
          gridColumnStyle={styles.gridColumn}
          gridRowStyle={styles.gridRow}
          formatDateHeader={showFixedComponent ? 'ddd' : 'ddd DD'}
          hoursInDisplay={12}
          timeStep={60}
          startHour={15}
          fixedHorizontally={showFixedComponent}
          showTitle={!showFixedComponent}
          showNowLine
          onDragEvent={onDragEvent}
          isRefreshing={false}
          RefreshComponent={MyRefreshComponent}
          onDayPress={onDayPress}
          onMonthPress={onMonthPress}
          onTimeScrolled={onTimeScrolled}
          editingEvent={editingEvent}
          onEditEvent={onEditEvent}
          editEventConfig={EDIT_EVENT_CONFIG}
        />
      </SafeAreaView>
    </>
  );
};

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
