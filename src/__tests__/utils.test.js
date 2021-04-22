import { calculateDaysArray } from '../utils.js';

describe('calculateDaysArray', () => {
  it('Returns array of dates', () => {
    const date = new Date(2021, 0, 1);
    const daysArray = calculateDaysArray(date, 5, false);

    expect(daysArray).toBeArrayOfSize(5);
    daysArray.forEach((day) => expect(day.toDate()).toBeValidDate());
  });
});
