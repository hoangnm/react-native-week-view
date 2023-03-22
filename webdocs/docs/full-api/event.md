---
sidebar_position: 3
sidebar_label: EventItem
description: Events provided
---

# `EventItem`

An event looks like this:

```js title="Example Event"
const myEvent = {
 // Basic fields:
 id: 1,
 description: 'Event',
 startDate: new Date(2021, 3, 15, 12, 0),
 endDate: new Date(2021, 3, 15, 12, 30),
 color: 'blue',

 // Special fields for extra features, e.g.:
 style: { borderColor: 'red' },
 eventKind: 'block',

 // ... your custom fields if needed
}
```

You can use any custom field you may need, as long as the key does not collide with a basic or special field.


## Basic fields

| Key | Type | Default | Description |
| --- | --- | --- | --- |
| `id` | `number` \| `string` | required | Unique identifier. |
| `startDate` | `Date` | required | Event start date. |
| `endDate` | `Date` | required | Event end date. |
| `description` | `string` | `""` | Event description. |
| `color` | `string` | `red` | Box color. |


## Special fields

There are some fields in the `EventItem` that provide extra customizations for each event.

* Styles
* Disable user interactions (e.g. drag, press)
* Overlap handling (details in the [overlaps guide](../guides/overlap))
* Block-like events (details in the [block-events guide](../guides/block-events))


| Key | Type | Default | Description |
| --- | --- | --- | --- |
| `style` | `Object` | `null` | Extra style passed to the container |
| **_Interactions_** |
| `disableDrag` | `bool` | `false` | Disables drag-and-drop |
| `disablePress` | `bool` | `false` | Disables onPress |
| `disableLongPress` | `bool` | `false` | Disables onLongPress |
| **_Overlap handling_** |
| `resolveOverlap` | `lane` \| `stack` \| `ignore` | `lane` | Choose overlap method for that event |
| `stackKey` | _String_ | `null` | Determine events it can be stacked with. If is `null`, it can be stacked with any other event. Only useful if `resolveOverlap: stack` |
| **_Block events_** |
| `eventKind` | `block` \| `standard` | `standard` | Defines the type of event |

