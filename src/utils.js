import { Dimensions } from 'react-native';
import moment from 'moment';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
export const CONTENT_OFFSET = 16;
export const CONTAINER_HEIGHT = SCREEN_HEIGHT - 60;
export const DATE_STR_FORMAT = 'YYYY-MM-DD';
export const availableNumberOfDays = [1, 3, 5, 7];

const TIMES_WIDTH_PERCENTAGE = 18;
const PAGE_WIDTH_PERCENTAGE = (100 - TIMES_WIDTH_PERCENTAGE) / 100;

export const computeWeekViewDimensions = (totalWidth, numberOfDays) => {
  // Each day must have an equal width (integer pixels)
  const dayWidth = Math.floor(
    (totalWidth * PAGE_WIDTH_PERCENTAGE) / numberOfDays,
  );
  const pageWidth = numberOfDays * dayWidth;

  // Fill the full screen
  const timeLabelsWidth = totalWidth - pageWidth;

  const dimensions = {
    pageWidth,
    timeLabelsWidth,
    dayWidth,
  };
  return dimensions;
};

/**
 * TODO
 *
 * @param {*} totalHeight
 * @param {*} hoursInDisplay
 * @param {*} minutesStep
 * @returns
 */
export const computeHeightDimensions = (
  totalHeight,
  hoursInDisplay,
  minutesStep,
) => {
  const timeLabelsInDisplay = Math.ceil((hoursInDisplay * 60) / minutesStep);
  return {
    timeLabelHeight: totalHeight / timeLabelsInDisplay,
  };
};

/**
 * Transform time in the day (expressed in minutes) to y dimension (pixels).
 *
 * Usage:
 * - to get a top position, consider the agenda offset:
 *   `top = minutesToY(minutesInDay, hoursInDisplay, beginAgendaAt)`
 * - to get a delta-y (e.g. height dimension), the offset must be 0:
 *   `height = minutesToY(minutesDelta, hoursInDisplay)`
 *
 * The precision is up to minutes (arbitrary choice).
 *
 * @param {Number} minutes Minutes to transform
 * @param {Number} hoursInDisplay component prop
 * @param {Number} minutesOffset offset, see docstring
 * @returns amount of pixels
 */
export const minutesToY = (minutes, hoursInDisplay, minutesOffset = 0) => {
  const minutesInDisplay = 60 * hoursInDisplay;
  return ((minutes - minutesOffset) * CONTAINER_HEIGHT) / minutesInDisplay;
};

/**
 * Transform a y-dimension value (in pixels) to time in the day (in seconds).
 *
 * Usage:
 * - if a top position is provided, also provide the agenda offset:
 *   `secondsInDay = yToSeconds(top, hoursInDisplay, beginAgendaAt)`
 * - if a delta-y is provided (e.g. height dimension), the offset must be 0:
 *   `secondsDuration = yToSeconds(height, hoursInDisplay)`
 *
 * The output precision is up to seconds (arbitrary choice).
 *
 * @param {Number} yValue pixels
 * @param {Number} hoursInDisplay component prop
 * @param {Number} minutesOffset offset, see docstring
 * @returns amount of seconds
 */
export const yToSeconds = (yValue, hoursInDisplay, minutesOffset = 0) => {
  const hour = (yValue * hoursInDisplay) / CONTAINER_HEIGHT;
  return (hour * 60 + minutesOffset) * 60;
};

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
  for (let i = 0; i < numberOfDays; i += 1) {
    const currentDate = moment(date).add(i, 'd');
    dates.push(currentDate);
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
