/** Debugging utilities. */

import {WeekViewEvent} from '..';

export const generateDates = (hours: number, minutes?: number) => {
  const date = new Date();
  date.setHours(date.getHours() + hours);
  if (minutes != null) {
    date.setMinutes(minutes);
  }
  return date;
};

export const makeBuilder = () => {
  let index = 0;

  return (start: number, duration: number, color: string, more = {}) => {
    index += 1;
    const stackKey = index % 2 === 0 ? 'A' : 'B';
    return {
      id: index,
      title: `E${index}`,
      description: `Event ${index}`,
      startDate: generateDates(start),
      endDate: generateDates(start + duration),
      color,
      stackKey: `evt-${stackKey}`,
      resolveOverlap: 'stack',
      ...(more || {}),
    };
  };
};

export const buildDateCycler = (dates = []) => {
  let DATES_SEQUENCE = new Array(...dates);

  return {
    next: (verbose = false) => {
      const nextDate = DATES_SEQUENCE[0];

      DATES_SEQUENCE = DATES_SEQUENCE.slice(1);
      DATES_SEQUENCE.push(nextDate);
      if (verbose) {
        console.log(
          'Cycling dates: ',
          nextDate.getDate(),
          DATES_SEQUENCE.map(d => d.getDate()),
        );
      }
      return nextDate;
    },
  };
};

type EventsWithUpdateAction = {
  event: WeekViewEvent;
  newStartDate: Date;
  newEndDate: Date;
};

export const eventsWithUpdate = (
  prevEvents: WeekViewEvent[],
  actionPayload: EventsWithUpdateAction,
) => {
  const {event, newStartDate, newEndDate} = actionPayload;
  return [
    ...prevEvents.filter(e => e.id !== event.id),
    {
      ...event,
      startDate: newStartDate,
      endDate: newEndDate,
    },
  ];
};

export const createDummyEvent = ({
  startDate,
  duration,
}: {
  startDate: Date;
  duration: number;
}) => {
  const endDate = new Date(startDate.getTime());
  endDate.setHours(startDate.getHours() + duration);
  return {
    description: 'New Event',
    color: 'lightblue',
    startDate,
    endDate,
  };
};

export const eventsWithAdd = (
  prevEvents: WeekViewEvent[],
  payload: WeekViewEvent,
) => {
  // Just an example reducer, you'll probably use your own
  const maxId = Math.max(...prevEvents.map(e => e.id));
  return [
    ...prevEvents,
    {
      ...payload,
      id: maxId + 1,
    },
  ];
};

type EventsWithAddAndUpdateAction = {
  type: string;
  payload: any;
};

export const eventsWithAddAndUpdate = (
  prevEvents: WeekViewEvent[],
  action: EventsWithAddAndUpdateAction,
) => {
  switch (action.type) {
    case 'updateEvent':
      return eventsWithUpdate(prevEvents, action.payload);
    case 'addEvent':
      return eventsWithAdd(prevEvents, action.payload);
    default:
      return prevEvents;
  }
};
