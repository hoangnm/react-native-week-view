import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import moment from 'moment';
import memoizeOne from 'memoize-one';

import NowLine from '../NowLine/NowLine';
import Event, { eventPropType } from '../Event/Event';
import {
  calculateDaysArray,
  DATE_STR_FORMAT,
  availableNumberOfDays,
  CONTENT_OFFSET,
  getTimeLabelHeight,
  yToSeconds,
  minutesToY,
} from '../utils';
import { ViewWithTouchable } from '../utils-gestures';

import styles from './Events.styles';

const MINUTES_IN_HOUR = 60;
const EVENT_HORIZONTAL_PADDING = 8; // percentage
const MIN_ITEM_WIDTH = 4;
const ALLOW_OVERLAP_SECONDS = 2;

const padItemWidth = (width, paddingPercentage = EVENT_HORIZONTAL_PADDING) =>
  paddingPercentage > 0
    ? width - Math.max(2, (width * paddingPercentage) / 100)
    : width;

const areEventsOverlapped = (event1EndDate, event2StartDate) => {
  const endDate = moment(event1EndDate);
  endDate.subtract(ALLOW_OVERLAP_SECONDS, 'seconds');
  return endDate.isSameOrAfter(event2StartDate);
};

const getStyleForEvent = (
  event,
  regularItemWidth,
  hoursInDisplay,
  beginAgendaAt,
) => {
  const startDate = moment(event.startDate);
  const minutes = startDate.hours() * MINUTES_IN_HOUR + startDate.minutes();
  const top = minutesToY(minutes, hoursInDisplay, beginAgendaAt);

  const deltaMinutes = moment(event.endDate).diff(event.startDate, 'minutes');
  const height = minutesToY(deltaMinutes, hoursInDisplay);

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
          !areEventsOverlapped(lastEvtInLane.box.endDate, event.box.startDate)
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
  const width = Math.max(
    padItemWidth(dividedWidth, EVENT_HORIZONTAL_PADDING / nLanes),
    MIN_ITEM_WIDTH,
  );

  overlappedArr.forEach((eventWithStyle, index) => {
    const { ref, box, style } = eventWithStyle;
    baseArr.push({
      ref,
      box,
      style: {
        ...style,
        width,
        left: dividedWidth * indexToLane(index),
      },
    });
  });
};

const getEventsWithPosition = (
  totalEvents,
  dayWidth,
  hoursInDisplay,
  beginAgendaAt,
) => {
  const paddedDayWidth = padItemWidth(dayWidth);
  return totalEvents.map((events) => {
    let overlappedSoFar = []; // Store events overlapped until now
    let lastDate = null;
    const eventsWithStyle = events.reduce((accumulated, { ref, box }) => {
      const style = getStyleForEvent(
        box,
        paddedDayWidth,
        hoursInDisplay,
        beginAgendaAt,
      );
      const eventWithStyle = {
        ref,
        box,
        style,
      };

      if (!lastDate || areEventsOverlapped(lastDate, box.startDate)) {
        overlappedSoFar.push(eventWithStyle);
        const endDate = moment(box.endDate);
        lastDate = lastDate ? moment.max(endDate, lastDate) : endDate;
      } else {
        addOverlappedToArray(accumulated, overlappedSoFar, dayWidth);
        overlappedSoFar = [eventWithStyle];
        lastDate = moment(box.endDate);
      }
      return accumulated;
    }, []);
    addOverlappedToArray(eventsWithStyle, overlappedSoFar, dayWidth);
    return eventsWithStyle;
  });
};

const processEvents = (
  eventsByDate,
  initialDate,
  numberOfDays,
  dayWidth,
  hoursInDisplay,
  rightToLeft,
  beginAgendaAt,
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
    beginAgendaAt,
  );
  return totalEventsWithPosition;
};

class Events extends PureComponent {
  processEvents = memoizeOne(processEvents);

  handleGridTouch = (pressEvt, callback) => {
    if (!callback) {
      return;
    }
    const { initialDate, hoursInDisplay, beginAgendaAt } = this.props;
    const dayIndex = Math.floor(pressEvt.x / this.props.dayWidth);

    const seconds = yToSeconds(
      pressEvt.y - CONTENT_OFFSET,
      hoursInDisplay,
      beginAgendaAt,
    );

    const dateWithTime = moment(initialDate)
      .add(dayIndex, 'day')
      .startOf('day')
      .seconds(seconds)
      .toDate();

    callback(pressEvt, dateWithTime.getHours(), dateWithTime);
  };

  handleGridPress = (pressEvt) => {
    this.handleGridTouch(pressEvt, this.props.onGridClick);
  };

  handleGridLongPress = (pressEvt) => {
    this.handleGridTouch(pressEvt, this.props.onGridLongPress);
  };

  handleDragEvent = (event, newX, newY) => {
    const { onDragEvent } = this.props;
    if (!onDragEvent) {
      return;
    }

    const { dayWidth, hoursInDisplay, beginAgendaAt } = this.props;

    // NOTE: The point (newX, newY) is in the eventsColumn coordinates
    const movedDays = Math.floor(newX / dayWidth);
    const seconds = yToSeconds(
      newY - CONTENT_OFFSET,
      hoursInDisplay,
      beginAgendaAt,
    );

    const newStartDate = moment(event.startDate)
      .add(movedDays, 'days')
      .startOf('day')
      .seconds(seconds)
      .toDate();

    const eventDuration = event.endDate.getTime() - event.startDate.getTime();
    const newEndDate = new Date(newStartDate.getTime() + eventDuration);

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
      beginAgendaAt,
      showNowLine,
      nowLineColor,
      onDragEvent,
      onGridClick,
      onGridLongPress,
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
      beginAgendaAt,
    );
    const timeSlotHeight = getTimeLabelHeight(hoursInDisplay, timeStep);

    return (
      <View style={[styles.container, { width: pageWidth }]}>
        {times.map((time) => (
          <View
            key={`${initialDate}-${time}`}
            style={[styles.timeRow, { height: timeSlotHeight }, gridRowStyle]}
          />
        ))}
        <ViewWithTouchable
          style={styles.eventsContainer}
          onPress={onGridClick && this.handleGridPress}
          onLongPress={onGridLongPress && this.handleGridLongPress}
        >
          {totalEvents.map((eventsInSection, dayIndex) => (
            <View
              style={[styles.eventsColumn, gridColumnStyle]}
              key={`${initialDate}-${dayIndex}`}
            >
              {showNowLine && this.isToday(dayIndex) && (
                <NowLine
                  color={nowLineColor}
                  hoursInDisplay={hoursInDisplay}
                  width={dayWidth}
                  beginAgendaAt={beginAgendaAt}
                />
              )}
              {eventsInSection.map((item) => (
                <Event
                  key={item.ref.id}
                  event={item.ref}
                  position={item.style}
                  onPress={onEventPress}
                  onLongPress={onEventLongPress}
                  EventComponent={EventComponent}
                  containerStyle={eventContainerStyle}
                  onDrag={onDragEvent && this.handleDragEvent}
                />
              ))}
            </View>
          ))}
        </ViewWithTouchable>
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
  eventsByDate: PropTypes.objectOf(
    PropTypes.arrayOf(
      PropTypes.shape({
        ref: eventPropType.isRequired,
        box: PropTypes.shape({
          startDate: PropTypes.instanceOf(Date).isRequired,
          endDate: PropTypes.instanceOf(Date).isRequired,
        }),
      }),
    ),
  ).isRequired,
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
