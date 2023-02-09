---
sidebar_label: Troubleshoot
sidebar_position: 100
---

# Troubleshoot


## Support

Found a bug? Need a new feature?
Contact us by opening [an issue](https://github.com/hoangnm/react-native-week-view/issues), opening a [discussion](https://github.com/hoangnm/react-native-week-view/discussions), or [sending a PR](https://github.com/hoangnm/react-native-week-view/pull)!

We are actively developing, and always happy to hear new use cases and ideas.



## Known issues

We try to make all user interactions and animations as smooth as possible, but we have seen issues in some cases.

### Glitch when swiping to new pages

* When navigating to a new distant date (e.g. using `weekViewRef.goToDate(someDistantDate)`) there may be a delay on the animation
  * Details in [this issue](https://github.com/hoangnm/react-native-week-view/issues/54)
* Flicker issue when swiping to one side
  * Details in [this issue](https://github.com/hoangnm/react-native-week-view/issues/39)
  * As a workaround, you can prioritize navigations to the past XOR to the future:
    * if `prependMostRecent={false}` (default) the swiping to the future will be smooth, but the swiping to the past pages may have glitches
    * if `prependMostRecent={true}`, the swiping to the past will be smooth, but swiping to the future may have glitches
* There may be blank spaces when swiping right or left
  * Details in [this issue](https://github.com/hoangnm/react-native-week-view/issues/243)
  * You can workaround this by customizing the _horizontal list optimization_ props listed in the API
  * See RN docs about [optimizing FlatList props](https://reactnative.dev/docs/optimizing-flatlist-configuration)
  * Note: we have not fully tested these props
