import 'react-native';
import React from 'react';
import {
  fireGestureHandler,
  getByGestureTestId,
} from 'react-native-gesture-handler/jest-utils';
import { render } from '@testing-library/react-native';
import Event from '../Event/Event';
import { VerticalDimensionsProvider } from '../utils/VerticalDimContext';

describe('onDrag handler', () => {
  // Any values as constants:
  const TRANSLATION_X = 7;
  const TRANSLATION_Y = 52;

  const buildDragGesture = () => [
    // {}, // implicit BEGIN state
    { translationX: 3, translationY: 21 }, // ACTIVE state
    { translationX: 20, translationY: -3 }, // ACTIVE state
    { translationX: TRANSLATION_X, translationY: TRANSLATION_Y }, // --> last ACTIVE position
    // {}, // implicit END state
  ];

  it('Calls onDrag with new position', () => {
    const targetId = 1;
    const mockEvent = {
      id: targetId,
      description: 'some description',
      color: 'red',
      startDate: new Date(2021, 1, 3, 12, 0),
      endDate: new Date(2021, 1, 3, 12, 2),
    };
    const onDragMock = jest.fn(() => null);

    render(
      <VerticalDimensionsProvider
        enableVerticalPinch={false}
        hoursInDisplay={12}
        beginAgendaAt={0}
        endAgendaAt={24}
        timeStep={60}
      >
        <Event
          event={mockEvent}
          onDrag={onDragMock}
          boxStartTimestamp={mockEvent.startDate.getTime()}
          boxEndTimestamp={mockEvent.endDate.getTime()}
          dayWidth={10}
        />
      </VerticalDimensionsProvider>,
    );
    fireGestureHandler(
      getByGestureTestId(`dragGesture-${targetId}`),
      buildDragGesture(),
    );

    expect(onDragMock).toHaveBeenCalledTimes(1);
    expect(onDragMock).toHaveBeenCalledWith(
      mockEvent,
      // NOTE: actual positions depends on dimensions, hoursInDisplay, etc
      expect.toBeNumber(),
      expect.toBeNumber(),
      expect.toBeNumber(),
    );
  });
});
