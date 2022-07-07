import React, { useEffect } from 'react';
import { View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import PropTypes from 'prop-types';

import { minutesToY, CONTENT_OFFSET } from '../utils';
import styles from './NowLine.styles';

const UPDATE_EVERY_MILLISECONDS = 60 * 1000; // 1 minute

const getCurrentTop = (hoursInDisplay, beginAgendaAt) => {
  const now = new Date();
  const minutes = now.getHours() * 60 + now.getMinutes();
  return minutesToY(minutes, hoursInDisplay, beginAgendaAt) + CONTENT_OFFSET;
};

const NowLine = ({ hoursInDisplay, beginAgendaAt, color, width }) => {
  const currentTop = useSharedValue(
    getCurrentTop(hoursInDisplay, beginAgendaAt),
  );

  const animatedStyle = useAnimatedStyle(() => ({
    top: withTiming(currentTop.value),
  }));

  useEffect(() => {
    const intervalCallbackId = setInterval(() => {
      currentTop.value = getCurrentTop(hoursInDisplay, beginAgendaAt);
    }, UPDATE_EVERY_MILLISECONDS);

    return () => intervalCallbackId && clearInterval(intervalCallbackId);
  }, [currentTop, hoursInDisplay, beginAgendaAt]);

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
  hoursInDisplay: PropTypes.number.isRequired,
  beginAgendaAt: PropTypes.number,
  color: PropTypes.string,
};

NowLine.defaultProps = {
  color: '#e53935',
  beginAgendaAt: 0,
};

export default React.memo(NowLine);
