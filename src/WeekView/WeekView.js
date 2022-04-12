import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  View,
  ScrollView,
  Animated,
  VirtualizedList,
  InteractionManager,
  ActivityIndicator,
} from 'react-native';
import moment from 'moment';
import memoizeOne from 'memoize-one';

import Event from '../Event/Event';
import Events from '../Events/Events';
import Header from '../Header/Header';
import Title from '../Title/Title';
import Times from '../Times/Times';
import styles from './WeekView.styles';
import {
  CONTAINER_HEIGHT,
  DATE_STR_FORMAT,
  availableNumberOfDays,
  setLocale,
  computeWeekViewDimensions,
} from '../utils';

const MINUTES_IN_DAY = 60 * 24;

export default class WeekView extends Component {
  constructor(props) {
    super(props);
    this.eventsGrid = null;
    this.verticalAgenda = null;
    this.header = null;
    this.pageOffset = 2;
    this.currentPageIndex = this.pageOffset;
    this.eventsGridScrollX = new Animated.Value(0);

    const initialDates = this.calculatePagesDates(
      props.selectedDate,
      props.numberOfDays,
      props.weekStartsOn,
      props.prependMostRecent,
      props.fixedHorizontally,
    );
    this.state = {
      initialDates,
    };

    // currentMoment always points to the date shown in the top-left
    this.currentMoment = moment(initialDates[this.currentPageIndex]).toDate();

    setLocale(props.locale);
  }

  componentDidMount() {
    requestAnimationFrame(() => {
      this.scrollToVerticalStart();
    });
    this.eventsGridScrollX.addListener((position) => {
      this.header.scrollToOffset({ offset: position.value, animated: false });
    });
  }

  componentDidUpdate(prevProps) {
    if (this.props.locale !== prevProps.locale) {
      setLocale(this.props.locale);
    }
    if (this.props.numberOfDays !== prevProps.numberOfDays) {
      const initialDates = this.calculatePagesDates(
        this.currentMoment,
        this.props.numberOfDays,
        this.props.prependMostRecent,
        this.props.fixedHorizontally,
      );

      this.currentPageIndex = this.pageOffset;
      this.currentMoment = moment(initialDates[this.currentPageIndex]).toDate();
      this.setState({ initialDates },
        () => {
          this.eventsGrid.scrollToIndex({
            index: this.pageOffset,
            animated: false,
          });
        },
      );
    }
  }

  componentWillUnmount() {
    this.eventsGridScrollX.removeAllListeners();
  }

  calculateTimes = memoizeOne((minutesStep, formatTimeLabel) => {
    const times = [];
    const startOfDay = moment().startOf('day');
    for (let timer = 0; timer < MINUTES_IN_DAY; timer += minutesStep) {
      const time = startOfDay.clone().minutes(timer);
      times.push(time.format(formatTimeLabel));
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

  getSignToTheFuture = () => {
    const { prependMostRecent } = this.props;

    const daySignToTheFuture = prependMostRecent ? -1 : 1;
    return daySignToTheFuture;
  };

  isHorizontalInverted = () => {
    const { prependMostRecent, rightToLeft } = this.props;
    return (prependMostRecent && !rightToLeft) || (!prependMostRecent && rightToLeft);
  }

  prependPagesInPlace = (initialDates, nPages) => {
    const { numberOfDays } = this.props;
    const daySignToTheFuture = this.getSignToTheFuture();

    const first = initialDates[0];
    const daySignToThePast = daySignToTheFuture * -1;
    const addDays = numberOfDays * daySignToThePast;
    for (let i = 1; i <= nPages; i += 1) {
      const initialDate = moment(first).add(addDays * i, 'd');
      initialDates.unshift(initialDate.format(DATE_STR_FORMAT));
    }
  };

  appendPagesInPlace = (initialDates, nPages) => {
    const { numberOfDays } = this.props;
    const daySignToTheFuture = this.getSignToTheFuture();

    const latest = initialDates[initialDates.length - 1];
    const addDays = numberOfDays * daySignToTheFuture;
    for (let i = 1; i <= nPages; i += 1) {
      const initialDate = moment(latest).add(addDays * i, 'd');
      initialDates.push(initialDate.format(DATE_STR_FORMAT));
    }
  };

  goToDate = (targetDate, animated = true) => {
    const { initialDates } = this.state;
    const { numberOfDays } = this.props;

    const currentDate = moment(initialDates[this.currentPageIndex]).startOf(
      'day',
    );
    const deltaDay = moment(targetDate).startOf('day').diff(currentDate, 'day');
    const deltaIndex = Math.floor(deltaDay / numberOfDays);
    const signToTheFuture = this.getSignToTheFuture();
    const targetIndex = this.currentPageIndex + deltaIndex * signToTheFuture;

    this.goToPageIndex(targetIndex, animated);
  };

  goToNextPage = (animated = true) => {
    const signToTheFuture = this.getSignToTheFuture();
    this.goToPageIndex(this.currentPageIndex + 1 * signToTheFuture, animated);
  };

  goToPrevPage = (animated = true) => {
    const signToTheFuture = this.getSignToTheFuture();
    this.goToPageIndex(this.currentPageIndex - 1 * signToTheFuture, animated);
  };

  goToPageIndex = (target, animated = true) => {
    if (target === this.currentPageIndex) {
      return;
    }

    const { initialDates } = this.state;

    const previousMoment = this.currentMoment;
    const previousInitialDate = initialDates[this.currentPageIndex];
    const dayOffset = moment(previousMoment).diff(moment(previousInitialDate), 'd');

    const scrollTo = (moveToIndex) => {
      const signToTheRight = this.isHorizontalInverted() ? 1 : -1;
      this.eventsGrid.scrollToIndex({
        index: moveToIndex,
        animated,
        viewOffset: signToTheRight * dayOffset * this.dimensions.dayWidth,
      });
      this.currentPageIndex = moveToIndex;
    };

    const newState = {};
    let newStateCallback = () => {};
    // The final target may change, if pages are added
    let targetIndex = target;

    const lastViewablePage = initialDates.length - this.pageOffset;
    if (targetIndex < this.pageOffset) {
      const nPages = this.pageOffset - targetIndex;
      this.prependPagesInPlace(initialDates, nPages);

      targetIndex = this.pageOffset;

      newState.initialDates = [...initialDates];
      newStateCallback = () => setTimeout(() => scrollTo(targetIndex), 0);
    } else if (targetIndex > lastViewablePage) {
      const nPages = targetIndex - lastViewablePage;
      this.appendPagesInPlace(initialDates, nPages);

      targetIndex = initialDates.length - this.pageOffset;

      newState.initialDates = [...initialDates];
      newStateCallback = () => setTimeout(() => scrollTo(targetIndex), 0);
    } else {
      scrollTo(targetIndex);
    }

    this.currentMoment = moment(initialDates[targetIndex]).add(dayOffset, 'd').toDate();
    this.setState(newState, newStateCallback);
  };

  scrollBegun = () => {
    this.isScrollingHorizontal = true;
  };

  scrollEnded = (event) => {
    if (!this.isScrollingHorizontal) {
      // Ensure the callback is called only once
      return;
    }
    this.isScrollingHorizontal = false;

    const { nativeEvent: { contentOffset } } = event;
    const { x: position } = contentOffset;
    const { onSwipePrev, onSwipeNext } = this.props;
    const { initialDates } = this.state;

    const previousMoment = this.currentMoment;

    const {
      pageWidth, // can also be calculated as = nativeEvent.contentSize.width / initialDates.length
      dayWidth,
    } = this.dimensions;

    const newPageIndex = Math.floor(position / pageWidth);
    const dayOffset = Math.round((position % pageWidth) / dayWidth);

    const movedPages = newPageIndex - this.currentPageIndex;
    this.currentPageIndex = newPageIndex;

    const newMoment = moment(
      initialDates[this.currentPageIndex],
    ).add(dayOffset, 'd').toDate();
    this.currentMoment = newMoment;

    const movedDays = moment(newMoment).diff(previousMoment, 'd');

    if (movedDays === 0) {
      return;
    }

    InteractionManager.runAfterInteractions(() => {
      // Step 1: update pages internally
      if (movedPages < 0 && newPageIndex < this.pageOffset) {
        this.prependPagesInPlace(initialDates, 1);
        this.currentPageIndex += 1;

        const scrollToCurrentIndex = () => {
          const signToTheRight = this.isHorizontalInverted() ? 1 : -1;
          this.eventsGrid.scrollToIndex({
            index: this.currentPageIndex,
            viewOffset: signToTheRight * dayOffset * dayWidth,
            animated: false,
          });
        };

        this.setState({
          initialDates: [...initialDates],
        }, () => setTimeout(scrollToCurrentIndex, 0));
        // setTimeout is a hacky way to ensure the callback is called after interactions
      } else if (
        movedPages > 0 &&
        newPageIndex >= this.state.initialDates.length - this.pageOffset
      ) {
        this.appendPagesInPlace(initialDates, 1);

        this.setState({
          initialDates: [...initialDates],
        });
      }

      // Step 2: execute callbacks
      if (onSwipePrev && movedDays < 0) {
        onSwipePrev(newMoment);
      } else if (onSwipeNext && movedDays > 0) {
        onSwipeNext(newMoment);
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

  calculatePagesDates = (
    currentMoment,
    numberOfDays,
    weekStartsOn,
    prependMostRecent,
    fixedHorizontally,
  ) => {
    const initialDates = [];
    const centralDate = moment(currentMoment);
    if (numberOfDays === 7 || fixedHorizontally) {
      centralDate.subtract(
        // Ensure centralDate is before currentMoment
        (centralDate.day() + 7 - weekStartsOn) % 7,
        'days',
      );
    }
    for (let i = -this.pageOffset; i <= this.pageOffset; i += 1) {
      const initialDate = moment(centralDate).add(numberOfDays * i, 'd');
      initialDates.push(initialDate.format(DATE_STR_FORMAT));
    }
    return prependMostRecent ? initialDates.reverse() : initialDates;
  };

  sortEventsByDate = memoizeOne((events) => {
    // Stores the events hashed by their date
    // For example: { "2020-02-03": [event1, event2, ...] }
    // If an event spans through multiple days, adds the event multiple times
    const sortedEvents = {};
    events.forEach((event) => {
      // in milliseconds
      const originalDuration =
        event.endDate.getTime() - event.startDate.getTime();
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
          originalDuration,
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

  updateDimensions = memoizeOne(computeWeekViewDimensions);

  getListItemLayout = (item, index) => {
    const pageWidth = this.dimensions.pageWidth || 0;
    return {
      length: pageWidth,
      offset: pageWidth * index,
      index,
    };
  };

  render() {
    const {
      showTitle,
      numberOfDays,
      headerStyle,
      headerTextStyle,
      hourTextStyle,
      gridRowStyle,
      gridColumnStyle,
      eventContainerStyle,
      DayHeaderComponent,
      TodayHeaderComponent,
      formatDateHeader,
      onEventPress,
      onEventLongPress,
      events,
      hoursInDisplay,
      timeStep,
      formatTimeLabel,
      onGridClick,
      onGridLongPress,
      EventComponent,
      rightToLeft,
      fixedHorizontally,
      allowMoveByOneDay,
      showNowLine,
      nowLineColor,
      onDragEvent,
      onMonthPress,
      onDayPress,
      isRefreshing,
      RefreshComponent,
    } = this.props;
    const { initialDates } = this.state;
    const times = this.calculateTimes(timeStep, formatTimeLabel);
    const eventsByDate = this.sortEventsByDate(events);
    const horizontalInverted = this.isHorizontalInverted();

    // Update dimensions
    this.dimensions = this.updateDimensions(numberOfDays);
    const {
      pageWidth,
      dayWidth,
      timeLabelsWidth,
    } = this.dimensions;

    const moveProps = allowMoveByOneDay ? {
      decelerationRate: 'fast',
      snapToInterval: dayWidth,
    } : {
      pagingEnabled: true,
    };

    return (
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Title
            showTitle={showTitle}
            style={headerStyle}
            textStyle={headerTextStyle}
            numberOfDays={numberOfDays}
            selectedDate={this.currentMoment}
            onMonthPress={onMonthPress}
            width={timeLabelsWidth}
          />
          <VirtualizedList
            horizontal
            pagingEnabled
            inverted={horizontalInverted}
            showsHorizontalScrollIndicator={false}
            scrollEnabled={false}
            ref={this.headerRef}
            data={initialDates}
            getItem={(data, index) => data[index]}
            getItemCount={(data) => data.length}
            getItemLayout={this.getListItemLayout}
            keyExtractor={(item) => item}
            initialScrollIndex={this.pageOffset}
            renderItem={({ item }) => {
              return (
                <View key={item} style={[styles.header, { width: pageWidth }]}>
                  <Header
                    style={headerStyle}
                    textStyle={headerTextStyle}
                    TodayComponent={TodayHeaderComponent}
                    DayComponent={DayHeaderComponent}
                    formatDate={formatDateHeader}
                    initialDate={item}
                    numberOfDays={numberOfDays}
                    rightToLeft={rightToLeft}
                    onDayPress={onDayPress}
                  />
                </View>
              );
            }}
          />
        </View>
        {isRefreshing && RefreshComponent && (
          <RefreshComponent
            style={[styles.loadingSpinner, { right: pageWidth / 2 }]}
          />
        )}
        <ScrollView
          onStartShouldSetResponderCapture={() => false}
          onMoveShouldSetResponderCapture={() => false}
          onResponderTerminationRequest={() => false}
          ref={this.verticalAgendaRef}>
          <View style={styles.scrollViewContent}>
            <Times
              times={times}
              textStyle={hourTextStyle}
              hoursInDisplay={hoursInDisplay}
              timeStep={timeStep}
              width={timeLabelsWidth}
            />
            <VirtualizedList
              data={initialDates}
              getItem={(data, index) => data[index]}
              getItemCount={(data) => data.length}
              getItemLayout={this.getListItemLayout}
              keyExtractor={(item) => item}
              initialScrollIndex={this.pageOffset}
              scrollEnabled={!fixedHorizontally}
              onStartShouldSetResponderCapture={() => false}
              onMoveShouldSetResponderCapture={() => false}
              onResponderTerminationRequest={() => false}
              renderItem={({ item }) => {
                return (
                  <Events
                    times={times}
                    eventsByDate={eventsByDate}
                    initialDate={item}
                    numberOfDays={numberOfDays}
                    onEventPress={onEventPress}
                    onEventLongPress={onEventLongPress}
                    onGridClick={onGridClick}
                    onGridLongPress={onGridLongPress}
                    hoursInDisplay={hoursInDisplay}
                    timeStep={timeStep}
                    EventComponent={EventComponent}
                    eventContainerStyle={eventContainerStyle}
                    gridRowStyle={gridRowStyle}
                    gridColumnStyle={gridColumnStyle}
                    rightToLeft={rightToLeft}
                    showNowLine={showNowLine}
                    nowLineColor={nowLineColor}
                    onDragEvent={onDragEvent}
                    pageWidth={pageWidth}
                    dayWidth={dayWidth}
                  />
                );
              }}
              horizontal
              inverted={horizontalInverted}
              onMomentumScrollBegin={this.scrollBegun}
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
              {...moveProps}
            />
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
  weekStartsOn: PropTypes.number,
  onSwipeNext: PropTypes.func,
  onSwipePrev: PropTypes.func,
  onEventPress: PropTypes.func,
  onEventLongPress: PropTypes.func,
  onGridClick: PropTypes.func,
  onGridLongPress: PropTypes.func,
  headerStyle: PropTypes.object,
  headerTextStyle: PropTypes.object,
  hourTextStyle: PropTypes.object,
  eventContainerStyle: PropTypes.object,
  gridRowStyle: Events.propTypes.gridRowStyle,
  gridColumnStyle: Events.propTypes.gridColumnStyle,
  selectedDate: PropTypes.instanceOf(Date).isRequired,
  locale: PropTypes.string,
  hoursInDisplay: PropTypes.number,
  timeStep: PropTypes.number,
  formatTimeLabel: PropTypes.string,
  startHour: PropTypes.number,
  EventComponent: PropTypes.elementType,
  DayHeaderComponent: PropTypes.elementType,
  TodayHeaderComponent: PropTypes.elementType,
  showTitle: PropTypes.bool,
  rightToLeft: PropTypes.bool,
  fixedHorizontally: PropTypes.bool,
  allowMoveByOneDay: PropTypes.bool,
  prependMostRecent: PropTypes.bool,
  showNowLine: PropTypes.bool,
  nowLineColor: PropTypes.string,
  onDragEvent: PropTypes.func,
  onMonthPress: PropTypes.func,
  onDayPress: PropTypes.func,
  isRefreshing: PropTypes.bool,
  RefreshComponent: PropTypes.elementType,
};

WeekView.defaultProps = {
  events: [],
  locale: 'en',
  hoursInDisplay: 6,
  weekStartsOn: 1,
  timeStep: 60,
  formatTimeLabel: 'H:mm',
  startHour: 8,
  showTitle: true,
  rightToLeft: false,
  prependMostRecent: false,
  allowMoveByOneDay: false,
  RefreshComponent: ActivityIndicator,
};
