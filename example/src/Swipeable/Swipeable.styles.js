import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timeLabel: {
    flex: -1,
    height: 40,
  },
  timeText: {
    fontSize: 12,
    textAlign: 'center',
  },
  timeColumn: {
    flex: -1,
    paddingTop: 10,
    width: 40,
  },
});

export default styles;
