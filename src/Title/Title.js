import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';

import { getCurrentMonth } from '../utils/dates';
import styles from './Title.styles';

const Title = ({
  style,
  showTitle,
  currentDate,
  textStyle,
  onMonthPress,
  width,
}) => {
  const formattedMonth = getCurrentMonth(currentDate);
  return (
    <TouchableOpacity
      style={[styles.title, { width }, style]}
      onPress={() => onMonthPress && onMonthPress(currentDate, formattedMonth)}
      disabled={!showTitle || !onMonthPress}
    >
      {showTitle && (
        <Text style={[styles.text, textStyle]}>{formattedMonth}</Text>
      )}
    </TouchableOpacity>
  );
};

Title.propTypes = {
  showTitle: PropTypes.bool,
  currentDate: PropTypes.instanceOf(Date).isRequired,
  style: PropTypes.object,
  textStyle: PropTypes.object,
  onMonthPress: PropTypes.func,
  width: PropTypes.number.isRequired,
};

export default React.memo(Title);
