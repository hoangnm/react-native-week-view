import React from 'react';
import PropTypes from 'prop-types';
import { View, Text } from 'react-native';
import styles from './Times.styles';
import { getTimeLabelHeight } from '../utils';

const Times = ({ times, hoursInDisplay, timeStep, textStyle, width }) => {
  const height = getTimeLabelHeight(hoursInDisplay, timeStep);
  return (
    <View style={[styles.columnContainer, { width }]}>
      {times.map((time) => (
        <View key={time} style={[styles.label, { height }]}>
          <Text style={[styles.text, textStyle]}>{time}</Text>
        </View>
      ))}
    </View>
  );
};

Times.propTypes = {
  times: PropTypes.arrayOf(PropTypes.string).isRequired,
  hoursInDisplay: PropTypes.number.isRequired,
  timeStep: PropTypes.number.isRequired,
  textStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  width: PropTypes.number.isRequired,
};

export default React.memo(Times);
