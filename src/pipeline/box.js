import moment from 'moment';
import { AllDayLayout, getDaysSpan } from './allDay';
import { minutesInDay } from '../utils/dates';
import { EVENT_KINDS } from '../utils/types';
import { RegularEventsInBuckets, AllDayEventsInBuckets } from './buckets';

/**
 * Creates an array of boxes that represent a standard event.
 * @param {EventItem} event
 */
const unrollStandardEvent = (event) => {
  if (!event.startDate || !event.endDate) {
    return [];
  }

  const startDate = moment(event.startDate);
  const endDate = moment(event.endDate);

  const boxes = [];
  for (
    let date = moment(startDate);
    date.isSameOrBefore(endDate, 'days');
    date.add(1, 'days')
  ) {
    const startOfDay = moment(date).startOf('day');
    const endOfDay = moment(date).endOf('day');

    boxes.push({
      bucketDate: date.toDate(),
      // The event box is limited to the start and end of the day
      boxStartDate: moment.max(startDate, startOfDay).toDate(),
      boxEndDate: moment.min(endDate, endOfDay).toDate(),
    });
  }
  return boxes;
};

const sanitizeEndDate = (startDate, endDate) => {
  if (!startDate || !endDate) return null;

  let end = moment(endDate);
  if (end.isSameOrBefore(startDate)) return null;
  if (minutesInDay(endDate) < minutesInDay(startDate)) {
    // Edge case: endDate is in the future but above the startDate
    end = end.subtract(1, 'days').endOf('day');
  }

  return end.toDate();
};

/**
 * Stores regular and all-day events hashed by their date.
 *
 * Each bucket has the events sorted by date (by the minute).
 *
 * There are two types of regular events:
 * - block --> always one box
 * - standard (default) --> multiple boxes if the event span multiple days
 */
const bucketEventsByDate = (events) => {
  const regularEvents = new RegularEventsInBuckets();
  const allDayEvents = new AllDayEventsInBuckets();

  const allDayLayout = new AllDayLayout();

  events.forEach((event) => {
    if (event.allDay) {
      const daysCovered = getDaysSpan(event.startDate, event.endDate);
      const lane = allDayLayout.useNextAvailableLane(daysCovered);
      allDayEvents.addEventToBucket(event, lane, daysCovered.length);
      return;
    }

    switch (event.eventKind) {
      case EVENT_KINDS.BLOCK: {
        const boxEndDate = sanitizeEndDate(event.startDate, event.endDate);
        if (boxEndDate != null) {
          regularEvents.addEventToBucket(
            event.startDate,
            event,
            event.startDate,
            boxEndDate,
          );
        }
        break;
      }
      case EVENT_KINDS.STANDARD:
      default:
        unrollStandardEvent(
          event,
        ).forEach(({ bucketDate, boxStartDate, boxEndDate }) =>
          regularEvents.addEventToBucket(
            bucketDate,
            event,
            boxStartDate,
            boxEndDate,
          ),
        );
        break;
    }
  });

  regularEvents.sortBuckets();

  return {
    regularEvents: regularEvents.buckets,
    allDayEvents: allDayEvents.buckets,
    computeMaxVisibleLanesInHeader: (...args) =>
      allDayLayout.computeMaxLanesVisible(...args),
  };
};

export default bucketEventsByDate;
