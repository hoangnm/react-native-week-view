import { StyleSheet, Platform } from 'react-native';

const styles = StyleSheet.create({
  scrollViewContentContainer:
    Platform.OS === 'web'
      ? {
          height: '100vh',
        }
      : { flex: 0 },
  scrollView: {
    flex: 1,
  },
});

export default styles;
