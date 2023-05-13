/* eslint-disable max-classes-per-file */
import { EVENT_KINDS, OVERLAP_METHOD } from '../utils/types';

const ALLOW_OVERLAP_MILLISECONDS = 2000;

const areEventsOverlapped = (event1EndTimestamp, event2StartTimestamp) => {
  if (event1EndTimestamp == null || event2StartTimestamp == null) return false;

  return event1EndTimestamp - ALLOW_OVERLAP_MILLISECONDS > event2StartTimestamp;
};

class Lane {
  constructor() {
    this.event2StackPosition = {};
    this.latestTimestamp = -1;

    this.resetStack();
  }

  resetStack = () => {
    this.currentStackLength = 0;
    this.stackKey = null;
  };

  addToStack = (eventWithMeta, eventIndex) => {
    this.latestTimestamp = Math.max(
      eventWithMeta.box.endTimestamp,
      this.latestTimestamp,
    );
    this.stackKey = eventWithMeta.ref.stackKey || null;
    this.event2StackPosition[eventIndex] = this.currentStackLength;
    this.currentStackLength += 1;
  };

  addEvent = (eventWithMeta, eventIndex) => {
    if (
      !areEventsOverlapped(
        this.latestTimestamp,
        eventWithMeta.box.startTimestamp,
      )
    ) {
      this.resetStack();
    }
    this.addToStack(eventWithMeta, eventIndex);
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

  saveEventToLane = (eventWithMeta, eventIndex, laneIndex) => {
    this.lanes[laneIndex].addEvent(eventWithMeta, eventIndex);

    this.event2LaneIndex[eventIndex] = laneIndex;
  };

  findFirstLaneNotOverlapping = (boxStartTimestamp) =>
    this.lanes.findIndex(
      (lane) => !areEventsOverlapped(lane.latestTimestamp, boxStartTimestamp),
    );

  addToNextAvailableLane = (eventWithMeta, eventIndex) => {
    let laneIndex = this.findFirstLaneNotOverlapping(
      eventWithMeta.box.startTimestamp,
    );
    if (laneIndex === -1) {
      this.lanes.push(new Lane());
      laneIndex = this.lanes.length - 1;
    }
    this.saveEventToLane(eventWithMeta, eventIndex, laneIndex);
  };

  findLaneWithOverlapAndKey = (eventWithMeta) => {
    const { ref: event, box } = eventWithMeta;
    return this.lanes.findIndex(
      (lane) =>
        (event.targetKey == null || event.targetKey === lane.stackKey) &&
        areEventsOverlapped(lane.latestTimestamp, box.startTimestamp),
    );
  };

  addToNextMatchingStack = (eventWithMeta, eventIndex) => {
    const laneIndex = this.findLaneWithOverlapAndKey(eventWithMeta);
    if (laneIndex !== -1) {
      this.saveEventToLane(eventWithMeta, eventIndex, laneIndex);
    } else {
      this.addToNextAvailableLane(eventWithMeta, eventIndex);
    }
  };

  addAsIgnored = (eventIndex) => {
    this.ignoredEvents[eventIndex] = true;
  };

  static buildFromOverlappedEvents = (eventsWithMeta) => {
    const layout = new OverlappedEventsHandler();

    (eventsWithMeta || []).forEach((eventWithMeta, eventIndex) => {
      switch (eventWithMeta.ref.resolveOverlap) {
        case OVERLAP_METHOD.STACK:
          layout.addToNextMatchingStack(eventWithMeta, eventIndex);
          break;
        case OVERLAP_METHOD.IGNORE:
          layout.addAsIgnored(eventIndex);
          break;
        case OVERLAP_METHOD.LANE:
        default:
          layout.addToNextAvailableLane(eventWithMeta, eventIndex);
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
  let latestTimestamp = -1;
  const resolvedEvents = events.reduce((accumulated, eventWithMeta) => {
    const { ref, box } = eventWithMeta;
    const shouldIgnoreOverlap =
      ref.eventKind === EVENT_KINDS.BLOCK ||
      ref.resolveOverlap === OVERLAP_METHOD.IGNORE;
    if (shouldIgnoreOverlap) {
      accumulated.push(eventWithMeta);
    } else if (
      latestTimestamp === -1 ||
      areEventsOverlapped(latestTimestamp, box.startTimestamp)
    ) {
      overlappedSoFar.push(eventWithMeta);
      latestTimestamp = Math.max(box.endTimestamp, latestTimestamp);
    } else {
      addOverlappedToArray(accumulated, overlappedSoFar);
      overlappedSoFar = [eventWithMeta];
      latestTimestamp = box.endTimestamp;
    }
    return accumulated;
  }, []);
  addOverlappedToArray(resolvedEvents, overlappedSoFar);
  return resolvedEvents;
};

export default resolveEventOverlaps;
