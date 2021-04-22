import { StyleSheet } from 'react-native';

const circleSize = 8;
const lineWidth = 1.5;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    zIndex: 2,
    borderTopWidth: lineWidth,
  },
  circle: {
    position: 'absolute',
    top: -(circleSize + lineWidth) / 2,
    left: 2,
    borderRadius: circleSize,
    height: circleSize,
    width: circleSize,
  },
});

export default styles;
