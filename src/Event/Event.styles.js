import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    position: 'absolute',
    borderRadius: 0,
    flex: 1,
  },
  description: {
    marginVertical: 8,
    marginHorizontal: 2,
    color: '#fff',
    textAlign: 'center',
    fontSize: 15,
  },
});

const circleDiameter = 15;
const baseCircleStyle = {
  position: 'absolute',
  borderColor: 'black',
  borderWidth: 1,
  borderRadius: circleDiameter,
  height: circleDiameter,
  width: circleDiameter,
  backgroundColor: 'white',
};

export const circleStyles = StyleSheet.create({
  top: {
    ...baseCircleStyle,
    top: -circleDiameter / 2,
  },
  bottom: {
    ...baseCircleStyle,
    bottom: -circleDiameter / 2,
  },
  left: {
    ...baseCircleStyle,
    left: -circleDiameter / 2,
    top: '50%',
  },
  right: {
    ...baseCircleStyle,
    right: -circleDiameter / 2,
    top: '50%',
  },
});

export default styles;
