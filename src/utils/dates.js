import moment from 'moment';

export const DATE_STR_FORMAT = 'YYYY-MM-DD';
export const availableNumberOfDays = [1, 3, 5, 7];

export const setLocale = (locale) => {
  if (locale) {
    moment.locale(locale);
  }
};

export const addLocale = (locale, obj) => {
  moment.locale(locale, obj);
};

export const getCurrentMonth = (date) => {
  return moment(date).format('MMMM Y');
};

/**
 * Get the amount of minutes in a day of a date.
 * @param {Date|Number} timestampOrDate
 * @returns amount of minutes in the day.
 */
export const minutesInDay = (timestampOrDate) => {
  'worklet';

  const date =
    timestampOrDate instanceof Date
      ? timestampOrDate
      : new Date(timestampOrDate);
  return date.getHours() * 60 + date.getMinutes();
};

export const calculateDaysArray = (fromDate, numberOfDays, rightToLeft) => {
  const dates = [];
  for (let i = 0; i < numberOfDays; i += 1) {
    dates.push(moment(fromDate).add(i, 'd').format(DATE_STR_FORMAT));
  }
  return rightToLeft ? dates.reverse() : dates;
};

export const createFixedWeekDate = (day, hours, minutes = 0, seconds = 0) => {
  const date = moment();
  date.isoWeekday(day);
  date.hours(hours);
  date.minutes(minutes);
  date.seconds(seconds);
  return date.toDate();
};
