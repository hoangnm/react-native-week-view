import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  View,
  ScrollView,
  Animated,
  VirtualizedList,
  InteractionManager,
  ActivityIndicator,
  Platform,
  Dimensions,
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import moment from 'moment';
import memoizeOne from 'memoize-one';

import Event from '../Event/Event';
import Events from '../Events/Events';
import Header from '../Header/Header';
import Title from '../Title/Title';
import Times from '../Times/Times';
import styles from './WeekView.styles';
import {
  DATE_STR_FORMAT,
  availableNumberOfDays,
  setLocale,
  minutesToY,
  yToSeconds,
  computeWeekViewDimensions,
  CONTENT_OFFSET,
} from '../utils';

const MINUTES_IN_DAY = 60 * 24;
const calculateTimesArray = (
  minutesStep,
  formatTimeLabel,
  beginAt = 0,
  endAt = MINUTES_IN_DAY,
) => {
  const times = [];
  const startOfDay = moment().startOf('day');
  for (
    let timer = beginAt >= 0 && beginAt < MINUTES_IN_DAY ? beginAt : 0;
    timer < endAt && timer < MINUTES_IN_DAY;
    timer += minutesStep
  ) {
    const time = startOfDay.clone().minutes(timer);
    times.push(time.format(formatTimeLabel));
  }

  return times;
};

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
      // currentMoment should always be the first date of the current page
      currentMoment: moment(initialDates[this.currentPageIndex]).toDate(),
      initialDates,
      windowWidth: Dimensions.get('window').width,
    };

    setLocale(props.locale);

    // FlatList optimization
    this.windowSize = this.pageOffset * 2 + 1;
  }

  componentDidMount() {
    requestAnimationFrame(() => {
      this.scrollToVerticalStart();
    });
    this.eventsGridScrollX.addListener((position) => {
      this.header.scrollToOffset({ offset: position.value, animated: false });
    });

    this.windowListener = Dimensions.addEventListener('change', ({ window }) =>
      this.setState({ windowWidth: window.width }),
    );
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.locale !== prevProps.locale) {
      setLocale(this.props.locale);
    }
    if (this.props.numberOfDays !== prevProps.numberOfDays) {
      /**
       * HOTFIX: linter rules no-access-state-in-setstate and no-did-update-set-state
       * are disabled here for now.
       * TODO: apply a better solution for the `currentMoment` and `initialDates` logic,
       * without using componentDidUpdate()
       */
      const initialDates = this.calculatePagesDates(
        // eslint-disable-next-line react/no-access-state-in-setstate
        this.state.currentMoment,
        this.props.numberOfDays,
        this.props.prependMostRecent,
        this.props.fixedHorizontally,
      );

      this.currentPageIndex = this.pageOffset;
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState(
        {
          currentMoment: moment(initialDates[this.currentPageIndex]).toDate(),
          initialDates,
        },
        () => {
          this.eventsGrid.scrollToIndex({
            index: this.pageOffset,
            animated: false,
          });
        },
      );
    }
    if (this.state.windowWidth !== prevState.windowWidth) {
      // NOTE: after a width change, the position may be off by a few days
      this.eventsGrid.scrollToIndex({
        index: this.currentPageIndex,
        animated: false,
      });
    }
  }

  componentWillUnmount() {
    this.eventsGridScrollX.removeAllListeners();
    if (this.windowListener) {
      this.windowListener.remove();
    }
  }

  calculateTimes = memoizeOne(calculateTimesArray);

  scrollToVerticalStart = () => {
    this.scrollToTime(this.props.startHour * 60, { animated: false });
  };

  scrollToTime = (minutes, options = {}) => {
    if (this.verticalAgenda) {
      const { animated = false } = options || {};
      const { hoursInDisplay, beginAgendaAt } = this.props;
      const top = minutesToY(minutes, hoursInDisplay, beginAgendaAt);
      this.verticalAgenda.scrollTo({
        y: top,
        x: 0,
        animated,
      });
    }
  };

  verticalScrollBegun = () => {
    this.isScrollingVertical = true;
  };

  verticalScrollEnded = (scrollEvent) => {
    if (!this.isScrollingVertical) {
      // Ensure the callback is called only once, same as with horizontal case
      return;
    }
    this.isScrollingVertical = false;

    const { onTimeScrolled, hoursInDisplay, beginAgendaAt } = this.props;

    if (!onTimeScrolled) {
      return;
    }

    const {
      nativeEvent: { contentOffset },
    } = scrollEvent;
    const { y: position } = contentOffset;

    const seconds = yToSeconds(
      position - CONTENT_OFFSET,
      hoursInDisplay,
      beginAgendaAt,
    );

    const date = moment(this.state.currentMoment)
      .startOf('day')
      .seconds(seconds)
      .toDate();

    onTimeScrolled(date);
  };

  isAppendingTheFuture = () => !this.props.prependMostRecent;

  getSignToTheFuture = () => (this.isAppendingTheFuture() ? 1 : -1);

  buildPages = (fromDate, nPages, appending) => {
    const timeSign = this.isAppendingTheFuture() === !!appending ? 1 : -1;
    const deltaDays = timeSign * this.props.numberOfDays;

    const newPages = Array.from({ length: nPages }, (_, index) =>
      moment(fromDate)
        .add((index + 1) * deltaDays, 'days')
        .format(DATE_STR_FORMAT),
    );
    return newPages;
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
    this.goToPageIndex(
      this.currentPageIndex + 1 * this.getSignToTheFuture(),
      animated,
    );
  };

  goToPrevPage = (animated = true) => {
    this.goToPageIndex(
      this.currentPageIndex - 1 * this.getSignToTheFuture(),
      animated,
    );
  };

  goToPageIndex = (target, animated = true) => {
    // - `target` is a number between -inf and inf,
    // - valid pages are between [0 and length-1]
    //   --> add pages necessary and update currentPageIndex
    if (target === this.currentPageIndex) {
      return;
    }

    const { initialDates } = this.state;

    const scrollTo = (moveToIndex) => {
      this.eventsGrid.scrollToIndex({
        index: moveToIndex,
        animated,
      });
      this.currentPageIndex = moveToIndex;
    };

    const newState = {};
    let newStateCallback = () => {};

    // The final target will change if pages are added in either direction
    let targetIndex = target;

    const firstViewablePage = this.pageOffset;
    const lastViewablePage = initialDates.length - this.pageOffset;

    if (targetIndex < firstViewablePage) {
      const prependNeeded = firstViewablePage - targetIndex;

      newState.initialDates = [
        this.buildPages(initialDates[0], prependNeeded, false),
        ...initialDates,
      ];
      targetIndex = this.pageOffset;

      newStateCallback = () => setTimeout(() => scrollTo(targetIndex), 0);
    } else if (targetIndex > lastViewablePage) {
      const appendNeeded = targetIndex - lastViewablePage;
      newState.initialDates = [
        ...initialDates,
        this.buildPages(
          initialDates[initialDates.length - 1],
          appendNeeded,
          true,
        ),
      ];

      targetIndex = newState.initialDates.length - this.pageOffset;

      newStateCallback = () => setTimeout(() => scrollTo(targetIndex), 0);
    } else {
      scrollTo(targetIndex);
    }

    newState.currentMoment = moment(initialDates[targetIndex]).toDate();
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

    const {
      nativeEvent: { contentOffset },
    } = event;
    const { x: position } = contentOffset;
    const { pageWidth } = this.dimensions;
    const { initialDates } = this.state;

    const newPageIndex = Math.round(position / pageWidth);
    const movedPages = newPageIndex - this.currentPageIndex;
    this.currentPageIndex = newPageIndex;

    if (movedPages === 0) {
      return;
    }

    InteractionManager.runAfterInteractions(() => {
      const newMoment = moment(initialDates[this.currentPageIndex]).toDate();
      const newState = {
        currentMoment: newMoment,
      };
      let newStateCallback = () => {};

      const buffer = this.pageOffset;
      const pagesToStartOfList = newPageIndex;
      const pagesToEndOfList = initialDates.length - newPageIndex - 1;

      if (movedPages < 0 && pagesToStartOfList < buffer) {
        const prependNeeded = buffer - pagesToStartOfList;

        newState.initialDates = [
          this.buildPages(initialDates[0], prependNeeded, false),
          ...initialDates,
        ];

        // After prepending, it needs to scroll to fix its position,
        // to mantain visible content position (mvcp)
        this.currentPageIndex += prependNeeded;
        const scrollToCurrentIndex = () =>
          this.eventsGrid.scrollToIndex({
            index: this.currentPageIndex,
            animated: false,
          });
        newStateCallback = () => setTimeout(scrollToCurrentIndex, 0);
      } else if (movedPages > 0 && pagesToEndOfList < buffer) {
        const appendNeeded = buffer - pagesToEndOfList;
        newState.initialDates = [
          ...initialDates,
          this.buildPages(
            initialDates[initialDates.length - 1],
            appendNeeded,
            true,
          ),
        ];
      }

      this.setState(newState, newStateCallback);

      const {
        onSwipePrev: onSwipeToThePast,
        onSwipeNext: onSwipeToTheFuture,
      } = this.props;
      const movedForward = movedPages > 0;
      const callback =
        this.isAppendingTheFuture() === movedForward
          ? onSwipeToTheFuture
          : onSwipeToThePast;
      if (callback) {
        callback(newMoment);
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

        // The event box is limited to the start and end of the day
        const boxStartDate = moment.max(startDate, startOfDay).toDate();
        const boxEndDate = moment.min(endDate, endOfDay).toDate();

        // Add to object
        const dateStr = date.format(DATE_STR_FORMAT);
        if (!sortedEvents[dateStr]) {
          sortedEvents[dateStr] = [];
        }
        sortedEvents[dateStr].push({
          ref: event,
          box: {
            startDate: boxStartDate,
            endDate: boxEndDate,
          },
        });
      }
    });
    // For each day, sort the events by the minute (in-place)
    Object.keys(sortedEvents).forEach((date) => {
      sortedEvents[date].sort((a, b) => {
        return moment(a.box.startDate).diff(b.box.startDate, 'minutes');
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
      beginAgendaAt,
      endAgendaAt,
      formatTimeLabel,
      onGridClick,
      onGridLongPress,
      EventComponent,
      prependMostRecent,
      rightToLeft,
      fixedHorizontally,
      showNowLine,
      nowLineColor,
      onDragEvent,
      onMonthPress,
      onDayPress,
      isRefreshing,
      RefreshComponent,
    } = this.props;
    const { currentMoment, initialDates, windowWidth } = this.state;
    const times = this.calculateTimes(
      timeStep,
      formatTimeLabel,
      beginAgendaAt,
      endAgendaAt,
    );
    const eventsByDate = this.sortEventsByDate(events);
    const horizontalInverted =
      (prependMostRecent && !rightToLeft) ||
      (!prependMostRecent && rightToLeft);

    this.dimensions = this.updateDimensions(windowWidth, numberOfDays);
    const { pageWidth, dayWidth, timeLabelsWidth } = this.dimensions;

    return (
      <GestureHandlerRootView style={styles.container}>
        <View style={styles.headerContainer}>
          <Title
            showTitle={showTitle}
            style={headerStyle}
            textStyle={headerTextStyle}
            numberOfDays={numberOfDays}
            selectedDate={currentMoment}
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
            extraData={dayWidth}
            windowSize={this.windowSize}
            initialNumToRender={this.windowSize}
            maxToRenderPerBatch={this.pageOffset}
            renderItem={({ item }) => {
              return (
                <Header
                  key={item}
                  style={headerStyle}
                  textStyle={headerTextStyle}
                  TodayComponent={TodayHeaderComponent}
                  DayComponent={DayHeaderComponent}
                  formatDate={formatDateHeader}
                  initialDate={item}
                  numberOfDays={numberOfDays}
                  rightToLeft={rightToLeft}
                  onDayPress={onDayPress}
                  dayWidth={dayWidth}
                />
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
          contentContainerStyle={Platform.OS === 'web' && styles.webScrollView}
          onMomentumScrollBegin={this.verticalScrollBegun}
          onMomentumScrollEnd={this.verticalScrollEnded}
          ref={this.verticalAgendaRef}
        >
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
                    beginAgendaAt={beginAgendaAt}
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
              pagingEnabled
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
              windowSize={this.windowSize}
              initialNumToRender={this.windowSize}
              maxToRenderPerBatch={this.pageOffset}
            />
          </View>
        </ScrollView>
      </GestureHandlerRootView>
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
  onTimeScrolled: PropTypes.func,
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
  beginAgendaAt: PropTypes.number,
  endAgendaAt: PropTypes.number,
  formatTimeLabel: PropTypes.string,
  startHour: PropTypes.number,
  EventComponent: PropTypes.elementType,
  DayHeaderComponent: PropTypes.elementType,
  TodayHeaderComponent: PropTypes.elementType,
  showTitle: PropTypes.bool,
  rightToLeft: PropTypes.bool,
  fixedHorizontally: PropTypes.bool,
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
  beginAgendaAt: 0,
  endAgendaAt: MINUTES_IN_DAY,
  formatTimeLabel: 'H:mm',
  startHour: 8,
  showTitle: true,
  rightToLeft: false,
  prependMostRecent: false,
  RefreshComponent: ActivityIndicator,
};
