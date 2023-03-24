import React from 'react';
import PropTypes from 'prop-types';
import Animated, {
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';

import AllDayEvent from './AllDayEvent';
import styles from './AllDayEvents.styles';
import {
  AllDayEventsWithMetaPropType,
  ReanimatedSharedValue,
} from '../utils/types';

// NOTE: event height is hard-coded!
export const ALL_DAY_EVENT_HEIGHT = 20;

const AllDayEvents = ({
  allDayEvents,
  days,
  dayWidth,
  style,
  visibleHeight,
  eventContainerStyle,
  EventComponent,
  onEventPress,
  onEventLongPress,
}) => {
  const animatedHeight = useAnimatedStyle(() => ({
    height: withTiming(visibleHeight.value, { duration: 100 }),
  }));
  return (
    <Animated.View style={[styles.container, style, animatedHeight]}>
      {days.map((day, dayIndex) => {
        const events = allDayEvents[day] || [];
        return events.map(({ ref: event, overlap }) => {
          const { lane, width: nDays } = overlap;
          return (
            <AllDayEvent
              key={event.id}
              event={event}
              onPress={onEventPress}
              onLongPress={onEventLongPress}
              left={dayWidth * dayIndex}
              width={dayWidth * nDays}
              top={lane * ALL_DAY_EVENT_HEIGHT}
              containerStyle={eventContainerStyle}
              EventComponent={EventComponent}
            />
          );
        });
      })}
    </Animated.View>
  );
};

AllDayEvents.propTypes = {
  allDayEvents: PropTypes.objectOf(
    PropTypes.arrayOf(AllDayEventsWithMetaPropType),
  ).isRequired,
  days: PropTypes.arrayOf(PropTypes.string),
  dayWidth: PropTypes.number.isRequired,
  style: PropTypes.object,
  eventContainerStyle: PropTypes.object,
  EventComponent: PropTypes.elementType,
  visibleHeight: ReanimatedSharedValue,
  onEventPress: PropTypes.func,
  onEventLongPress: PropTypes.func,
};

export default AllDayEvents;
