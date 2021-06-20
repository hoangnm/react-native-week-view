import React from 'react';
import { ActivityIndicator } from 'react-native';
import styles from './RefreshSpinner.styles';

const RefreshSpinner = ({ CustomComponent }) => {
  if (CustomComponent) {
    return <CustomComponent style={styles.spinner} />;
  }

  return <ActivityIndicator size="large" color="blue" style={styles.spinner} />;
};

export default React.memo(RefreshSpinner);
