import moment from 'moment';
import { DATE_STR_FORMAT } from '../utils/dates';

/**
 * Creates an array of boxes that represent a standard event.
 * @param {EventItem} event
 */
const unrollStandardEvent = (event) => {
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

/**
 * Stores the events hashed by their date.
 * Each bucket has the events sorted by date (by the minute)
 *
 * Supports two types of events:
 * - block --> always one box
 * - standard (default) --> multiple boxes if the event span multiple days
 *
 * @param {Array} events
 * @returns object of events bucketed by date. Events come with box metadata, e.g.:
 * { "2020-02-03": [{ ref: event1, box }, { ref: event2, box }, ...] }
 */
const bucketEventsByDate = (events) => {
  const sortedEvents = {};

  /**
   * Pushes an event to a bucket.
   * @param {Date} bucketDate date indicating bucket to add the event
   * @param {Object} eventRef event itself
   * @param {Date} boxStartDate date indicating the start of the box
   * @param {Date} boxEndDate date indicating the end of the box
   */
  const addEventToBucket = (bucketDate, eventRef, boxStartDate, boxEndDate) => {
    const dateStr = moment(bucketDate).format(DATE_STR_FORMAT);
    if (!sortedEvents[dateStr]) {
      sortedEvents[dateStr] = [];
    }
    sortedEvents[dateStr].push({
      ref: eventRef,
      box: {
        startDate: new Date(boxStartDate.getTime()),
        endDate: new Date(boxEndDate.getTime()),
      },
    });
  };

  events.forEach((event) => {
    switch (event.eventType) {
      case 'block':
        addEventToBucket(
          event.startDate,
          event,
          event.startDate,
          event.endDate,
        );
        break;
      case 'standard':
      default:
        unrollStandardEvent(
          event,
        ).forEach(({ bucketDate, boxStartDate, boxEndDate }) =>
          addEventToBucket(bucketDate, event, boxStartDate, boxEndDate),
        );
        break;
    }
  });

  Object.keys(sortedEvents).forEach((date) => {
    // NOTE: sorting in place
    sortedEvents[date].sort((a, b) => {
      return moment(a.box.startDate).diff(b.box.startDate, 'minutes');
    });
  });
  return sortedEvents;
};

export default bucketEventsByDate;
