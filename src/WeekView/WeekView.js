import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  View,
  ScrollView,
  Dimensions,
  Text,
} from 'react-native';
import moment from 'moment';
import { setLocale } from '../utils';
import Events from '../Events/Events';
import Header from '../Header/Header';
import styles from './WeekView.styles';
import { TIME_LABELS_IN_DISPLAY, TIME_LABEL_HEIGHT, CONTAINER_HEIGHT } from '../utils';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const MINUTES_IN_DAY = 60*24;

export default class WeekView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentMoment: props.selectedDate,
    };
    this.eventsGrid = null;
    this.verticalAgenda = null;
    setLocale(props.locale);
    this.times = this.generateTimes();
  }

  componentDidMount() {
    requestAnimationFrame(() => {
      this.eventsGrid.scrollTo({ y: 0, x: 2 * (SCREEN_WIDTH - 60), animated: false });
      this.scrollToAgendaStart();
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.selectedDate) {
      this.setState({ currentMoment: nextProps.selectedDate });
    }
    if (nextProps.locale !== this.props.locale) {
      setLocale(nextProps.locale);
    }
  }

  componentDidUpdate() {
    this.eventsGrid.scrollTo({ y: 0, x: 2 * (SCREEN_WIDTH - 60), animated: false });
  }

  scrollToAgendaStart = () => {
    if (this.verticalAgenda) {
      const { startHour, hoursInDisplay } = this.props;
      const startHeight = startHour * CONTAINER_HEIGHT / hoursInDisplay;
      this.verticalAgenda.scrollTo({ y: startHeight, x: 0, animated: false });
    }
  }

  generateTimes = () => {
    const { hoursInDisplay } = this.props;
    const times = [];
    const timeLabelsPerHour = TIME_LABELS_IN_DISPLAY / hoursInDisplay;
    const minutesStep = 60 / timeLabelsPerHour;
    for (let timer = 0; timer < MINUTES_IN_DAY; timer += minutesStep) {
      let minutes = timer % 60;
      if (minutes < 10) minutes = `0${minutes}`;
      const hour = Math.floor(timer / 60);
      const timeString = `${hour}:${minutes}`;
      times.push(timeString);
    }
    return times;
  };

  scrollEnded = (event) => {
    const { nativeEvent: { contentOffset, contentSize } } = event;
    const { x: position } = contentOffset;
    const { width: innerWidth } = contentSize;
    const newPage = (position / innerWidth) * 5;
    const { onSwipePrev, onSwipeNext, numberOfDays } = this.props;
    const { currentMoment } = this.state;
    requestAnimationFrame(() => {
      const newMoment = moment(currentMoment)
        .add((newPage - 2) * numberOfDays, 'd')
        .toDate();

      this.setState({ currentMoment: newMoment });

      if (newPage < 2) {
        onSwipePrev && onSwipePrev(newMoment);
      } else if (newPage > 2) {
        onSwipeNext && onSwipeNext(newMoment);
      }
    });
  };

  eventsGridRef = (ref) => {
    this.eventsGrid = ref;
  }

  verticalAgendaRef = (ref) => {
    this.verticalAgenda = ref;
  }

  prepareDates = (currentMoment, numberOfDays) => {
    const dates = [];
    for (let i = -2; i < 3; i += 1) {
      const date = moment(currentMoment).add(numberOfDays * i, 'd');
      dates.push(date);
    }
    return dates;
  };

  render() {
    const {
      numberOfDays,
      headerStyle,
      headerTextColor,
      formatDateHeader,
      onEventPress,
      events,
      hoursInDisplay,
    } = this.props;
    const { currentMoment } = this.state;
    const dates = this.prepareDates(currentMoment, numberOfDays);
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Header
            style={headerStyle}
            textColor={headerTextColor}
            formatDate={formatDateHeader}
            selectedDate={currentMoment}
            numberOfDays={numberOfDays}
          />
        </View>
        <ScrollView
          ref={this.verticalAgendaRef}
        >
          <View style={styles.scrollViewContent}>
            <View style={styles.timeColumn}>
              {this.times.map(time => (
                <View
                  key={time}
                  style={[styles.timeLabel, { height: TIME_LABEL_HEIGHT }]}
                >
                  <Text style={styles.timeText}>{time}</Text>
                </View>
              ))}
            </View>
            <ScrollView
              horizontal
              pagingEnabled
              automaticallyAdjustContentInsets={false}
              onMomentumScrollEnd={this.scrollEnded}
              ref={this.eventsGridRef}
            >
              {dates.map(date => (
                <View
                  key={date}
                  style={{ flex: 1, width: SCREEN_WIDTH - 60 }}
                >
                  <Events
                    key={dates}
                    times={this.times}
                    selectedDate={date.toDate()}
                    numberOfDays={numberOfDays}
                    onEventPress={onEventPress}
                    events={events}
                    hoursInDisplay={hoursInDisplay}
                  />
                </View>
              ))}
            </ScrollView>
          </View>
        </ScrollView>
      </View>
    );
  }
}

WeekView.propTypes = {
  events: Events.propTypes.events,
  numberOfDays: PropTypes.oneOf([1, 3, 7]).isRequired,
  onSwipeNext: PropTypes.func,
  onSwipePrev: PropTypes.func,
  formatDateHeader: PropTypes.string,
  onEventPress: PropTypes.func,
  headerStyle: PropTypes.object,
  headerTextColor: PropTypes.string,
  selectedDate: PropTypes.instanceOf(Date).isRequired,
  locale: PropTypes.string,
  hoursInDisplay: PropTypes.number,
  startHour: PropTypes.number,
};

WeekView.defaultProps = {
  events: [],
  locale: 'en',
  hoursInDisplay: 6,
  startHour: 0,
};
