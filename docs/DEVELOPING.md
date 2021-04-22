# Developing


## Run `example/` app:


### Installation

```sh
# 1. Install dependencies:
cd example/
npm install

# 2. Install from local
npm run sync:rm # removes symlink folder, which does not work with the react-native metro-bundler
npm run sync # copies using rsync
```

### Running app
```sh
npm run android
npm run start
```


#### Syncing changes

When you make changes to the `react-native-week-view/` package, you need to manually sync the code with the `example/` app to see the changes.
After each change, run `npm run sync` and reload the app.



## Tests and linter

Run tests and linter in both folders (`react-native-week-view/` and `example/`):

* `npm run lint`
* `npm run test`
