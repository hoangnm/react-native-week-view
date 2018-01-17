import React from 'react';
import PropTypes from 'prop-types';
import { Text, View } from 'react-native';
import moment from 'moment';

import styles from './Header.styles';

const getBorder = (items, index) => {
  return {
    borderLeftWidth: index === 0 ? 1 : 0,
    borderRightWidth: index < items.length - 1 ? 1 : 0,
  };
};

const getColumns = (numberOfDays, selectedDate) => {
  const columns = [];
  let initial = 0;
  if (numberOfDays === 7) {
    initial = 1;
    initial -= moment().isoWeekday();
  }
  for (let i = initial; i < (numberOfDays + initial); i += 1) {
    let date = moment(selectedDate);
    date = date.add(i, 'd');
    columns.push(date.toDate());
  }
  return columns;
};

const getFormattedDate = (date) => {
  return moment(date).format('MMM D');
};

const getCurrentMonth = (date) => {
  return moment(date).format('MMMM Y');
};

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

// components

const Column = ({ column, style, numberOfDays }) => { // eslint-disable-line react/prop-types
  return (
    <View style={[styles.column, style]}>
      <Text style={[styles.text, getDayTextStyles(numberOfDays)]}>
        {getFormattedDate(column)}
      </Text>
    </View>
  );
};

const Columns = ({ columns, numberOfDays }) => { // eslint-disable-line react/prop-types
  return (
    <View style={styles.columns}>
      {columns.map((column, index) => {
        return (
          <Column
            key={column}
            column={column}
            numberOfDays={numberOfDays}
            style={getBorder(columns, index)}
          />
        );
      })}
    </View>
  );
};

const Title = ({ numberOfDays, selectedDate }) => { // eslint-disable-line react/prop-types
  return (
    <View style={[styles.oneDayHeader, { width: numberOfDays > 1 ? 60 : '100%' }]}>
      <Text
        style={[styles.text, { fontSize: getFontSizeHeader(numberOfDays) }]}
      >
        {getCurrentMonth(selectedDate)}
      </Text>
    </View>
  );
};

const WeekViewHeader = ({ numberOfDays, selectedDate, style }) => {
  const columns = numberOfDays > 1 && getColumns(numberOfDays, selectedDate);
  return (
    <View style={[styles.container, style]}>
      <Title numberOfDays={numberOfDays} selectedDate={selectedDate} />
      {columns && <Columns columns={columns} numberOfDays={numberOfDays} />}
    </View>
  );
};

WeekViewHeader.propTypes = {
  numberOfDays: PropTypes.oneOf([1, 3, 7]).isRequired,
  selectedDate: PropTypes.instanceOf(Date).isRequired,
  style: View.propTypes.style,
};

export default WeekViewHeader;
