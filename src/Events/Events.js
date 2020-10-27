import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { View, TouchableWithoutFeedback } from 'react-native';
import moment from 'moment';
import memoizeOne from 'memoize-one';

import Event from '../Event/Event';
import {
  TIME_LABEL_HEIGHT,
  CONTAINER_HEIGHT,
  CONTAINER_WIDTH,
  calculateDaysArray,
  DATE_STR_FORMAT,
  availableNumberOfDays,
} from '../utils';

import styles, { CONTENT_OFFSET } from './Events.styles';

const MINUTES_IN_HOUR = 60;
const EVENT_HORIZONTAL_PADDING = 15;
const EVENTS_CONTAINER_WIDTH = CONTAINER_WIDTH - EVENT_HORIZONTAL_PADDING;
const MIN_ITEM_WIDTH = 4;
const ALLOW_OVERLAP_SECONDS = 2;

const areEventsOverlapped = (event1EndDate, event2StartDate) => {
  const endDate = moment(event1EndDate);
  endDate.subtract(ALLOW_OVERLAP_SECONDS, 'seconds');
  return endDate.isSameOrAfter(event2StartDate);
};

class Events extends PureComponent {
  getStyleForEvent = (item) => {
    const startDate = moment(item.startDate);
    const startHours = startDate.hours();
    const startMinutes = startDate.minutes();
    const totalStartMinutes = startHours * MINUTES_IN_HOUR + startMinutes;
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
    if (!overlappedArr) return;

    const nOverlapped = overlappedArr.length;
    if (nOverlapped === 0) {
      return;
    }
    if (nOverlapped === 1) {
      baseArr.push(overlappedArr[0]);
      return;
    }

    let nLanes;
    let horizontalPadding;
    let indexToLane;
    if (nOverlapped === 2) {
      nLanes = nOverlapped;
      horizontalPadding = 3;
      indexToLane = (index) => index;
    } else {
      // Distribute events in multiple lanes
      const maxLanes = nOverlapped;
      const latestByLane = {};
      const laneByEvent = {};
      overlappedArr.forEach((event, index) => {
        for (let lane = 0; lane < maxLanes; lane += 1) {
          const lastEvtInLaneIndex = latestByLane[lane];
          const lastEvtInLane =
            (lastEvtInLaneIndex || lastEvtInLaneIndex === 0) &&
            overlappedArr[lastEvtInLaneIndex];
          if (
            !lastEvtInLane ||
            !areEventsOverlapped(
              lastEvtInLane.data.endDate,
              event.data.startDate,
            )
          ) {
            // Place in this lane
            latestByLane[lane] = index;
            laneByEvent[index] = lane;
            break;
          }
        }
      });

      nLanes = Object.keys(latestByLane).length;
      horizontalPadding = 2;
      indexToLane = (index) => laneByEvent[index];
    }
    const dividedWidth = itemWidth / nLanes;
    const width = Math.max(dividedWidth - horizontalPadding, MIN_ITEM_WIDTH);

    overlappedArr.forEach((eventWithStyle, index) => {
      const { data, style } = eventWithStyle;
      baseArr.push({
        data,
        style: {
          ...style,
          width,
          left: dividedWidth * indexToLane(index),
        },
      });
    });
  };

  getEventsWithPosition = (totalEvents) => {
    const regularItemWidth = this.getEventItemWidth();

    return totalEvents.map((events) => {
      let overlappedSoFar = []; // Store events overlapped until now
      let lastDate = null;
      const eventsWithStyle = events.reduce((eventsAcc, event) => {
        const style = this.getStyleForEvent(event);
        const eventWithStyle = {
          data: event,
          style,
        };

        if (!lastDate || areEventsOverlapped(lastDate, event.startDate)) {
          overlappedSoFar.push(eventWithStyle);
          const endDate = moment(event.endDate);
          lastDate = lastDate ? moment.max(endDate, lastDate) : endDate;
        } else {
          this.addOverlappedToArray(
            eventsAcc,
            overlappedSoFar,
            regularItemWidth,
          );
          overlappedSoFar = [eventWithStyle];
          lastDate = moment(event.endDate);
        }
        return eventsAcc;
      }, []);
      this.addOverlappedToArray(
        eventsWithStyle,
        overlappedSoFar,
        regularItemWidth,
      );
      return eventsWithStyle;
    });
  };

  minutesToYDimension = (minutes) => {
    const { hoursInDisplay } = this.props;
    const minutesInDisplay = MINUTES_IN_HOUR * hoursInDisplay;
    return (minutes * CONTAINER_HEIGHT) / minutesInDisplay;
  };

  yToHour = (y) => {
    const { hoursInDisplay } = this.props;
    const hour = (y * hoursInDisplay) / CONTAINER_HEIGHT;
    return hour;
  };

  getEventItemWidth = () => {
    const { numberOfDays } = this.props;
    return EVENTS_CONTAINER_WIDTH / numberOfDays;
  };

  processEvents = memoizeOne(
    (eventsByDate, initialDate, numberOfDays, rightToLeft) => {
      // totalEvents stores events in each day of numberOfDays
      // example: [[event1, event2], [event3, event4], [event5]], each child array
      // is events for specific day in range
      const dates = calculateDaysArray(initialDate, numberOfDays, rightToLeft);
      const totalEvents = dates.map((date) => {
        const dateStr = date.format(DATE_STR_FORMAT);
        return eventsByDate[dateStr] || [];
      });
      const totalEventsWithPosition = this.getEventsWithPosition(totalEvents);
      return totalEventsWithPosition;
    },
  );

  onGridClick = (event, dayIndex) => {
    const { initialDate, onGridClick } = this.props;
    if (!onGridClick) {
      return;
    }
    const { locationY } = event.nativeEvent;
    const hour = Math.floor(this.yToHour(locationY - CONTENT_OFFSET));

    const date = moment(initialDate).add(dayIndex, 'day').toDate();

    onGridClick(event, hour, date);
  };

  render() {
    const {
      eventsByDate,
      initialDate,
      numberOfDays,
      times,
      onEventPress,
      eventContainerStyle,
      EventComponent,
      rightToLeft,
    } = this.props;
    const totalEvents = this.processEvents(
      eventsByDate,
      initialDate,
      numberOfDays,
      rightToLeft,
    );

    return (
      <View style={styles.container}>
        {times.map((time) => (
          <View
            key={time}
            style={[styles.timeRow, { height: TIME_LABEL_HEIGHT }]}
          >
            <View style={styles.timeLabelLine} />
          </View>
        ))}
        <View style={styles.events}>
          {totalEvents.map((eventsInSection, dayIndex) => (
            <TouchableWithoutFeedback
              onPress={(e) => this.onGridClick(e, dayIndex)}
              key={dayIndex}
            >
              <View style={styles.event}>
                {eventsInSection.map((item) => (
                  <Event
                    key={item.data.id}
                    event={item.data}
                    position={item.style}
                    onPress={onEventPress}
                    EventComponent={EventComponent}
                    containerStyle={eventContainerStyle}
                  />
                ))}
              </View>
            </TouchableWithoutFeedback>
          ))}
        </View>
      </View>
    );
  }
}

Events.propTypes = {
  numberOfDays: PropTypes.oneOf(availableNumberOfDays).isRequired,
  eventsByDate: PropTypes.objectOf(PropTypes.arrayOf(Event.propTypes.event))
    .isRequired,
  initialDate: PropTypes.string.isRequired,
  hoursInDisplay: PropTypes.number.isRequired,
  times: PropTypes.arrayOf(PropTypes.string).isRequired,
  onEventPress: PropTypes.func,
  onGridClick: PropTypes.func,
  eventContainerStyle: PropTypes.object,
  EventComponent: PropTypes.elementType,
  rightToLeft: PropTypes.bool,
};

export default Events;
