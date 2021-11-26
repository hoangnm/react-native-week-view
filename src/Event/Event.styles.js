import { StyleSheet } from 'react-native';

const circleSize = 15;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    position: 'absolute',
    borderRadius: 0,
    flex: 1,
  },
  touchableContainer: {
    flex: 1,
    alignSelf: 'stretch',
  },
  description: {
    marginVertical: 8,
    marginHorizontal: 2,
    color: '#fff',
    textAlign: 'center',
    fontSize: 15,
  },
  circle: {
    position: 'absolute',
    bottom: -circleSize / 2,
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: circleSize,
    height: circleSize,
    width: circleSize,
    backgroundColor: 'white',
  },
});

export default styles;
