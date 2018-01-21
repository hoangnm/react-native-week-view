import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Dimensions,
} from 'react-native';
import moment from 'moment';

import Event from '../Event/Event';

import styles, { CONTENT_OFFSET } from './Events.styles';

const { width: screenWidth } = Dimensions.get('window');
const TIME_LABELS_COUNT = 48;
const MINUTES_IN_HOUR = 60;
const MINUTES_IN_DAY = MINUTES_IN_HOUR * 24;
const ROW_HEIGHT = 40;
const CONTENT_HEIGHT = ROW_HEIGHT * TIME_LABELS_COUNT;
const TIME_LABEL_WIDTH = 40;
const EVENTS_CONTAINER_WIDTH = screenWidth - TIME_LABEL_WIDTH - 35;

const TimeRow = () => {
  return (
    <View style={styles.timeRow}>
      <View style={styles.timeLabelLine} />
    </View>
  );
};

class Events extends Component {
  onEventPress = (item) => {
    const { onEventPress } = this.props;
    if (onEventPress) {
      onEventPress(item.data);
    }
  };

  getEventsByNumberOfDays = (numberOfDays, events, selectedDate) => {
    const total = [];
    let initial = 0;
    if (numberOfDays === 7) {
      initial = 1;
      initial -= moment().isoWeekday();
    }
    for (let i = initial; i < (numberOfDays + initial); i += 1) {
      let dates = events.filter((item) => {
        const date = moment(selectedDate);
        date.add(i, 'd');
        return date.isSame(item.startDate, 'day') || date.isSame(item.endDate, 'day');
      });
      dates = dates.map((item) => {
        const date = moment(selectedDate).add(i, 'd');
        let newDate = moment(item.startDate);
        if (!date.isSame(item.startDate, 'day')) {
          newDate = moment(item.startDate).add(i, 'd').startOf('day');
        }
        return {
          ...item,
          startDate: newDate.toDate(),
        };
      });
      total.push(dates);
    }
    return total;
  };

  getStyleForEvent = (item) => {
    const startHours = moment(item.startDate).hours();
    const startMinutes = moment(item.startDate).minutes();
    const totalStartMinutes = (startHours * MINUTES_IN_HOUR) + startMinutes;
    const topOffset = (totalStartMinutes * CONTENT_HEIGHT) / MINUTES_IN_DAY;
    const height = (moment(item.endDate).diff(item.startDate, 'minutes') * CONTENT_HEIGHT) / MINUTES_IN_DAY;
    const width = this.getEventItemWidth();

    return {
      top: topOffset + CONTENT_OFFSET,
      left: 0,
      height,
      width,
    };
  };

  getEventsWithPosition = (totalEvents) => {
    const itemWidth = this.getEventItemWidth();
    return totalEvents.map((events) => {
      // get position and width for each event
      const eventsWithStyle = events.map((item, index) => {
        return {
          data: item,
          style: this.getStyleForEvent(item, index),
        };
      });
      eventsWithStyle.forEach((event, i) => {
        let numberOfDuplicate = 1;
        // check if previous events have the same position or not,
        // start from 0 to current index of event item
        for (let j = 0; j < i; j += 1) {
          const previousEvent = eventsWithStyle[j];
          // if left and top of previous event collides with current item,
          // move current item to the right and update new width for both
          const foundDuplicate = previousEvent.style.left === event.style.left &&
          previousEvent.style.top + previousEvent.style.height >= event.style.top;
          if (foundDuplicate) {
            numberOfDuplicate += 1;
            event.style = { // eslint-disable-line no-param-reassign
              ...event.style,
              left: 5 + (itemWidth / numberOfDuplicate),
              width: itemWidth / numberOfDuplicate,
            };
            previousEvent.style.width = itemWidth / numberOfDuplicate;
          }
        }
      });
      return eventsWithStyle;
    });
  };

  getEventItemWidth = () => {
    return EVENTS_CONTAINER_WIDTH / this.props.numberOfDays;
  };

  getEventStyles = (events, index) => {
    return {
      borderLeftWidth: index === 0 ? 1 : 0,
      borderRightWidth: index < events.length - 1 ? 1 : 0,
    };
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
      onEventPress,
      times,
    } = this.props;
    const sortedEvents = this.sortEventByDates(events);
    let totalEvents = this.getEventsByNumberOfDays(numberOfDays, sortedEvents, selectedDate);
    totalEvents = this.getEventsWithPosition(totalEvents);
    return (
      <View style={{ paddingTop: 16 }}>
        {times.map((time) => {
          return (<TimeRow key={time} time={time} />);
        })}
        <View style={styles.scheduleItems}>
          {totalEvents.map((eventsInSection, sectionIndex) => {
              return (
                <View
                  key={sectionIndex}
                  style={[styles.event, this.getEventStyles(totalEvents, sectionIndex)]}
                >
                  {eventsInSection.map((item) => {
                  return (
                    <Event
                      key={item.data.id}
                      event={item.data}
                      style={item.style}
                      onPress={onEventPress}
                    />
                  );
                })}
                </View>);
            })}
        </View>
      </View>
    );
  }
}

Events.propTypes = {
  numberOfDays: PropTypes.oneOf([1, 3, 7]).isRequired,
  events: PropTypes.arrayOf(Event.propTypes.event),
  onEventPress: PropTypes.func,
  selectedDate: PropTypes.instanceOf(Date),
  times: PropTypes.arrayOf(PropTypes.string),
};

Events.defaultProps = {
  events: [],
  selectedDate: new Date(),
};

export default Events;
