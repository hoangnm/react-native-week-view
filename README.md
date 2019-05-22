# react-native-week-view

![weekView](images/gif.gif)
## Props
* **`events`** _(Array)_ - Events to display
* **`onEventPress`** _(Function)_ - Callback when event item is clicked
* **`dateHeaderFormat`** _(String)_ - Format for dates of header, default is `MMM D`
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
- [ ] allow to set custom date format for header.
- [ ] allow to drag drop events to specific time and date.
- [ ] update example for more cases (1 day, 7 days).
- [ ] update document.
