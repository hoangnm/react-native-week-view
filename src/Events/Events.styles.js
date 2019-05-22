import { StyleSheet } from 'react-native';

const GREY_COLOR = '#E9EDF0';
const ROW_HEIGHT = 40;
export const CONTENT_OFFSET = 16;

const styles = StyleSheet.create({
  container: {
    paddingTop: 16,
  },
  timeRow: {
    flex: 0,
    height: ROW_HEIGHT,
  },
  timeLabelLine: {
    height: 1,
    backgroundColor: GREY_COLOR,
    position: 'absolute',
    right: 0,
    left: 0,
  },
  event: {
    flex: 1,
    overflow: 'hidden',
    borderColor: GREY_COLOR,
    borderLeftWidth: 1,
  },
  events: {
    position: 'absolute',
    flexDirection: 'row',
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
    backgroundColor: 'transparent',
  },
});

export default styles;
