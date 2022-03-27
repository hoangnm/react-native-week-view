import React from 'react';
import PropTypes from 'prop-types';
import { Text, View, TouchableOpacity } from 'react-native';
import moment from 'moment';

import {
  getFormattedDate,
  calculateDaysArray,
  availableNumberOfDays,
} from '../utils';
import styles from './Header.styles';

const getDayTextStyles = (numberOfDays) => {
  const fontSize = numberOfDays === 7 ? 12 : 14;
  return {
    fontSize,
  };
};

const Column = ({
  column,
  numberOfDays,
  format,
  style,
  textStyle,
  TodayComponent,
  onDayPress,
}) => {
  const formattedDate = getFormattedDate(column, format);
  const useTodayComponent = TodayComponent && moment().isSame(column, 'days');
  const fullTextStyle = [getDayTextStyles(numberOfDays), textStyle];

  return (
    <TouchableOpacity
      style={[styles.column, style]}
      onPress={() => onDayPress && onDayPress(column, formattedDate)}
      disabled={!onDayPress}
    >
      {useTodayComponent ? (
        <TodayComponent
          date={column}
          formattedDate={formattedDate}
          textStyle={fullTextStyle}
        />
      ) : (
        <Text style={fullTextStyle}>{formattedDate}</Text>
      )}
    </TouchableOpacity>
  );
};

const Columns = ({
  columns,
  numberOfDays,
  format,
  style,
  textStyle,
  TodayComponent,
  onDayPress,
}) => {
  return (
    <View style={styles.columns}>
      {columns.map((column) => {
        return (
          <Column
            style={style}
            textStyle={textStyle}
            key={column}
            column={column}
            numberOfDays={numberOfDays}
            format={format}
            TodayComponent={TodayComponent}
            onDayPress={onDayPress}
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
  textStyle,
  TodayComponent,
  rightToLeft,
  onDayPress,
}) => {
  const columns = calculateDaysArray(initialDate, numberOfDays, rightToLeft);
  return (
    <View style={styles.container}>
      {columns && (
        <Columns
          format={formatDate}
          columns={columns}
          numberOfDays={numberOfDays}
          style={style}
          textStyle={textStyle}
          TodayComponent={TodayComponent}
          onDayPress={onDayPress}
        />
      )}
    </View>
  );
};

WeekViewHeader.propTypes = {
  numberOfDays: PropTypes.oneOf(availableNumberOfDays).isRequired,
  initialDate: PropTypes.string.isRequired,
  formatDate: PropTypes.string,
  style: PropTypes.object,
  textStyle: PropTypes.object,
  rightToLeft: PropTypes.bool,
  TodayComponent: PropTypes.elementType,
  onDayPress: PropTypes.func,
};

WeekViewHeader.defaultProps = {
  formatDate: 'MMM D',
};

export default React.memo(WeekViewHeader);
