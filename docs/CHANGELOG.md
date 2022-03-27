# Changelog
## 0.10.0 - 2022-03-27
- Add onDayPress and onMonthPress props [#176](https://github.com/hoangnm/react-native-week-view/pull/176)
- Add support for React 17 [#173](https://github.com/hoangnm/react-native-week-view/pull/173)
## 0.9.0 - 2022-01-18
- Add gridRowStyle and gridColumnStyle props [#158](https://github.com/hoangnm/react-native-week-view/pull/158)
## 0.8.1 - 2021-12-30
- Fix dragging event issue [#152](https://github.com/hoangnm/react-native-week-view/pull/152)
## 0.8.0 - 2021-11-29
- Add precision up to seconds in onGrid callbacks [#149](https://github.com/hoangnm/react-native-week-view/pull/149)

## 0.7.0 - 2021-11-11
- Add isRefreshing and RefreshComponent props [#112](https://github.com/hoangnm/react-native-week-view/pull/112)
- Fix events break when changing hoursInDisplay [#133](https://github.com/hoangnm/react-native-week-view/pull/133)
- Allow to drag-drop event [#143](https://github.com/hoangnm/react-native-week-view/pull/143) 
- Support react-native above v0.59.0 only
## 0.6.1 - 2021-08-22

### Fixed
- Fix wrong display when updating `numberOfDays` prop [#126](https://github.com/hoangnm/react-native-week-view/pull/126)

## 0.6.0 - 2021-08-05

### Changed
- Add `fixedHorizontally` prop to display a fixed week [#75](https://github.com/hoangnm/react-native-week-view/pull/75)
- Add `formatTimeLabel` prop [#103](https://github.com/hoangnm/react-native-week-view/pull/103)
- Add `weekStartsOn` prop [#120](https://github.com/hoangnm/react-native-week-view/pull/120)
- Add `TodayHeaderComponent` prop [#113](https://github.com/hoangnm/react-native-week-view/pull/113)

### Fixed
- Fix scroll called twice [#117](https://github.com/hoangnm/react-native-week-view/pull/117)

## 0.5.0 - 2021-05-16

### Changed

- Add `timeStep` prop to control the height of time slot better [#98](https://github.com/hoangnm/react-native-week-view/pull/98)
- Add `goToNextPage` and `goToPrevPage` method to allow moving to the next/prev page outside of the widget [#99](https://github.com/hoangnm/react-native-week-view/pull/99)

### Fixed

- Fix goToDate moving off-by-one when the numberOfDays is 1 [#97](https://github.com/hoangnm/react-native-week-view/pull/97)

## 0.4.0 - 2021-04-23

### Changed

- Add two props `showNowLine` and `nowLineColor` to support showing the current date [#78](https://github.com/hoangnm/react-native-week-view/pull/78)

### Fixed

- The wrong selected date from onGridClick event [#77](https://github.com/hoangnm/react-native-week-view/pull/77)

## 0.3.0 - 2021-02-13

### Changed

- Breaking change: do not use `color` from the `headerStyle` prop [#65](https://github.com/hoangnm/react-native-week-view/pull/65)

### Fixed

- Optimize horizontal space for 3+ overlapped events [#61](https://github.com/hoangnm/react-native-week-view/pull/61)

## 0.2.0 - 2021-01-22

### Changed

- Breaking change: use `WeekView.goToDate()` method to navigate to a date [#56](https://github.com/hoangnm/react-native-week-view/pull/56)

### Fixed

- Iso weekday issue [#57](https://github.com/hoangnm/react-native-week-view/pull/57)

## 0.1.1 - 2020-10-30

### Fixed

- Allow events to overlap by 2 seconds [#53](https://github.com/hoangnm/react-native-week-view/pull/53)

## 0.1.0 - 2020-10-30

### Added

- Add RTL support (`rightToLeft` prop) and `prependMostRecent` prop [#52](https://github.com/hoangnm/react-native-week-view/pull/52)

### Fixed

- Load events with infinite horizontal scrolling [#51](https://github.com/hoangnm/react-native-week-view/pull/51)

## [0.0.19] - 2020-09-27

### Added

- `date` argument to `onGridClick` callback [#48](https://github.com/hoangnm/react-native-week-view/pull/48)

### Changed

- Use props to give styles: `hourTextStyle`, `headerTextStyle`, eventContainerStyle` [#48](https://github.com/hoangnm/react-native-week-view/pull/48)

## [0.0.18] - 2020-09-21

### Added

- `showTitle` prop [#42](https://github.com/hoangnm/react-native-week-view/pull/42)

## [0.0.17] - 2020-09-05

### Added

- `EventComponent` prop [#50](https://github.com/hoangnm/react-native-week-view/pull/50)

### Fixed

- Hide scroll indicator on header

## [0.0.16] - 2020-08-02

### Added

- `onGridClick` prop [#37](https://github.com/hoangnm/react-native-week-view/pull/37)

## [0.0.15] - 2020-07-25

### Fixed

- More than 2 events overlapping issue [#28](https://github.com/hoangnm/react-native-week-view/pull/28)

[0.0.19]: https://github.com/hoangnm/react-native-week-view/releases/tag/v0.0.19
[0.0.18]: https://github.com/hoangnm/react-native-week-view/releases/tag/v0.0.18
[0.0.17]: https://github.com/hoangnm/react-native-week-view/releases/tag/v0.0.17
[0.0.16]: https://github.com/hoangnm/react-native-week-view/releases/tag/v0.0.16
[0.0.15]: https://github.com/hoangnm/react-native-week-view/releases/tag/v0.0.15
