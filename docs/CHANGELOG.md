# Changelog

## Unreleased
### Added
* "Now line" is displayed
* `fixedHorizontally` prop and `createFixedWeekDate()` function, to support fixed-week behavior



## 0.3.0 - 2021-02-13
### Changed
* Breaking change: do not use `color` from the `headerStyle` prop [#65](https://github.com/hoangnm/react-native-week-view/pull/65)

### Fixed
* Optimize horizontal space for 3+ overlapped events [#61](https://github.com/hoangnm/react-native-week-view/pull/61)



## 0.2.0 - 2021-01-22
### Changed
* Breaking change: use `WeekView.goToDate()` method to navigate to a date [#56](https://github.com/hoangnm/react-native-week-view/pull/56)

### Fixed
* Iso weekday issue [#57](https://github.com/hoangnm/react-native-week-view/pull/57)




## 0.1.1 - 2020-10-30
### Fixed
* Allow events to overlap by 2 seconds [#53](https://github.com/hoangnm/react-native-week-view/pull/53)




## 0.1.0 - 2020-10-30
### Added
* Add RTL support (`rightToLeft` prop) and `prependMostRecent` prop [#52](https://github.com/hoangnm/react-native-week-view/pull/52)

### Fixed
* Load events with infinite horizontal scrolling [#51](https://github.com/hoangnm/react-native-week-view/pull/51)




## [0.0.19] - 2020-09-27
### Added
* `date` argument to `onGridClick` callback [#48](https://github.com/hoangnm/react-native-week-view/pull/48)

### Changed
* Use props to give styles: `hourTextStyle`, `headerTextStyle`, eventContainerStyle` [#48](https://github.com/hoangnm/react-native-week-view/pull/48)



## [0.0.18] - 2020-09-21
### Added
* `showTitle` prop [#42](https://github.com/hoangnm/react-native-week-view/pull/42)



## [0.0.17] - 2020-09-05
### Added
* `EventComponent` prop [#50](https://github.com/hoangnm/react-native-week-view/pull/50)

### Fixed
* Hide scroll indicator on header



## [0.0.16] - 2020-08-02
### Added
* `onGridClick` prop [#37](https://github.com/hoangnm/react-native-week-view/pull/37)


## [0.0.15] - 2020-07-25
### Fixed
* More than 2 events overlapping issue [#28](https://github.com/hoangnm/react-native-week-view/pull/28)



[0.0.19]: https://github.com/hoangnm/react-native-week-view/releases/tag/v0.0.19
[0.0.18]: https://github.com/hoangnm/react-native-week-view/releases/tag/v0.0.18
[0.0.17]: https://github.com/hoangnm/react-native-week-view/releases/tag/v0.0.17
[0.0.16]: https://github.com/hoangnm/react-native-week-view/releases/tag/v0.0.16
[0.0.15]: https://github.com/hoangnm/react-native-week-view/releases/tag/v0.0.15
