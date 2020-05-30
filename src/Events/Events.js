import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Dimensions,
} from 'react-native';
import moment from 'moment';

import Event from '../Event/Event';
import { TIME_LABEL_HEIGHT, CONTAINER_HEIGHT } from '../utils';

import styles, { CONTENT_OFFSET } from './Events.styles';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const MINUTES_IN_HOUR = 60;
const TIME_LABEL_WIDTH = 40;
const EVENTS_CONTAINER_WIDTH = SCREEN_WIDTH - TIME_LABEL_WIDTH - 35;
const MIN_ITEM_WIDTH = 4;

const areEventsOverlapped = (event1, event2) => {
  return moment(event1.endDate).isSameOrAfter(event2.startDate);
}

class Events extends Component {
  getEventsByNumberOfDays = (numberOfDays, events, selectedDate) => {
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
      const currenDate = moment(selectedDate).add(i, 'd');

      // filter events that have startDate/endDate in current date
      let filteredEvents = events.filter((item) => {
        return currenDate.isSame(item.startDate, 'day') || currenDate.isSame(item.endDate, 'day');
      });

      filteredEvents = filteredEvents.map((item) => {
        let { startDate } = item;
        // if endDate is in next day, set starDate to begin time of current date (00:00)
        if (!currenDate.isSame(startDate, 'day')) {
          startDate = currenDate.startOf('day').toDate();
        }
        return {
          ...item,
          startDate,
        };
      });
      total.push(filteredEvents);
    }
    return total;
  };

  getStyleForEvent = (item) => {
    const startHours = moment(item.startDate).hours();
    const startMinutes = moment(item.startDate).minutes();
    const totalStartMinutes = (startHours * MINUTES_IN_HOUR) + startMinutes;
    const top = this.minutesToYDimension(totalStartMinutes);
    const deltaMinutes = moment(item.endDate).diff(item.startDate, 'minutes');
    const height = this.minutesToYDimension(deltaMinutes);
    const width = this.getEventItemWidth();

    return {
      top: top + CONTENT_OFFSET,
      left: 0,
      height,
      width,
    };
  };

  addOverlappedToArray = (baseArr, overlappedArr, itemWidth) => {
    // Given an array of overlapped events (with style), modifies their style to overlap them
    // and adds them to a (base) array of events.
    const nOverlapped = overlappedArr.length;
    if (nOverlapped === 1) {
      baseArr.push(overlappedArr[0]);
    } else {
      const dividedWidth = itemWidth / nOverlapped;
      const horizontalPadding = 3;
      overlappedArr.forEach((overlappedEventWithStyle, index) => {
        const { data, style } = overlappedEventWithStyle;
        baseArr.push({
          data,
          style: {
            ...style,
            width: Math.max(dividedWidth - horizontalPadding, MIN_ITEM_WIDTH),
            left: dividedWidth * index,
          },
        });
      });
    }
  };

  getEventsWithPosition = (totalEvents) => {
    const regularItemWidth = this.getEventItemWidth();

    return totalEvents.map((events) => {
      let overlappedSoFar = []; // Store events overlapped until now
      const eventsWithStyle = events.reduce((eventsAcc, event, i) => {
        const style = this.getStyleForEvent(event);
        const eventWithStyle = {
          data: event,
          style,
        };

        const nSoFar = overlappedSoFar.length;
        const lastEventOverlapped = nSoFar > 0 ? overlappedSoFar[nSoFar - 1] : null;
        if (!lastEventOverlapped || areEventsOverlapped(lastEventOverlapped.data, event)) {
          overlappedSoFar.push(eventWithStyle);
        } else {
          this.addOverlappedToArray(eventsAcc, overlappedSoFar, regularItemWidth);
          overlappedSoFar = [eventWithStyle];
        }
        return eventsAcc;
      }, []);
      this.addOverlappedToArray(eventsWithStyle, overlappedSoFar, regularItemWidth);
      return eventsWithStyle;
    });
  };

  minutesToYDimension = (minutes) => {
    const { hoursInDisplay } = this.props;
    const minutesInDisplay = MINUTES_IN_HOUR * hoursInDisplay;
    return minutes * CONTAINER_HEIGHT / minutesInDisplay;
  };

  getEventItemWidth = () => {
    const { numberOfDays } = this.props;
    return EVENTS_CONTAINER_WIDTH / numberOfDays;
  };

  sortEventByDates = (events) => {
    const sortedEvents = events.slice(0)
      .sort((a, b) => {
        return moment(a.startDate)
          .diff(b.startDate, 'minutes');
      });
    return sortedEvents;
  };

  render() {
    const {
      events,
      numberOfDays,
      selectedDate,
      times,
      onEventPress,
    } = this.props;
    const sortedEvents = this.sortEventByDates(events);
    let totalEvents = this.getEventsByNumberOfDays(numberOfDays, sortedEvents, selectedDate);
    totalEvents = this.getEventsWithPosition(totalEvents);    
    return (
      <View style={styles.container}>
        {times.map(time => (
          <View key={time} style={[styles.timeRow, { height: TIME_LABEL_HEIGHT }]}>
            <View style={styles.timeLabelLine} />
          </View>
        ))}
        <View style={styles.events}>
          {totalEvents.map((eventsInSection, sectionIndex) => (
            <View
              key={sectionIndex}
              style={styles.event}
            >
              {eventsInSection.map(item => (
                <Event
                  key={item.data.id}
                  event={item.data}
                  style={item.style}
                  onPress={onEventPress}
                />
              ))}
            </View>
          ))}
        </View>
      </View>
    );
  }
}

Events.propTypes = {
  numberOfDays: PropTypes.oneOf([1, 3, 5, 7]).isRequired,
  events: PropTypes.arrayOf(Event.propTypes.event),
  onEventPress: PropTypes.func,
  selectedDate: PropTypes.instanceOf(Date),
  times: PropTypes.arrayOf(PropTypes.string),
  hoursInDisplay: PropTypes.number.isRequired,
};

Events.defaultProps = {
  events: [],
  selectedDate: new Date(),
};

export default Events;
