import React from 'react';
import { Text, View } from 'react-native';
import PropTypes from 'prop-types';

import { availableNumberOfDays } from '../utils';
import styles from './Title.styles';

const getFontSizeHeader = (numberOfDays) => {
  if (numberOfDays > 1) {
    return 12;
  }
  return 16;
};

const Title = ({ style, showTitle, numberOfDays, text, textStyle }) => {
  return (
    <View style={[styles.title, style]}>
      {(showTitle && text) ? (
        <Text
          style={[
            {
              fontSize: getFontSizeHeader(numberOfDays),
              textAlign: 'center',
            },
            textStyle,
          ]}
        >
          {text}
        </Text>
      ) : null}
    </View>
  );
};

Title.propTypes = {
  showTitle: PropTypes.bool,
  numberOfDays: PropTypes.oneOf(availableNumberOfDays).isRequired,
  text: PropTypes.string,
  style: PropTypes.object,
  textStyle: PropTypes.object,
};

export default React.memo(Title);
