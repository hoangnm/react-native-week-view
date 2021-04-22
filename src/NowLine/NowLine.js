import React from 'react';
import { Text, View, Animated } from 'react-native';
import PropTypes from 'prop-types';

import {
  minutesToYDimension,
  CONTENT_OFFSET,
} from '../utils';
import styles from './NowLine.styles';

const UPDATE_EVERY_MILLISECONDS = 60 * 1000; // 1 minute

const getCurrentTop = (hoursInDisplay) => {
  const now = new Date();
  const minutes = now.getHours() * 60 + now.getMinutes();
  return minutesToYDimension(hoursInDisplay, minutes) + CONTENT_OFFSET;
};

class NowLine extends React.Component {
  constructor(props) {
    super(props);

    this.initialTop = getCurrentTop(this.props.hoursInDisplay);

    this.state = {
      currentTranslateY: new Animated.Value(0),
    }

    this.intervalCallbackId = null;
  }

  componentDidMount() {
    this.intervalCallbackId = setInterval(() => {
      const newTop = getCurrentTop(this.props.hoursInDisplay);
      Animated.timing(this.state.currentTranslateY, {
        toValue: newTop - this.initialTop,
        duration: 1000,
        useNativeDriver: true,
        isInteraction: false,
      }).start();
    }, UPDATE_EVERY_MILLISECONDS);
  }

  componentWillUnmount() {
    if (this.intervalCallbackId) {
      clearInterval(this.intervalCallbackId);
    }
  }

  render() {
    const { color, width } = this.props;

    return (
      <Animated.View
        style={[
          styles.container,
          {
            top: this.initialTop,
            transform: [{ translateY: this.state.currentTranslateY }],
            borderColor: color,
            width,
          },
        ]}
      >
        <View
          style={[
            styles.circle,
            {
              backgroundColor: color,
            },
        ]}/>
      </Animated.View>
    );
  }
}

NowLine.propTypes = {
  width: PropTypes.number.isRequired,
  hoursInDisplay: PropTypes.number.isRequired,
  color: PropTypes.string,
};

NowLine.defaultProps = {
  color: '#e53935',
};

export default React.memo(NowLine);
