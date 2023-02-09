---
sidebar_position: 2
sidebar_label: Event
---

# `Event`

## Basic fields

```js
const myEvent = {
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

## Special fields

There are some fields in the `EventItem` that provide extra customizations for each event.
* Style per event
* Disable user interactions (e.g. drag, press)
* Event overlap handling [see more details](docs/overlaps.md).
* [Block-like events](docs/common-usages.md#block-like-events)

| Extra `EventItem` fields | Type                                | Default  | Description                                                                                                                             |
| ------------------------ | ----------------------------------- | -------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| `style`                  | `Object`                            | `null`   | Provide extra styling for the container.                                                                                                |
| `disableDrag`            | `bool`                              | `false`  | Disables drag-and-drop interaction.                                                                                                     |
| `disablePress`           | `bool`                              | `false`  | Disables onPress interaction.                                                                                                           |
| `disableLongPress`       | `bool`                              | `false`  | Disables onLongPress interaction.                                                                                                       |
| **_Block-like events_**  |
| `eventKind`              | `'block'` \| `'standard'`           | `'standard'` | Defines the type of event                                                                                                           |
| **_Event overlaps_**     |
| `resolveOverlap`         | `'lane'` \| `'stack'` \| `'ignore'` | `'lane'` | Defines the method to resolve overlaps for that event.                                                                                  |
| `stackKey`               | _String_                            | `null`   | Limit the events it can be stacked with. If is `null`, it can be stacked with any other event. Only useful if `resolveMethod = 'stack'` |
