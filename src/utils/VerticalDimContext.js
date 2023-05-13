import React, { useContext } from 'react';
import { useWindowDimensions } from 'react-native';
import { useDerivedValue } from 'react-native-reanimated';
import { Gesture } from 'react-native-gesture-handler';

export const VerticalDimensionContext = React.createContext(null);

const useSetupDimensions = ({
  hoursInDisplay,
  beginAgendaAt,
  endAgendaAt,
  timeStep,
}) => {
  const { height: windowHeight } = useWindowDimensions();

  const currentVerticalScale = useDerivedValue(() => 1, [
    hoursInDisplay,
    windowHeight,
  ]);
  const savedVerticalScale = useDerivedValue(() => 1, [
    hoursInDisplay,
    windowHeight,
  ]);

  const MIN_HOURS_IN_DISPLAY = 30 / 60;
  const MAX_HOURS_IN_DISPLAY = endAgendaAt - beginAgendaAt / 60;

  const verticalPinchGesture = Gesture.Pinch()
    // TODO: add enabled prop
    .onUpdate((pinchEvt) => {
      const newValue = savedVerticalScale.value * pinchEvt.scale;
      const newHoursInDisplay = hoursInDisplay / newValue;
      if (
        newHoursInDisplay > MIN_HOURS_IN_DISPLAY &&
        newHoursInDisplay < MAX_HOURS_IN_DISPLAY
      ) {
        currentVerticalScale.value = newValue;
      }
    })
    .onEnd(() => {
      savedVerticalScale.value = currentVerticalScale.value;
    });

  const verticalResolution = useDerivedValue(() => {
    const minutesInDisplay = (hoursInDisplay * 60) / currentVerticalScale.value;
    const minutesResolution = windowHeight / minutesInDisplay;
    return minutesResolution;
  });
  const timeLabelHeight = useDerivedValue(
    () => timeStep * verticalResolution.value,
  );

  return {
    beginAgendaAt, // NOTE: passed down for convenience
    verticalPinchGesture,
    verticalResolution,
    timeLabelHeight,
  };
};

export const useVerticalDimensionContext = () => {
  const value = useContext(VerticalDimensionContext);
  return value;
};

export const VerticalDimensionsProvider = ({ children, ...props }) => {
  const value = useSetupDimensions({ ...props });
  return (
    <VerticalDimensionContext.Provider value={value}>
      {children}
    </VerticalDimensionContext.Provider>
  );
};
