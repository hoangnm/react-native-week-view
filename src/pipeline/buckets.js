/* eslint-disable max-classes-per-file */
import moment from 'moment';
import { DATE_STR_FORMAT } from '../utils/dates';
import { EVENT_KINDS, OVERLAP_METHOD } from '../utils/types';

export class AllDayEventsInBuckets {
  constructor() {
    this.buckets = {};
  }

  /**
   * Pushes an all-day event to its bucket.
   * @param {Object} eventRef event itself
   * @param {number} lane lane as given by the layout
   * @param {number} nDaysWidth number of days it spans
   */
  addEventToBucket = (eventRef, lane, nDaysWidth) => {
    const dateStr = moment(eventRef.startDate).format(DATE_STR_FORMAT);
    if (!this.buckets[dateStr]) {
      this.buckets[dateStr] = [];
    }
    this.buckets[dateStr].push({
      ref: eventRef,
      overlap: {
        lane,
        width: nDaysWidth,
      },
    });
  };
}

const regularEventsWithMetaSorter = (evtA, evtB) => {
  const backgroundDiff = evtB.box.background - evtA.box.background;
  if (backgroundDiff !== 0) {
    return backgroundDiff;
  }
  return moment(evtA.box.startDate).diff(evtB.box.startDate, 'minutes');
};

export class RegularEventsInBuckets {
  constructor() {
    this.buckets = {};
  }

  /**
   * Pushes a regular event to its bucket.
   * @param {Date} bucketDate date indicating bucket to add the event
   * @param {Object} eventRef event itself
   * @param {Date} boxStartDate date indicating the start of the box
   * @param {Date} boxEndDate date indicating the end of the box
   */
  addEventToBucket = (bucketDate, eventRef, boxStartDate, boxEndDate) => {
    const dateStr = moment(bucketDate).format(DATE_STR_FORMAT);
    if (!this.buckets[dateStr]) {
      this.buckets[dateStr] = [];
    }
    this.buckets[dateStr].push({
      ref: eventRef,
      box: {
        startDate: new Date(boxStartDate.getTime()),
        endDate: new Date(boxEndDate.getTime()),
        background:
          eventRef.eventKind === EVENT_KINDS.BLOCK ||
          eventRef.resolveOverlap === OVERLAP_METHOD.IGNORE,
      },
    });
  };

  sortBuckets = () => {
    Object.keys(this.buckets).forEach((date) => {
      // NOTE: sorting in place
      this.buckets[date].sort(regularEventsWithMetaSorter);
    });
  };
}
