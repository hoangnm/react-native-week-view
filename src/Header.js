import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import moment from 'moment';

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

const getCurrentMonth = (selectedDate) => {
  return moment(selectedDate).format('MMMM Y');
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

const WeekViewHeader = ({ numberOfDays, selectedDate, style }) => {
  const columns = numberOfDays > 1 && getColumns(numberOfDays, selectedDate);

  return (
    <View style={[styles.container, style]}>
      <View style={[styles.oneDayHeader, { width: numberOfDays > 1 ? 60 : '100%' }]}>
        <Text
          style={[styles.text, { fontSize: getFontSizeHeader(numberOfDays) }]}
        >
          {getCurrentMonth(selectedDate)}
        </Text>
      </View>
      {columns && columns.map((column, index) => {
        return (
          <View key={index} style={[styles.column, getBorder(columns, index)]}>
            <Text style={[styles.text, getDayTextStyles(numberOfDays)]}>
              {getFormattedDate(column)}
            </Text>
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-between',
  },
  oneDayHeader: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  column: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: '#fff',
    borderTopWidth: 1,
  },
  text: {
    color: '#fff',
  },
});

export default WeekViewHeader;
