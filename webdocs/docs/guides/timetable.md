---
sidebar_position: 50
sidebar_label: Timetable
---

# Timetable

Display a fixed week as a timetable


* Use `fixedHorizontally={true}`
* Create `startDate` and `endDate` by using the function `createFixedWeekDate(day, hour, minutes=0, seconds=0)`, where:
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
