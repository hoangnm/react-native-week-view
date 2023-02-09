---
sidebar_position: 2
sidebar_label: Custom Components
---

# Customize components

Further customize the week-view by providing your own components.


## `EventComponent`

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

## Custom Day header component

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


## Custom RefreshComponent

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
