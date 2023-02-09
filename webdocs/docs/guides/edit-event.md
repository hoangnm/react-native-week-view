---
sidebar_position: 22
sidebar_label: Edit and Create Events
---


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

## Utility

Events hook used in the examples:

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
