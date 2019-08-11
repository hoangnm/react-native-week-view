import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-between',
  },
  title: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 60,
    borderColor: '#fff',
    borderTopWidth: 1,
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
    borderLeftWidth: 1,
  },
  text: {
    color: '#fff',
  },
});

export default styles;
