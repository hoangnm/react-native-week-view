import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { View, TouchableWithoutFeedback } from 'react-native';
import moment from 'moment';
import memoizeOne from 'memoize-one';

import NowLine from '../NowLine/NowLine';
import Event from '../Event/Event';
import {
  CONTAINER_HEIGHT,
  calculateDaysArray,
  DATE_STR_FORMAT,
  availableNumberOfDays,
  minutesToYDimension,
  CONTENT_OFFSET,
  getTimeLabelHeight,
} from '../utils';

import styles from './Events.styles';

const MINUTES_IN_HOUR = 60;
const EVENT_HORIZONTAL_PADDING = 8; // percentage
const MIN_ITEM_WIDTH = 4;
const ALLOW_OVERLAP_SECONDS = 2;

const padItemWidth = (
  width,
  paddingPercentage = EVENT_HORIZONTAL_PADDING,
) => paddingPercentage > 0 ? width - Math.max(2, width * paddingPercentage / 100) : width;

const areEventsOverlapped = (event1EndDate, event2StartDate) => {
  const endDate = moment(event1EndDate);
  endDate.subtract(ALLOW_OVERLAP_SECONDS, 'seconds');
  return endDate.isSameOrAfter(event2StartDate);
};

const getStyleForEvent = (event, regularItemWidth, hoursInDisplay) => {
  const startDate = moment(event.startDate);
  const startHours = startDate.hours();
  const startMinutes = startDate.minutes();
  const totalStartMinutes = startHours * MINUTES_IN_HOUR + startMinutes;
  const top = minutesToYDimension(hoursInDisplay, totalStartMinutes);
  const deltaMinutes = moment(event.endDate).diff(event.startDate, 'minutes');
  const height = minutesToYDimension(hoursInDisplay, deltaMinutes);

  return {
    top: top + CONTENT_OFFSET,
    left: 0,
    height,
    width: regularItemWidth,
  };
};

const addOverlappedToArray = (baseArr, overlappedArr, itemWidth) => {
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
  let indexToLane;
  if (nOverlapped === 2) {
    nLanes = nOverlapped;
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
    indexToLane = (index) => laneByEvent[index];
  }
  const dividedWidth = itemWidth / nLanes;
  const width = Math.max(padItemWidth(dividedWidth, EVENT_HORIZONTAL_PADDING / nLanes), MIN_ITEM_WIDTH);

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

const getEventsWithPosition = (totalEvents, dayWidth, hoursInDisplay) => {
  const paddedDayWidth = padItemWidth(dayWidth);
  return totalEvents.map((events) => {
    let overlappedSoFar = []; // Store events overlapped until now
    let lastDate = null;
    const eventsWithStyle = events.reduce((eventsAcc, event) => {
      const style = getStyleForEvent(event, paddedDayWidth, hoursInDisplay);
      const eventWithStyle = {
        data: event,
        style,
      };

      if (!lastDate || areEventsOverlapped(lastDate, event.startDate)) {
        overlappedSoFar.push(eventWithStyle);
        const endDate = moment(event.endDate);
        lastDate = lastDate ? moment.max(endDate, lastDate) : endDate;
      } else {
        addOverlappedToArray(
          eventsAcc,
          overlappedSoFar,
          dayWidth,
        );
        overlappedSoFar = [eventWithStyle];
        lastDate = moment(event.endDate);
      }
      return eventsAcc;
    }, []);
    addOverlappedToArray(
      eventsWithStyle,
      overlappedSoFar,
      dayWidth,
    );
    return eventsWithStyle;
  });
};

const processEvents = (
  eventsByDate, initialDate, numberOfDays, dayWidth, hoursInDisplay, rightToLeft,
) => {
  // totalEvents stores events in each day of numberOfDays
  // example: [[event1, event2], [event3, event4], [event5]], each child array
  // is events for specific day in range
  const dates = calculateDaysArray(initialDate, numberOfDays, rightToLeft);
  const totalEvents = dates.map((date) => {
    const dateStr = date.format(DATE_STR_FORMAT);
    return eventsByDate[dateStr] || [];
  });

  const totalEventsWithPosition = getEventsWithPosition(
    totalEvents,
    dayWidth,
    hoursInDisplay,
  );
  return totalEventsWithPosition;
};

class Events extends PureComponent {
  yToHour = (y) => {
    const { hoursInDisplay } = this.props;
    const hour = (y * hoursInDisplay) / CONTAINER_HEIGHT;
    return hour;
  };

  processEvents = memoizeOne(processEvents);

  onGridTouch = (event, dayIndex, longPress) => {
    const { initialDate, onGridClick, onGridLongPress } = this.props;
    const callback = longPress ? onGridLongPress : onGridClick;
    if (!callback) {
      return;
    }
    const { locationY } = event.nativeEvent;

    // WithDec === with decimals. // e.g. hours 10.5 === 10:30am
    const hoursWDec = this.yToHour(locationY - CONTENT_OFFSET);
    const minutesWDec = (hoursWDec - parseInt(hoursWDec)) * 60;
    const seconds = Math.floor((minutesWDec - parseInt(minutesWDec)) * 60);

    const hour = Math.floor(hoursWDec);
    const minutes = Math.floor(minutesWDec);

    const date = moment(initialDate)
      .add(dayIndex, 'day')
      .hours(hour)
      .minutes(minutes)
      .seconds(seconds)
      .toDate();

    callback(event, hour, date);
  };

  onDragEvent = (event, newX, newY) => {
    const { onDragEvent, dayWidth } = this.props;
    if (!onDragEvent) {
      return;
    }

    // NOTE: newX is in the eventsColumn coordinates
    const movedDays = Math.floor(newX / dayWidth);

    const startTime = event.startDate.getTime();
    const newStartDate = new Date(startTime);
    newStartDate.setDate(newStartDate.getDate() + movedDays);

    let newMinutes = this.yToHour(newY - CONTENT_OFFSET) * 60;
    const newHour = Math.floor(newMinutes / 60);
    newMinutes %= 60;
    newStartDate.setHours(newHour, newMinutes);

    const newEndDate = new Date(
      newStartDate.getTime() + event.originalDuration,
    );

    onDragEvent(event, newStartDate, newEndDate);
  };

  isToday = (dayIndex) => {
    const { initialDate } = this.props;
    const today = moment();
    return moment(initialDate).add(dayIndex, 'days').isSame(today, 'day');
  };

  render() {
    const {
      eventsByDate,
      initialDate,
      numberOfDays,
      times,
      onEventPress,
      onEventLongPress,
      eventContainerStyle,
      gridRowStyle,
      gridColumnStyle,
      EventComponent,
      rightToLeft,
      hoursInDisplay,
      timeStep,
      showNowLine,
      nowLineColor,
      onDragEvent,
      dayWidth,
      pageWidth,
    } = this.props;
    const totalEvents = this.processEvents(
      eventsByDate,
      initialDate,
      numberOfDays,
      dayWidth,
      hoursInDisplay,
      rightToLeft,
    );
    const timeSlotHeight = getTimeLabelHeight(hoursInDisplay, timeStep);

    return (
      <View style={[styles.container, { width: pageWidth }]}>
        {times.map((time) => (
          <View
            key={time}
            style={[
              styles.timeRow,
              { height: timeSlotHeight },
              gridRowStyle,
            ]}
          />
        ))}
        <View style={styles.eventsContainer}>
          {totalEvents.map((eventsInSection, dayIndex) => (
            <TouchableWithoutFeedback
              onPress={(e) => this.onGridTouch(e, dayIndex, false)}
              onLongPress={(e) => this.onGridTouch(e, dayIndex, true)}
              key={dayIndex}
            >
              <View style={[styles.eventsColumn, gridColumnStyle]}>
                {showNowLine && this.isToday(dayIndex) && (
                  <NowLine
                    color={nowLineColor}
                    hoursInDisplay={hoursInDisplay}
                    width={dayWidth}
                  />
                )}
                {eventsInSection.map((item) => (
                  <Event
                    key={item.data.id}
                    event={item.data}
                    position={item.style}
                    onPress={onEventPress}
                    onLongPress={onEventLongPress}
                    EventComponent={EventComponent}
                    containerStyle={eventContainerStyle}
                    onDrag={onDragEvent && this.onDragEvent}
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

const GridRowPropType = PropTypes.shape({
  borderColor: PropTypes.string,
  borderTopWidth: PropTypes.number,
});

const GridColumnPropType = PropTypes.shape({
  borderColor: PropTypes.string,
  borderLeftWidth: PropTypes.number,
});


Events.propTypes = {
  numberOfDays: PropTypes.oneOf(availableNumberOfDays).isRequired,
  eventsByDate: PropTypes.objectOf(PropTypes.arrayOf(Event.propTypes.event))
    .isRequired,
  initialDate: PropTypes.string.isRequired,
  hoursInDisplay: PropTypes.number.isRequired,
  timeStep: PropTypes.number.isRequired,
  times: PropTypes.arrayOf(PropTypes.string).isRequired,
  onEventPress: PropTypes.func,
  onEventLongPress: PropTypes.func,
  onGridClick: PropTypes.func,
  onGridLongPress: PropTypes.func,
  eventContainerStyle: PropTypes.object,
  gridRowStyle: GridRowPropType,
  gridColumnStyle: GridColumnPropType,
  EventComponent: PropTypes.elementType,
  rightToLeft: PropTypes.bool,
  showNowLine: PropTypes.bool,
  nowLineColor: PropTypes.string,
  onDragEvent: PropTypes.func,
  pageWidth: PropTypes.number.isRequired,
  dayWidth: PropTypes.number.isRequired,
};

export default Events;
