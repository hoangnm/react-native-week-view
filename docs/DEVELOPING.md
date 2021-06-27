# Developing


## Run `example/` app:


### Installation

```sh
# 1. Install dependencies:
cd example/
yarn install

# 2. Install from local
yarn install:local # removes symlink folder, which does not work with the react-native metro-bundler
yarn sync # copies using rsync
```

### Running app in android
```sh
yarn android
yarn start
```


### Sync changes

When you make changes to the `react-native-week-view/` package, you need to manually sync the code with the `example/` app to see the changes.
After each change, run `yarn sync` and reload the app.
