import { Dimensions } from 'react-native';
import moment from 'moment';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
export const TIME_LABELS_IN_DISPLAY = 12;
export const CONTAINER_HEIGHT = SCREEN_HEIGHT - 60;
export const TIME_LABEL_HEIGHT = CONTAINER_HEIGHT / TIME_LABELS_IN_DISPLAY;
export const DATE_STR_FORMAT = 'YYYY-MM-DD';

export const getFormattedDate = (date, format) => {
  return moment(date).format(format);
};

export const setLocale = (locale) => {
  moment.locale(locale);
};

export const addLocale = (locale, obj) => {
  moment.locale(locale, obj);
};

export const getCurrentMonth = (date) => {
  return moment(date).format('MMMM Y');
};

export const calculateDaysArray = (date, numberOfDays) => {
  const dates = [];
  let initial = 0;
  if (numberOfDays === 7) {
    initial = 1;
    initial -= moment().isoWeekday();
  }
  for (let i = initial; i < (numberOfDays + initial); i += 1) {
    const currentDate = moment(date).add(i, 'd');
    dates.push(currentDate);
  }
  return dates;
};
