/* eslint-disable max-classes-per-file */
import moment from 'moment';

const ALLOW_OVERLAP_SECONDS = 2;

const areEventsOverlapped = (event1EndDate, event2StartDate) => {
  if (!event1EndDate || !event2StartDate) return false;

  const endDate = moment(event1EndDate);
  endDate.subtract(ALLOW_OVERLAP_SECONDS, 'seconds');
  return endDate.isSameOrAfter(event2StartDate);
};

class Lane {
  constructor() {
    this.latestDate = null;
    this.stackKey = null;
    this.event2StackPosition = {};
    this.length = 0;
  }

  addToStack = (event, eventIndex) => {
    this.latestDate = this.latestDate
      ? moment.max(event.endDate, this.latestDate)
      : event.endDate;
    this.stackKey = event.stackKey || null;
    this.event2StackPosition[eventIndex] = this.length;
    this.length += 1;
  };
}

class OverlappedEventsHandler {
  constructor() {
    this.lanes = [];
    this.lanesByKey = {};
    this.event2LaneIndex = {};
  }

  findFirstLaneNotOverlapping = (startDate) =>
    this.lanes.findIndex((lane) =>
      areEventsOverlapped(lane.latestDate, startDate),
    );

  addToNextAvailableLane = (event, eventIndex) => {
    let laneIndex = this.findFirstLaneNotOverlapping(event.ref.startDate);
    if (laneIndex === -1) {
      this.lanes.push(new Lane());
      laneIndex = this.lanes.length - 1;
    }
    this.saveEventToLane(event, eventIndex, laneIndex);
  };

  getLaneByKeyWithOverlap = (stackKey, startDate) => {
    const laneIndex = this.lanesByKey[stackKey];
    if (laneIndex == null || !this.lanes[laneIndex]) {
      return null;
    }
    if (!areEventsOverlapped(this.lanes[laneIndex].latestDate, startDate)) {
      return laneIndex;
    }
    return null;
  };

  tryAddToStack = (event, eventIndex) => {
    const laneIndex = this.getLaneByKeyWithOverlap(
      event.ref.stackKey,
      event.ref.startDate,
    );
    if (laneIndex != null) {
      this.saveEventToLane(event, eventIndex, laneIndex);
      return true;
    }
    return false;
  };

  saveEventToLane = (event, eventIndex, laneIndex) => {
    this.lanes[laneIndex].addToStack(event, eventIndex);

    this.event2LaneIndex[eventIndex] = laneIndex;
    this.lanesByKey[event.ref.stackKey] = laneIndex;
  };

  static buildFromOverlappedEvents = (events) => {
    const layout = new OverlappedEventsHandler();

    (events || []).forEach((event, eventIndex) => {
      if (event.ref.stackKey != null) {
        const success = layout.tryAddToStack(event, eventIndex);
        if (success) {
          return;
        }
      }
      layout.addToNextAvailableLane(event, eventIndex);
    });
    return layout;
  };

  getEventMeta = (eventIndex) => {
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
      nStacked: lane.length,
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
      path: layout.getEventMeta(eventIndex),
    });
  });
};

const resolveEventOverlaps = (events) => {
  let overlappedSoFar = [];
  let lastDate = null;
  const resolvedEvents = events.reduce((accumulated, eventWithMeta) => {
    const { box } = eventWithMeta;
    if (!lastDate || areEventsOverlapped(lastDate, box.startDate)) {
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
