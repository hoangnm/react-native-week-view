import React from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';

import { getCurrentMonth, availableNumberOfDays } from '../utils/dates';
import styles from './Title.styles';

const getFontSizeHeader = (numberOfDays) => {
  if (numberOfDays > 1) {
    return 12;
  }
  return 16;
};

const Title = ({
  style,
  showTitle,
  numberOfDays,
  selectedDate,
  textStyle,
  onMonthPress,
  width,
}) => {
  if (!showTitle) {
    return <View style={[styles.title, { width }, style]} />;
  }
  const formattedMonth = getCurrentMonth(selectedDate);
  return (
    <TouchableOpacity
      style={[styles.title, { width }, style]}
      onPress={() => onMonthPress && onMonthPress(selectedDate, formattedMonth)}
      disabled={!onMonthPress}
    >
      <Text
        style={[
          {
            fontSize: getFontSizeHeader(numberOfDays),
            textAlign: 'center',
          },
          textStyle,
        ]}
      >
        {formattedMonth}
      </Text>
    </TouchableOpacity>
  );
};

Title.propTypes = {
  showTitle: PropTypes.bool,
  numberOfDays: PropTypes.oneOf(availableNumberOfDays).isRequired,
  selectedDate: PropTypes.instanceOf(Date).isRequired,
  style: PropTypes.object,
  textStyle: PropTypes.object,
  onMonthPress: PropTypes.func,
  width: PropTypes.number.isRequired,
};

export default React.memo(Title);
