import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  View,
  ScrollView,
} from 'react-native';
import moment from 'moment';
import memoizeOne from 'memoize-one';

import Event from '../Event/Event';
import Events from '../Events/Events';
import Header from '../Header/Header';
import Title from '../Title/Title';
import Times from '../Times/Times';
import styles from './FixedWeekView.styles';
import {
  CONTAINER_HEIGHT,
  DATE_STR_FORMAT,
  availableNumberOfDays,
  setLocale,
  getTimesArray,
  bucketEventsByDate,
  getCurrentMonth,
} from '../utils';

export default class FixedWeekView extends Component {
  constructor(props) {
    super(props);
    this.verticalAgenda = null;

    setLocale(props.locale);
  }

  componentDidMount() {
    requestAnimationFrame(() => {
      this.scrollToVerticalStart();
    });
  }

  componentDidUpdate(prevprops) {
    if (this.props.locale !== prevprops.locale) {
      setLocale(this.props.locale);
    }
  }

  calculateTimes = memoizeOne(getTimesArray);

  scrollToVerticalStart = () => {
    if (this.verticalAgenda) {
      const { startHour, hoursInDisplay } = this.props;
      const startHeight = (startHour * CONTAINER_HEIGHT) / hoursInDisplay;
      this.verticalAgenda.scrollTo({ y: startHeight, x: 0, animated: false });
    }
  };

  verticalAgendaRef = (ref) => {
    this.verticalAgenda = ref;
  };

  sortEventsByDate = memoizeOne(bucketEventsByDate);

  render() {
    const {
      events,
      formatDateHeader,
      numberOfDays,
      onEventPress,
      onGridClick,
      headerStyle,
      headerTextStyle,
      hourTextStyle,
      eventContainerStyle,
      hoursInDisplay,
      EventComponent,
      showTitle,
      rightToLeft,
      title,
    } = this.props;
    const times = this.calculateTimes(hoursInDisplay);
    const eventsByDate = this.sortEventsByDate(events);
    const thisMonday = moment().startOf('isoWeek').format(DATE_STR_FORMAT);

    return (
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Title
            showTitle={showTitle}
            style={headerStyle}
            textStyle={headerTextStyle}
            numberOfDays={numberOfDays}
            text={title || getCurrentMonth(new Date())}
          />
          <View style={styles.header}>
            <Header
              style={headerStyle}
              textStyle={headerTextStyle}
              formatDate={formatDateHeader}
              initialDate={thisMonday}
              numberOfDays={numberOfDays}
              rightToLeft={rightToLeft}
            />
          </View>
        </View>
        <ScrollView ref={this.verticalAgendaRef}>
          <View style={styles.scrollViewContent}>
            <Times times={times} textStyle={hourTextStyle} />
            <Events
              times={times}
              eventsByDate={eventsByDate}
              initialDate={thisMonday}
              numberOfDays={numberOfDays}
              onEventPress={onEventPress}
              onGridClick={onGridClick}
              hoursInDisplay={hoursInDisplay}
              EventComponent={EventComponent}
              eventContainerStyle={eventContainerStyle}
              rightToLeft={rightToLeft}
            />
          </View>
        </ScrollView>
      </View>
    );
  }
}

FixedWeekView.propTypes = {
  events: PropTypes.arrayOf(Event.propTypes.event),
  formatDateHeader: PropTypes.string,
  numberOfDays: PropTypes.oneOf(availableNumberOfDays),
  onEventPress: PropTypes.func,
  onGridClick: PropTypes.func,
  headerStyle: PropTypes.object,
  headerTextStyle: PropTypes.object,
  hourTextStyle: PropTypes.object,
  eventContainerStyle: PropTypes.object,
  locale: PropTypes.string,
  hoursInDisplay: PropTypes.number,
  startHour: PropTypes.number,
  EventComponent: PropTypes.elementType,
  showTitle: PropTypes.bool,
  rightToLeft: PropTypes.bool,
  title: PropTypes.string,
};

FixedWeekView.defaultProps = {
  events: [],
  locale: 'en',
  numberOfDays: 7,
  hoursInDisplay: 6,
  startHour: 0,
  formatDateHeader: 'ddd',
  showTitle: false,
  rightToLeft: false,
};
