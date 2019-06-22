import moment from 'moment/min/moment-with-locales';

export const getFormattedDate = (date, format) => {
  return moment(date).format(format);
};

export const setLocale = (locale) => {
  moment.locale(locale);
};

export const getCurrentMonth = (date) => {
  return moment(date).format('MMMM Y');
};
