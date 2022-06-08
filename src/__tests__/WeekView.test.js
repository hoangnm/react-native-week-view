import React from 'react';
import { Dimensions } from 'react-native';
import { render, cleanup } from '@testing-library/react-native';
import { State } from 'react-native-gesture-handler';
import {
  fireGestureHandler,
  getByGestureTestId,
} from 'react-native-gesture-handler/jest-utils';
import WeekView from '../WeekView/WeekView';

describe('WeekView', () => {
  it('renders with basic props', () => {
    render(
      <WeekView
        events={[]}
        numberOfDays={3}
        selectedDate={new Date(2021, 3, 24)}
      />,
    );
  });

  it('Renders 5 events', async () => {
    const events = Array.from({ length: 5 }, (_, index) => ({
      id: index,
      startDate: new Date(2021, 4, index + 2, 12),
      endDate: new Date(2021, 4, index + 2, 15),
    }));
    // TODO: comment about selectedDate used
    const { findAllByTestId } = render(
      <WeekView
        events={events}
        numberOfDays={5}
        selectedDate={new Date(2021, 4, 2)}
        startHour={10}
      />,
    );
    const renderedEvents = await findAllByTestId('WeekViewEvent');
    expect(renderedEvents).toBeArrayOfSize(5);
    // TODO: check more stuff about the rendered events?, e.g.
    // correct descriptions, colors, etc
  });

  describe('onEventPress', () => {
    // TODO: better to test with multiple rendered events
    const someEvent = {
      id: 34,
      startDate: new Date(2021, 4, 2, 12),
      endDate: new Date(2021, 4, 2, 15),
    };
    let mockOnEventPress;

    beforeEach(() => {
      mockOnEventPress = jest.fn();

      render(
        <WeekView
          events={[someEvent]}
          numberOfDays={5}
          selectedDate={new Date(2021, 4, 1)}
          startHour={10}
          onEventPress={mockOnEventPress}
        />,
      );
    });
    it('calls with correct arguments', () => {
      fireGestureHandler(getByGestureTestId('pressGesture'), []);
      expect(mockOnEventPress).toHaveBeenCalledOnce();
      const [eventArg] = mockOnEventPress.mock.calls[0];
      expect(eventArg.id).toEqual(someEvent.id);
    });
  });

  describe('onDragEvent callback', () => {
    /**
     * NOTES: This test maybe somewhat fragile regarding:
     *
     * Screen width in pixels: needed to simulate a drag gesture
     * through some days.
     *
     * Days displayed in the screen: so the target event is seen
     * and can be dragged, recommended values:
     *     numberOfDays: 3
     *     selectedDate: one day before startDate
     *     startHour: 2 hours before the target event
     */

    const startDate = new Date(2022, 3, 5, 12, 0, 0);
    const endDate = new Date(2022, 3, 5, 14, 53, 52);

    const someEvent = {
      id: 17,
      startDate,
      endDate,
    };
    let mockOnDragEvent;

    const numberOfDays = 3;

    beforeEach(() => {
      mockOnDragEvent = jest.fn();

      render(
        <WeekView
          events={[someEvent]}
          numberOfDays={numberOfDays}
          selectedDate={new Date(2022, 3, 4)}
          startHour={10}
          onDragEvent={mockOnDragEvent}
        />,
      );
    });

    it('is not called if the movement fails', () => {
      fireGestureHandler(getByGestureTestId('dragGesture'), [
        { translationX: 100, translationY: -3 },
        { state: State.FAILED },
      ]);

      expect(mockOnDragEvent).not.toHaveBeenCalled();
    });

    it('is not called if the movement is cancelled', () => {
      fireGestureHandler(getByGestureTestId('dragGesture'), [
        { translationX: -100, translationY: 200 },
        { state: State.CANCELLED },
      ]);

      expect(mockOnDragEvent).not.toHaveBeenCalled();
    });

    it('is called with the correct arguments', () => {
      fireGestureHandler(getByGestureTestId('dragGesture'), [
        { translationX: 100, translationY: 100 },
      ]);

      expect(mockOnDragEvent).toHaveBeenCalledTimes(1);
      const [e, newStartDate, newEndDate] = mockOnDragEvent.mock.calls[0];

      expect(e.id).toEqual(someEvent.id);
      expect(newStartDate).toBeValidDate();
      expect(newEndDate).toBeValidDate();
    });

    describe('when dragging in direction', () => {
      // const startDate = new Date(2022, 3, 5, 12, 0, 0);
      const startOfDay = new Date(startDate.getTime());
      startOfDay.setHours(0);
      startOfDay.setMinutes(0);
      startOfDay.setSeconds(0);
      const endOfDay = new Date(startDate.getTime());
      endOfDay.setHours(23);
      endOfDay.setMinutes(59);
      endOfDay.setSeconds(59);

      const estimatedDayWidth = Dimensions.get('window').width / numberOfDays;
      const atLeastOneDay = Math.floor(estimatedDayWidth * 1.5);

      if (Number.isNaN(estimatedDayWidth)) {
        throw new Error('Could not get window width');
      }

      it('up and right, computes correctly newStartDate', () => {
        fireGestureHandler(getByGestureTestId('dragGesture'), [
          { translationX: atLeastOneDay, translationY: -30 },
        ]);

        expect(mockOnDragEvent).toHaveBeenCalledTimes(1);
        const args = mockOnDragEvent.mock.calls[0];
        const newStartDate = args[1];
        expect(newStartDate).toBeAfter(endOfDay);
      });

      it('down and left, computes correctly newStartDate', () => {
        fireGestureHandler(getByGestureTestId('dragGesture'), [
          { translationX: -atLeastOneDay, translationY: 55 },
        ]);

        expect(mockOnDragEvent).toHaveBeenCalledTimes(1);
        const args = mockOnDragEvent.mock.calls[0];
        const newStartDate = args[1];
        expect(newStartDate).toBeBefore(startOfDay);
      });

      it('up (same day), computes correctly newStartDate', () => {
        fireGestureHandler(getByGestureTestId('dragGesture'), [
          { translationX: 0, translationY: -55 },
        ]);

        expect(mockOnDragEvent).toHaveBeenCalledTimes(1);
        const args = mockOnDragEvent.mock.calls[0];
        const newStartDate = args[1];
        expect(newStartDate).toBeBetween(startOfDay, startDate);
      });
    });

    describe('duration handling', () => {
      it('is called with the correct duration', () => {
        fireGestureHandler(getByGestureTestId('dragGesture'), [
          { translationX: 100, translationY: 100 },
        ]);

        expect(mockOnDragEvent).toHaveBeenCalledTimes(1);
        const [, newStartDate, newEndDate] = mockOnDragEvent.mock.calls[0];

        expect(newEndDate).toBeValidDate();
        expect(newEndDate.getTime() - newStartDate.getTime()).toEqual(
          endDate.getTime() - startDate.getTime(),
        );
      });

      it('handles the duration for events of multiple days', () => {
        cleanup();

        const startDateInDay1 = new Date(2022, 3, 6, 22, 0, 0);
        const endDateInDay2 = new Date(2022, 3, 7, 2, 0, 0);

        // lasts 4 hours
        const edgeCaseDuration =
          endDateInDay2.getTime() - startDateInDay1.getTime();
        const edgeEvent = {
          id: 2,
          startDate: startDateInDay1,
          endDate: endDateInDay2,
        };
        render(
          <WeekView
            events={[edgeEvent]}
            numberOfDays={3}
            selectedDate={new Date(2022, 3, 5)}
            startHour={20}
            onDragEvent={mockOnDragEvent}
          />,
        );

        fireGestureHandler(getByGestureTestId('dragGesture'), [
          { translationX: 100, translationY: 100 },
        ]);

        expect(mockOnDragEvent).toHaveBeenCalledTimes(1);
        const [, newStartDate, newEndDate] = mockOnDragEvent.mock.calls[0];

        expect(newEndDate).toBeValidDate();
        expect(newEndDate.getTime() - newStartDate.getTime()).toEqual(
          edgeCaseDuration,
        );
      });
    });
  });
});
