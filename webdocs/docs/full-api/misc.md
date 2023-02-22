---
sidebar_label: Miscellaneous
sidebar_position: 100
description: Other functions
---

# Miscellaneous functions


## createFixedWeekDate()

Signature: `createFixedWeekDate(day, hour, minutes=0, seconds=0)`

* `day`: _(number|string)_ - specify day of the week as number (1 is monday, 2 is tuesday, etc) or as string (will be parsed with the current locale, e.g. `"Monday"`, `"Tuesday"`, etc. for english).
* `hour`: _(number)_ - specify hour of the day as number (from 0 to 23)
* `minutes`: _(number)_ - specify minutes of the day as number (from 0 to 59), defaults to 0
* `seconds`: _(number)_ - specify seconds of the day as number (from 0 to 59), defaults to 0
