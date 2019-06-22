import React from 'react';
import PropTypes from 'prop-types';
import { Text, View } from 'react-native';
import moment from 'moment';

import { getFormattedDate, getCurrentMonth } from '../utils';

import styles from './Header.styles';

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
  column, numberOfDays, format, lang
}) => {
  return (
    <View style={styles.column}>
      <Text style={[styles.text, getDayTextStyles(numberOfDays)]}>
        {getFormattedDate(column, format, lang)}
      </Text>
    </View>
  );
};

const Columns = ({ columns, numberOfDays, format, lang }) => {
  return (
    <View style={styles.columns}>
      {columns.map((column) => {
        return (
          <Column
            key={column}
            column={column}
            numberOfDays={numberOfDays}
            format={format}
            lang={lang}
          />
        );
      })}
    </View>
  );
};

const Title = ({ numberOfDays, selectedDate, lang }) => { // eslint-disable-line react/prop-types
  return (
    <View style={styles.title}>
      <Text
        style={[styles.text, { fontSize: getFontSizeHeader(numberOfDays) }]}
      >
        {getCurrentMonth(selectedDate, lang)}
      </Text>
    </View>
  );
};

const WeekViewHeader = ({
  numberOfDays, selectedDate, formatDate, style, lang
}) => {
  const columns = getColumns(numberOfDays, selectedDate);
  return (
    <View style={[styles.container, style]}>
      <Title numberOfDays={numberOfDays} selectedDate={selectedDate} lang={lang} />
      {columns && <Columns format={formatDate} columns={columns} numberOfDays={numberOfDays} lang={lang}/>}
    </View>
  );
};

WeekViewHeader.propTypes = {
  numberOfDays: PropTypes.oneOf([1, 3, 7]).isRequired,
  selectedDate: PropTypes.instanceOf(Date).isRequired,
  formatDate: PropTypes.string,
  style: PropTypes.object,
  lang: PropTypes.oneOf(moment.locales()),
};

WeekViewHeader.defaultProps = {
  formatDate: 'MMM D',
  lang: 'en'
};

export default WeekViewHeader;
