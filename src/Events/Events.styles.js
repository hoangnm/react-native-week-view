import { StyleSheet } from 'react-native';
import { CONTAINER_WIDTH, CONTENT_OFFSET } from '../utils';

const GREY_COLOR = '#E9EDF0';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: CONTENT_OFFSET,
    width: CONTAINER_WIDTH,
  },
  timeRow: {
    flex: 0,
    borderTopWidth: 1,
    borderColor: GREY_COLOR,
    backgroundColor: 'transparent',
  },
  eventsColumn: {
    flex: 1,
    borderColor: GREY_COLOR,
    borderLeftWidth: 1,
  },
  eventsContainer: {
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
