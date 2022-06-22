import React from 'react';
import { Dimensions } from 'react-native';
import { render } from '@testing-library/react-native';
import { State } from 'react-native-gesture-handler';
import {
  fireGestureHandler,
  getByGestureTestId,
} from 'react-native-gesture-handler/jest-utils';
import WeekView from '../WeekView/WeekView';

/**
 * Extracts the event-id embedded in "WeekViewEvent-<id>".
 *
 * Throws an error if the testID does not match the regex.
 * @param {String} testID
 * @returns string with event id
 */
const extractEventIdFromTestID = (testID) => {
  const found = testID.match(/WeekViewEvent-(?<eventId>\d+)/);
  const eventId = found && found.groups && found.groups.eventId;
  if (!eventId) {
    throw Error(`Could not find the event id in testID: ${testID}`);
  }
  return eventId;
};

/**
 * NOTE: In most cases the props provided to <WeekView /> need to be
 * selected carefully, so that events _are visible in the screen_.
 * For example:
 *   - numberOfDays
 *   - selectedDate (usually, at least the same day the target event's startDate)
 *   - hoursInDisplay
 *   - startHour (usually, some hours before the target event)
 */
describe('Basic render functionality', () => {
  describe('with no events', () => {
    it('renders an empty grid', () => {
      const { getByHintText, queryAllByHintText } = render(
        <WeekView
          events={[]}
          numberOfDays={3}
          selectedDate={new Date(2020, 3, 24)}
        />,
      );
      expect(getByHintText('Grid with horizontal scroll')).toBeDefined();
      expect(queryAllByHintText(/Show event \d+/)).toBeArrayOfSize(0);
    });
  });

  const runTestShowsAll = (events, props) => {
    const { queryAllByHintText, queryAllByText } = render(
      /* eslint-disable-next-line react/jsx-props-no-spreading */
      <WeekView events={events} {...props} />,
    );
    expect(queryAllByHintText(/Show event \d+/)).toBeArrayOfSize(events.length);
    expect(queryAllByText(/event \d+/)).toBeArrayOfSize(events.length);

    /**
     * NOTE: Ideally, the selection would be only by text: queryAllByText('event \d')
     * without queryAllByHintText(), but in practice an edge case might occur:
     *     the box is visible --> events are detected byHint
     *     but is too small, so the text is hidden --> events are not detected byText.
     * This depends on many factors: screen size, hours in display, number of days,
     * font size, padding, etc.
     *
     * To avoid future headaches with this test, we test both things in that order:
     * byHint and byText.
     *   - If byHint passes the test but byText does not
     *     --> boxes are visible but the text inside is not
     *     --> test events are too small, or change props hoursInDisplay, numberOfDays, etc
     *   - If both test fails --> events are not rendered at all --> code is broken
     */
  };

  const runTestShowColor = (baseEvents, props, colors) => {
    const events = baseEvents.map((evt, index) => ({
      ...evt,
      color: colors[index],
    }));
    const { queryAllByHintText } = render(
      /* eslint-disable-next-line react/jsx-props-no-spreading */
      <WeekView events={events} {...props} />,
    );
    queryAllByHintText(/Show event \d+/).forEach((renderedEvent) => {
      const eventId = Number(
        extractEventIdFromTestID(renderedEvent.props.testID),
      );
      const expectedColor = events.find((evt) => evt.id === eventId).color;
      expect(renderedEvent).toHaveStyle({ backgroundColor: expectedColor });
    });
  };

  describe('with non-overlapping events', () => {
    const baseEventsNoOverlap = [
      {
        id: 1,
        startDate: new Date(2021, 4, 2, 12, 0),
        endDate: new Date(2021, 4, 2, 13, 0),
      },
      {
        id: 2,
        startDate: new Date(2021, 4, 2, 13, 0),
        endDate: new Date(2021, 4, 2, 13, 45),
      },
      {
        id: 7,
        startDate: new Date(2021, 4, 3, 11, 14, 56),
        endDate: new Date(2021, 4, 3, 11, 30, 21),
      },
      {
        id: 19,
        startDate: new Date(2021, 4, 4, 13, 32),
        endDate: new Date(2021, 4, 4, 14, 35),
      },
      {
        id: 52,
        startDate: new Date(2021, 4, 5, 18, 23),
        endDate: new Date(2021, 4, 5, 19, 57),
      },
    ].map((evt) => ({ ...evt, description: `event ${evt.id}` }));

    const baseProps = {
      numberOfDays: 5,
      selectedDate: new Date(2021, 4, 1),
      hoursInDisplay: 10,
      startHour: 11,
    };

    it('shows all events', () =>
      runTestShowsAll(baseEventsNoOverlap, baseProps));

    it('shows each event with its color', () => {
      const colors = ['blue', 'lightblue', 'purple', 'yellow', 'pink'];
      runTestShowColor(baseEventsNoOverlap, baseProps, colors);
    });
  });

  describe('with overlapped events', () => {
    const baseEventsOverlap = [
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
        id: 11,
        startDate: new Date(2020, 7, 25, 12, 15),
        endDate: new Date(2020, 7, 25, 14, 30),
      },
      {
        id: 2,
        startDate: new Date(2020, 7, 25, 13, 0),
        endDate: new Date(2020, 7, 25, 13, 45),
      },
      {
        id: 3,
        startDate: new Date(2020, 7, 24, 17),
        endDate: new Date(2020, 7, 24, 18),
      },
      {
        id: 1,
        startDate: new Date(2020, 7, 26, 13),
        endDate: new Date(2020, 7, 26, 20),
      },
    ].map((evt) => ({ ...evt, description: `event ${evt.id}` }));

    const baseProps = {
      numberOfDays: 3,
      selectedDate: new Date(2020, 7, 24),
      hoursInDisplay: 12,
      startHour: 12,
    };

    it('shows all events', () => runTestShowsAll(baseEventsOverlap, baseProps));

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
      fireGestureHandler(getByGestureTestId(`pressGesture-${targetId}`), []);

      return mockOnEventPress;
    };

    it('calls callback exactly once', () => {
      const mockOnEventPress = mockRenderAndFire();
      expect(mockOnEventPress).toHaveBeenCalledOnce();
    });

    it('calls callback with event as first argument', () => {
      const mockOnEventPress = mockRenderAndFire();
      const [eventArg] = mockOnEventPress.mock.calls[0];
      expect(eventArg.id).toEqual(targetId);
    });
  });

  describe('Dragging events', () => {
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

      fireGestureHandler(getByGestureTestId(`dragGesture-${targetId}`), [
        { translationX: 100, translationY: -3 },
        { state: State.FAILED },
      ]);

      expect(mockOnDragEvent).not.toHaveBeenCalled();
    });

    it('callback is not called if the movement is cancelled', () => {
      const mockOnDragEvent = mockAndRender();

      fireGestureHandler(getByGestureTestId(`dragGesture-${targetId}`), [
        { translationX: -100, translationY: 200 },
        { state: State.CANCELLED },
      ]);

      expect(mockOnDragEvent).not.toHaveBeenCalled();
    });

    it('callback is called with the correct arguments', () => {
      const mockOnDragEvent = mockAndRender();

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

      if (Number.isNaN(estimatedDayWidth)) {
        throw new Error('Could not get window width');
      }

      it('up and right, computes correctly newStartDate', () => {
        const mockOnDragEvent = mockAndRender();

        fireGestureHandler(getByGestureTestId(`dragGesture-${targetId}`), [
          { translationX: atLeastOneDay, translationY: -30 },
        ]);

        expect(mockOnDragEvent).toHaveBeenCalledTimes(1);
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

        fireGestureHandler(getByGestureTestId(`dragGesture-${targetId}`), [
          { translationX: -atLeastOneDay, translationY: 55 },
        ]);

        expect(mockOnDragEvent).toHaveBeenCalledTimes(1);
        const args = mockOnDragEvent.mock.calls[0];
        const newStartDate = args[1];
        expect(newStartDate).toBeBefore(startOfDay);
      });

      it('up (same day), computes correctly newStartDate', () => {
        const mockOnDragEvent = mockAndRender();
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
        const mockOnDragEvent = mockAndRender();
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
