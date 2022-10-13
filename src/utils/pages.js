/** Handle horizontal pages. */
import moment from 'moment';
import { DATE_STR_FORMAT } from './dates';

// FlatList configuration
export const PAGES_OFFSET = 2;
export const DEFAULT_WINDOW_SIZE = PAGES_OFFSET * 2 + 1;

export const getRawDayOffset = (newDayOffset, options = {}) => {
  const { left: distanceToLeft = null } = options || {};
  if (distanceToLeft != null) {
    // the user wants to see targetDate at <distanceToLeft> from the edge
    return newDayOffset - distanceToLeft;
  }
  return newDayOffset;
};

const getPageStartDate = (
  selectedDate,
  numberOfDays,
  pageStartAtOptions = {},
) => {
  const { left: distanceToLeft = null, weekday = null } =
    pageStartAtOptions || {};
  if (distanceToLeft != null) {
    // the user wants to see selectedDate at <distanceToLeft> from the left edge
    return moment(selectedDate).subtract(distanceToLeft, 'day');
  }
  if (weekday != null) {
    const date = moment(selectedDate);
    return date.subtract(
      // Ensure centralDate is before currentMoment
      (date.day() + numberOfDays - weekday) % numberOfDays,
      'days',
    );
  }
  return moment(selectedDate);
};

/** Compute an array of dates representing pages. */
export const calculatePagesDates = (
  selectedDate,
  numberOfDays,
  pageStartAt,
  prependMostRecent,
) => {
  const initialDates = [];
  const centralDate = getPageStartDate(selectedDate, numberOfDays, pageStartAt);
  for (let i = -PAGES_OFFSET; i <= PAGES_OFFSET; i += 1) {
    const initialDate = moment(centralDate).add(numberOfDays * i, 'd');
    initialDates.push(initialDate.format(DATE_STR_FORMAT));
  }
  return prependMostRecent ? initialDates.reverse() : initialDates;
};
