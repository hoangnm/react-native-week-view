/* eslint-disable max-classes-per-file */
import moment from 'moment';
import { EVENT_KINDS, OVERLAP_METHOD } from '../utils/types';

const ALLOW_OVERLAP_SECONDS = 2;

const areEventsOverlapped = (event1EndDate, event2StartDate) => {
  if (!event1EndDate || !event2StartDate) return false;

  const endDate = moment(event1EndDate);
  endDate.subtract(ALLOW_OVERLAP_SECONDS, 'seconds');
  return endDate.isSameOrAfter(event2StartDate);
};

class Lane {
  constructor() {
    this.event2StackPosition = {};
    this.latestDate = null;

    this.resetStack();
  }

  resetStack = () => {
    this.currentStackLength = 0;
    this.stackKey = null;
  };

  addToStack = (event, eventIndex) => {
    this.latestDate =
      this.latestDate == null
        ? moment(event.endDate)
        : moment.max(moment(event.endDate), this.latestDate);
    this.stackKey = event.stackKey || null;
    this.event2StackPosition[eventIndex] = this.currentStackLength;
    this.currentStackLength += 1;
  };

  addEvent = (event, eventIndex) => {
    if (!areEventsOverlapped(this.latestDate, event.startDate)) {
      this.resetStack();
    }
    this.addToStack(event, eventIndex);
  };
}

const IGNORED_EVENTS_META = {
  lane: 0,
  nLanes: 1,
  stackPosition: 0,
};

class OverlappedEventsHandler {
  constructor() {
    this.lanes = [];
    this.event2LaneIndex = {};
    this.ignoredEvents = {};
  }

  saveEventToLane = (event, eventIndex, laneIndex) => {
    this.lanes[laneIndex].addEvent(event, eventIndex);

    this.event2LaneIndex[eventIndex] = laneIndex;
  };

  findFirstLaneNotOverlapping = (startDate) =>
    this.lanes.findIndex(
      (lane) => !areEventsOverlapped(lane.latestDate, startDate),
    );

  addToNextAvailableLane = (event, eventIndex) => {
    let laneIndex = this.findFirstLaneNotOverlapping(event.startDate);
    if (laneIndex === -1) {
      this.lanes.push(new Lane());
      laneIndex = this.lanes.length - 1;
    }
    this.saveEventToLane(event, eventIndex, laneIndex);
  };

  findLaneWithOverlapAndKey = (startDate, targetKey = null) =>
    this.lanes.findIndex(
      (lane) =>
        (targetKey == null || targetKey === lane.stackKey) &&
        areEventsOverlapped(lane.latestDate, startDate),
    );

  addToNextMatchingStack = (event, eventIndex) => {
    const laneIndex = this.findLaneWithOverlapAndKey(
      event.startDate,
      event.stackKey,
    );
    if (laneIndex !== -1) {
      this.saveEventToLane(event, eventIndex, laneIndex);
    } else {
      this.addToNextAvailableLane(event, eventIndex);
    }
  };

  addAsIgnored = (eventIndex) => {
    this.ignoredEvents[eventIndex] = true;
  };

  static buildFromOverlappedEvents = (events) => {
    const layout = new OverlappedEventsHandler();

    (events || []).forEach(({ ref: event }, eventIndex) => {
      switch (event.resolveOverlap) {
        case OVERLAP_METHOD.STACK:
          layout.addToNextMatchingStack(event, eventIndex);
          break;
        case OVERLAP_METHOD.IGNORE:
          layout.addAsIgnored(eventIndex);
          break;
        case OVERLAP_METHOD.LANE:
        default:
          layout.addToNextAvailableLane(event, eventIndex);
          break;
      }
    });
    return layout;
  };

  getEventOverlapMeta = (eventIndex) => {
    if (this.ignoredEvents[eventIndex]) {
      return IGNORED_EVENTS_META;
    }
    const laneIndex = this.event2LaneIndex[eventIndex];
    if (laneIndex == null || laneIndex > this.lanes.length) {
      // internal error
      return {};
    }
    const lane = this.lanes[laneIndex];
    return {
      lane: laneIndex,
      nLanes: this.lanes.length,
      stackPosition: lane.event2StackPosition[eventIndex],
    };
  };
}

const addOverlappedToArray = (baseArr, overlappedArr) => {
  if (!overlappedArr) return;

  const nOverlapped = overlappedArr.length;
  if (nOverlapped === 0) {
    return;
  }
  if (nOverlapped === 1) {
    baseArr.push(overlappedArr[0]);
    return;
  }

  const layout = OverlappedEventsHandler.buildFromOverlappedEvents(
    overlappedArr,
  );

  overlappedArr.forEach(({ ref, box }, eventIndex) => {
    baseArr.push({
      ref,
      box,
      overlap: layout.getEventOverlapMeta(eventIndex),
    });
  });
};

const resolveEventOverlaps = (events) => {
  let overlappedSoFar = [];
  let lastDate = null;
  const resolvedEvents = events.reduce((accumulated, eventWithMeta) => {
    const { ref, box } = eventWithMeta;
    const shouldIgnoreOverlap =
      ref.eventKind === EVENT_KINDS.BLOCK ||
      ref.resolveOverlap === OVERLAP_METHOD.IGNORE;
    if (shouldIgnoreOverlap) {
      accumulated.push(eventWithMeta);
    } else if (!lastDate || areEventsOverlapped(lastDate, box.startDate)) {
      overlappedSoFar.push(eventWithMeta);
      const endDate = moment(box.endDate);
      lastDate = lastDate ? moment.max(endDate, lastDate) : endDate;
    } else {
      addOverlappedToArray(accumulated, overlappedSoFar);
      overlappedSoFar = [eventWithMeta];
      lastDate = moment(box.endDate);
    }
    return accumulated;
  }, []);
  addOverlappedToArray(resolvedEvents, overlappedSoFar);
  return resolvedEvents;
};

export default resolveEventOverlaps;
