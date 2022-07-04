# Common use cases

- [Drag and drop events](#drag-and-drop-events)
- [Press or longPress the grid to create an event](#press-or-longpress-the-grid-to-create-an-event)
- [Fixed week (timetable)](#fixed-week-timetable)

## Drag and drop events

```js
class MyComponent extends React.Component {
  state = {
    events: [
      // ...
    ],
  };

  /** Here you should update the event in your DB with the new date and time. */
  handleDragEvent = (event, newStartDate, newEndDate) => {
    this.setState({
      events: [
        ...this.state.events.filter(e => e.id !== event.id),
        {
          ...event,
          startDate: newStartDate,
          endDate: newEndDate,
        },
      ],
    });
  };

  render() {
    return (
      <WeekView
        events={this.state.events}
        onDragEvent={this.handleDragEvent}
      />
    );
  }
}
```


## Press or longPress the grid to create an event

```js
class MyComponent extends React.Component {
  state = {
    events: [
      // ...
    ],
  };

  createDummyEvent = ({ startDate, duration }) => {
    const maxId = Math.max(...this.state.events.map(e => e.id));
    const endDate = new Date(startDate.getTime());
    endDate.setHours(startDate.getHours() + duration);
    return {
      id: maxId + 1,
      description: 'New Event',
      color: 'lightblue',
      startDate,
      endDate,
    };
  }

  /** Here you should update your DB with the new event. */
  handleCreateNewEvent = (event, startHour, date) => {
    // Create dummy event
    const dummyEvent = this.createDummyEvent({ startDate: date, duration: 2 });

    // Update DB with the new event
    this.setState({
      events: [
        ...this.state.events,
        dummyEvent,
      ],
    });
  };

  render() {
    return (
      <WeekView
        events={this.state.events}
        onGridClick={this.handleCreateNewEvent} // create on press
        onGridLongPress={this.handleCreateNewEvent} // ...or on long-press
      />
    );
  }
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