import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import moment from 'moment';
import memoizeOne from 'memoize-one';

import NowLine from '../NowLine/NowLine';
import Event, { eventPropType } from '../Event/Event';
import {
  calculateDaysArray,
  DATE_STR_FORMAT,
  availableNumberOfDays,
  minutesInDay,
} from '../utils/dates';
import {
  minutesInDayToTop,
  minutesToHeight,
  topToSecondsInDay as topToSecondsInDayFromUtils,
} from '../utils/dimensions';
import { ViewWithTouchable } from '../utils/gestures';

import styles from './Events.styles';

const EVENT_HORIZONTAL_PADDING = 8; // percentage
const MIN_ITEM_WIDTH = 4;
const ALLOW_OVERLAP_SECONDS = 2;

const padItemWidth = (width, paddingPercentage = EVENT_HORIZONTAL_PADDING) =>
  paddingPercentage > 0
    ? width - Math.max(2, (width * paddingPercentage) / 100)
    : width;

const getWidth = (box, dayWidth) => {
  const dividedWidth = dayWidth / (box.nLanes || 1);
  const dividedPadding = EVENT_HORIZONTAL_PADDING / (box.nLanes || 1);
  const width = Math.max(
    padItemWidth(dividedWidth, dividedPadding),
    MIN_ITEM_WIDTH,
  );
  return width;
};

const getLeft = (box, dayWidth) => {
  if (!box.lane || !box.nLanes) return 0;
  const dividedWidth = dayWidth / box.nLanes;
  return dividedWidth * box.lane;
};

const areEventsOverlapped = (event1EndDate, event2StartDate) => {
  const endDate = moment(event1EndDate);
  endDate.subtract(ALLOW_OVERLAP_SECONDS, 'seconds');
  return endDate.isSameOrAfter(event2StartDate);
};

const addOverlappedToArray = (baseArr, overlappedArr) => {
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

  overlappedArr.forEach((eventWithStyle, index) => {
    const { ref, box } = eventWithStyle;
    baseArr.push({
      ref,
      box: {
        ...box,
        nLanes,
        lane: indexToLane(index),
      },
    });
  });
};

const resolveEventOverlaps = (totalEvents) => {
  return totalEvents.map((events) => {
    let overlappedSoFar = []; // Store events overlapped until now
    let lastDate = null;
    const resolvedEvents = events.reduce((accumulated, eventWithMeta) => {
      const { box } = eventWithMeta;
      if (!lastDate || areEventsOverlapped(lastDate, box.startDate)) {
        overlappedSoFar.push(eventWithMeta);
        const endDate = moment(box.endDate);
        lastDate = lastDate ? moment.max(endDate, lastDate) : endDate;
      } else {
        addOverlappedToArray(accumulated, overlappedSoFar);
        overlappedSoFar = [eventWithMeta];
        lastDate = moment(box.endDate);
      }
      return accumulated;
    }, []);
    addOverlappedToArray(resolvedEvents, overlappedSoFar);
    return resolvedEvents;
  });
};

const processEvents = (
  eventsByDate,
  initialDate,
  numberOfDays,
  rightToLeft,
) => {
  // totalEvents stores events in each day of numberOfDays
  // example: [[event1, event2], [event3, event4], [event5]], each child array
  // is events for specific day in range
  const dates = calculateDaysArray(initialDate, numberOfDays, rightToLeft);
  const totalEvents = dates.map((date) => {
    const dateStr = date.format(DATE_STR_FORMAT);
    return eventsByDate[dateStr] || [];
  });

  return resolveEventOverlaps(totalEvents);
};

const Lines = ({ initialDate, times, timeLabelHeight, gridRowStyle }) => {
  const heightStyle = useAnimatedStyle(() => ({
    height: withTiming(timeLabelHeight),
  }));
  return times.map((time) => (
    <Animated.View
      key={`${initialDate}-${time}`}
      style={[styles.timeRow, gridRowStyle, heightStyle]}
    />
  ));
};

class Events extends PureComponent {
  topToSecondsInDay = (yValue) =>
    topToSecondsInDayFromUtils(
      yValue,
      this.props.verticalResolution,
      this.props.beginAgendaAt,
    );

  xToDayIndex = (xValue) => Math.floor(xValue / this.props.dayWidth);

  processEvents = memoizeOne(processEvents);

  handleGridTouch = (pressEvt, callback) => {
    if (!callback) {
      return;
    }
    const dayIndex = this.xToDayIndex(pressEvt.x);
    const secondsInDay = this.topToSecondsInDay(pressEvt.y);

    const dateWithTime = moment(this.props.initialDate)
      .add(dayIndex, 'day')
      .startOf('day')
      .seconds(secondsInDay)
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

    // NOTE: The point (newX, newY) is in the eventsColumn coordinates
    const movedDays = this.xToDayIndex(newX);
    const secondsInDay = this.topToSecondsInDay(newY);

    const newStartDate = moment(event.startDate)
      .add(movedDays, 'days')
      .startOf('day')
      .seconds(secondsInDay)
      .toDate();

    const eventDuration = event.endDate.getTime() - event.startDate.getTime();
    const newEndDate = new Date(newStartDate.getTime() + eventDuration);

    onDragEvent(event, newStartDate, newEndDate);
  };

  handleEditEvent = (event, params) => {
    const { onEditEvent } = this.props;
    if (!onEditEvent) {
      return;
    }
    if (!params || Object.keys(params).length === 0) {
      return;
    }

    let newStartDate = moment(event.startDate);
    let newEndDate = moment(event.endDate);

    if (params.left != null) {
      const daysToLeft = this.xToDayIndex(params.left);
      newStartDate = newStartDate.add(daysToLeft, 'days');
    }
    if (params.right != null) {
      const movedRight = this.xToDayIndex(params.right);
      newEndDate = newEndDate.add(movedRight, 'days');
    }
    if (params.top != null) {
      newStartDate = newStartDate
        .startOf('day')
        .seconds(this.topToSecondsInDay(params.top));
    }
    if (params.bottom != null) {
      newEndDate = newEndDate
        .startOf('day')
        .seconds(this.topToSecondsInDay(params.bottom));
    }

    onEditEvent(event, newStartDate.toDate(), newEndDate.toDate());
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
      beginAgendaAt,
      showNowLine,
      nowLineColor,
      onDragEvent,
      onGridClick,
      onGridLongPress,
      dayWidth,
      pageWidth,
      timeLabelHeight,
      verticalResolution,
      onEditEvent,
      editingEventId,
      editEventConfig,
    } = this.props;
    const totalEvents = this.processEvents(
      eventsByDate,
      initialDate,
      numberOfDays,
      rightToLeft,
    );

    return (
      <View style={[styles.container, { width: pageWidth }]}>
        <Lines
          initialDate={initialDate}
          times={times}
          timeLabelHeight={timeLabelHeight}
          gridRowStyle={gridRowStyle}
        />
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
                  verticalResolution={verticalResolution}
                  width={dayWidth}
                  beginAgendaAt={beginAgendaAt}
                />
              )}
              {eventsInSection.map((item) => {
                const { ref: event, box } = item;
                return (
                  <Event
                    key={event.id}
                    event={event}
                    position={{
                      top: minutesInDayToTop(
                        minutesInDay(box.startDate),
                        verticalResolution,
                        beginAgendaAt,
                      ),
                      height: minutesToHeight(
                        minutesInDay(box.endDate) - minutesInDay(box.startDate),
                        verticalResolution,
                      ),
                      left: getLeft(box, dayWidth),
                      width: getWidth(box, dayWidth),
                    }}
                    onPress={onEventPress}
                    onLongPress={onEventLongPress}
                    EventComponent={EventComponent}
                    containerStyle={eventContainerStyle}
                    onDrag={onDragEvent && this.handleDragEvent}
                    onEdit={onEditEvent && this.handleEditEvent}
                    editingEventId={editingEventId}
                    editEventConfig={editEventConfig}
                  />
                );
              })}
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
  beginAgendaAt: PropTypes.number,
  onDragEvent: PropTypes.func,
  pageWidth: PropTypes.number.isRequired,
  dayWidth: PropTypes.number.isRequired,
  verticalResolution: PropTypes.number.isRequired,
  timeLabelHeight: PropTypes.number.isRequired,
  onEditEvent: PropTypes.func,
  editingEventId: PropTypes.number,
};

export default Events;
