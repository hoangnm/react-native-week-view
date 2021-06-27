import 'react-native';
import React from 'react';
import renderer from 'react-test-renderer';
import WeekView from '../WeekView/WeekView';

it('renders correctly', () => {
  renderer.create(
    <WeekView numberOfDays={3} selectedDate={new Date(2021, 3, 24)} />,
  );
});
