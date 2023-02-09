---
sidebar_position: 21
sidebar_label: Drag and Drop
---

```js
const MyComponent = () => {
  const {events, updateEvent} = useEvents();

  return (
    <WeekView
      events={events}
      onDragEvent={(event, newStartDate, newEndDate) => {
        // Here you must update the event in your local DB with the new date and time
        updateEvent({ event, newStartDate, newEndDate })
      }}
    />
  );
}
```

Events hook used in the example:

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
        default:
          break;
      }
      return prevEvents;
    },
    initialEvents,
  );

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
