import React from 'react';
import PropTypes from 'prop-types';
import { Text, TouchableOpacity } from 'react-native';

import styles from './AllDayEvent.styles';
import { EventPropType } from '../utils/types';

const AllDayEventDefaultComponent = ({ event }) => (
  <Text numberOfLines={1} ellipsizeMode="tail" style={styles.description}>
    {event.description}
  </Text>
);

const AllDayEvent = ({
  event,
  onPress,
  onLongPress,
  left,
  width,
  top,
  containerStyle,
  EventComponent = AllDayEventDefaultComponent,
}) => {
  const onPressWrapper =
    !event.disablePress && onPress && (() => onPress(event));
  const onLongPressWrapper =
    !event.disableLongPress && onLongPress && (() => onLongPress(event));

  return (
    <TouchableOpacity
      key={event.id}
      onPress={onPressWrapper}
      onLongPress={onLongPressWrapper}
      disabled={!onPressWrapper && !onLongPressWrapper}
      style={[
        styles.container,
        {
          left,
          width,
          top,
          backgroundColor: event.color,
        },
        containerStyle,
        event.style,
      ]}
    >
      <EventComponent event={event} />
    </TouchableOpacity>
  );
};

AllDayEvent.propTypes = {
  event: EventPropType.isRequired,
  left: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
  top: PropTypes.number.isRequired,
  containerStyle: PropTypes.object,
  EventComponent: PropTypes.elementType,
  onPress: PropTypes.func,
  onLongPress: PropTypes.func,
};

export default React.memo(AllDayEvent);
