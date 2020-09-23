# react-native-week-view

![weekView](images/gif.gif)
## Props
* **`events`** _(Array)_ - Events to display
* **`onEventPress`** _(Function)_ - Callback when event item is clicked
* **`numberOfDays`** _(Number)_ - Set number of days to show in view, can be `1`, `3`, `5`, `7`.
* **`formatDateHeader`** _(String)_ - Format for dates of header, default is `MMM D`
* **`selectedDate`** _(Date)_ - Intial date to show week/days in view
* **`onSwipeNext`** _(Function)_ - Callback when calendar is swiped to next week/days
* **`onSwipePrev`** _(Function)_ - Callback when calendar is swiped to previous week/days
* **`locale`** _(String)_ - locale for the header, there's a `addLocale` function to add cusomized locale. Default is `en`.
* **`showTitle`** _(Boolean)_ - show/hide the title (the selected month and year). Default is `true`. 
* **`headerStyle`** _(Object)_ - custom styles for header container. Example: `{ backgroundColor: '#4286f4', color: '#fff', borderColor: '#fff' }`
* **`hoursInDisplay`** _(Number)_ - Amount of hours to display in the screen. Default is 6.
* **`startHour`** _(Number)_ - Hour to scroll to on start. Default is 8 (8 am).
* **`onGridClick`** _(Function)_ - Callback when the grid view is clicked, signature: `(pressEvent, startHour, date) => {}`.
  * `pressEvent` _(Object)_ - object passed by the [TouchableWithoutFeedback.onPress() method](https://reactnative.dev/docs/touchablewithoutfeedback#onpress) (and not an event object as defined below)
  * `startHour` _(Number)_ - hour clicked (as integer)
  * `date` _(Date)_ - date object indicating day clicked (the hour is not relevant)
* **`EventComponent`** _(React.Component)_ - Component rendered inside an event. By default, is a `Text` with the `event.description`. See below for details on the component.

## Event Object
```js
{
  id: 1,
  description: 'Event',
  startDate: new Date(),
  endDate: new Date(),
  color: 'blue',
  // ... more properties if needed,
}
```

## Custom `EventComponent`
The component will be rendered inside a `TouchableOpacity`, which has the backgroud color set to `event.color`, and is placed with absolute position in the grid. The component receives two props:
* **`event`** _(Event)_ - Event object as described before.
* **`position`**: _(Object)_ - object containint `top`, `left`, `height` and `width` values in pixels.

For example, to display an icon inside each event, such as a [react-native-elements Icon](https://react-native-elements.github.io/react-native-elements/docs/icon/):
```js
class MyEventComponent = ({ event, position }) => (
  <Icon
    name={event.iconName}
    type={event.iconType}
    color={event.color}
    size={position.height}
  />
);

<WeekView
  // ... other props
  EventComponent={MyEventComponent}
/>
```

## Locales customization
There's a `addLocale` function to add customized locale for the component. The component depends on `momentjs`, you can refer to https://momentjs.com/docs/#/customization/ for more information.

Example:
```
export WeekView, { addLocale } from 'react-native-week-view';
// add customized localed before using locale prop.
addLocale('fr', {
  months: 'janvier_février_mars_avril_mai_juin_juillet_août_septembre_octobre_novembre_décembre'.split('_'),
  monthsShort: 'janv._févr._mars_avr._mai_juin_juil._août_sept._oct._nov._déc.'.split('_'),
  weekdays: 'dimanche_lundi_mardi_mercredi_jeudi_vendredi_samedi'.split('_'),
  weekdaysShort: 'dim._lun._mar._mer._jeu._ven._sam.'.split('_'),
});
```
## TODO
- [x] allow to swipe between weeks or days.
- [x] header should be swipeable with columns.
- [x] allow to click on grid view.
- [ ] allow to drag drop events to specific time and date.
