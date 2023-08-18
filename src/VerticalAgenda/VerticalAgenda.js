import React from 'react';
import PropTypes from 'prop-types';
import {
  GestureDetector,
  ScrollView as GHScrollView,
} from 'react-native-gesture-handler';

import styles from './VerticalAgenda.styles';
import { minutesInDayToTop, topToSecondsInDay } from '../utils/dimensions';
import { useVerticalDimensionContext } from '../utils/VerticalDimContext';

const VerticalAgenda = React.forwardRef(
  ({ onTimeScrolled, children }, upperRef) => {
    const agendaRef = React.useRef(null);

    const {
      verticalPinchGesture,
      verticalResolution,
      beginAgendaAt,
    } = useVerticalDimensionContext();

    const pinchRef = React.useRef();

    React.useImperativeHandle(upperRef, () => ({
      scrollToTime: (minutes, options = {}) => {
        if (agendaRef.current) {
          const { animated = false } = options || {};
          const top = minutesInDayToTop(
            minutes,
            verticalResolution,
            beginAgendaAt,
          );
          agendaRef.current.scrollTo({
            y: top,
            x: 0,
            animated,
          });
        }
      },
    }));

    const isScrollingVertical = React.useRef(false);
    const verticalScrollBegun = () => {
      isScrollingVertical.current = true;
    };

    const verticalScrollEnded = (scrollEvent) => {
      if (!isScrollingVertical.current) {
        // Ensure the callback is called only once
        return;
      }
      isScrollingVertical.current = false;

      if (!onTimeScrolled) {
        return;
      }

      const {
        nativeEvent: { contentOffset },
      } = scrollEvent;
      const { y: yPosition } = contentOffset;

      const secondsInDay = topToSecondsInDay(
        yPosition,
        verticalResolution,
        beginAgendaAt,
      );

      onTimeScrolled(secondsInDay);
    };

    return (
      <GHScrollView
        contentContainerStyle={styles.scrollViewContentContainer}
        style={styles.scrollView}
        onMomentumScrollBegin={verticalScrollBegun}
        onMomentumScrollEnd={verticalScrollEnded}
        ref={agendaRef}
        waitFor={pinchRef}
      >
        <GestureDetector gesture={verticalPinchGesture.withRef(pinchRef)}>
          {children}
        </GestureDetector>
      </GHScrollView>
    );
  },
);

VerticalAgenda.propTypes = {
  onTimeScrolled: PropTypes.func,
  children: PropTypes.element,
};

export default VerticalAgenda;
