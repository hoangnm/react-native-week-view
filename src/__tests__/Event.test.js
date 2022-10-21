import 'react-native';
import React from 'react';
import {
  fireGestureHandler,
  getByGestureTestId,
} from 'react-native-gesture-handler/jest-utils';
import { render } from '@testing-library/react-native';
import Event from '../Event/Event';

describe('onDrag handler', () => {
  // Any values as constants:
  const INITIAL_TOP = 10;
  const INITIAL_LEFT = 0;
  const TRANSLATION_X = 7;
  const TRANSLATION_Y = 52;
  const EVT_HEIGHT = 50;
  const EVT_WIDTH = 40;

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
      <Event
        event={mockEvent}
        onDrag={onDragMock}
        top={INITIAL_TOP}
        left={INITIAL_LEFT}
        height={EVT_HEIGHT}
        width={EVT_WIDTH}
      />,
    );
    fireGestureHandler(
      getByGestureTestId(`dragGesture-${targetId}`),
      buildDragGesture(),
    );

    expect(onDragMock).toHaveBeenCalledTimes(1);
    expect(onDragMock).toHaveBeenCalledWith(
      mockEvent,
      INITIAL_LEFT + TRANSLATION_X,
      INITIAL_TOP + TRANSLATION_Y,
      EVT_WIDTH,
    );
  });
});
