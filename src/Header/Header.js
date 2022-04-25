import React from 'react';
import PropTypes from 'prop-types';
import { Text, View, TouchableOpacity } from 'react-native';
import moment from 'moment';

import {
  getFormattedDate,
  calculateDaysArray,
  availableNumberOfDays,
  stylePropType,
} from '../utils';
import styles from './Header.styles';

const getDayTextStyles = (numberOfDays) => {
  const fontSize = numberOfDays === 7 ? 12 : 14;
  return {
    fontSize,
  };
};

const DefaultDayComponent = ({ textStyle, formattedDate }) => (
  <Text style={textStyle}>{formattedDate}</Text>
);

const Column = ({
  column,
  numberOfDays,
  format,
  style,
  textStyle,
  DayComponent,
  TodayComponent,
  onDayPress,
}) => {
  const formattedDate = getFormattedDate(column, format);
  const isToday = moment().isSame(column, 'days');
  const fullTextStyle = [getDayTextStyles(numberOfDays), textStyle];

  const ComponentChosen = DayComponent || (isToday && TodayComponent) || DefaultDayComponent;

  return (
    <TouchableOpacity
      style={[styles.column, style]}
      onPress={() => onDayPress && onDayPress(column, formattedDate)}
      disabled={!onDayPress}
    >
      <ComponentChosen
        date={column}
        formattedDate={formattedDate}
        textStyle={fullTextStyle}
        isToday={isToday}
      />
    </TouchableOpacity>
  );
};

const Columns = ({
  columns,
  numberOfDays,
  format,
  style,
  textStyle,
  DayComponent,
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
            DayComponent={DayComponent}
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
  DayComponent,
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
          DayComponent={DayComponent}
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
  style: stylePropType,
  textStyle: stylePropType,
  rightToLeft: PropTypes.bool,
  DayComponent: PropTypes.elementType,
  TodayComponent: PropTypes.elementType,
  onDayPress: PropTypes.func,
};

WeekViewHeader.defaultProps = {
  formatDate: 'MMM D',
};

export default React.memo(WeekViewHeader);
