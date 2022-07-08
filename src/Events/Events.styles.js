import { StyleSheet } from 'react-native';
import { CONTENT_TOP_PADDING } from '../utils/dimensions';

const GREY_COLOR = '#E9EDF0';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: CONTENT_TOP_PADDING,
  },
  timeRow: {
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
