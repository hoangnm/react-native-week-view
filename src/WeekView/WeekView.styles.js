import { StyleSheet } from 'react-native';
import { CONTAINER_HEIGHT } from '../utils';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollViewContent: {
    flexDirection: 'row',
  },
  headerContainer: {
    flexDirection: 'row',
  },
  loadingSpinner: {
    position: 'absolute',
    top: CONTAINER_HEIGHT / 2,
    zIndex: 2,
  },
  webScrollView: {
    height: '100vh',
  },
});

export default styles;
