import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useDerivedValue,
  withTiming,
} from 'react-native-reanimated';
import PropTypes from 'prop-types';

import { minutesInDay } from '../utils/dates';
import { minutesInDayToTop } from '../utils/dimensions';
import styles from './NowLine.styles';

const UPDATE_EVERY_MILLISECONDS = 60 * 1000; // 1 minute

const useMinutesNow = (updateEvery = UPDATE_EVERY_MILLISECONDS) => {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const intervalCallbackId = setInterval(
      () => setNow(new Date()),
      updateEvery,
    );

    return () => intervalCallbackId && clearInterval(intervalCallbackId);
  }, [setNow, updateEvery]);

  return minutesInDay(now);
};

const NowLine = ({ verticalResolution, beginAgendaAt, color, width }) => {
  const minutesNow = useMinutesNow();

  const currentTop = useDerivedValue(() =>
    minutesInDayToTop(minutesNow, verticalResolution, beginAgendaAt),
  );

  const animatedStyle = useAnimatedStyle(() => ({
    top: withTiming(currentTop.value),
  }));

  return (
    <Animated.View
      style={[
        styles.container,
        {
          borderColor: color,
          width,
        },
        animatedStyle,
      ]}
    >
      <View
        style={[
          styles.circle,
          {
            backgroundColor: color,
          },
        ]}
      />
    </Animated.View>
  );
};

NowLine.propTypes = {
  width: PropTypes.number.isRequired,
  verticalResolution: PropTypes.number.isRequired,
  beginAgendaAt: PropTypes.number,
  color: PropTypes.string,
};

NowLine.defaultProps = {
  color: '#e53935',
  beginAgendaAt: 0,
};

export default React.memo(NowLine);
