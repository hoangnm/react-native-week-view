/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @format
 */

import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Alert,
} from 'react-native';
import WeekView, { addLocale } from 'react-native-week-view';

addLocale('fr', {
  months: 'janvier_février_mars_avril_mai_juin_juillet_août_septembre_octobre_novembre_décembre'.split('_'),
  monthsShort: 'janv._févr._mars_avr._mai_juin_juil._août_sept._oct._nov._déc.'.split('_'),
  weekdays: 'dimanche_lundi_mardi_mercredi_jeudi_vendredi_samedi'.split('_'),
  weekdaysShort: 'dim._lun._mar._mer._jeu._ven._sam.'.split('_'),
});

export default class App extends Component {
  selectedDate = new Date();

  generateDates = (hours, minutes) => {
    const date = new Date();
    date.setHours(date.getHours() + hours);
    if (minutes !== null) {
      date.setMinutes(minutes);
    }
    return date;
  };

  render() {
    const events = [
      {
        id: 1,
        description: 'Event 1',
        startDate: this.generateDates(0),
        endDate: this.generateDates(2),
        color: 'blue',
      },
      {
        id: 2,
        description: 'Event 2',
        startDate: this.generateDates(1),
        endDate: this.generateDates(4),
        color: 'red',
      },
      {
        id: 3,
        description: 'Event 3',
        startDate: this.generateDates(-5),
        endDate: this.generateDates(-3),
        color: 'green',
      },
    ];

    return (
      <View style={styles.container}>
        <WeekView
          events={events}
          selectedDate={this.selectedDate}
          numberOfDays={3}
          onEventPress={(event) => Alert.alert('eventId:' + event.id)}
          headerStyle={styles.headerStyle}
          formatDateHeader="MMM D"
          locale="fr"
        />
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
  headerStyle: {
    backgroundColor: '#4286f4',
  },
});
