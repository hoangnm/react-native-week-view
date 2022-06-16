import React from 'react';
import { Dimensions } from 'react-native';
import { render, cleanup } from '@testing-library/react-native';
import { State } from 'react-native-gesture-handler';
import {
  fireGestureHandler,
  getByGestureTestId,
} from 'react-native-gesture-handler/jest-utils';
import WeekView from '../WeekView/WeekView';

const extractEventIdFromTestID = (testID) => {
  const found = testID.match(/WeekViewEvent-(?<eventId>\d+)/);
  const eventId = found && found.groups && found.groups.eventId;
  if (!eventId) {
    throw Error(`Could not find the event id in testID: ${testID}`);
  }
  return eventId;
};

describe('Basic render functionality', () => {
  it('Renders with no events', () => {
    // does not throw exception
    render(
      <WeekView
        events={[]}
        numberOfDays={3}
        selectedDate={new Date(2020, 3, 24)}
      />,
    );
  });

  const runTestShowsAll = (baseEvents, baseProps) => {
    const events = baseEvents;
    const { queryAllByHintText } = render(
      /* eslint-disable-next-line react/jsx-props-no-spreading */
      <WeekView events={events} {...baseProps} />,
    );
    expect(queryAllByHintText('Show event')).toBeArrayOfSize(events.length);
  };

  const runTestShowDescription = (baseEvents, baseProps) => {
    const events = baseEvents.map((evt) => ({
      ...evt,
      description: `event ${evt.id}`,
    }));
    const { queryAllByHintText } = render(
      /* eslint-disable-next-line react/jsx-props-no-spreading */
      <WeekView events={events} {...baseProps} />,
    );
    queryAllByHintText('Show event').forEach((renderedEvent) => {
      expect(renderedEvent).toHaveTextContent(/event \d+/g);
    });
  };

  const runTestShowColor = (baseEvents, baseProps, colors) => {
    const events = baseEvents.map((evt, index) => ({
      ...evt,
      color: colors[index],
    }));
    const { queryAllByHintText } = render(
      /* eslint-disable-next-line react/jsx-props-no-spreading */
      <WeekView events={events} {...baseProps} />,
    );
    queryAllByHintText('Show event').forEach((renderedEvent) => {
      const eventId = Number(
        extractEventIdFromTestID(renderedEvent.props.testID),
      );
      const expectedColor = events.find((evt) => evt.id === eventId).color;
      expect(renderedEvent).toHaveStyle({ backgroundColor: expectedColor });
    });
  };

  describe('with events with no overlap', () => {
    const baseEventsNoOverlap = [
      {
        id: 1,
        startDate: new Date(2021, 4, 2, 12, 0),
        endDate: new Date(2021, 4, 2, 12, 30),
      },
      {
        id: 2,
        startDate: new Date(2021, 4, 2, 13, 0),
        endDate: new Date(2021, 4, 2, 13, 45),
      },
      {
        id: 7,
        startDate: new Date(2021, 4, 3, 11),
        endDate: new Date(2021, 4, 3, 11, 30),
      },
      {
        id: 19,
        startDate: new Date(2021, 4, 4, 13),
        endDate: new Date(2021, 4, 4, 14, 35),
      },
      {
        id: 52,
        startDate: new Date(2021, 4, 5, 18),
        endDate: new Date(2021, 4, 5, 21, 57),
      },
    ];
    const baseProps = {
      // these props must allow showing the events in the screen:
      numberOfDays: 5,
      selectedDate: new Date(2021, 4, 1),
      hoursInDisplay: 24,
      startHour: 0,
    };

    it('shows all events', () =>
      runTestShowsAll(baseEventsNoOverlap, baseProps));

    it('shows each event with its description', () =>
      runTestShowDescription(baseEventsNoOverlap, baseProps));

    it('shows each event with its color', () => {
      const colors = ['blue', 'lightblue', 'purple', 'yellow', 'pink'];
      runTestShowColor(baseEventsNoOverlap, baseProps, colors);
    });
  });

  describe('with events with some overlap', () => {
    const baseEventsOverlap = [
      {
        id: 11,
        startDate: new Date(2020, 7, 25, 12, 0),
        endDate: new Date(2020, 7, 25, 14, 30),
      },
      {
        id: 2,
        startDate: new Date(2020, 7, 25, 13, 0),
        endDate: new Date(2020, 7, 25, 13, 45),
      },
      {
        id: 9,
        startDate: new Date(2020, 7, 24, 17),
        endDate: new Date(2020, 7, 24, 18),
      },
      {
        id: 43,
        startDate: new Date(2020, 7, 24, 17),
        endDate: new Date(2020, 7, 24, 18),
      },
      {
        id: 3,
        startDate: new Date(2020, 7, 24, 17),
        endDate: new Date(2020, 7, 24, 18),
      },
      {
        id: 1,
        startDate: new Date(2020, 7, 26, 11),
        endDate: new Date(2020, 7, 26, 20),
      },
    ];
    const baseProps = {
      // these props must allow showing the events in the screen:
      numberOfDays: 3,
      selectedDate: new Date(2020, 7, 24),
      hoursInDisplay: 24,
      startHour: 0,
    };

    it('shows all events', () => runTestShowsAll(baseEventsOverlap, baseProps));

    it('shows each event with its description', () =>
      runTestShowDescription(baseEventsOverlap, baseProps));

    it('shows each event with its color', () => {
      const colors = [
        'purple',
        'red',
        'pink',
        'yellow',
        'lightblue',
        'lightblue',
      ];
      runTestShowColor(baseEventsOverlap, baseProps, colors);
    });
  });
});

describe('User interactions', () => {
  describe('Pressing events', () => {
    const targetId = 34;
    const events = [
      {
        id: targetId,
        startDate: new Date(2020, 7, 24, 12),
        endDate: new Date(2020, 7, 24, 18),
        description: 'target event',
      },
      {
        id: 91,
        startDate: new Date(2020, 7, 23, 20),
        endDate: new Date(2020, 7, 23, 21, 15),
        description: 'other',
      },
    ];

    let mockOnEventPress;

    beforeEach(() => {
      mockOnEventPress = jest.fn();

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
       * Ideally, the press would be grabbed without knowledge of gesture-handler,
       * for example: `fireEvent.press(getByText('target event'))`,
       * but RNGH does not work like that
       */
      fireGestureHandler(getByGestureTestId(`pressGesture-${targetId}`), []);
    });

    it('calls callback exactly once', () => {
      expect(mockOnEventPress).toHaveBeenCalledOnce();
    });

    it('calls callback with event as first argument', () => {
      const [eventArg] = mockOnEventPress.mock.calls[0];
      expect(eventArg.id).toEqual(targetId);
    });
  });

  describe('Dragging events', () => {
    /**
     * NOTES: This test maybe somewhat fragile regarding:
     *
     * The screen-width in pixels: needed to simulate a drag gesture
     * through some days.
     *
     * The amount-of-days displayed in the screen: so the target event is
     * shown and can be dragged, recommended values:
     *     numberOfDays: 3
     *     selectedDate: one day before startDate
     *     startHour: 2 hours before the target event
     */

    const startDate = new Date(2022, 3, 5, 12, 0, 0);
    const endDate = new Date(2022, 3, 5, 14, 53, 52);

    const targetId = 171;
    const events = [
      {
        id: targetId,
        startDate,
        endDate,
        description: 'event to be dragged',
      },
      {
        id: 82,
        startDate: new Date(2022, 3, 6, 17),
        endDate: new Date(2022, 3, 6, 18),
      },
    ];
    let mockOnDragEvent;

    const numberOfDays = 3;

    beforeEach(() => {
      mockOnDragEvent = jest.fn();

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
    });

    it('callback is not called if the movement fails', () => {
      fireGestureHandler(getByGestureTestId(`dragGesture-${targetId}`), [
        { translationX: 100, translationY: -3 },
        { state: State.FAILED },
      ]);

      expect(mockOnDragEvent).not.toHaveBeenCalled();
    });

    it('callback is not called if the movement is cancelled', () => {
      fireGestureHandler(getByGestureTestId(`dragGesture-${targetId}`), [
        { translationX: -100, translationY: 200 },
        { state: State.CANCELLED },
      ]);

      expect(mockOnDragEvent).not.toHaveBeenCalled();
    });

    it('callback is called with the correct arguments', () => {
      fireGestureHandler(getByGestureTestId(`dragGesture-${targetId}`), [
        { translationX: 100, translationY: 100 },
      ]);

      expect(mockOnDragEvent).toHaveBeenCalledTimes(1);
      const [e, newStartDate, newEndDate] = mockOnDragEvent.mock.calls[0];

      expect(e.id).toEqual(targetId);
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
        fireGestureHandler(getByGestureTestId(`dragGesture-${targetId}`), [
          { translationX: atLeastOneDay, translationY: -30 },
        ]);

        expect(mockOnDragEvent).toHaveBeenCalledTimes(1);
        const args = mockOnDragEvent.mock.calls[0];
        const newStartDate = args[1];
        expect(newStartDate).toBeAfter(endOfDay);
      });

      it('down and left, computes correctly newStartDate', () => {
        fireGestureHandler(getByGestureTestId(`dragGesture-${targetId}`), [
          { translationX: -atLeastOneDay, translationY: 55 },
        ]);

        expect(mockOnDragEvent).toHaveBeenCalledTimes(1);
        const args = mockOnDragEvent.mock.calls[0];
        const newStartDate = args[1];
        expect(newStartDate).toBeBefore(startOfDay);
      });

      it('up (same day), computes correctly newStartDate', () => {
        fireGestureHandler(getByGestureTestId(`dragGesture-${targetId}`), [
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
        fireGestureHandler(getByGestureTestId(`dragGesture-${targetId}`), [
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
