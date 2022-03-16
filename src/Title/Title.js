import React from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';

import { getCurrentMonth, availableNumberOfDays } from '../utils';
import styles from './Title.styles';

const getFontSizeHeader = (numberOfDays) => {
  if (numberOfDays > 1) {
    return 12;
  }
  return 16;
};

const Title = ({
  style, showTitle, numberOfDays, selectedDate, textStyle, onMonthPress,
}) => {
  if (!showTitle) {
    return <View style={[styles.title, style]}></View>
  }
  const formattedMonth = getCurrentMonth(selectedDate);
  return (
    <TouchableOpacity
      style={[styles.title, style]}
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
};

export default React.memo(Title);
