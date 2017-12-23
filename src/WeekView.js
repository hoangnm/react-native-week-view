import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import moment from 'moment';

import Header from './Header';

import styles, { CONTENT_OFFSET } from './styles';

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

const TimeLabel = ({ time }) => { // eslint-disable-line react/prop-types
  return (
    <View style={styles.timeLabel}>
      <Text style={styles.timeText}>{time}</Text>
    </View>
  );
};

class WeekView extends Component {
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

  getEventStyles = (events, index) => {
    return {
      borderLeftWidth: index === 0 ? 1 : 0,
      borderRightWidth: index < events.length - 1 ? 1 : 0,
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

  sortEventByDates = (events) => {
    const sortedEvents = events.slice(0)
      .sort((a, b) => {
        return moment(a.startDate)
          .diff(b.startDate, 'minutes');
      });
    return sortedEvents;
  };

  generateTimes = () => {
    const times = [];
    for (let i = 0; i < TIME_LABELS_COUNT; i += 1) {
      const minutes = i % 2 === 0 ? '00' : '30';
      const hour = Math.floor(i / 2);
      const time = `${hour}:${minutes}`;
      times.push(time);
    }
    return times;
  };

  render() {
    const {
      events,
      selectedDate,
      numberOfDays,
      onEventPress,
      headerStyle,
    } = this.props;

    const sortedEvents = this.sortEventByDates(events);
    let totalEvents = this.getEventsByNumberOfDays(numberOfDays, sortedEvents, selectedDate);
    totalEvents = this.getEventsWithPosition(totalEvents);
    const times = this.generateTimes();

    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Header style={headerStyle} numberOfDays={numberOfDays} selectedDate={selectedDate} />
        </View>
        <ScrollView>
          <View style={styles.timeLineContainer}>
            <View style={styles.timeColumn}>
              {times.map((time) => {
                return (<TimeLabel key={`${time}`} time={time} />);
              })}
            </View>
            <View style={styles.eventColumn}>
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
                        {eventsInSection.map((item, index) => {
                        return (
                          <TouchableOpacity
                            onPress={() => onEventPress(item.data)}
                            key={index}
                            style={[styles.scheduleItem, item.style, {
                              backgroundColor: item.data.color,
                            }]}
                          >
                            <Text style={styles.description}>{item.data.description}</Text>
                          </TouchableOpacity>
                        );
                      })}
                      </View>);
                  })}
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }
}

WeekView.propTypes = {
  numberOfDays: PropTypes.oneOf([1, 3, 7]).isRequired,
  events: PropTypes.arrayOf(PropTypes.shape({
    color: PropTypes.string,
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    description: PropTypes.string,
    startDate: PropTypes.instanceOf(Date).isRequired,
    endDate: PropTypes.instanceOf(Date).isRequired,
  })),
  headerStyle: View.propTypes.style,
};

WeekView.defaultProps = {
  events: [],
  headerStyle: null,
};

export default WeekView;
