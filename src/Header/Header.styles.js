import { StyleSheet } from 'react-native';
import { HEADER_HEIGHT } from '../utils/dimensions';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'stretch',
  },
  daysContainer: {
    flexDirection: 'row',
    height: HEADER_HEIGHT,
  },
});

export default styles;
