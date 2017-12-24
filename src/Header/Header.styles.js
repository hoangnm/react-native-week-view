import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-between',
  },
  oneDayHeader: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  columns: {
    flex: 1,
    flexDirection: 'row',
  },
  column: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: '#fff',
    borderTopWidth: 1,
  },
  text: {
    color: '#fff',
  },
});

export default styles;
