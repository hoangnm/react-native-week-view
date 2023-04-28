import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  View,
  ScrollView,
  InteractionManager,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import moment from 'moment';
import memoizeOne from 'memoize-one';

import Events from '../Events/Events';
import Header from '../Header/Header';
import Title from '../Title/Title';
import Times from '../Times/Times';
import styles from './WeekView.styles';
import bucketEventsByDate from '../pipeline/box';
import {
  HorizontalSyncFlatList,
  HeaderRefContextProvider,
} from '../utils/HorizontalScroll';
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
import {
  GridRowPropType,
  GridColumnPropType,
  EditEventConfigPropType,
  EventPropType,
  PageStartAtOptionsPropType,
  DragEventConfigPropType,
} from '../utils/types';
import {
  PAGES_OFFSET,
  calculatePagesDates,
  getRawDayOffset,
  DEFAULT_WINDOW_SIZE,
} from '../utils/pages';
import { RunGesturesOnJSContext } from '../utils/gestures';

/** For some reason, this sign is necessary in all cases. */
const VIEW_OFFSET_SIGN = -1;

const identity = (item) => item;
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
    this.eventsGrid = React.createRef();
    this.verticalAgenda = React.createRef();
    this.currentPageIndex = PAGES_OFFSET;

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
          this.eventsGrid.current.scrollToIndex({
            index: PAGES_OFFSET,
            animated: false,
          });
        },
      );
    }
    if (this.state.windowWidth !== prevState.windowWidth) {
      // NOTE: after a width change, the position may be off by a few days
      this.eventsGrid.current.scrollToIndex({
        index: this.currentPageIndex,
        animated: false,
      });
    }
  }

  componentWillUnmount() {
    if (this.windowListener) {
      this.windowListener.remove();
    }
  }

  calculateTimes = memoizeOne(calculateTimesArray);

  scrollToVerticalStart = () => {
    this.scrollToTime(this.props.startHour * 60, { animated: false });
  };

  scrollToTime = (minutes, options = {}) => {
    if (this.verticalAgenda.current) {
      const { animated = false } = options || {};
      const { beginAgendaAt } = this.props;
      const top = minutesInDayToTop(
        minutes,
        this.dimensions.verticalResolution,
        beginAgendaAt,
      );
      this.verticalAgenda.current.scrollTo({
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
    const { numberOfDays, allowScrollByDay } = this.props;

    // Compute target index
    const startOfPage = moment(initialDates[this.currentPageIndex]).startOf(
      'day',
    );
    const deltaDay = targetDateMoment.startOf('day').diff(startOfPage, 'day');
    const deltaIndex = Math.floor(deltaDay / numberOfDays);
    const newDayOffset = mod(deltaDay, numberOfDays);
    const targetPageIndex =
      this.currentPageIndex + deltaIndex * this.getSignToTheFuture();

    if (!allowScrollByDay) {
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
   *     Only used if allowScrollByDay is true.
   */
  goToPageIndex = (targetPageIndex, targetDayOffset, options = {}) => {
    const { allowScrollByDay } = this.props;
    if (targetPageIndex === this.currentPageIndex && !allowScrollByDay) {
      // If allowScrollByDay is false, cannot scroll through offsets
      return;
    }

    const dayOffset =
      !allowScrollByDay || targetDayOffset == null
        ? this.getCurrentDayOffset()
        : targetDayOffset;

    const viewOffset =
      targetDayOffset == null
        ? undefined
        : VIEW_OFFSET_SIGN * this.dimensions.dayWidth * dayOffset;

    const [moveToIndex, newState] = this.computeParamsToGoToIndex(
      targetPageIndex,
      targetDayOffset || 0,
    );

    const { animated = true } = options || {};

    this.setState(newState, () =>
      // setTimeout is used to force calling scroll after UI is updated
      setTimeout(() => {
        this.eventsGrid.current.scrollToIndex({
          index: moveToIndex,
          viewOffset,
          animated,
        });
        this.currentPageIndex = moveToIndex;
      }, 0),
    );
  };

  horizontalScrollEnded = (newXPosition) => {
    const { pageWidth, dayWidth } = this.dimensions;
    const { initialDates, currentMoment: oldMoment } = this.state;

    const newPageIndex = Math.floor(newXPosition / pageWidth);
    const dayOffset = Math.round((newXPosition % pageWidth) / dayWidth);
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
          this.eventsGrid.current.scrollToIndex({
            index: this.currentPageIndex,
            viewOffset: VIEW_OFFSET_SIGN * dayOffset * dayWidth,
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
      const callback = movedDays > 0 ? onSwipeToTheFuture : onSwipeToThePast;
      if (callback) {
        callback(newMoment);
      }
    });
  };

  bucketEventsByDate = memoizeOne(bucketEventsByDate);

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
      hourContainerStyle,
      gridRowStyle,
      gridColumnStyle,
      eventContainerStyle,
      eventTextStyle,
      allDayEventContainerStyle,
      AllDayEventComponent,
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
      allowScrollByDay,
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
      dragEventConfig,
      onDragEvent,
      onMonthPress,
      onDayPress,
      isRefreshing,
      RefreshComponent,
      windowSize,
      initialNumToRender,
      maxToRenderPerBatch,
      updateCellsBatchingPeriod,
      removeClippedSubviews,
      disableVirtualization,
      runOnJS,
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
    const {
      regularEvents: eventsByDate,
      allDayEvents,
      computeMaxVisibleLanesInHeader,
    } = this.bucketEventsByDate(events);
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

    const horizontalScrollProps = allowScrollByDay
      ? {
          decelerationRate: 'fast',
          snapToInterval: dayWidth,
        }
      : {
          pagingEnabled: true,
        };

    return (
      <GestureHandlerRootView style={styles.container}>
        <HeaderRefContextProvider>
          <View style={styles.headerAndTitleContainer}>
            <Title
              showTitle={showTitle}
              style={headerStyle}
              textStyle={headerTextStyle}
              currentDate={currentMoment}
              onMonthPress={onMonthPress}
              width={timeLabelsWidth}
            />
            <Header
              numberOfDays={numberOfDays}
              currentDate={currentMoment}
              allDayEvents={allDayEvents}
              initialDates={initialDates}
              formatDate={formatDateHeader}
              style={headerStyle}
              textStyle={headerTextStyle}
              eventContainerStyle={allDayEventContainerStyle}
              EventComponent={AllDayEventComponent}
              TodayComponent={TodayHeaderComponent}
              DayComponent={DayHeaderComponent}
              rightToLeft={rightToLeft}
              computeMaxVisibleLanes={computeMaxVisibleLanesInHeader}
              onDayPress={onDayPress}
              onEventPress={onEventPress}
              onEventLongPress={onEventLongPress}
              dayWidth={dayWidth}
              horizontalInverted={horizontalInverted}
              getListItemLayout={this.getListItemLayout}
              windowSize={windowSize}
              initialNumToRender={initialNumToRender}
              maxToRenderPerBatch={maxToRenderPerBatch}
              updateCellsBatchingPeriod={updateCellsBatchingPeriod}
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
            contentContainerStyle={styles.scrollViewContentContainer}
            style={styles.scrollView}
            onMomentumScrollBegin={this.verticalScrollBegun}
            onMomentumScrollEnd={this.verticalScrollEnded}
            ref={this.verticalAgenda}
          >
            <View style={styles.scrollViewChild}>
              <Times
                times={times}
                containerStyle={hourContainerStyle}
                textStyle={hourTextStyle}
                timeLabelHeight={timeLabelHeight}
                width={timeLabelsWidth}
              />
              <RunGesturesOnJSContext.Provider value={runOnJS}>
                <HorizontalSyncFlatList
                  data={initialDates}
                  getItemLayout={this.getListItemLayout}
                  keyExtractor={identity}
                  initialScrollIndex={PAGES_OFFSET}
                  scrollEnabled={!fixedHorizontally}
                  horizontal
                  // eslint-disable-next-line react/jsx-props-no-spreading
                  {...horizontalScrollProps}
                  horizontalScrollEnded={this.horizontalScrollEnded}
                  inverted={horizontalInverted}
                  ref={this.eventsGrid}
                  windowSize={windowSize}
                  initialNumToRender={initialNumToRender}
                  maxToRenderPerBatch={maxToRenderPerBatch}
                  updateCellsBatchingPeriod={updateCellsBatchingPeriod}
                  removeClippedSubviews={removeClippedSubviews}
                  disableVirtualization={disableVirtualization}
                  accessible
                  accessibilityLabel="Grid with horizontal scroll"
                  accessibilityHint="Grid with horizontal scroll"
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
                        eventTextStyle={eventTextStyle}
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
                        dragEventConfig={dragEventConfig}
                      />
                    );
                  }}
                />
              </RunGesturesOnJSContext.Provider>
            </View>
          </ScrollView>
        </HeaderRefContextProvider>
      </GestureHandlerRootView>
    );
  }
}

WeekView.propTypes = {
  events: PropTypes.arrayOf(EventPropType),
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
  dragEventConfig: DragEventConfigPropType,
  headerStyle: PropTypes.object,
  headerTextStyle: PropTypes.object,
  hourTextStyle: PropTypes.object,
  hourContainerStyle: PropTypes.object,
  eventContainerStyle: PropTypes.object,
  eventTextStyle: PropTypes.object,
  allDayEventContainerStyle: PropTypes.object,
  gridRowStyle: GridRowPropType,
  gridColumnStyle: GridColumnPropType,
  selectedDate: PropTypes.instanceOf(Date).isRequired,
  locale: PropTypes.string,
  hoursInDisplay: PropTypes.number,
  allowScrollByDay: PropTypes.bool,
  timeStep: PropTypes.number,
  beginAgendaAt: PropTypes.number,
  endAgendaAt: PropTypes.number,
  formatTimeLabel: PropTypes.string,
  startHour: PropTypes.number,
  AllDayEventComponent: PropTypes.elementType,
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
  removeClippedSubviews: PropTypes.bool,
  disableVirtualization: PropTypes.bool,
  runOnJS: PropTypes.bool,
};

WeekView.defaultProps = {
  events: [],
  locale: 'en',
  hoursInDisplay: 6,
  timeStep: 60,
  beginAgendaAt: 0,
  endAgendaAt: MINUTES_IN_DAY,
  allowScrollByDay: false,
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
  removeClippedSubviews: true,
  disableVirtualization: false,
  runOnJS: false,
};
