import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, ScrollView, Animated } from 'react-native';
import moment from 'moment';
import memoizeOne from 'memoize-one';

import Event from '../Event/Event';
import Events from '../Events/Events';
import Header from '../Header/Header';
import Title from '../Title/Title';
import Times from '../Times/Times';
import styles from './WeekView.styles';
import {
  TIME_LABELS_IN_DISPLAY,
  CONTAINER_HEIGHT,
  CONTAINER_WIDTH,
  DATE_STR_FORMAT,
  availableNumberOfDays,
  setLocale,
} from '../utils';

const MINUTES_IN_DAY = 60 * 24;

export default class WeekView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentMoment: props.selectedDate,
    };
    this.eventsGrid = null;
    this.verticalAgenda = null;
    this.header = null;
    this.pagesLeft = 2;
    this.pagesRight = 2;
    this.currentPageIndex = this.pagesLeft;
    this.totalPages = this.pagesLeft + this.pagesRight + 1;
    this.eventsGridScrollX = new Animated.Value(0);

    setLocale(props.locale);
  }

  componentDidMount() {
    requestAnimationFrame(() => {
      this.scrollToHorizontalStart();
      this.scrollToVerticalStart();
    });
    this.eventsGridScrollX.addListener((position) => {
      this.header.scrollTo({ x: position.value, animated: false });
    });
  }

  componentDidUpdate(prevprops) {
    if (
      this.props.selectedDate &&
      this.props.selectedDate !== prevprops.selectedDate
    ) {
      this.setState({ currentMoment: this.props.selectedDate });
    }
    if (this.props.locale !== prevprops.locale) {
      setLocale(this.props.locale);
    }

    this.scrollToHorizontalStart();
  }

  componentWillUnmount() {
    this.eventsGridScrollX.removeAllListeners();
  }

  calculateTimes = memoizeOne((hoursInDisplay) => {
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
  });

  scrollToVerticalStart = () => {
    if (this.verticalAgenda) {
      const { startHour, hoursInDisplay } = this.props;
      const startHeight = (startHour * CONTAINER_HEIGHT) / hoursInDisplay;
      this.verticalAgenda.scrollTo({ y: startHeight, x: 0, animated: false });
    }
  };

  scrollToHorizontalStart = () => {
    if (this.eventsGrid) {
      const startX = this.currentPageIndex * CONTAINER_WIDTH;
      this.eventsGrid.scrollTo({ y: 0, x: startX, animated: false });
    }
  };

  scrollEnded = (event) => {
    const {
      nativeEvent: { contentOffset, contentSize },
    } = event;
    const { x: position } = contentOffset;
    const { width: innerWidth } = contentSize;
    const newPage = (position / innerWidth) * this.totalPages;
    const movedPages = newPage - this.currentPageIndex;
    if (movedPages === 0) {
      return;
    }
    const { onSwipePrev, onSwipeNext, numberOfDays } = this.props;
    const { currentMoment } = this.state;
    requestAnimationFrame(() => {
      const newMoment = moment(currentMoment)
        .add(movedPages * numberOfDays, 'd')
        .toDate();

      this.setState({ currentMoment: newMoment });

      if (movedPages < 0) {
        onSwipePrev && onSwipePrev(newMoment);
      } else {
        onSwipeNext && onSwipeNext(newMoment);
      }
    });
  };

  eventsGridRef = (ref) => {
    this.eventsGrid = ref;
  };

  verticalAgendaRef = (ref) => {
    this.verticalAgenda = ref;
  };

  headerRef = (ref) => {
    this.header = ref;
  };

  calculatePagesDates = memoizeOne((currentMoment, numberOfDays) => {
    const initialDates = [];
    for (let i = -this.pagesLeft; i <= this.pagesRight; i += 1) {
      const initialDate = moment(currentMoment).add(numberOfDays * i, 'd');
      initialDates.push(initialDate.format(DATE_STR_FORMAT));
    }
    return initialDates;
  });

  sortEventsByDate = memoizeOne((events) => {
    // Stores the events hashed by their date
    // For example: { "2020-02-03": [event1, event2, ...] }
    // If an event spans through multiple days, adds the event multiple times
    const sortedEvents = {};
    events.forEach((event) => {
      const startDate = moment(event.startDate);
      const endDate = moment(event.endDate);

      for (
        let date = moment(startDate);
        date.isSameOrBefore(endDate, 'days');
        date.add(1, 'days')
      ) {
        // Calculate actual start and end dates
        const startOfDay = moment(date).startOf('day');
        const endOfDay = moment(date).endOf('day');
        const actualStartDate = moment.max(startDate, startOfDay);
        const actualEndDate = moment.min(endDate, endOfDay);

        // Add to object
        const dateStr = date.format(DATE_STR_FORMAT);
        if (!sortedEvents[dateStr]) {
          sortedEvents[dateStr] = [];
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
        return moment(a.startDate).diff(b.startDate, 'minutes');
      });
    });
    return sortedEvents;
  });

  render() {
    const {
      numberOfDays,
      headerStyle,
      formatDateHeader,
      onEventPress,
      events,
      hoursInDisplay,
      onGridClick,
    } = this.props;
    const { currentMoment } = this.state;
    const times = this.calculateTimes(hoursInDisplay);
    const initialDates = this.calculatePagesDates(currentMoment, numberOfDays);
    const eventsByDate = this.sortEventsByDate(events);
    return (
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Title
            style={headerStyle}
            numberOfDays={numberOfDays}
            selectedDate={currentMoment}
          />
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            scrollEnabled={false}
            automaticallyAdjustContentInsets={false}
            ref={this.headerRef}
          >
            {initialDates.map((date) => (
              <View key={date} style={styles.header}>
                <Header
                  style={headerStyle}
                  formatDate={formatDateHeader}
                  initialDate={date}
                  numberOfDays={numberOfDays}
                />
              </View>
            ))}
          </ScrollView>
        </View>
        <ScrollView ref={this.verticalAgendaRef}>
          <View style={styles.scrollViewContent}>
            <Times times={times} />
            <ScrollView
              horizontal
              pagingEnabled
              automaticallyAdjustContentInsets={false}
              onMomentumScrollEnd={this.scrollEnded}
              scrollEventThrottle={32}
              onScroll={Animated.event(
                [
                  {
                    nativeEvent: {
                      contentOffset: {
                        x: this.eventsGridScrollX,
                      },
                    },
                  },
                ],
                { useNativeDriver: false },
              )}
              ref={this.eventsGridRef}
            >
              {initialDates.map((date) => (
                <Events
                  key={date}
                  times={times}
                  eventsByDate={eventsByDate}
                  initialDate={date}
                  numberOfDays={numberOfDays}
                  onEventPress={onEventPress}
                  onGridClick={onGridClick}
                  hoursInDisplay={hoursInDisplay}
                />
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
  formatDateHeader: PropTypes.string,
  numberOfDays: PropTypes.oneOf(availableNumberOfDays).isRequired,
  onSwipeNext: PropTypes.func,
  onSwipePrev: PropTypes.func,
  onEventPress: PropTypes.func,
  onGridClick: PropTypes.func,
  headerStyle: PropTypes.object,
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
