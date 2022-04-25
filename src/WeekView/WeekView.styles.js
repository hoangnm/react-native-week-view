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
  header: {
    flex: 1,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingSpinner: {
    position: 'absolute',
    top: CONTAINER_HEIGHT / 2,
    zIndex: 2,
  },
});

export default styles;
