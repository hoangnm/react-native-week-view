import React from 'react';
import { Dimensions } from 'react-native';
import { render } from '@testing-library/react-native';
import { State } from 'react-native-gesture-handler';
import {
  fireGestureHandler,
  getByGestureTestId,
} from 'react-native-gesture-handler/jest-utils';
import WeekView from '../../WeekView/WeekView';

describe('User interactions', () => {
  describe('Pressing events', () => {
    const targetEvent = {
      id: 34,
      startDate: new Date(2020, 7, 24, 12),
      endDate: new Date(2020, 7, 24, 18),
      description: 'target event',
    };
    const events = [
      targetEvent,
      {
        id: 91,
        startDate: new Date(2020, 7, 23, 20),
        endDate: new Date(2020, 7, 23, 21, 15),
        description: 'other',
      },
    ];

    const mockRenderAndFire = () => {
      const mockOnEventPress = jest.fn();

      render(
        <WeekView
          events={events}
          numberOfDays={5}
          selectedDate={new Date(2020, 7, 22)}
          hoursInDisplay={24}
          startHour={0}
          onEventPress={mockOnEventPress}
        />,
      );

      /**
       * NOTE: Ideally, the press would be grabbed without knowledge of gesture-handler,
       * for example: `fireEvent.press(getByText('target event'))`,
       * but RNGH does not provide an appropriate API for that
       */
      fireGestureHandler(
        getByGestureTestId(`pressGesture-${targetEvent.id}`),
        [],
      );

      return mockOnEventPress;
    };

    it('calls callback exactly once and with event as argument', () => {
      const mockOnEventPress = mockRenderAndFire();
      expect(mockOnEventPress).toHaveBeenCalledOnce();
      expect(mockOnEventPress).toHaveBeenCalledWith(
        expect.objectContaining(targetEvent),
      );
    });
  });

  describe('Dragging events', () => {
    const startDate = new Date(2022, 3, 5, 12, 0, 0);
    const endDate = new Date(2022, 3, 5, 14, 53, 52);

    const targetEvent = {
      id: 171,
      startDate,
      endDate,
      description: 'event to be dragged',
    };
    const events = [
      targetEvent,
      {
        id: 82,
        startDate: new Date(2022, 3, 6, 17),
        endDate: new Date(2022, 3, 6, 18),
      },
    ];

    const numberOfDays = 3;

    const mockAndRender = () => {
      const mockOnDragEvent = jest.fn();

      render(
        <WeekView
          events={events}
          numberOfDays={numberOfDays}
          selectedDate={new Date(2022, 3, 4)}
          startHour={10}
          hoursInDisplay={24}
          onDragEvent={mockOnDragEvent}
        />,
      );

      return mockOnDragEvent;
    };

    it('callback is not called if the movement fails', () => {
      const mockOnDragEvent = mockAndRender();

      fireGestureHandler(getByGestureTestId(`dragGesture-${targetEvent.id}`), [
        { translationX: 100, translationY: -3 },
        { state: State.FAILED },
      ]);

      expect(mockOnDragEvent).not.toHaveBeenCalled();
    });

    it('callback is not called if the movement is cancelled', () => {
      const mockOnDragEvent = mockAndRender();

      fireGestureHandler(getByGestureTestId(`dragGesture-${targetEvent.id}`), [
        { translationX: -100, translationY: 200 },
        { state: State.CANCELLED },
      ]);

      expect(mockOnDragEvent).not.toHaveBeenCalled();
    });

    it('callback is called with the correct arguments', () => {
      const mockOnDragEvent = mockAndRender();

      fireGestureHandler(getByGestureTestId(`dragGesture-${targetEvent.id}`), [
        { translationX: 100, translationY: 100 },
      ]);

      expect(mockOnDragEvent).toHaveBeenCalledOnce();
      expect(mockOnDragEvent).toHaveBeenCalledWith(
        expect.objectContaining(targetEvent),
        expect.toBeValidDate(),
        expect.toBeValidDate(),
      );
    });

    describe('when dragging in direction', () => {
      const startOfDay = new Date(startDate.getTime());
      startOfDay.setHours(0);
      startOfDay.setMinutes(0);
      startOfDay.setSeconds(0);
      const endOfDay = new Date(startDate.getTime());
      endOfDay.setHours(23);
      endOfDay.setMinutes(59);
      endOfDay.setSeconds(59);

      /**
       * NOTE: the screen-width (in pixels) is needed to simulate a drag gesture
       * through a specific amount of days.
       */
      const estimatedDayWidth = Dimensions.get('window').width / numberOfDays;
      const atLeastOneDay = Math.floor(estimatedDayWidth * 1.5);

      it('up and right, computes correctly newStartDate', () => {
        const mockOnDragEvent = mockAndRender();

        fireGestureHandler(
          getByGestureTestId(`dragGesture-${targetEvent.id}`),
          [{ translationX: atLeastOneDay, translationY: -30 }],
        );

        expect(mockOnDragEvent).toHaveBeenCalledOnce();
        const args = mockOnDragEvent.mock.calls[0];
        const newStartDate = args[1];
        expect(newStartDate).toBeAfter(endOfDay);
        /**
         * NOTE: we do not expect an exact amount of days/time dragged,
         * since the specific calculation from pixels to time depends on:
         * hoursInDisplay, selectedDate, window size, etc.
         * We only expect that the date change was in the correct direction.
         */
      });

      it('down and left, computes correctly newStartDate', () => {
        const mockOnDragEvent = mockAndRender();

        fireGestureHandler(
          getByGestureTestId(`dragGesture-${targetEvent.id}`),
          [{ translationX: -atLeastOneDay, translationY: 55 }],
        );

        expect(mockOnDragEvent).toHaveBeenCalledOnce();
        const args = mockOnDragEvent.mock.calls[0];
        const newStartDate = args[1];
        expect(newStartDate).toBeBefore(startOfDay);
      });

      it('up (same day), computes correctly newStartDate', () => {
        const mockOnDragEvent = mockAndRender();
        fireGestureHandler(
          getByGestureTestId(`dragGesture-${targetEvent.id}`),
          [{ translationX: 0, translationY: -55 }],
        );

        expect(mockOnDragEvent).toHaveBeenCalledOnce();
        const args = mockOnDragEvent.mock.calls[0];
        const newStartDate = args[1];
        expect(newStartDate).toBeBetween(startOfDay, startDate);
      });
    });

    describe('duration handling', () => {
      it('is called with the correct duration', () => {
        const mockOnDragEvent = mockAndRender();
        fireGestureHandler(
          getByGestureTestId(`dragGesture-${targetEvent.id}`),
          [{ translationX: 100, translationY: 100 }],
        );

        expect(mockOnDragEvent).toHaveBeenCalledOnce();
        const [, newStartDate, newEndDate] = mockOnDragEvent.mock.calls[0];

        expect(newStartDate).toBeValidDate();
        expect(newEndDate).toBeValidDate();
        expect(newEndDate.getTime() - newStartDate.getTime()).toEqual(
          endDate.getTime() - startDate.getTime(),
        );
      });

      it('handles the duration for events of multiple days', () => {
        const mockOnDragEvent = jest.fn();

        const startDateInDay1 = new Date(2022, 3, 6, 22, 0, 0);
        const endDateInDay2 = new Date(2022, 3, 7, 2, 0, 0);

        const edgeCaseDuration =
          endDateInDay2.getTime() - startDateInDay1.getTime();
        const edgeCaseId = 2;
        const eventsPlusEdgeCase = [
          ...events,
          {
            id: edgeCaseId,
            startDate: startDateInDay1,
            endDate: endDateInDay2,
            description: 'event lasting more than 1 day',
          },
          {
            id: 29,
            startDate: new Date(2022, 3, 7, 6),
            endDate: new Date(2022, 3, 7, 9),
          },
        ];
        render(
          <WeekView
            events={eventsPlusEdgeCase}
            numberOfDays={3}
            selectedDate={new Date(2022, 3, 5)}
            startHour={20}
            onDragEvent={mockOnDragEvent}
          />,
        );

        fireGestureHandler(getByGestureTestId(`dragGesture-${edgeCaseId}`), [
          { translationX: 100, translationY: 100 },
        ]);

        expect(mockOnDragEvent).toHaveBeenCalledOnce();
        const [, newStartDate, newEndDate] = mockOnDragEvent.mock.calls[0];

        expect(newStartDate).toBeValidDate();
        expect(newEndDate).toBeValidDate();
        expect(newEndDate.getTime() - newStartDate.getTime()).toEqual(
          edgeCaseDuration,
        );
      });
    });
  });
});
