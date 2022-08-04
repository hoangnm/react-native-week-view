import { StyleSheet } from 'react-native';

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
    zIndex: 2,
  },
  webScrollView: {
    height: '100vh',
  },
});

export default styles;
