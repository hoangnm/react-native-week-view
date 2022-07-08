# Common use cases

- [Drag and drop events](#drag-and-drop-events)
- [Press the grid to create an event](#press-the-grid-to-create-an-event)
- [Press an event and drag for editing](#press-an-event-and-drag-for-editing)
- [Fixed week (timetable)](#fixed-week-timetable)
- [Utility reducer](#utility-reducer)


Note: some examples provided use the hook `useEvents()` which handles a state of events and is [defined below](#utility-reducer).

## Drag and drop events

```js
const MyComponent = () => {
  const {events, updateEvent} = useEvents();

  return (
    <WeekView
      events={events}
      onDragEvent={(event, newStartDate, newEndDate) => {
        // Here you must update the event in your DB with the new date and time
        updateEvent({ event, newStartDate, newEndDate })
      }}
    />
  );
}
```


## Press the grid to create an event

```js
const createDummyEvent = ({ startDate, duration }) => {
  const endDate = new Date(startDate.getTime());
  endDate.setHours(startDate.getHours() + duration);
  return {
    description: 'New Event',
    color: 'lightblue',
    startDate,
    endDate,
  };
}

const MyComponent = () => {
  const {events, addEvent} = useEvents();

  const createSomeNewEvent = (event, startHour, date) => {
    // Here you update the DB with some new event
    addEvent(createDummyEvent({ startDate: date, duration: 2 }));
  };

  return (
    <WeekView
      events={events}
      onGridClick={createSomeNewEvent} // create on press
      onGridLongPress={createSomeNewEvent} // ...and/or on long-press
    />
  );
}
```


## Press an event and drag for editing

```js
const EDIT_EVENT_CONFIG = {
  top: true,
  bottom: true,
  left: true,
  right: true,
};

const MyComponent = () => {
  const {events, updateEvent} = useEvents();

  const onEditEvent = (event, newStartDate, newEndDate) => {
    // Here you must update the event in your DB with the new date and time
    updateEvent({event, newStartDate, newEndDate});
  };

  // You must store the event being edited
  const [editingEventId, setEditEvent] = useState(null);

  /* Here you choose when to enable/disable edit mode */
  const handleLongPressEvent = event => {
    if (editingEventId == null) {
      // e.g. long-pressing the event enables editing mode
      setEditEvent(event.id);
    } else {
      setEditEvent(null);
    }
  };

  const handlePressEvent = event => {
    if (editingEventId != null) {
      // e.g. pressing the event disables editing mode
      setEditEvent(null);
      return;
    }

    console.log(`Event press ${event.id}`);
  };

  const handleGridPress = (event, startHour, date) => {
    if (editingEventId != null) {
      // e.g. pressing the grid disables editing mode
      setEditEvent(null);
      return;
    }

    console.log(`Grid press: ${date}`);
  };

  return (
    <WeekView
      events={events}
      onEventPress={handlePressEvent}
      onEventLongPress={handleLongPressEvent}
      onGridClick={handleGridPress}
      editingEvent={editingEventId}
      onEditEvent={onEditEvent}
      editEventConfig={EDIT_EVENT_CONFIG}
    />
  );
}
```


## Fixed week (timetable)


* Use `fixedHorizontally={true}`. This prop should not be changed after the first render

* To set `startDate` and `endDate` in each event, you should use the function provided: `createFixedWeekDate(day, hour, minutes=0, seconds=0)`, where:
  * `day`: _(Number|String)_ - specify day of the week as number (1 is monday, 2 is tuesday, etc) or as string (will be parsed with the current locale, e.g. `"Monday"`, `"Tuesday"`, etc. for english).
  * `hour`: _(Number)_ - specify hour of the day as number (from 0 to 23)
  * `minutes`: _(Number)_ - specify minutes of the day as number (from 0 to 59), defaults to 0
  * `seconds`: _(Number)_ - specify seconds of the day as number (from 0 to 59), defaults to 0

  If you choose to not use `createFixedWeekDate()`, make sure that `startDate` and `endDate` are `Date` objects within this week, otherwise the events will not be displayed correctly in the timetable.


* If the `numberOfDays` is other than 7, will display the first days of the week. E.g. if `numberOfDays === 5`, will display from monday to friday.


```js
import WeekView, { createFixedWeekDate } from 'react-native-week-view';

const myEvents = [
  {
    id: 1,
    description: 'Event 1',
    startDate: createFixedWeekDate('Monday', 12), // Day may be passed as string
    endDate: createFixedWeekDate(1, 14), // Or as number, 1 = monday
    color: 'blue',
  },
  {
    id: 2,
    description: 'Event 2',
    startDate: createFixedWeekDate('wed', 16),
    endDate: createFixedWeekDate(3, 16, 30),
    color: 'red',
  },
];

const MyComponent = () => (
  <WeekView
    events={myEvents}
    fixedHorizontally={true}
    // Recommended props:
    showTitle={false} // if true, shows this month and year
    numberOfDays={7}
    formatDateHeader="ddd" // display short name days, e.g. Mon, Tue, etc
    // ... other props
  />
);
```


## Utility reducer

Events hook used in some of these examples

```js
const useEvents = (initialEvents = []) => {
  const [events, dispatch] = useReducer(
    (prevEvents, action) => {
      switch (action.type) {
        case 'updateEvent':
          const {event, newStartDate, newEndDate} = action.payload;
          return [
            ...prevEvents.filter(e => e.id !== event.id),
            {
              ...event,
              startDate: newStartDate,
              endDate: newEndDate,
            },
          ];
        case 'addEvent':
          const maxId = Math.max(...prevEvents.map(e => e.id));
          return [
            ...prevEvents,
            {
              ...action.payload,
              id: maxId + 1,
            },
          ];
        default:
          break;
      }
      return prevEvents;
    },
    initialEvents,
  );

  const addEvent = (payload) => dispatch({
    type: 'addEvent',
    payload,
  });

  const updateEvent = ({ event, newStartDate, newEndDate }) => dispatch({
    type: 'updateEvent',
    payload: { event, newStartDate, newEndDate },
  });

  return {
    events,
    updateEvent,
  };
};
```