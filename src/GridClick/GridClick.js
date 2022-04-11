import React from 'react';
import { View, Animated } from 'react-native';
import PropTypes from 'prop-types';

import { minutesToYDimension, CONTENT_OFFSET } from '../utils';
import styles from './GridClick.styles';

const UPDATE_EVERY_MILLISECONDS = 60 * 1000; // 1 minute

const getCurrentTop = (hoursInDisplay) => {
  const now = new Date();
  const minutes = now.getHours() * 60 + now.getMinutes();
  return minutesToYDimension(hoursInDisplay, minutes) + CONTENT_OFFSET;
};

class GridClick extends React.Component {
  constructor(props) {
    super(props);

    this.initialTop = getCurrentTop(this.props.hoursInDisplay);

    this.state = {
      currentTranslateY: new Animated.Value(0),
    };

    this.intervalCallbackId = null;
  }

  componentDidMount() {
    this.intervalCallbackId = setInterval(() => {
      this.updateLinePosition(1000);
    }, UPDATE_EVERY_MILLISECONDS);
  }

  componentWillUnmount() {
    if (this.intervalCallbackId) {
      clearInterval(this.intervalCallbackId);
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.hoursInDisplay !== this.props.hoursInDisplay) {
      this.updateLinePosition(500);
    }
  }

  updateLinePosition = (animationDuration) => {
    const newTop = getCurrentTop(this.props.hoursInDisplay);
    Animated.timing(this.state.currentTranslateY, {
      toValue: newTop - this.initialTop,
      duration: animationDuration,
      useNativeDriver: true,
      isInteraction: false,
    }).start();
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
            borderColor: '#2797BA',
            width,
          },
        ]}
      >
        <View
          style={[
            styles.circle,
            {
              backgroundColor: '#DDF2F8',
              borderColor: '#2797BA',
              borderWidth: 1
            },
          ]}
        />
      </Animated.View>
    );
  }
}

GridClick.propTypes = {
  width: PropTypes.number.isRequired,
  hoursInDisplay: PropTypes.number.isRequired,
  color: PropTypes.string,
};

GridClick.defaultProps = {
  color: '#DDF2F8',
};

export default React.memo(GridClick);
