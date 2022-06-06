import { StyleSheet } from 'react-native';

const DEFAULT_COLOR = 'red';

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    position: 'absolute',
    borderRadius: 0,
    flex: 1,
    overflow: 'hidden',
    backgroundColor: DEFAULT_COLOR,
  },
  description: {
    marginVertical: 8,
    marginHorizontal: 2,
    color: '#fff',
    textAlign: 'center',
    fontSize: 15,
  },
});

export default styles;
