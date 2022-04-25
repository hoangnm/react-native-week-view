import React from 'react';
import { View, Animated } from 'react-native';
import PropTypes from 'prop-types';

import { minutesToYDimension, CONTENT_OFFSET } from '../utils';
import styles from './NowLine.styles';

const UPDATE_EVERY_MILLISECONDS = 60 * 1000; // 1 minute

const getCurrentTop = (hoursInDisplay, beginAgendaAt) => {
  const now = new Date();
  const minutes = now.getHours() * 60 + now.getMinutes();
  const position = minutesToYDimension(hoursInDisplay, minutes);
  const agendaOffset = minutesToYDimension(hoursInDisplay, beginAgendaAt);
  return position - agendaOffset + CONTENT_OFFSET;
};

class NowLine extends React.Component {
  constructor(props) {
    super(props);

    const { hoursInDisplay, beginAgendaAt } = this.props;

    this.initialTop = getCurrentTop(hoursInDisplay, beginAgendaAt);

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
    const { hoursInDisplay, beginAgendaAt } = this.props;

    const newTop = getCurrentTop(hoursInDisplay, beginAgendaAt);
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
          ]}
        />
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
