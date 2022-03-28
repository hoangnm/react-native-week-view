# react-native-week-view
The week view component for react-native.

![weekView](images/gif.gif)

## Key features

* Supported in Android and iOS
* Many user interactions supported: **drag and drop events**, swipe through pages, event press and long-press, grid press and long-press
* Customizable styles
* Multiple locale support


## Installation

> `npm install --save react-native-week-view`

or

> `yarn add react-native-week-view`

Requires react-native 0.59 or above (from `react-native-week-view >= 0.7.0`)



## Basic usage

```js
import WeekView from 'react-native-week-view';

const myEvents = [
  {
    id: 1,
    description: 'Event',
    startDate: new Date(2021, 3, 15, 12, 0),
    endDate: new Date(2021, 3, 15, 12, 30),
    color: 'blue',
    // ... more properties if needed,
  },
  // More events...
];

const MyComponent = () => (
  <WeekView
    events={myEvents}
    selectedDate={new Date(2021, 3, 15)}
    numberOfDays={7}
  />
);

```

## Full API

### Props

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `events` | _Array_ | **required** | Events to display, in `Event Item` format ([see below](#event-item)). |
| `selectedDate` | _Date_ | **required** | Date to show the week-view in the first render. Note: changing this prop after the first render will not have any effect in the week-view; to actually move the week-view, use the `goToDate()` method, [see below](#methods). |
| `numberOfDays` | _Number_, one of `1`, `3`, `5`, `7` | **required** | Number of days to show in the week-view. |
|**_Gesture <br> interactions_**|
| `onEventPress` | _Function:_ `(event) => {}` | `null` | Callback when an event item is pressed, receives the event-item pressed: `(event) => {}`. |
| `onEventLongPress` | _Function:_ `(event) => {}` | `null` | Callback when an event item is long pressed, same signature as `onEventPress`. |
| `onSwipeNext` | _Function:_ `(date) => {}` | `null` | Callback when week-view is swiped to next week/days, receives new date shown. |
| `onSwipePrev` | _Function:_ `(date) => {}` | `null` | Callback when week-view is swiped to previous week/days, same signature as `onSwipeNext`. |
| `onGridClick` | _Function:_ `(pressEvent, startHour, date) => {}` | `null` | Callback when the grid view is pressed. Arguments: `pressEvent`: object passed by the [TouchableWithoutFeedback.onPress() method](https://reactnative.dev/docs/touchablewithoutfeedback#onpress) (not an event item); `startHour`: _Number_, hour pressed; `date` _Date_, date object indicating day and time pressed with precision up to seconds. Note: `startHour` is redundant (can be extracted from `date`), but is kept for backward-compatibility. |
| `onGridLongPress` | _Function:_ `(pressEvent, startHour, date) => {}` | `null` | Callback when the grid view is long-pressed. Same signature as `onGridClick` |
| `onDragEvent` | _Function:_ `(event, newStartDate, newEndDate) => update DB` | `null` | Callback when an event item is dragged to another position. Arguments: `event`: event-item moved, and the `newStartDate` and `newEndDate` are `Date` objects with day and hour of the new position (precision up to minutes). **With this callback you must trigger an update on the `events` prop (i.e. update your DB), with the updated information from the event.** |
| `onDayPress` | _Function:_ `(date, formattedDate) => {}` | `null` | Callback when a day from the header is pressed. |
| `onMonthPress` | _Function:_ `(date, formattedDate) => {}` | `null` | Callback when the month at the top left (title) is pressed. |
|**_Week-view <br> customizations_**|
| `startHour` | _Number_, in hours | `8` (8 am) | Vertical position of the week-view in the first render (vertically in the agenda). |
| `weekStartsOn` | _Number_ | `1` (Monday) | First day of the week, i.e. day to show at the left of the week-view (0 is Sunday, 1 is Monday, and so on). Only useful when `numberOfDays === 7` or `fixedHorizontally` is true. |
| `showTitle` | _Boolean_ | `true` | Show or hide the selected month and year in the top-left corner (a.k.a the title). |
| `hoursInDisplay` | _Number_, in hours | `6` | Amount of hours to display vertically in the agenda. Increasing this number will make the events look smaller. |
| `beginAgendaAt` | _Number_, in minutes | `0` (0h) | Time of day to start the agenda at the top (grid above is left out). For example, for 8 am set `beginAgendaAt={8*60}`. |
| `endAgendaAt` | _Number_, in minutes | `24 * 60` (24h) | Time of day to end the agenda at the bottom (grid below is left out). For example, for 10pm set `engAgendaAt={22*60}`. |
| `timeStep` | _Number_, in minutes | `60` | Number of minutes to use as step in the time labels at the left. Increasing this number will increase the vertical space between grid lines. |
| `formatDateHeader` | _String_ | `"MMM D"` (e.g. "Apr 3") | Formatter for dates in the header. See [all formatters in momentjs](https://momentjs.com/docs/#/displaying/format/). |
| `formatTimeLabel` | _String_ | `"H:mm"` (24 hours) | Formatter for the time labels at the left. Other examples, AM/PM: `"h:mm A"` or `"h:mm a"` for lowercase. See [all formatters in momentjs](https://momentjs.com/docs/#/displaying/format/). |
| `EventComponent` | _ReactComponent_ | `Text` | Custom component rendered inside an event. By default, is a `Text` with the `event.description`. See [sub-section below](#custom-eventcomponent) for details on the component. |
| `TodayHeaderComponent` | _ReactComponent_ | `null` | Custom component to highlight today in the header (by default, *today* looks the same than every day). See details in [sub-section below](#custom-todaycomponent) |
| `showNowLine` | _Boolean_ | `false` | If `true`, displays a line indicating the time right now. |
| `nowLineColor` | _String_ | `red (#E53935)` | Color used for the now-line. |
| `fixedHorizontally` | _Boolean_ | `false` | If `true`, the component can be used to display a single fixed week. See example in [sub-section below](#fixed-week). |
| `isRefreshing` | _Boolean_ | `false` | When `true`, the week-view will show an `<ActivityIndicator />` in the middle of the grid. |
| `RefreshComponent` | _ReactComponent_ | `ActivityIndicator` | Custom component used when `isRefreshing` is `true`. See [example below](#custom-refreshcomponent). |
| `locale` | _String_ | `"en"` | Locale for the dates (e.g. header). There's an `addLocale()` function to add customized locale, [see below](#locales-customization). |
| `rightToLeft` | _Boolean_ | `false` | If `true`, render older days to the right and more recent days to the left. |
| **_Style <br> props_** |
| `headerStyle` | _Object_ | - | Custom styles for header container. Example: `{ backgroundColor: '#4286f4', color: '#fff', borderColor: '#fff' }` |
| `headerTextStyle` | _Object_ | - | Custom styles for text inside header. Applied to day names and month name (i.e. title) |
| `hourTextStyle` | _Object_ | - | Custom styles for text displaying hours at the left. |
| `eventContainerStyle` | _Object_ | - | Custom styles for each event item container. Note: the background color and (absolute) positioning are already set. |
|**_Grid lines <br> props_**|
| `gridRowStyle` | _Object_ | `width: 1`, `color: grey (#E9EDF0)` | Prop to customize width and color of horizontal lines, provide: `{ borderTopWidth: <width>, borderColor: <color> }` |
| `gridColumnStyle` | _Object_ | same as above | Prop to customize width and color of vertical lines, provide: `{ borderLeftWidth: <width>, borderColor: <color> }` |
|**_Other props <br> (patch RN bugs)_**|
| `prependMostRecent` | _Boolean_ | `false` | If `true`, the horizontal prepending is done in the most recent dates when scrolling. See [issue #39](https://github.com/hoangnm/react-native-week-view/issues/39) for more details. |

### Event Item
```js
{
  id: 1,
  description: 'Event',
  startDate: new Date(2021, 3, 15, 12, 0),
  endDate: new Date(2021, 3, 15, 12, 30),
  color: 'blue',
  // ... more properties if needed,
}
```

### Methods

To use the component methods save a reference to it:
```js
<WeekView
  // ... other props
  ref={(ref) => { this.weekViewRef = ref; }}
/>
```

* **`goToDate(date, animated = true)`**: the component navigates to a custom date. Note: if the target date has not been rendered before, there may be a delay on the animation. See [this issue](https://github.com/hoangnm/react-native-week-view/issues/54) for details.
* **`goToNextPage(animated = true)`**: the component navigates to the next page (to the future). Note: if `prependMostRecent` is `true`, and the component is near the last page rendered, there may be a delay on the animation.
* **`goToPrevPage(animated = true)`**: the component navigates to the previous page (to the past). Note: if `prependMostRecent` is `false` (the default), and the component is near the first page rendered, there may be a delay on the animation.


### Custom `EventComponent`
The custom component will be rendered inside a `TouchableOpacity`, which has the background color set to `event.color`, and is placed with absolute position in the grid. The component receives two props:
* **`event`** _(Event)_ - Event item as described before.
* **`position`**: _(Object)_ - object containing `top`, `left`, `height` and `width` values in pixels.

For example, to display an icon inside each event, such as a [react-native-elements Icon](https://react-native-elements.github.io/react-native-elements/docs/icon/):
```js
const MyEventComponent = ({ event, position }) => (
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


### Custom TodayComponent
Use this prop to highlight today in the header, by rendering it differently from the other days. The component `TodayHeaderComponent` receives these props:
* `date` _(moment Date)_ - moment date object containing today's date.
* `formattedDate` _(String)_ - day formatted according to `formatDateHeader`, e.g. `"Mon 3"`.
* `textStyle` _(Object)_ - text style used for every day.

For example, to highlight today with a bold font:
```js
const MyTodayComponent = ({ formattedDate, textStyle }) => (
  <Text style={[textStyle, { fontWeight: 'bold' }]}>{formattedDate}</Text>
);

<WeekView
  // ... other props
  TodayHeaderComponent={MyTodayComponent}
/>
```

### Locales customization

There's a `addLocale` function to add customized locale for the component. The component depends on `momentjs`, you can refer to https://momentjs.com/docs/#/customization/ for more information.

Example:
```js
export WeekView, { addLocale } from 'react-native-week-view';
// add customized localed before using locale prop.
addLocale('fr', {
  months: 'janvier_février_mars_avril_mai_juin_juillet_août_septembre_octobre_novembre_décembre'.split('_'),
  monthsShort: 'janv._févr._mars_avr._mai_juin_juil._août_sept._oct._nov._déc.'.split('_'),
  weekdays: 'dimanche_lundi_mardi_mercredi_jeudi_vendredi_samedi'.split('_'),
  weekdaysShort: 'dim._lun._mar._mer._jeu._ven._sam.'.split('_'),
});
```

### Custom RefreshComponent

* `RefreshComponent` is a _ReactComponent_ that receives a `style` prop that must be used (since it sets the component position).
* Note: the `ActivityIndicator` default color in some devices may be white.

Example:
```js
const MyRefreshComponent = ({ style }) => (
  <Text style={style}>loading...</Text>
);

<WeekView
  // ... other props
  RefreshComponent={MyRefreshComponent}
/>
```

## Other example usages

### Fixed week

The `WeekView` component can be used to display a fixed week (as a timetable):

* Use the prop `fixedHorizontally={true}`. This prop should not be changed after the first render

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
