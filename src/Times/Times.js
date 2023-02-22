import React from 'react';
import PropTypes from 'prop-types';
import { View, Text } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import styles from './Times.styles';

const Times = ({
  times,
  containerStyle,
  textStyle,
  width,
  timeLabelHeight,
}) => {
  const lineStyle = useAnimatedStyle(() => ({
    height: withTiming(timeLabelHeight),
  }));
  return (
    <View style={[styles.container, containerStyle, { width }]}>
      {times.map((time) => (
        <Animated.View key={time} style={[styles.label, lineStyle]}>
          <Text style={[styles.text, textStyle]}>{time}</Text>
        </Animated.View>
      ))}
    </View>
  );
};

Times.propTypes = {
  times: PropTypes.arrayOf(PropTypes.string).isRequired,
  textStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  width: PropTypes.number.isRequired,
  timeLabelHeight: PropTypes.number.isRequired,
};

export default React.memo(Times);
