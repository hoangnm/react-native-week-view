import React from 'react';
import { render } from '@testing-library/react-native';
import { Text } from 'react-native';
import WeekView from '../../WeekView/WeekView';

describe('Visual customizations', () => {
  describe('custom EventComponent', () => {
    const exampleEvents = [
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
    ].map((evt) => ({
      ...evt,
      description: 'event by default',
      color: 'green',
    }));

    it('renders the custom component instead of the default', () => {
      const MyEventComponent = ({ event }) => (
        <Text>{`custom ${event.id}`}</Text>
      );

      const { queryAllByText } = render(
        <WeekView
          events={exampleEvents}
          numberOfDays={5}
          selectedDate={new Date(2021, 4, 1)}
          hoursInDisplay={10}
          startHour={11}
          EventComponent={MyEventComponent}
        />,
      );
      expect(queryAllByText('event by default')).toBeArrayOfSize(0);
      expect(queryAllByText(/custom \d+/)).toBeArrayOfSize(
        exampleEvents.length,
      );
    });
  });

  describe('using event.style', () => {
    const exampleEvents = [
      {
        id: 1,
        startDate: new Date(2021, 4, 2, 12, 0),
        endDate: new Date(2021, 4, 2, 13, 0),
        style: { borderRadius: 2, borderWidth: 1, borderColor: 'blue' },
      },
      {
        id: 7,
        startDate: new Date(2021, 4, 3, 11, 14, 56),
        endDate: new Date(2021, 4, 3, 11, 30, 21),
        style: { backgroundColor: 'red' },
      },
      {
        id: 19,
        startDate: new Date(2021, 4, 4, 13, 32),
        endDate: new Date(2021, 4, 4, 14, 35),
        style: { backgroundColor: 'green' },
      },
    ].map((evt) => ({
      ...evt,
      description: `event ${evt.id}`,
      color: 'green',
    }));

    it('renders the event with extra style', () => {
      const { getByHintText } = render(
        <WeekView
          events={exampleEvents}
          numberOfDays={5}
          selectedDate={new Date(2021, 4, 1)}
          hoursInDisplay={10}
          startHour={11}
        />,
      );
      exampleEvents.forEach((evt) => {
        const renderedEvent = getByHintText(`Show event ${evt.id}`);
        expect(renderedEvent).toHaveStyle(evt.style);
      });
    });
  });
});
