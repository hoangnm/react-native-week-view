import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  View,
  ScrollView,
  Animated,
  VirtualizedList,
  InteractionManager,
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
  CONTAINER_WIDTH,
  bucketEventsByDate,
  getTimesArray,
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
      props.prependMostRecent,
      props.fixedHorizontally,
    );
    this.state = {
      // currentMoment should always be the first date of the current page
      currentMoment: moment(initialDates[this.currentPageIndex]).toDate(),
      initialDates,
    };

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

  componentDidUpdate(prevprops) {
    if (this.props.locale !== prevprops.locale) {
      setLocale(this.props.locale);
    }
  }

  componentWillUnmount() {
    this.eventsGridScrollX.removeAllListeners();
  }

  calculateTimes = memoizeOne(getTimesArray);

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

    const currentDate = initialDates[this.currentPageIndex];
    const deltaDay = moment(targetDate).diff(currentDate, 'day');
    const deltaIndex = Math.floor(deltaDay / numberOfDays);
    const signToTheFuture = this.getSignToTheFuture();
    let targetIndex = this.currentPageIndex + deltaIndex * signToTheFuture;

    if (targetIndex === this.currentPageIndex) {
      return;
    }

    const scrollTo = (moveToIndex) => {
      this.eventsGrid.scrollToIndex({
        index: moveToIndex,
        animated,
      });
      this.currentPageIndex = moveToIndex;
    };

    const newState = {};
    let newStateCallback = () => {};

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

    newState.currentMoment = moment(initialDates[targetIndex]).toDate();
    this.setState(newState, newStateCallback);
  };

  scrollEnded = (event) => {
    const {
      nativeEvent: { contentOffset, contentSize },
    } = event;
    const { x: position } = contentOffset;
    const { width: innerWidth } = contentSize;
    const { onSwipePrev, onSwipeNext } = this.props;
    const { initialDates } = this.state;

    const newPage = Math.round((position / innerWidth) * initialDates.length);
    const movedPages = newPage - this.currentPageIndex;
    this.currentPageIndex = newPage;

    if (movedPages === 0) {
      return;
    }

    InteractionManager.runAfterInteractions(() => {
      const newMoment = moment(initialDates[this.currentPageIndex]).toDate();
      const newState = {
        currentMoment: newMoment,
      };
      let newStateCallback = () => {};

      if (movedPages < 0 && newPage < this.pageOffset) {
        this.prependPagesInPlace(initialDates, 1);
        this.currentPageIndex += 1;

        newState.initialDates = [...initialDates];
        const scrollToCurrentIndex = () =>
          this.eventsGrid.scrollToIndex({
            index: this.currentPageIndex,
            animated: false,
          });
        newStateCallback = () => setTimeout(scrollToCurrentIndex, 0);
      } else if (
        movedPages > 0 &&
        newPage >= this.state.initialDates.length - this.pageOffset
      ) {
        this.appendPagesInPlace(initialDates, 1);

        newState.initialDates = [...initialDates];
      }

      this.setState(newState, newStateCallback);

      if (movedPages < 0) {
        onSwipePrev && onSwipePrev(newMoment);
      } else {
        onSwipeNext && onSwipeNext(newMoment);
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

  calculatePagesDates = (currentMoment, numberOfDays, prependMostRecent, fixedHorizontally) => {
    const initialDates = [];
    const centralDate = moment(currentMoment);
    if (numberOfDays === 7 || fixedHorizontally) {
      // Start week on monday
      centralDate.startOf('isoWeek');
    }
    for (let i = -this.pageOffset; i <= this.pageOffset; i += 1) {
      const initialDate = moment(centralDate).add(numberOfDays * i, 'd');
      initialDates.push(initialDate.format(DATE_STR_FORMAT));
    }
    return prependMostRecent ? initialDates.reverse() : initialDates;
  };

  sortEventsByDate = memoizeOne(bucketEventsByDate);

  getListItemLayout = (index) => ({
    length: CONTAINER_WIDTH,
    offset: CONTAINER_WIDTH * index,
    index,
  });

  render() {
    const {
      showTitle,
      numberOfDays,
      headerStyle,
      headerTextStyle,
      hourTextStyle,
      eventContainerStyle,
      formatDateHeader,
      onEventPress,
      events,
      hoursInDisplay,
      onGridClick,
      EventComponent,
      rightToLeft,
      fixedHorizontally,
      prependMostRecent,
    } = this.props;
    const { currentMoment, initialDates } = this.state;
    const times = this.calculateTimes(hoursInDisplay);
    const eventsByDate = this.sortEventsByDate(events);
    const horizontalInverted =
      (prependMostRecent && !rightToLeft) ||
      (!prependMostRecent && rightToLeft);

    return (
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Title
            showTitle={showTitle}
            style={headerStyle}
            textStyle={headerTextStyle}
            numberOfDays={numberOfDays}
            selectedDate={currentMoment}
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
            getItemLayout={(_, index) => this.getListItemLayout(index)}
            keyExtractor={(item) => item}
            initialScrollIndex={this.pageOffset}
            renderItem={({ item }) => {
              return (
                <View key={item} style={styles.header}>
                  <Header
                    style={headerStyle}
                    textStyle={headerTextStyle}
                    formatDate={formatDateHeader}
                    initialDate={item}
                    numberOfDays={numberOfDays}
                    rightToLeft={rightToLeft}
                  />
                </View>
              );
            }}
          />
        </View>
        <ScrollView ref={this.verticalAgendaRef}>
          <View style={styles.scrollViewContent}>
            <Times times={times} textStyle={hourTextStyle} />
            <VirtualizedList
              data={initialDates}
              getItem={(data, index) => data[index]}
              getItemCount={(data) => data.length}
              getItemLayout={(_, index) => this.getListItemLayout(index)}
              keyExtractor={(item) => item}
              initialScrollIndex={this.pageOffset}
              scrollEnabled={!fixedHorizontally}
              renderItem={({ item }) => {
                return (
                  <Events
                    times={times}
                    eventsByDate={eventsByDate}
                    initialDate={item}
                    numberOfDays={numberOfDays}
                    onEventPress={onEventPress}
                    onGridClick={onGridClick}
                    hoursInDisplay={hoursInDisplay}
                    EventComponent={EventComponent}
                    eventContainerStyle={eventContainerStyle}
                    rightToLeft={rightToLeft}
                  />
                );
              }}
              horizontal
              pagingEnabled
              inverted={horizontalInverted}
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
  onSwipeNext: PropTypes.func,
  onSwipePrev: PropTypes.func,
  onEventPress: PropTypes.func,
  onGridClick: PropTypes.func,
  headerStyle: PropTypes.object,
  headerTextStyle: PropTypes.object,
  hourTextStyle: PropTypes.object,
  eventContainerStyle: PropTypes.object,
  selectedDate: PropTypes.instanceOf(Date).isRequired,
  locale: PropTypes.string,
  hoursInDisplay: PropTypes.number,
  startHour: PropTypes.number,
  EventComponent: PropTypes.elementType,
  showTitle: PropTypes.bool,
  rightToLeft: PropTypes.bool,
  fixedHorizontally: PropTypes.bool,
  prependMostRecent: PropTypes.bool,
};

WeekView.defaultProps = {
  events: [],
  locale: 'en',
  hoursInDisplay: 6,
  startHour: 0,
  showTitle: true,
  rightToLeft: false,
  prependMostRecent: false,
};
