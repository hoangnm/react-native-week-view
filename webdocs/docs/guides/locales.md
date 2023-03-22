---
sidebar_position: 100
sidebar_label: Localization
description: Customize to any language
---

# Locales customization

Use the [`addLocale`](../full-api/misc#addlocale) function to add customized locale for the component. The component depends on `momentjs`, you can refer to https://momentjs.com/docs/#/customization/ for more information.

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