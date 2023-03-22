---
sidebar_label: Miscellaneous
sidebar_position: 100
description: Other functions
---

# Miscellaneous functions


## addLocale()

Internally calls `moment.locale(...params)`. Example:

```js
import { addLocale } from 'react-native-week-view'

addLocale('fr', {
  months: 'janvier_février_mars_avril_mai_juin_juillet_août_septembre_octobre_novembre_décembre'.split('_'),
  monthsShort: 'janv._févr._mars_avr._mai_juin_juil._août_sept._oct._nov._déc.'.split('_'),
  weekdays: 'dimanche_lundi_mardi_mercredi_jeudi_vendredi_samedi'.split('_'),
  weekdaysShort: 'dim._lun._mar._mer._jeu._ven._sam.'.split('_'),
});
```

## createFixedWeekDate()

```js
import { createFixedWeekDate } from 'react-native-week-view'

const dateThisWeek = createFixedWeekDate(day, hour, minutes=0, seconds=0);
```

Parameters:

* `day`: _(number|string)_ - specify day of the week as number (1 is monday, 2 is tuesday, etc) or as string (will be parsed with the current locale, e.g. `"Monday"`, `"Tuesday"`, etc. for english).
* `hour`: _(number)_ - specify hour of the day as number (from 0 to 23)
* `minutes`: _(number)_ - specify minutes of the day as number (from 0 to 59), defaults to 0
* `seconds`: _(number)_ - specify seconds of the day as number (from 0 to 59), defaults to 0
