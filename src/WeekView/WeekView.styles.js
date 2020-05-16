import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollViewContent: {
    flexDirection: 'row',
  },
  header: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timeLabel: {
    flex: -1,
  },
  timeText: {
    fontSize: 12,
    textAlign: 'center',
  },
  timeColumn: {
    paddingTop: 10,
    width: 60,
  },
});

export default styles;
