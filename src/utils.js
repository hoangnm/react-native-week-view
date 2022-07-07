import moment from 'moment';

export const HEADER_HEIGHT = 50;
export const CONTENT_OFFSET = 16;
export const DATE_STR_FORMAT = 'YYYY-MM-DD';
export const availableNumberOfDays = [1, 3, 5, 7];

const TIMES_WIDTH_PERCENTAGE = 18;
const PAGE_WIDTH_PERCENTAGE = (100 - TIMES_WIDTH_PERCENTAGE) / 100;

export const computeHorizontalDimensions = (totalWidth, numberOfDays) => {
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
export const computeVerticalDimensions = (
  totalHeight,
  hoursInDisplay,
  minutesStep,
) => {
  const minutesInDisplay = hoursInDisplay * 60;
  const timeLabelsInDisplay = Math.ceil(minutesInDisplay / minutesStep);

  // unit: (pixels / minutes)
  const minutesResolution = totalHeight / minutesInDisplay;

  return {
    timeLabelHeight: totalHeight / timeLabelsInDisplay,
    resolution: minutesResolution,
  };
};

/**
 * Transform time in the day (expressed in minutes) to y dimension (pixels).
 *
 * Usage:
 * - to get a top position, consider the agenda offset:
 *   `top = minutesInDayToTop(minutesInDay, hoursInDisplay, beginAgendaAt)`
 * - to get a delta-y (e.g. height dimension), the offset must be 0:
 *   `height = minutesInDayToTop(minutesDelta, hoursInDisplay)`
 *
 * The precision is up to minutes (arbitrary choice).
 *
 * @param {Number} minutes Minutes to transform
 * @param {Number} verticalResolution TODO
 * @param {Number} minutesOffset offset, see docstring
 * @returns amount of pixels
 */
export const minutesInDayToTop = (
  minutes,
  verticalResolution,
  minutesOffset = 0,
) => {
  'worklet';

  return (minutes - (minutesOffset || 0)) * verticalResolution + CONTENT_OFFSET;
};

/**
 * TODO
 *
 * @param {*} minutesDelta
 * @param {*} verticalResolution
 * @returns
 */
export const minutesToHeight = (minutesDelta, verticalResolution) => {
  'worklet';

  return minutesDelta * verticalResolution;
};

/**
 * Transform a y-dimension value (in pixels) to time in the day (in seconds).
 *
 * The output precision is up to seconds (arbitrary choice).
 *
 * @param {Number} yValue pixels
 * @param {Number} verticalResolution TODO
 * @param {Number} minutesOffset offset, see docstring
 * @returns amount of seconds
 */
export const yToSeconds = (yValue, verticalResolution, minutesOffset = 0) => {
  const secondsResolution = verticalResolution / 60;
  const secondsInDay = (yValue - CONTENT_OFFSET) / secondsResolution;
  return secondsInDay + minutesOffset * 60;
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

/**
 * Get the amount of minutes in a day of a date.
 * @param {Date} date
 * @returns amount of minutes in the day.
 */
export const minutesInDay = (date) => {
  const dateObj = moment(date);
  if (!dateObj.isValid()) return 0;
  return dateObj.hours() * 60 + dateObj.minutes();
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
