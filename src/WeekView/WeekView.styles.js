import { StyleSheet, Platform } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollViewContentContainer:
    Platform.OS === 'web'
      ? {
          height: '100vh',
        }
      : { flex: 0 },
  scrollView: {
    flex: 1,
  },
  scrollViewChild: {
    flexDirection: 'row',
  },
  headerAndTitleContainer: {
    flexDirection: 'row',
  },
  loadingSpinner: {
    position: 'absolute',
    zIndex: 2,
  },
});

export default styles;
