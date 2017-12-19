/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';
import WeekView from 'react-native-week-view';

export default class App extends Component<{}> {
  render() {
    return (
      <View style={styles.container}>
        <WeekView />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    paddingTop: 22,
  },
});
