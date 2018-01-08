import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  View,
  ScrollView,
  Dimensions,
} from 'react-native';
import moment from 'moment';
import WeekView from '../WeekView/WeekView';
import Header from '../Header/Header';
import styles from './Swipeable.styles';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default class Swipeable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentMoment: props.selectedDate,
    };
  }

  componentDidMount() {
    this._calendar.scrollTo({ y: 0, x: 2 * SCREEN_WIDTH, animated: false });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.selectedDate) {
      this.setState({ currentMoment: nextProps.selectedDate });
    }
  }

  componentDidUpdate() {
    this._calendar.scrollTo({ y: 0, x: 2 * SCREEN_WIDTH, animated: false });
  }

  scrollEnded = (event) => {
    const position = event.nativeEvent.contentOffset.x;
    const currentPage = position / SCREEN_WIDTH;
    const { onSwipePrev, onSwipeNext } = this.props;
    setTimeout(() => {
      const newMoment = moment(this.state.currentMoment)
        .add((currentPage - 2) * this.props.numberOfDays, 'd')
        .toDate();

      this.setState({ currentMoment: newMoment });

      if (currentPage < 2) {
        onSwipePrev && onSwipePrev(newMoment);
      } else if (currentPage > 2) {
        onSwipeNext && onSwipeNext(newMoment);
      }
    }, 100);
  };

  render() {
    const { numberOfDays, headerStyle } = this.props;
    const { currentMoment } = this.state;
    const dates = [];
    for (let i = -2; i < 3; i += 1) {
      const date = moment(currentMoment).add(numberOfDays * i, 'd');
      dates.push(date);
    }
    return (
      <View style={styles.container} onLayout={this.onContainerLayout}>
        <View style={styles.header}>
          <Header style={headerStyle} selectedDate={currentMoment} numberOfDays={numberOfDays} />
        </View>
        <ScrollView
          ref={ref => this._calendar = ref}
          horizontal
          scrollEnabled={numberOfDays > 1}
          pagingEnabled
          removeClippedSubviews={this.props.removeClippedSubviews}
          scrollEventThrottle={1000}
          showsHorizontalScrollIndicator={false}
          automaticallyAdjustContentInsets={false}
          onMomentumScrollEnd={event => this.scrollEnded(event)}
        >
          {dates.map((date) => {
            return (<WeekView
              key={date}
              style={{ width: SCREEN_WIDTH }}
              selectedDate={date.toDate()}
              numberOfDays={numberOfDays}
              onEventPress={this.props.onEventPress}
              events={this.props.events}
            />);
          })}
        </ScrollView>
      </View>
    );
  }
}

Swipeable.propTypes = {
  onSwipeNext: PropTypes.func,
  onSwipePrev: PropTypes.func,
};
