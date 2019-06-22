# react-native-week-view

![weekView](images/gif.gif)
## Props
* **`events`** _(Array)_ - Events to display
* **`onEventPress`** _(Function)_ - Callback when event item is clicked
* **`numberOfDays`** _(Number)_ - Set number of days to show in view, can be `1`, `3`, `7`.
* **`dateHeaderFormat`** _(String)_ - Format for dates of header, default is `MMM D`
* **`selectedDate`** _(Date)_ - Intial date to show week/days in view
* **`onSwipeNext`** _(Function)_ - Callback when calendar is swiped to next week/days
* **`onSwipePrev`** _(Function)_ - Callback when calendar is swiped to previous week/days
* **`locale`** _(String)_ - locale for the header, this library depends on `moment` library, so it should work for all supported locales from `moment`.
## Event Object
```
{
  id: 1,
  description: 'Event',
  startDate: new Date(),
  endDate: new Date(),
  color: 'blue',
}
```
## TODO
- [x] allow to swipe between weeks or days.
- [ ] header should be swipeable with columns.
- [ ] allow to drag drop events to specific time and date.
- [ ] update example for more cases (1 day, 7 days).
- [ ] update document.
