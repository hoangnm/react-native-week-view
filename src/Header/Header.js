import React from 'react';
import PropTypes from 'prop-types';
import { View, FlatList } from 'react-native';
import { useDerivedValue } from 'react-native-reanimated';

import AllDayEvents, { ALL_DAY_EVENT_HEIGHT } from './AllDayEvents';
import { calculateDaysArray, availableNumberOfDays } from '../utils/dates';
import styles from './Header.styles';
import HeaderDay from './HeaderDay';
import { useHeaderRefContext } from '../utils/HorizontalScroll';
import { PAGES_OFFSET } from '../utils/pages';
import { AllDayEventsWithMetaPropType } from '../utils/types';

const identity = (item) => item;

const HeaderPage = ({
  initialDate,
  numberOfDays,
  rightToLeft,
  style,
  textStyle,
  formatDate,
  DayComponent,
  TodayComponent,
  onDayPress,
  dayWidth,
  allDayEvents,
  visibleHeight,
  eventContainerStyle,
  EventComponent,
  onEventPress,
  onEventLongPress,
}) => {
  const days = calculateDaysArray(initialDate, numberOfDays, rightToLeft) || [];
  return (
    <View style={styles.container}>
      <View style={styles.daysContainer}>
        {days.map((day) => (
          <HeaderDay
            style={style}
            textStyle={textStyle}
            key={day}
            day={day}
            format={formatDate}
            DayComponent={DayComponent}
            TodayComponent={TodayComponent}
            onDayPress={onDayPress}
            width={dayWidth}
          />
        ))}
      </View>
      <AllDayEvents
        style={style}
        allDayEvents={allDayEvents}
        days={days}
        dayWidth={dayWidth}
        visibleHeight={visibleHeight}
        eventContainerStyle={eventContainerStyle}
        EventComponent={EventComponent}
        onEventPress={onEventPress}
        onEventLongPress={onEventLongPress}
      />
    </View>
  );
};

const WeekViewHeader = ({
  numberOfDays,
  currentDate,
  allDayEvents,
  initialDates,
  formatDate,
  style,
  textStyle,
  eventContainerStyle,
  EventComponent,
  TodayComponent,
  DayComponent,
  rightToLeft,
  onDayPress,
  dayWidth,
  computeMaxVisibleLanes,
  onEventPress,
  onEventLongPress,
  horizontalInverted,
  getListItemLayout,
  windowSize,
  initialNumToRender,
  maxToRenderPerBatch,
  updateCellsBatchingPeriod,
}) => {
  const headerRef = useHeaderRefContext();

  const visibleDays = calculateDaysArray(
    currentDate,
    numberOfDays,
    rightToLeft,
  );
  const currentVisibleHeight =
    computeMaxVisibleLanes(visibleDays) * ALL_DAY_EVENT_HEIGHT;

  const visibleHeight = useDerivedValue(() => currentVisibleHeight || 0);

  const renderHeaderPage = ({ item: initialDate }) => (
    <HeaderPage
      initialDate={initialDate}
      numberOfDays={numberOfDays}
      rightToLeft={rightToLeft}
      style={style}
      textStyle={textStyle}
      formatDate={formatDate}
      DayComponent={DayComponent}
      TodayComponent={TodayComponent}
      onDayPress={onDayPress}
      dayWidth={dayWidth}
      allDayEvents={allDayEvents}
      visibleHeight={visibleHeight}
      eventContainerStyle={eventContainerStyle}
      EventComponent={EventComponent}
      onEventPress={onEventPress}
      onEventLongPress={onEventLongPress}
    />
  );

  return (
    <FlatList
      horizontal
      pagingEnabled
      inverted={horizontalInverted}
      showsHorizontalScrollIndicator={false}
      scrollEnabled={false}
      ref={headerRef}
      data={initialDates}
      renderItem={renderHeaderPage}
      getItemLayout={getListItemLayout}
      keyExtractor={identity}
      initialScrollIndex={PAGES_OFFSET}
      windowSize={windowSize}
      initialNumToRender={initialNumToRender}
      maxToRenderPerBatch={maxToRenderPerBatch}
      updateCellsBatchingPeriod={updateCellsBatchingPeriod}
    />
  );
};

WeekViewHeader.propTypes = {
  numberOfDays: PropTypes.oneOf(availableNumberOfDays).isRequired,
  initialDates: PropTypes.arrayOf(PropTypes.string).isRequired,
  currentDate: PropTypes.instanceOf(Date).isRequired,
  allDayEvents: PropTypes.objectOf(
    PropTypes.arrayOf(AllDayEventsWithMetaPropType),
  ).isRequired,
  computeMaxVisibleLanes: PropTypes.func.isRequired,
  formatDate: PropTypes.string,
  style: PropTypes.object,
  textStyle: PropTypes.object,
  eventContainerStyle: PropTypes.object,
  EventComponent: PropTypes.elementType,
  DayComponent: PropTypes.elementType,
  TodayComponent: PropTypes.elementType,
  onDayPress: PropTypes.func,
  onEventPress: PropTypes.func,
  onEventLongPress: PropTypes.func,
  rightToLeft: PropTypes.bool,
  dayWidth: PropTypes.number.isRequired,
  horizontalInverted: PropTypes.bool,
  getListItemLayout: PropTypes.func,
  windowSize: PropTypes.number,
  initialNumToRender: PropTypes.number,
  maxToRenderPerBatch: PropTypes.number,
  updateCellsBatchingPeriod: PropTypes.number,
};

WeekViewHeader.defaultProps = {
  formatDate: 'MMM D',
};

export default WeekViewHeader;
