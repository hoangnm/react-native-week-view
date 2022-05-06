import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    height: 50,
    alignItems: 'stretch',
  },
  column: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderTopWidth: 1,
    borderLeftWidth: 1,
  },
});

export default styles;
