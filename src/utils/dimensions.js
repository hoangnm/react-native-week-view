/**
 * Handle horizontal and vertical dimensions.
 *
 * Notes:
 * (1) Definition: _verticalResolution_
 *   - Computed as `component-height / time-in-display`
 *   - (time can be in minutes, hours, etc)
 *   - e.g. `screenHeight / hoursInDisplay`
 *
 * Given a point in the screen, its relation between the position (top in pixels)
 * and the time in the day is:
 *     top = verticalResolution * time + CONTENT_TOP_PADDING
 *
 * When the agenda does not begin at 00:00, use:
 *     top = verticalResolution * (time - beginAgendaAt) + CONTENT_TOP_PADDING
 *
 *
 * (2) Some functions __must__ be declared as worklets because they
 * are used with react-native-reanimated in useAnimatedStyle(), useDerivedValue(),
 * etc.
 */
export const HEADER_HEIGHT = 50;
export const CONTENT_TOP_PADDING = 16;

export const computeVerticalDimensions = (
  totalHeight,
  hoursInDisplay,
  minutesStep,
) => {
  const minutesInDisplay = hoursInDisplay * 60;
  const timeLabelsInDisplay = Math.ceil(minutesInDisplay / minutesStep);

  const minutesResolution = totalHeight / minutesInDisplay;

  return {
    timeLabelHeight: totalHeight / timeLabelsInDisplay,
    resolution: minutesResolution,
  };
};

/**
 * Convert time in the day (expressed in minutes) to top (pixels in y dim).
 *
 * @param {Number} minutes Minutes to convert
 * @param {Number} verticalResolution resolution in minutes
 * @param {Number} minutesOffset offset, e.g. beginAgendaAt
 * @returns pixels
 */
export const minutesInDayToTop = (
  minutes,
  verticalResolution,
  minutesOffset = 0,
) => {
  'worklet';

  return (
    (minutes - (minutesOffset || 0)) * verticalResolution + CONTENT_TOP_PADDING
  );
};

/**
 * Convert period of time (in minutes) to height (pixels in y dim).
 *
 * @param {*} minutesDelta period of time in minutes
 * @param {*} verticalResolution resolution in minutes
 * @returns pixels
 */
export const minutesToHeight = (minutesDelta, verticalResolution) => {
  'worklet';

  return minutesDelta * verticalResolution;
};

/**
 * Convert a top position (pixels in y-dim) to time in the day (in seconds).
 *
 * The output precision is up to seconds (arbitrary choice).
 *
 * @param {Number} yValue top position in pixels
 * @param {Number} verticalResolution resolution in minutes
 * @param {Number} minutesOffset offset, e.g. beginAgendaAt
 * @returns amount of seconds
 */
export const topToSecondsInDay = (
  yValue,
  verticalResolution,
  minutesOffset = 0,
) => {
  const secondsResolution = verticalResolution / 60;
  const secondsInDay = (yValue - CONTENT_TOP_PADDING) / secondsResolution;
  return secondsInDay + minutesOffset * 60;
};

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

  return {
    pageWidth,
    timeLabelsWidth,
    dayWidth,
  };
};
