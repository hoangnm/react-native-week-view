import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  View,
  ScrollView,
  Dimensions,
  Text,
} from 'react-native';
import moment from 'moment';
import memoizeOne from 'memoize-one';
import { setLocale } from '../utils';
import Event from '../Event/Event';
import Events from '../Events/Events';
import Header from '../Header/Header';
import styles from './WeekView.styles';
import { TIME_LABELS_IN_DISPLAY, TIME_LABEL_HEIGHT, CONTAINER_HEIGHT } from '../utils';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const MINUTES_IN_DAY = 60*24;
const DATE_KEY_FORMAT = 'YYYY-MM-DD';

export default class WeekView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentMoment: props.selectedDate,
    };
    this.eventsGrid = null;
    this.verticalAgenda = null;
    setLocale(props.locale);
    this.times = this.generateTimes();
  }

  componentDidMount() {
    requestAnimationFrame(() => {
      this.eventsGrid.scrollTo({ y: 0, x: 2 * (SCREEN_WIDTH - 60), animated: false });
      this.scrollToAgendaStart();
    });
  }

  componentDidUpdate(prevprops) {
    if (this.props.selectedDate && this.props.selectedDate!=prevprops.selectedDate) {
      this.setState({ currentMoment: this.props.selectedDate });
    }
    if (this.props.locale !== prevprops.locale) {
      setLocale(this.props.locale);
    }

    this.eventsGrid.scrollTo({ y: 0, x: 2 * (SCREEN_WIDTH - 60), animated: false });
  }

  scrollToAgendaStart = () => {
    if (this.verticalAgenda) {
      const { startHour, hoursInDisplay } = this.props;
      const startHeight = startHour * CONTAINER_HEIGHT / hoursInDisplay;
      this.verticalAgenda.scrollTo({ y: startHeight, x: 0, animated: false });
    }
  }

  generateTimes = () => {
    const { hoursInDisplay } = this.props;
    const times = [];
    const timeLabelsPerHour = TIME_LABELS_IN_DISPLAY / hoursInDisplay;
    const minutesStep = 60 / timeLabelsPerHour;
    for (let timer = 0; timer < MINUTES_IN_DAY; timer += minutesStep) {
      let minutes = timer % 60;
      if (minutes < 10) minutes = `0${minutes}`;
      const hour = Math.floor(timer / 60);
      const timeString = `${hour}:${minutes}`;
      times.push(timeString);
    }
    return times;
  };

  scrollEnded = (event) => {
    const { nativeEvent: { contentOffset, contentSize } } = event;
    const { x: position } = contentOffset;
    const { width: innerWidth } = contentSize;
    const newPage = (position / innerWidth) * 5;
    const { onSwipePrev, onSwipeNext, numberOfDays } = this.props;
    const { currentMoment } = this.state;
    requestAnimationFrame(() => {
      const newMoment = moment(currentMoment)
        .add((newPage - 2) * numberOfDays, 'd')
        .toDate();

      this.setState({ currentMoment: newMoment });

      if (newPage < 2) {
        onSwipePrev && onSwipePrev(newMoment);
      } else if (newPage > 2) {
        onSwipeNext && onSwipeNext(newMoment);
      }
    });
  };

  eventsGridRef = (ref) => {
    this.eventsGrid = ref;
  }

  verticalAgendaRef = (ref) => {
    this.verticalAgenda = ref;
  }

  prepareDates = (currentMoment, numberOfDays) => {
    const dates = [];
    for (let i = -2; i < 3; i += 1) {
      const date = moment(currentMoment).add(numberOfDays * i, 'd');
      dates.push(date);
    }
    return dates;
  };

  getEventsByNumberOfDays = (numberOfDays, eventsByDate, selectedDate) => {
    // total stores events in each day of numberOfDays
    // example: [[event1, event2], [event3, event4], [event5]], each child array
    // is events for specific day in range
    const total = [];
    let initial = 0;
    if (numberOfDays === 7) {
      initial = 1;
      initial -= moment().isoWeekday();
    }
    for (let i = initial; i < (numberOfDays + initial); i += 1) {
      // current date in numberOfDays, calculated from selected date
      const currentDate = moment(selectedDate).add(i, 'd');
      const currentDateStr = currentDate.format(DATE_KEY_FORMAT);
      total.push(eventsByDate[currentDateStr] || []);
    }
    
    return total;
  };

  sortEventsByDate = memoizeOne((events) => {
    // Stores the events hashed by their date
    // For example: { "2020-02-03": [event1, event2, ...] }
    // If an event spans through multiple days, adds the event multiple times
    const sortedEvents = {};
    events.forEach((event) => {
      const startDate = moment(event.startDate);
      const endDate = moment(event.endDate);

      for (let date = moment(startDate); date.isSameOrBefore(endDate, 'days'); date.add(1, 'days')) {
        // Calculate actual start and end dates
        const startOfDay = moment(date).startOf('day');
        const endOfDay = moment(date).endOf('day');
        const actualStartDate = moment.max(startDate, startOfDay);
        const actualEndDate = moment.min(endDate, endOfDay);

        // Add to object
        const dateStr = date.format(DATE_KEY_FORMAT);
        if (!sortedEvents[dateStr]) {
          sortedEvents[dateStr] = []
        }
        sortedEvents[dateStr].push({
          ...event,
          startDate: actualStartDate.toDate(),
          endDate: actualEndDate.toDate(),
        });
      }
    });    
    
    // For each day, sort the events by the minute (in-place)
    Object.keys(sortedEvents).forEach((date) => {
      sortedEvents[date].sort((a, b) => {
        return moment(a.startDate)
          .diff(b.startDate, 'minutes');
      });
    });
    return sortedEvents;
  });

  render() {
    const {
      numberOfDays,
      headerStyle,
      headerTextColor,
      formatDateHeader,
      onEventPress,
      events,
      hoursInDisplay,
    } = this.props;
    const { currentMoment } = this.state;
    const dates = this.prepareDates(currentMoment, numberOfDays);
    const eventsByDate = this.sortEventsByDate(events);
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Header
            style={headerStyle}
            textColor={headerTextColor}
            formatDate={formatDateHeader}
            selectedDate={currentMoment}
            numberOfDays={numberOfDays}
          />
        </View>
        <ScrollView
          ref={this.verticalAgendaRef}
        >
          <View style={styles.scrollViewContent}>
            <View style={styles.timeColumn}>
              {this.times.map(time => (
                <View
                  key={time}
                  style={[styles.timeLabel, { height: TIME_LABEL_HEIGHT }]}
                >
                  <Text style={styles.timeText}>{time}</Text>
                </View>
              ))}
            </View>
            <ScrollView
              horizontal
              pagingEnabled
              automaticallyAdjustContentInsets={false}
              onMomentumScrollEnd={this.scrollEnded}
              ref={this.eventsGridRef}
            >
              {dates.map((date, idx) => (
                <View
                  key={idx}
                  style={{ flex: 1, width: SCREEN_WIDTH - 60 }}
                >
                  <Events
                    key={idx}
                    times={this.times}
                    selectedDate={date.toDate()}
                    numberOfDays={numberOfDays}
                    onEventPress={onEventPress}
                    totalEvents={this.getEventsByNumberOfDays(numberOfDays, eventsByDate, date)}
                    hoursInDisplay={hoursInDisplay}
                  />
                </View>
              ))}
            </ScrollView>
          </View>
        </ScrollView>
      </View>
    );
  }
}

WeekView.propTypes = {
  events: PropTypes.arrayOf(Event.propTypes.event),
  numberOfDays: PropTypes.oneOf([1, 3, 5, 7]).isRequired,
  onSwipeNext: PropTypes.func,
  onSwipePrev: PropTypes.func,
  formatDateHeader: PropTypes.string,
  onEventPress: PropTypes.func,
  headerStyle: PropTypes.object,
  headerTextColor: PropTypes.string,
  selectedDate: PropTypes.instanceOf(Date).isRequired,
  locale: PropTypes.string,
  hoursInDisplay: PropTypes.number,
  startHour: PropTypes.number,
};

WeekView.defaultProps = {
  events: [],
  locale: 'en',
  hoursInDisplay: 6,
  startHour: 0,
};
