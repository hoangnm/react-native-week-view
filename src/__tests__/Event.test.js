import 'react-native';
import React from 'react';
import {
  fireGestureHandler,
  getByGestureTestId,
} from 'react-native-gesture-handler/jest-utils';
import { render } from '@testing-library/react-native';
import Event from '../Event/Event';

describe('onDrag handler', () => {
  const buildDragGesture = () => [
    // {}, // implicit BEGIN state
    { translationX: 3, translationY: 21 }, // ACTIVE state
    { translationX: 20, translationY: -3 }, // ACTIVE state
    { translationX: 7, translationY: 52 }, // --> last ACTIVE position
    // {}, // implicit END state
  ];

  it('Calls onDrag with new position', () => {
    const mockEvent = {
      id: 1,
      description: 'some description',
      color: 'red',
      startDate: new Date(2021, 1, 3, 12, 0),
      endDate: new Date(2021, 1, 3, 12, 2),
    };
    const onDragMock = jest.fn(() => null);
    const position = { top: 10, left: 0, width: 40, height: 50 };

    render(<Event event={mockEvent} onDrag={onDragMock} position={position} />);
    fireGestureHandler(getByGestureTestId('dragGesture'), buildDragGesture());

    expect(onDragMock).toHaveBeenCalledTimes(1);
    expect(onDragMock).toHaveBeenCalledWith(
      mockEvent,
      position.left + position.width / 2 + 7,
      position.top + 52,
    );
  });
});
