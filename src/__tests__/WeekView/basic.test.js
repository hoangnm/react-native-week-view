import React from 'react';
import { render } from '@testing-library/react-native';
import WeekView from '../../WeekView/WeekView';

/**
 * NOTE: In most cases, when providing events to <WeekView />, select
 * carefully some props so the events _are visible in the screen_.
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

  const eventsWithoutOverlap = [
    {
      id: 1,
      startDate: new Date(2021, 4, 2, 12, 0),
      endDate: new Date(2021, 4, 2, 13, 0),
      color: 'blue',
    },
    {
      id: 2,
      startDate: new Date(2021, 4, 2, 13, 0),
      endDate: new Date(2021, 4, 2, 13, 45),
      color: 'lightblue',
    },
    {
      id: 7,
      startDate: new Date(2021, 4, 3, 11, 14, 56),
      endDate: new Date(2021, 4, 3, 11, 30, 21),
      color: 'purple',
    },
    {
      id: 19,
      startDate: new Date(2021, 4, 4, 13, 32),
      endDate: new Date(2021, 4, 4, 14, 35),
      color: 'yellow',
    },
    {
      id: 52,
      startDate: new Date(2021, 4, 5, 18, 23),
      endDate: new Date(2021, 4, 5, 19, 57),
      color: 'pink',
    },
  ].map((evt) => ({ ...evt, description: `event ${evt.id}` }));

  const propsForNoOverlap = {
    numberOfDays: 5,
    selectedDate: new Date(2021, 4, 1),
    hoursInDisplay: 10,
    startHour: 11,
  };

  const eventsWithOverlap = [
    {
      id: 9,
      startDate: new Date(2020, 7, 24, 17),
      endDate: new Date(2020, 7, 24, 18),
      color: 'purple',
    },
    {
      id: 43,
      startDate: new Date(2020, 7, 24, 17),
      endDate: new Date(2020, 7, 24, 18),
      color: 'red',
    },
    {
      id: 11,
      startDate: new Date(2020, 7, 25, 12, 15),
      endDate: new Date(2020, 7, 25, 14, 30),
      color: 'pink',
    },
    {
      id: 2,
      startDate: new Date(2020, 7, 25, 13, 0),
      endDate: new Date(2020, 7, 25, 13, 45),
      color: 'yellow',
    },
    {
      id: 3,
      startDate: new Date(2020, 7, 24, 17),
      endDate: new Date(2020, 7, 24, 18),
      color: 'lightblue',
    },
    {
      id: 1,
      startDate: new Date(2020, 7, 26, 13),
      endDate: new Date(2020, 7, 26, 20),
      color: 'lightblue',
    },
  ].map((evt) => ({ ...evt, description: `event ${evt.id}` }));

  const propsForOverlap = {
    numberOfDays: 3,
    selectedDate: new Date(2020, 7, 24),
    hoursInDisplay: 12,
    startHour: 12,
  };

  describe.each([
    ['non-overlapping', eventsWithoutOverlap, propsForNoOverlap],
    ['overlapped', eventsWithOverlap, propsForOverlap],
  ])('with %s events', (_, events, props) => {
    it('shows all events', () => {
      const { queryAllByText } = render(
        /* eslint-disable-next-line react/jsx-props-no-spreading */
        <WeekView events={events} {...props} />,
      );
      expect(queryAllByText(/event \d+/)).toBeArrayOfSize(events.length);
    });

    it('shows each event with its color', () => {
      const { getByHintText } = render(
        /* eslint-disable-next-line react/jsx-props-no-spreading */
        <WeekView events={events} {...props} />,
      );
      events.forEach((evt) => {
        const renderedEvent = getByHintText(`Show event ${evt.id}`);
        const expectedColor = evt.color;
        expect(renderedEvent).toHaveStyle({ backgroundColor: expectedColor });
      });
    });
  });
});
