import { StyleSheet } from 'react-native';
import { CONTAINER_HEIGHT, CONTAINER_WIDTH } from '../utils';

const styles = StyleSheet.create({
  spinner: {
    position: 'absolute',
    top: CONTAINER_HEIGHT / 2,
    right: CONTAINER_WIDTH / 2,
    zIndex: 1,
  },
});

export default styles;
