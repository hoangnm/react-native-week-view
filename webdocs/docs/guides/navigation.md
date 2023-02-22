---
sidebar_label: Scrolling and navigating
sidebar_position: 90
---

# Pages navigation

With the week-view component you can naturally navigate by scrolling through dates (horizontally) and scrolling through hours of the day (vertically). This guide describes further ways to navigate.


## Navigate programatically

You can use several methods to navigate to a date or time programatically. First save a ref to the component: `<WeekView ref={weekViewRef} />` and then use these methods:

* **`scrollToTime(minutesInDay)`**: scroll vertically to a time in the day
* **`goToDate(date)`**: scroll horizontally to a custom date
* **`goToNextPage()`**: navigate to the next page (to the future)
* **`goToPrevPage()`**: navigate to the previous page (to the past)
* **`goToNextDay()`**: navigate to the next day (to the future). Requires `allowScrollByDay={true}` to work properly.
* **`goToPrevDay()`**: navigate to the previous day (to the past). Requires `allowScrollByDay={true}` to work properly.

See more details about the methods [here](../full-api/week-view#methods).


## Scroll one day at the time

Provide the prop `allowScrollByDay={true}` to allow scrolling horizontally by one day. If `false` (the default), the scrolling goes one page at the time.


| Scroll by page (default) | Scroll by day |
| :---: | :---: |
| `allowScrollByDay={false}` | `allowScrollByDay={true}` |
| ![scroll-by-page](./img/scrolling/scroll-one-page.gif) | ![scroll-by-day](./img/scrolling/scroll-one-day.gif) |
