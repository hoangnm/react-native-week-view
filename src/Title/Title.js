import React from 'react';
import { Text, View } from 'react-native';
import PropTypes from 'prop-types';

import { getCurrentMonth } from '../utils';
import styles from './Title.styles';

const getFontSizeHeader = (numberOfDays) => {
  if (numberOfDays > 1) {
    return 12;
  }
  return 16;
};

const Title = ({
  style,
  numberOfDays,
  selectedDate,
  textColor,
}) => {
  return (
    <View style={[styles.title, style]}>
      <Text
        style={{ color: textColor, fontSize: getFontSizeHeader(numberOfDays) }}
      >
        {getCurrentMonth(selectedDate)}
      </Text>
    </View>
  );
};

Title.propTypes = {
  numberOfDays: PropTypes.oneOf([1, 3, 5, 7]).isRequired,
  selectedDate: PropTypes.instanceOf(Date).isRequired,
  style: PropTypes.object,
  textColor: PropTypes.string,
};

export default React.memo(Title);
