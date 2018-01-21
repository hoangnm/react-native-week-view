import { StyleSheet } from 'react-native';

const LIGHT_COLOR = '#FFF';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timeLineContainer: {
    flexDirection: 'row',
  },
  timeColumn: {
    flex: -1,
    paddingTop: 10,
    width: 40,
  },
  timeLabel: {
    flex: -1,
    height: 40,
  },
  timeText: {
    fontSize: 12,
    textAlign: 'center',
  },
  eventColumn: {
    flex: 1,
    backgroundColor: LIGHT_COLOR,
  },
});

export default styles;
