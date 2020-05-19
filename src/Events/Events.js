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

class Events extends Component {
  getStyleForEvent = (item) => {
    const startDate = moment(item.startDate);
    const startHours = startDate.hours();
    const startMinutes = startDate.minutes();
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

  getEventsWithPosition = (totalEvents) => {
    const itemWidth = this.getEventItemWidth();
    return totalEvents.map((events) => {
      // get position and width for each event
      const eventsWithStyle = events.reduce((eventsAcc, event, i) => {
        let numberOfDuplicate = 1;
        const style = this.getStyleForEvent(event);
        // check if previous events have the same position or not,
        // start from 0 to current index of event item
        for (let j = 0; j < i; j += 1) {
          const previousEvent = eventsAcc[j];
          // if left and top of previous event collides with current item,
          // move current item to the right and update new width for both
          const foundDuplicate = previousEvent.style.left === style.left
          && previousEvent.style.top + previousEvent.style.height >= style.top;
          if (foundDuplicate) {
            numberOfDuplicate += 1;
            style.left = 5 + (itemWidth / numberOfDuplicate);
            style.width = itemWidth / numberOfDuplicate;
            previousEvent.style.width = itemWidth / numberOfDuplicate;
          }
        }
        eventsAcc.push({
          data: event,
          style,
        });
        return eventsAcc;
      }, []);
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

  render() {
    const {
      totalEvents,
      times,
      onEventPress,
    } = this.props;
    const totalEventsWithPosition = this.getEventsWithPosition(totalEvents);
    return (
      <View style={styles.container}>
        {times.map(time => (
          <View key={time} style={[styles.timeRow, { height: TIME_LABEL_HEIGHT }]}>
            <View style={styles.timeLabelLine} />
          </View>
        ))}
        <View style={styles.events}>
          {totalEventsWithPosition.map((eventsInSection, sectionIndex) => (
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
  totalEvents: PropTypes.arrayOf(PropTypes.arrayOf(Event.propTypes.event)),
  onEventPress: PropTypes.func,
  selectedDate: PropTypes.instanceOf(Date),
  times: PropTypes.arrayOf(PropTypes.string),
  hoursInDisplay: PropTypes.number.isRequired,
};

Events.defaultProps = {
  totalEvents: [],
  selectedDate: new Date(),
};

export default Events;
