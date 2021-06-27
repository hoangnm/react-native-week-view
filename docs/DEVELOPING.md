# Developing


## Run `example/` app:

Use `yarn`, not `npm`

```sh
# 1. Install dependencies:
cd example/
yarn

# 2. Run app on android
yarn android
yarn start

# 3. Sync changes
# After making changes to `react-native-week-view/` code,
# you need to manually sync the code and reload the app to see the changes
yarn sync
```


## Tests and linter

Run tests and linter in both folders (`react-native-week-view/` and `example/`):

* `yarn lint`
* `yarn test`
