import React from 'react';
import PropTypes from 'prop-types';
import { Text, View } from 'react-native';

import { getFormattedDate, getCurrentMonth, calculateDaysArray } from '../utils';

import styles from './Header.styles';

const getFontSizeHeader = (numberOfDays) => {
  if (numberOfDays > 1) {
    return 12;
  }

  return 16;
};

const getDayTextStyles = (numberOfDays) => {
  const fontSize = numberOfDays === 7 ? 12 : 14;
  return {
    fontSize,
  };
};

const Column = ({
  column, numberOfDays, format, textColor
}) => {
  return (
    <View style={styles.column}>
      <Text style={[ { color: textColor }, getDayTextStyles(numberOfDays)]}>
        {getFormattedDate(column, format)}
      </Text>
    </View>
  );
};

const Columns = ({ columns, numberOfDays, format, textColor }) => {
  return (
    <View style={styles.columns}>
      {columns.map((column) => {
        return (
          <Column
            textColor={textColor}
            key={column}
            column={column}
            numberOfDays={numberOfDays}
            format={format}
          />
        );
      })}
    </View>
  );
};

const Title = ({ numberOfDays, selectedDate, textColor }) => { // eslint-disable-line react/prop-types
  return (
    <View style={styles.title}>
      <Text
        style={{ color: textColor, fontSize: getFontSizeHeader(numberOfDays) }}
      >
        {getCurrentMonth(selectedDate)}
      </Text>
    </View>
  );
};

const WeekViewHeader = ({
  numberOfDays, selectedDate, formatDate, style, textColor
}) => {
  const columns = calculateDaysArray(selectedDate, numberOfDays);
  
  return (
    <View style={[styles.container, style]}>
      <Title numberOfDays={numberOfDays} selectedDate={selectedDate} textColor={textColor} />
      {columns && <Columns format={formatDate} columns={columns} numberOfDays={numberOfDays} textColor={textColor} />}
    </View>
  );
};

WeekViewHeader.propTypes = {
  numberOfDays: PropTypes.oneOf([1, 3, 5, 7]).isRequired,
  selectedDate: PropTypes.instanceOf(Date).isRequired,
  formatDate: PropTypes.string,
  style: PropTypes.object,
  textColor: PropTypes.string,
};

WeekViewHeader.defaultProps = {
  formatDate: 'MMM D',
};

export default React.memo(WeekViewHeader);
