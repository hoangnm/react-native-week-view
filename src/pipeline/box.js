import moment from 'moment';
import { DATE_STR_FORMAT } from '../utils/dates';

const bucketEventsByDate = (events) => {
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

      // The event box is limited to the start and end of the day
      const boxStartDate = moment.max(startDate, startOfDay).toDate();
      const boxEndDate = moment.min(endDate, endOfDay).toDate();

      // Add to object
      const dateStr = date.format(DATE_STR_FORMAT);
      if (!sortedEvents[dateStr]) {
        sortedEvents[dateStr] = [];
      }
      sortedEvents[dateStr].push({
        ref: event,
        box: {
          startDate: boxStartDate,
          endDate: boxEndDate,
        },
      });
    }
  });
  // For each day, sort the events by the minute (in-place)
  Object.keys(sortedEvents).forEach((date) => {
    sortedEvents[date].sort((a, b) => {
      return moment(a.box.startDate).diff(b.box.startDate, 'minutes');
    });
  });
  return sortedEvents;
};

export default bucketEventsByDate;
