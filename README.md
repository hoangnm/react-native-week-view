![tests](https://github.com/hoangnm/react-native-week-view/actions/workflows/tests.yml/badge.svg) ![linter](https://github.com/hoangnm/react-native-week-view/actions/workflows/linter.yml/badge.svg) ![codeql](https://github.com/hoangnm/react-native-week-view/actions/workflows/codeql-analysis.yml/badge.svg)

# react-native-week-view
The week view component for react-native.

* Supported in Android and iOS
* Many user interactions supported: **drag and drop events**, edit events, swipe through pages, event press, grid press, etc
* Customizable styles
* Multiple locale support

![weekView](images/gif.gif)

## Table of Contents
- [Table of Contents](#table-of-contents)
- [Installation](#installation)
- [Basic usage](#basic-usage)
- [Example use cases](#example-use-cases)
- [Changelog](#changelog)
- [Full API](#full-api)
  - [Props](#props)
  - [Event Item](#event-item)
  - [Methods](#methods)
- [Custom components](#custom-components)
  - [Custom Event item component](#custom-event-item-component)
  - [Custom Day header component](#custom-day-header-component)
  - [Locales customization](#locales-customization)
  - [Custom RefreshComponent](#custom-refreshcomponent)
- [Known issues](#known-issues)
- [Contributors](#contributors)


## Installation

> `npm install --save react-native-week-view`

or

> `yarn add react-native-week-view`

**Requirements:** install peer dependencies [react-native-gesture-handler](https://docs.swmansion.com/react-native-gesture-handler/docs/installation/) v2 and [react-native-reanimated](https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/installation) v2, which we use to provide smoother interactions and animations (e.g. drag and drop).
Required by react-native-week-view since versions 0.17.0 and higher.

Compatibility:

| react-native-week-view | react-native |
| ---------------------- | ------------ |
| >= 0.7.0               | >= 0.59      |
| >= 0.17.0              | >= 0.60.0    |


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


## Example use cases

See [dedicated docs](./docs/common-usages.md) with common usages and example code.

- [Drag and drop events](./docs/common-usages.md#drag-and-drop-events)
- [Press the grid to create an event](./docs/common-usages.md#press-the-grid-to-create-an-event)
- [Press an event and drag for editing](./docs/common-usages.md#press-an-event-and-drag-for-editing)
- [Timetable](./docs/common-usages.md#fixed-week-timetable)


## Changelog

API is still unstable, minor updates before v1.0.0 can include breaking changes, adhering to Semantic Versioning.
See [CHANGELOG.md](docs/CHANGELOG.md) for details.


## Full API

### Props

| Prop name                                                                    | Type                                                         | Default                             | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| ---------------------------------------------------------------------------- | ------------------------------------------------------------ | ----------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `events`                                                                     | _Array_                                                      | **required**                        | Events to display, in `Event Item` format ([see below](#event-item)).                                                                                                                                                                                                                                                                                                                                                                                                               |
| `selectedDate`                                                               | _Date_                                                       | **required**                        | Date to show the week-view in the first render. Note: changing this prop after the first render will not have any effect in the week-view; to actually move the week-view, use the `goToDate()` method, [see below](#methods).                                                                                                                                                                                                                                                      |
| `numberOfDays`                                                               | _Number_, one of `1`, `3`, `5`, `7`                          | **required**                        | Number of days to show in the week-view.                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| **_Gesture <br> interactions_**                                              |
| `onEventPress`                                                               | _Function:_ `(event) => {}`                                  | `null`                              | Callback when an event item is pressed, receives the event-item pressed: `(event) => {}`.                                                                                                                                                                                                                                                                                                                                                                                           |
| `onEventLongPress`                                                           | _Function:_ `(event) => {}`                                  | `null`                              | Callback when an event item is long pressed, same signature as `onEventPress`.                                                                                                                                                                                                                                                                                                                                                                                                      |
| `onSwipeNext`                                                                | _Function:_ `(date) => {}`                                   | `null`                              | Callback when week-view is swiped to next week/days, receives new date shown.                                                                                                                                                                                                                                                                                                                                                                                                       |
| `onSwipePrev`                                                                | _Function:_ `(date) => {}`                                   | `null`                              | Callback when week-view is swiped to previous week/days, same signature as `onSwipeNext`.                                                                                                                                                                                                                                                                                                                                                                                           |
| `onGridClick`                                                                | _Function:_ `(pressEvent, startHour, date) => {}`            | `null`                              | Callback when the grid view is pressed. Arguments: `pressEvent`: object passed by the [react-native-gesture-handler touch events](https://docs.swmansion.com/react-native-gesture-handler/docs/api/gestures/touch-events) (not an event item); `startHour`: _Number_, hour pressed; `date` _Date_, date object indicating day and time pressed with precision up to seconds. Note: `startHour` is redundant (can be extracted from `date`), but is kept for backward-compatibility. |
| `onGridLongPress`                                                            | _Function:_ `(pressEvent, startHour, date) => {}`            | `null`                              | Callback when the grid view is long-pressed. Same signature as `onGridClick`                                                                                                                                                                                                                                                                                                                                                                                                        |
| `onDayPress`                                                                 | _Function:_ `(date, formattedDate) => {}`                    | `null`                              | Callback when a day from the header is pressed.                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| `onMonthPress`                                                               | _Function:_ `(date, formattedDate) => {}`                    | `null`                              | Callback when the month at the top left (title) is pressed.                                                                                                                                                                                                                                                                                                                                                                                                                         |
| `onTimeScrolled`                                                             | _Function:_ `(dateWithTime) => {}`                           | `null`                              | Callback when the agenda is scrolled vertically.                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| `onDragEvent`                                                                | _Function:_ `(event, newStartDate, newEndDate) => update DB` | `null`                              | Callback when an event item is dragged to another position. Arguments: `event`: event-item moved, and the `newStartDate` and `newEndDate` are `Date` objects with day and hour of the new position (precision up to minutes). **With this callback you must trigger an update on the `events` prop (i.e. update your DB), with the updated information from the event.**                                                                                                            |
| `onEditEvent`                                                                | _Function:_ `(event, newStartDate, newEndDate) => update DB` | `null`                              | Callback when an event item is edited by dragging its borders.                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `editingEvent`                                                               | _Number_                                                     | String                              | null_                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | `null`                      | id indicating the event currently being edited. |
| `editEventConfig`                                                            | _{bottom: bool, top: bool, left: bool, right: bool}_         | null_                               | `{bottom: true}`                                                                                                                                                                                                                                                                                                                                                                                                                                                                    | Sides allowed to be edited. |
| **_Week-view <br> customizations_**                                          |
| `startHour`                                                                  | _Number_, in hours                                           | `8` (8 am)                          | Vertical position of the week-view in the first render (vertically in the agenda).                                                                                                                                                                                                                                                                                                                                                                                                  |
| `pageStartAt`                                                                | _{left: number, weekday: number}_                            | `{left:0}`                          | Indicates what date to show in the top-left corner. If `left = value` provided, the `selectedDate` will appear at `value` days from the left. If `weekday = value` _(e.g. tuesday = 2)_ is provided, the latest tuesday will appear in the left.                                                                                                                                                                                                                                    |
| `allowScrollByOneDay`                                                        | _Boolean_                                                    | `false`                             | When `true`, the component can scroll horizontally one day at the time. When `false`, the horizontal scroll can only be done one page at the time (i.e. `numberOfDays` at the time).                                                                                                                                                                                                                                                                                                |
| `showTitle`                                                                  | _Boolean_                                                    | `true`                              | Show or hide the selected month and year in the top-left corner (a.k.a the title).                                                                                                                                                                                                                                                                                                                                                                                                  |
| `hoursInDisplay`                                                             | _Number_, in hours                                           | `6`                                 | Amount of hours to display vertically in the agenda. Increasing this number will make the events look smaller.                                                                                                                                                                                                                                                                                                                                                                      |
| `beginAgendaAt`                                                              | _Number_, in minutes                                         | `0` (0h)                            | Time of day to start the agenda at the top (grid above is left out). For example, for 8 am set `beginAgendaAt={8*60}`.                                                                                                                                                                                                                                                                                                                                                              |
| `endAgendaAt`                                                                | _Number_, in minutes                                         | `24 * 60` (24h)                     | Time of day to end the agenda at the bottom (grid below is left out). For example, for 10pm set `engAgendaAt={22*60}`.                                                                                                                                                                                                                                                                                                                                                              |
| `timeStep`                                                                   | _Number_, in minutes                                         | `60`                                | Number of minutes to use as step in the time labels at the left. Increasing this number will increase the vertical space between grid lines.                                                                                                                                                                                                                                                                                                                                        |
| `formatDateHeader`                                                           | _String_                                                     | `"MMM D"` (e.g. "Apr 3")            | Formatter for dates in the header. See [all formatters in momentjs](https://momentjs.com/docs/#/displaying/format/).                                                                                                                                                                                                                                                                                                                                                                |
| `formatTimeLabel`                                                            | _String_                                                     | `"H:mm"` (24 hours)                 | Formatter for the time labels at the left. Other examples, AM/PM: `"h:mm A"` or `"h:mm a"` for lowercase. See [all formatters in momentjs](https://momentjs.com/docs/#/displaying/format/).                                                                                                                                                                                                                                                                                         |
| `timesColumnWidth`                     | _Number_                                                     | `0.18` (18% of screen-width)        | Customize the width of the times column at the left. If the value is in range `0..1` indicates a percentage of the screen width (e.g. 0.18 --> 18%). Otherwise is the amount of pixels (e.g. 40 pixels).                                                                                                                                                                                                                                                                            |
| `EventComponent`                                                             | _ReactComponent_                                             | `Text`                              | Custom component rendered inside an event. By default, is a `Text` with the `event.description`. See [sub-section below](#custom-eventcomponent) for details on the component.                                                                                                                                                                                                                                                                                                      |
| `TodayHeaderComponent`                                                       | _ReactComponent_                                             | `null`                              | Custom component to highlight today in the header (by default, *today* looks the same than every day). See details in [sub-section below](#custom-day-components)                                                                                                                                                                                                                                                                                                                   |
| `DayHeaderComponent`                                                         | _ReactComponent_                                             | `null`                              | Custom component to show each day in the header. If provided, overrides `TodayHeaderComponent`. See details in [sub-section below](#custom-day-components)                                                                                                                                                                                                                                                                                                                          |
| `showNowLine`                                                                | _Boolean_                                                    | `false`                             | If `true`, displays a line indicating the time right now.                                                                                                                                                                                                                                                                                                                                                                                                                           |
| `nowLineColor`                                                               | _String_                                                     | `red (#E53935)`                     | Color used for the now-line.                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| `fixedHorizontally`                                                          | _Boolean_                                                    | `false`                             | If `true`, the component can be used to display a single fixed week. See example in [sub-section below](#fixed-week).                                                                                                                                                                                                                                                                                                                                                               |
| `isRefreshing`                                                               | _Boolean_                                                    | `false`                             | When `true`, the week-view will show an `<ActivityIndicator />` in the middle of the grid.                                                                                                                                                                                                                                                                                                                                                                                          |
| `RefreshComponent`                                                           | _ReactComponent_                                             | `ActivityIndicator`                 | Custom component used when `isRefreshing` is `true`. See [example below](#custom-refreshcomponent).                                                                                                                                                                                                                                                                                                                                                                                 |
| `locale`                                                                     | _String_                                                     | `"en"`                              | Locale for the dates (e.g. header). There's an `addLocale()` function to add customized locale, [see below](#locales-customization).                                                                                                                                                                                                                                                                                                                                                |
| `rightToLeft`                                                                | _Boolean_                                                    | `false`                             | If `true`, render older days to the right and more recent days to the left.                                                                                                                                                                                                                                                                                                                                                                                                         |
| **_Style <br> props_**                                                       |
| `headerStyle`                                                                | _Object_                                                     | -                                   | Custom styles for header container. Example: `{ backgroundColor: '#4286f4', color: '#fff', borderColor: '#fff' }`                                                                                                                                                                                                                                                                                                                                                                   |
| `headerTextStyle`                                                            | _Object_                                                     | -                                   | Custom styles for text inside header. Applied to day names and month name (i.e. title)                                                                                                                                                                                                                                                                                                                                                                                              |
| `hourTextStyle`                                                              | _Object_                                                     | -                                   | Custom styles for text displaying hours at the left.                                                                                                                                                                                                                                                                                                                                                                                                                                |
| `eventContainerStyle`                                                        | _Object_                                                     | -                                   | Custom styles for each event item container. Note: the background color and (absolute) positioning are already set.                                                                                                                                                                                                                                                                                                                                                                 |
| **_Grid lines <br> props_**                                                  |
| `gridRowStyle`                                                               | _Object_                                                     | `width: 1`, `color: grey (#E9EDF0)` | Prop to customize width and color of horizontal lines, provide: `{ borderTopWidth: <width>, borderColor: <color> }`                                                                                                                                                                                                                                                                                                                                                                 |
| `gridColumnStyle`                                                            | _Object_                                                     | same as above                       | Prop to customize width and color of vertical lines, provide: `{ borderLeftWidth: <width>, borderColor: <color> }`                                                                                                                                                                                                                                                                                                                                                                  |
| **_Horizontal list optimizations_** <br> (see [known issues](#known-issues)) |
| `windowSize`                                                                 | _Number_                                                     | 5                                   | Number of pages to render at the same time. One page is composed by `numberOfDays` days. See in [_optimizing FlatList docs_](https://reactnative.dev/docs/optimizing-flatlist-configuration#windowsize)                                                                                                                                                                                                                                                                             |
| `initialNumToRender`                                                         | _Number_                                                     | 5                                   | Initial number of pages to render. See in [_optimizing FlatList docs_](https://reactnative.dev/docs/optimizing-flatlist-configuration#maxtorenderperbatch)                                                                                                                                                                                                                                                                                                                          |
| `maxToRenderPerBatch`                                                        | _Number_                                                     | 2                                   | See in [_optimizing FlatList docs_](https://reactnative.dev/docs/optimizing-flatlist-configuration#maxtorenderperbatch).                                                                                                                                                                                                                                                                                                                                                            |
| `updateCellsBatchingPeriod`                                                  | _Number_                                                     | 50                                  | See in [_optimizing FlatList docs_](https://reactnative.dev/docs/optimizing-flatlist-configuration#updatecellsbatchingperiod)                                                                                                                                                                                                                                                                                                                                                       |
| **_Other props <br> (patch RN bugs)_**                                       |
| `prependMostRecent`                                                          | _Boolean_                                                    | `false`                             | If `true`, the horizontal prepending is done in the most recent dates when scrolling. See [known issues](#glitch-when-swiping-to-new-pages)                                                                                                                                                                                                                                                                                                                                         |

### Event Item
```js
{
  // Basic fields:
  id: 1,
  description: 'Event',
  startDate: new Date(2021, 3, 15, 12, 0),
  endDate: new Date(2021, 3, 15, 12, 30),
  color: 'blue',

  // Special fields for extra features, details below. e.g.:
  style: { borderColor: 'red' },

  // ... your custom fields if needed,
}
```

#### Special fields

There are some fields in the `EventItem` that provide extra customizations for each event.

| Extra `EventItem` fields | Type     | Default | Description                              |
| ------------------------ | -------- | ------- | ---------------------------------------- |
| `style`                  | `Object` | `null`  | Provide extra styling for the container. |
| `disableDrag`            | `bool`   | `false` | Disables drag-and-drop interaction.      |
| `disablePress`           | `bool`   | `false` | Disables onPress interaction.            |
| `disableLongPress`       | `bool`   | `false` | Disables onLongPress interaction.        |


### Methods

* **`goToDate(date, {animated = true, left: number = null})`**: navigate to a custom date. If `left = value` is provided, the target `date` will appear at `value` days from the left (e.g. use `left = 0` to show `date` at the most left).
* **`goToNextDay({animated = true})`**: navigate to the next day (to the future).
* **`goToPrevDay({animated = true})`**: navigate to the previous day (to the past).
* **`goToNextPage({animated = true})`**: navigate to the next page (to the future).
* **`goToPrevPage({animated = true})`**: navigate to the previous page (to the past).
* **`scrollToTime(minutes, options = { animated = false })`**: scroll vertically to a time in the day, provided in minutes. For example, scroll to 13:00 hrs: `ref.scrollToTime(13 * 60)`.

To save a reference to the component:
```js
<WeekView
  // class components:
  ref={(ref) => { this.weekViewRef = ref; }}
  // functional components:
  ref={weekViewRef} // with `const weekViewRef = React.useRef()`
/>
```

## Custom components

Further customize the week-view by providing your own components.

### Custom Event item component
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

### Custom Day header component
(Note: first you should check if the props `headerStyle`, `headerTextStyle` and/or `formatDateHeader` are enough for your use case).

Use these props to fully customize the days in the header.
* `TodayHeaderComponent`: to highlight today in the header, by rendering it differently from the other days.
* `DayHeaderComponent`: to render every day in the header. Overrides the prop `TodayHeaderComponent`.

Both components would receive these props:
* `date` _(moment Date)_ - moment date object containing today's date.
* `formattedDate` _(String)_ - day formatted according to `formatDateHeader`, e.g. `"Mon 3"`.
* `textStyle` _(Object)_ - text style used for every day.
* `isToday` _(Bool)_ - indicate if the `date` is today or not.

Examples:
```js
// Highlight today with a bold font
const MyTodayComponent = ({ formattedDate, textStyle }) => (
  <Text style={[textStyle, { fontWeight: 'bold' }]}>{formattedDate}</Text>
);

// Add text to the header
const MyDayComponent = ({ formattedDate, textStyle, isToday }) => (
  <Text style={textStyle}>Some text - {formattedDate}</Text>
);

<WeekView
  TodayHeaderComponent={MyTodayComponent}
  // or:
  DayHeaderComponent={MyDayComponent}
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


## Known issues

We try to make all user interactions and animations as smooth as possible, but we have seen issues in some cases.

#### Glitch when swiping to new pages

* When navigating to a new distant date (e.g. using `weekViewRef.goToDate(someDistantDate)`) there may be a delay on the animation
  * See [this issue](https://github.com/hoangnm/react-native-week-view/issues/54) for details
* Flicker issue when swiping to one side
  * See https://github.com/hoangnm/react-native-week-view/issues/39 for details
  * As a workaround, you can prioritize navigations to the past XOR to the future:
    * if `prependMostRecent={false}` (default) the swiping to the future will be smooth, but the swiping to the past pages may have glitches
    * if `prependMostRecent={true}`, the swiping to the past will be smooth, but swiping to the future may have glitches
* There may be blank spaces when swiping right or left
  * See https://github.com/hoangnm/react-native-week-view/issues/243 for details
  * You can workaround this by customizing the _horizontal list optimization_ props listed in the API
  * See RN docs about [optimizing FlatList props](https://reactnative.dev/docs/optimizing-flatlist-configuration)
  * Note: we have not fully tested these props


## Contributors

<a href="https://github.com/hoangnm/react-native-week-view/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=hoangnm/react-native-week-view" />
</a>

Made with [contrib.rocks](https://contrib.rocks).
