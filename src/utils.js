import { Dimensions } from 'react-native';
import moment from 'moment';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
export const TIME_LABELS_IN_DISPLAY = 12;
export const CONTAINER_HEIGHT = SCREEN_HEIGHT - 60;
export const CONTAINER_WIDTH = SCREEN_WIDTH - 60;
export const TIME_LABEL_HEIGHT = CONTAINER_HEIGHT / TIME_LABELS_IN_DISPLAY;
export const DATE_STR_FORMAT = 'YYYY-MM-DD';
export const availableNumberOfDays = [1, 3, 5, 7];
const MINUTES_IN_DAY = 60 * 24;

export const getFormattedDate = (date, format) => {
  return moment(date).format(format);
};

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

export const calculateDaysArray = (date, numberOfDays, rightToLeft) => {
  const dates = [];
  let initial = 0;
  if (numberOfDays === 7) {
    initial = 1;
    initial -= moment(date).isoWeekday();
  }
  for (let i = initial; i < numberOfDays + initial; i += 1) {
    const currentDate = moment(date).add(i, 'd');
    dates.push(currentDate);
  }
  return rightToLeft ? dates.reverse() : dates;
};

export const getTimesArray = (hoursInDisplay) => {
  const times = [];
  const timeLabelsPerHour = TIME_LABELS_IN_DISPLAY / hoursInDisplay;
  const minutesStep = 60 / timeLabelsPerHour;
  for (let timer = 0; timer < MINUTES_IN_DAY; timer += minutesStep) {
    let minutes = timer % 60;
    if (minutes < 10) minutes = `0${minutes}`;
    const hour = Math.floor(timer / 60);
    const timeString = `${hour}:${minutes}`;
    times.push(timeString);
  }
  return times;
};

export const bucketEventsByDate = (events) => {
  // Stores the events hashed by their date
  // For example: { "2020-02-03": [event1, event2, ...] }
  // If an event spans through multiple days, adds the event multiple times
  const sortedEvents = {};
  events.forEach((event) => {
    const startDate = moment(event.startDate);
    const endDate = moment(event.endDate);

    for (
      let date = moment(startDate);
      date.isSameOrBefore(endDate, 'days');
      date.add(1, 'days')
    ) {
      // Calculate actual start and end dates
      const startOfDay = moment(date).startOf('day');
      const endOfDay = moment(date).endOf('day');
      const actualStartDate = moment.max(startDate, startOfDay);
      const actualEndDate = moment.min(endDate, endOfDay);

      // Add to object
      const dateStr = date.format(DATE_STR_FORMAT);
      if (!sortedEvents[dateStr]) {
        sortedEvents[dateStr] = [];
      }
      sortedEvents[dateStr].push({
        ...event,
        startDate: actualStartDate.toDate(),
        endDate: actualEndDate.toDate(),
      });
    }
  });
  // For each day, sort the events by the minute (in-place)
  Object.keys(sortedEvents).forEach((date) => {
    sortedEvents[date].sort((a, b) => {
      return moment(a.startDate).diff(b.startDate, 'minutes');
    });
  });
  return sortedEvents;
};

export const createFixedWeekDate = (day, hours, minutes=0, seconds=0) => {
  const date = moment();
  date.isoWeekday(day);
  date.hours(hours);
  date.minutes(minutes);
  return date.toDate();
};
