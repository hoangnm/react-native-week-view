# Developing


## Run `example/` app:


### Installation

```sh
# 1. Install dependencies
yarn install # For tests, lint, etc
cd example/
yarn install

# 2. Install from local
yarn install:local
# removes "file:../" (does not work with RN-metro)
```

### Running app in android
```sh
yarn android
yarn start
```


### Sync changes

When you make changes to the `react-native-week-view/` package, you need to manually sync the code with the `example/` app to see the changes.
After each change, run `yarn sync` and reload the app.


### Profile performance on android

See general guides here: https://reactnative.dev/docs/profiling#profiling-android-ui-performance-with-systrace

Run the following:
```sh
cd example
yarn android:release # Install release version (__DEV__ === false)

# Open the app in the emulator

# Run systrace with:
/path/to/android-sdk/platform-tools/systrace/systrace.py --time 10 -o ../traces/<some-filename>.html sched gfx view -a com.example

# Interact with the app for 10 seconds, then check trace.html in Google Chrome
```

Known issues:

* UI thread info is detailed, but JS thread info may not be complete, see here: https://github.com/facebook/react-native/issues/26032
