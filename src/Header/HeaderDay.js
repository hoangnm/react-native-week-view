import React from 'react';
import PropTypes from 'prop-types';
import { Text, TouchableOpacity } from 'react-native';
import moment from 'moment';

import styles from './HeaderDay.styles';

const DefaultDayComponent = ({ textStyle, formattedDate }) => (
  <Text style={[styles.text, textStyle]}>{formattedDate}</Text>
);

const HeaderDay = ({
  day,
  format,
  style,
  textStyle,
  DayComponent,
  TodayComponent,
  onDayPress,
  width,
}) => {
  const dateObj = moment(day);
  const formattedDate = dateObj.format(format);
  const isToday = moment().isSame(dateObj, 'days');

  const ComponentChosen =
    DayComponent || (isToday && TodayComponent) || DefaultDayComponent;

  return (
    <TouchableOpacity
      style={[styles.container, style, { width }]}
      onPress={() => onDayPress && onDayPress(dateObj.toDate(), formattedDate)}
      disabled={!onDayPress}
    >
      <ComponentChosen
        date={day}
        formattedDate={formattedDate}
        textStyle={textStyle}
        isToday={isToday}
      />
    </TouchableOpacity>
  );
};

HeaderDay.propTypes = {
  day: PropTypes.string.isRequired,
  format: PropTypes.string,
  style: PropTypes.object,
  textStyle: PropTypes.object,
  DayComponent: PropTypes.elementType,
  TodayComponent: PropTypes.elementType,
  onDayPress: PropTypes.func,
  width: PropTypes.number.isRequired,
};

export default HeaderDay;
