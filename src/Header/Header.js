import React from 'react';
import PropTypes from 'prop-types';
import { Text, View } from 'react-native';

import { getFormattedDate, calculateDaysArray } from '../utils';
import styles from './Header.styles';

const getDayTextStyles = (numberOfDays) => {
  const fontSize = numberOfDays === 7 ? 12 : 14;
  return {
    fontSize,
  };
};

const Column = ({ column, numberOfDays, format, textColor }) => {
  return (
    <View style={styles.column}>
      <Text style={[{ color: textColor }, getDayTextStyles(numberOfDays)]}>
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

const WeekViewHeader = ({
  numberOfDays,
  initialDate,
  formatDate,
  style,
  textColor,
}) => {
  const columns = calculateDaysArray(initialDate, numberOfDays);
  return (
    <View style={[styles.container, style]}>
      {columns && (
        <Columns
          format={formatDate}
          columns={columns}
          numberOfDays={numberOfDays}
          textColor={textColor}
        />
      )}
    </View>
  );
};

WeekViewHeader.propTypes = {
  numberOfDays: PropTypes.oneOf([1, 3, 5, 7]).isRequired,
  initialDate: PropTypes.string.isRequired,
  formatDate: PropTypes.string,
  style: PropTypes.object,
  textColor: PropTypes.string,
};

WeekViewHeader.defaultProps = {
  formatDate: 'MMM D',
};

export default React.memo(WeekViewHeader);
