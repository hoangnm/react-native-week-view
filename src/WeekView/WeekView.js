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

import { EditEventConfigPropType, eventPropType } from '../Event/Event';
import Events, { GridRowPropType, GridColumnPropType } from '../Events/Events';
import Header from '../Header/Header';
import Title from '../Title/Title';
import Times from '../Times/Times';
import styles from './WeekView.styles';
import {
  DATE_STR_FORMAT,
  availableNumberOfDays,
  setLocale,
} from '../utils/dates';
import { mod } from '../utils/misc';
import {
  minutesInDayToTop,
  topToSecondsInDay,
  computeVerticalDimensions,
  computeHorizontalDimensions,
} from '../utils/dimensions';

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

const getRawDayOffset = (newDayOffset, options = {}) => {
  const { left: distanceToLeft = null } = options || {};
  if (distanceToLeft != null) {
    // the user wants to see targetDate at <distanceToLeft> from the edge
    return newDayOffset - distanceToLeft;
  }
  return newDayOffset;
};

const getPageStartDate = (
  selectedDate,
  numberOfDays,
  pageStartAtOptions = {},
) => {
  const { left: distanceToLeft = null, weekday = null } =
    pageStartAtOptions || {};
  if (distanceToLeft != null) {
    // the user wants to see selectedDate at <distanceToLeft> from the left edge
    return moment(selectedDate).subtract(distanceToLeft, 'day');
  }
  if (weekday != null) {
    const date = moment(selectedDate);
    return date.subtract(
      // Ensure centralDate is before currentMoment
      (date.day() + numberOfDays - weekday) % numberOfDays,
      'days',
    );
  }
  return moment(selectedDate);
};

// FlatList configuration
const PAGES_OFFSET = 2;
const DEFAULT_WINDOW_SIZE = PAGES_OFFSET * 2 + 1;

const calculatePagesDates = (
  selectedDate,
  numberOfDays,
  pageStartAt,
  prependMostRecent,
) => {
  const initialDates = [];
  const centralDate = getPageStartDate(selectedDate, numberOfDays, pageStartAt);
  for (let i = -PAGES_OFFSET; i <= PAGES_OFFSET; i += 1) {
    const initialDate = moment(centralDate).add(numberOfDays * i, 'd');
    initialDates.push(initialDate.format(DATE_STR_FORMAT));
  }
  return prependMostRecent ? initialDates.reverse() : initialDates;
};

export default class WeekView extends Component {
  constructor(props) {
    super(props);
    this.eventsGrid = null;
    this.verticalAgenda = null;
    this.header = null;
    this.currentPageIndex = PAGES_OFFSET;
    this.eventsGridScrollX = new Animated.Value(0);

    const initialDates = calculatePagesDates(
      props.selectedDate,
      props.numberOfDays,
      props.pageStartAt,
      props.prependMostRecent,
    );
    const { width: windowWidth, height: windowHeight } = Dimensions.get(
      'window',
    );
    this.state = {
      // currentMoment should always be the first date of the current page
      currentMoment: moment(initialDates[this.currentPageIndex]).toDate(),
      initialDates,
      windowWidth,
      windowHeight,
    };

    setLocale(props.locale);

    this.dimensions = {};
  }

  componentDidMount() {
    requestAnimationFrame(() => {
      this.scrollToVerticalStart();
    });
    this.eventsGridScrollX.addListener((position) => {
      this.header.scrollToOffset({ offset: position.value, animated: false });
    });

    this.windowListener = Dimensions.addEventListener(
      'change',
      ({ window }) => {
        const { width: windowWidth, height: windowHeight } = window;
        this.setState({ windowWidth, windowHeight });
      },
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
      const initialDates = calculatePagesDates(
        // eslint-disable-next-line react/no-access-state-in-setstate
        this.state.currentMoment,
        this.props.numberOfDays,
        this.props.pageStartAt,
        this.props.prependMostRecent,
      );

      this.currentPageIndex = PAGES_OFFSET;
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState(
        {
          currentMoment: moment(initialDates[this.currentPageIndex]).toDate(),
          initialDates,
        },
        () => {
          this.eventsGrid.scrollToIndex({
            index: PAGES_OFFSET,
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
      const { beginAgendaAt } = this.props;
      const top = minutesInDayToTop(
        minutes,
        this.dimensions.verticalResolution,
        beginAgendaAt,
      );
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

    const { onTimeScrolled, beginAgendaAt } = this.props;

    if (!onTimeScrolled) {
      return;
    }

    const {
      nativeEvent: { contentOffset },
    } = scrollEvent;
    const { y: yPosition } = contentOffset;

    const secondsInDay = topToSecondsInDay(
      yPosition,
      this.dimensions.verticalResolution,
      beginAgendaAt,
    );

    const date = moment(this.state.currentMoment)
      .startOf('day')
      .seconds(secondsInDay)
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
    return appending ? newPages : newPages.reverse();
  };

  goToDate = (targetDate, options) => {
    const targetDateMoment = moment(targetDate);
    if (!targetDateMoment || !targetDateMoment.isValid()) {
      return;
    }
    const { initialDates } = this.state;
    const { numberOfDays, allowScrollByOneDay } = this.props;

    // Compute target index
    const startOfPage = moment(initialDates[this.currentPageIndex]).startOf(
      'day',
    );
    const deltaDay = targetDateMoment.startOf('day').diff(startOfPage, 'day');
    const deltaIndex = Math.floor(deltaDay / numberOfDays);
    const newDayOffset = mod(deltaDay, numberOfDays);
    const targetPageIndex =
      this.currentPageIndex + deltaIndex * this.getSignToTheFuture();

    if (!allowScrollByOneDay) {
      this.goToPageIndex(targetPageIndex, null, options);
      return;
    }

    // Adjust offset
    const rawShiftOffset = getRawDayOffset(newDayOffset, options);
    const overflowPages = Math.floor(rawShiftOffset / numberOfDays);
    const targetDayOffset = mod(rawShiftOffset, numberOfDays);

    this.goToPageIndex(
      targetPageIndex + overflowPages,
      targetDayOffset,
      options,
    );
  };

  goToNextPage = (options) =>
    this.goToPageIndex(
      this.currentPageIndex + this.getSignToTheFuture(),
      null,
      options,
    );

  goToPrevPage = (options) =>
    this.goToPageIndex(
      this.currentPageIndex - this.getSignToTheFuture(),
      null,
      options,
    );

  goToNextDay = (options) =>
    this.goToDate(moment(this.state.currentMoment).add(1, 'day'), options);

  goToPrevDay = (options) =>
    this.goToDate(moment(this.state.currentMoment).add(-1, 'day'), options);

  /**
   * Computes the targetIndex and newState for a goToPage operation.
   *
   * Helper for goToPageIndex() method.
   * Notice a new targetIndex is returned, while the dayOffset is handled outside of this method.
   *
   * @param {Number} targetPageIndex index between (-infinity, infinity) indicating target page.
   * @param {Number} targetDayOffset day offset inside a page.
   * @returns [reindexedTargetIndex, newState]
   */
  computeParamsToGoToIndex = (targetPageIndex, targetDayOffset) => {
    /** helper for readability */
    const date2State = (dateStr) =>
      moment(dateStr).add(targetDayOffset, 'day').toDate();

    const { initialDates: oldPages } = this.state;
    const firstViewablePage = PAGES_OFFSET;
    const lastViewablePage = oldPages.length - PAGES_OFFSET;

    if (targetPageIndex < firstViewablePage) {
      const firstPageDate = oldPages[0];
      const prependNeeded = firstViewablePage - targetPageIndex;

      const newPages = [
        ...this.buildPages(firstPageDate, prependNeeded, false),
        ...oldPages,
      ];
      const reIndexedTargetPage = PAGES_OFFSET;

      return [
        reIndexedTargetPage,
        {
          initialDates: newPages,
          currentMoment: date2State(newPages[reIndexedTargetPage]),
        },
      ];
    }
    if (targetPageIndex > lastViewablePage) {
      const lastPageDate = oldPages[oldPages.length - 1];
      const appendNeeded = targetPageIndex - lastViewablePage;

      const newPages = [
        ...oldPages,
        ...this.buildPages(lastPageDate, appendNeeded, true),
      ];

      const reIndexedTargetPage = newPages.length - PAGES_OFFSET;

      return [
        reIndexedTargetPage,
        {
          initialDates: newPages,
          currentMoment: date2State(newPages[reIndexedTargetPage]),
        },
      ];
    }
    return [
      targetPageIndex,
      {
        currentMoment: date2State(oldPages[targetPageIndex]),
      },
    ];
  };

  /**
   * Computes the left-offset displayed in the current date.
   *
   * Helper method used in goToPageIndex()
   * */
  getCurrentDayOffset = () => {
    const { initialDates, currentMoment } = this.state;

    return moment(currentMoment).diff(
      initialDates[this.currentPageIndex],
      'day',
    );
  };

  /**
   * Navigates the view to a pageIndex and (optional) dayOffset.
   *
   * Adds more pages (if necessary), scrolls the List to the new index,
   * and updates this.currentPageIndex.
   *
   * @param {Number} targetPageIndex between (-infinity, infinity) indicating target page.
   * @param {Number} targetDayOffset day offset inside a page.
   *     Only used if allowScrollByOneDay is true.
   */
  goToPageIndex = (targetPageIndex, targetDayOffset, options = {}) => {
    const { allowScrollByOneDay } = this.props;
    if (targetPageIndex === this.currentPageIndex && !allowScrollByOneDay) {
      // If allowScrollByOneDay is false, cannot scroll through offsets
      return;
    }

    const dayOffset =
      !allowScrollByOneDay || targetDayOffset == null
        ? this.getCurrentDayOffset()
        : targetDayOffset;

    const viewOffset =
      targetDayOffset == null
        ? undefined
        : -this.dimensions.dayWidth * dayOffset;

    const [moveToIndex, newState] = this.computeParamsToGoToIndex(
      targetPageIndex,
      targetDayOffset || 0,
    );

    const { animated = true } = options || {};

    this.setState(newState, () =>
      // setTimeout is used to force calling scroll after UI is updated
      setTimeout(() => {
        this.eventsGrid.scrollToIndex({
          index: moveToIndex,
          viewOffset,
          animated,
        });
        this.currentPageIndex = moveToIndex;
      }, 0),
    );
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
    const { pageWidth, dayWidth } = this.dimensions;
    const { initialDates, currentMoment: oldMoment } = this.state;

    const newPageIndex = Math.round(position / pageWidth);
    const dayOffset = Math.round((position % pageWidth) / dayWidth);
    const movedPages = newPageIndex - this.currentPageIndex;
    this.currentPageIndex = newPageIndex;

    const newMoment = moment(initialDates[newPageIndex])
      .add(dayOffset, 'd')
      .toDate();

    const movedDays = moment(newMoment).diff(oldMoment, 'd');

    if (movedDays === 0) {
      return;
    }

    InteractionManager.runAfterInteractions(() => {
      const newState = {
        currentMoment: newMoment,
      };
      let newStateCallback = () => {};

      const buffer = PAGES_OFFSET;
      const pagesToStartOfList = newPageIndex;
      const pagesToEndOfList = initialDates.length - newPageIndex - 1;

      if (movedPages < 0 && pagesToStartOfList < buffer) {
        const prependNeeded = buffer - pagesToStartOfList;

        newState.initialDates = [
          ...this.buildPages(initialDates[0], prependNeeded, false),
          ...initialDates,
        ];

        // After prepending, it needs to scroll to fix its position,
        // to mantain visible content position (mvcp)
        this.currentPageIndex += prependNeeded;
        const scrollToCurrentIndexAndOffset = () =>
          this.eventsGrid.scrollToIndex({
            index: this.currentPageIndex,
            viewOffset: -dayOffset * dayWidth,
            animated: false,
          });
        newStateCallback = () => setTimeout(scrollToCurrentIndexAndOffset, 0);
      } else if (movedPages > 0 && pagesToEndOfList < buffer) {
        const appendNeeded = buffer - pagesToEndOfList;
        newState.initialDates = [
          ...initialDates,
          ...this.buildPages(
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
      const movedForward = movedDays > 0;
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
      timesColumnWidth,
      onEventPress,
      onEventLongPress,
      events,
      hoursInDisplay,
      timeStep,
      beginAgendaAt,
      endAgendaAt,
      formatTimeLabel,
      allowScrollByOneDay,
      onGridClick,
      onGridLongPress,
      onEditEvent,
      editEventConfig,
      editingEvent,
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
      windowSize,
      initialNumToRender,
      maxToRenderPerBatch,
      updateCellsBatchingPeriod,
    } = this.props;
    const {
      currentMoment,
      initialDates,
      windowWidth,
      windowHeight,
    } = this.state;
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

    const {
      pageWidth,
      dayWidth,
      timeLabelsWidth,
    } = computeHorizontalDimensions(
      windowWidth,
      numberOfDays,
      timesColumnWidth,
    );

    const {
      timeLabelHeight,
      resolution: verticalResolution,
    } = computeVerticalDimensions(windowHeight, hoursInDisplay, timeStep);

    this.dimensions = {
      dayWidth,
      pageWidth,
      verticalResolution,
    };

    const horizontalScrollProps = allowScrollByOneDay
      ? {
          decelerationRate: 'fast',
          snapToInterval: dayWidth,
        }
      : {
          pagingEnabled: true,
        };

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
            inverted={horizontalInverted}
            showsHorizontalScrollIndicator={false}
            scrollEnabled={false}
            ref={this.headerRef}
            data={initialDates}
            getItem={(data, index) => data[index]}
            getItemCount={(data) => data.length}
            getItemLayout={this.getListItemLayout}
            keyExtractor={(item) => item}
            initialScrollIndex={PAGES_OFFSET}
            extraData={dayWidth}
            windowSize={windowSize}
            initialNumToRender={initialNumToRender}
            maxToRenderPerBatch={maxToRenderPerBatch}
            updateCellsBatchingPeriod={updateCellsBatchingPeriod}
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
            style={[
              styles.loadingSpinner,
              { right: pageWidth / 2, top: windowHeight / 2 },
            ]}
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
              timeLabelHeight={timeLabelHeight}
              width={timeLabelsWidth}
            />
            <VirtualizedList
              data={initialDates}
              getItem={(data, index) => data[index]}
              getItemCount={(data) => data.length}
              getItemLayout={this.getListItemLayout}
              keyExtractor={(item) => item}
              initialScrollIndex={PAGES_OFFSET}
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
                    beginAgendaAt={beginAgendaAt}
                    timeLabelHeight={timeLabelHeight}
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
                    verticalResolution={verticalResolution}
                    onEditEvent={onEditEvent}
                    editingEventId={editingEvent}
                    editEventConfig={editEventConfig}
                  />
                );
              }}
              horizontal
              // eslint-disable-next-line react/jsx-props-no-spreading
              {...horizontalScrollProps}
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
              windowSize={windowSize}
              initialNumToRender={initialNumToRender}
              maxToRenderPerBatch={maxToRenderPerBatch}
              updateCellsBatchingPeriod={updateCellsBatchingPeriod}
              accessible
              accessibilityLabel="Grid with horizontal scroll"
              accessibilityHint="Grid with horizontal scroll"
            />
          </View>
        </ScrollView>
      </GestureHandlerRootView>
    );
  }
}

const PageStartAtOptionsPropType = PropTypes.shape({
  left: PropTypes.number,
  weekday: PropTypes.number,
});

WeekView.propTypes = {
  events: PropTypes.arrayOf(eventPropType),
  formatDateHeader: PropTypes.string,
  numberOfDays: PropTypes.oneOf(availableNumberOfDays).isRequired,
  timesColumnWidth: PropTypes.number,
  pageStartAt: PageStartAtOptionsPropType,
  onSwipeNext: PropTypes.func,
  onSwipePrev: PropTypes.func,
  onTimeScrolled: PropTypes.func,
  onEventPress: PropTypes.func,
  onEventLongPress: PropTypes.func,
  onGridClick: PropTypes.func,
  onGridLongPress: PropTypes.func,
  editingEvent: PropTypes.number,
  onEditEvent: PropTypes.func,
  editEventConfig: EditEventConfigPropType,
  headerStyle: PropTypes.object,
  headerTextStyle: PropTypes.object,
  hourTextStyle: PropTypes.object,
  eventContainerStyle: PropTypes.object,
  gridRowStyle: GridRowPropType,
  gridColumnStyle: GridColumnPropType,
  selectedDate: PropTypes.instanceOf(Date).isRequired,
  locale: PropTypes.string,
  hoursInDisplay: PropTypes.number,
  allowScrollByOneDay: PropTypes.bool,
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
  windowSize: PropTypes.number,
  initialNumToRender: PropTypes.number,
  maxToRenderPerBatch: PropTypes.number,
  updateCellsBatchingPeriod: PropTypes.number,
};

WeekView.defaultProps = {
  events: [],
  locale: 'en',
  hoursInDisplay: 6,
  timeStep: 60,
  beginAgendaAt: 0,
  endAgendaAt: MINUTES_IN_DAY,
  allowScrollByOneDay: false,
  formatTimeLabel: 'H:mm',
  startHour: 8,
  showTitle: true,
  rightToLeft: false,
  prependMostRecent: false,
  RefreshComponent: ActivityIndicator,
  windowSize: DEFAULT_WINDOW_SIZE,
  initialNumToRender: DEFAULT_WINDOW_SIZE,
  maxToRenderPerBatch: PAGES_OFFSET,
  updateCellsBatchingPeriod: 50, // RN default
};
