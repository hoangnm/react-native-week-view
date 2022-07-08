import { calculateDaysArray } from '../utils/dates';

describe('calculateDaysArray', () => {
  const expectToBeMomentArray = (daysArray) =>
    daysArray.forEach((day) => expect(day.toDate()).toBeValidDate());

  describe('Given correct inputs', () => {
    it('Given 5 days, returns array of dates', () => {
      const daysArray = calculateDaysArray(new Date(2021, 1, 1), 5, false);

      expect(daysArray).toBeArrayOfSize(5);
      expectToBeMomentArray(daysArray);
    });

    it('Given 1 day, returns array of dates', () => {
      const daysArray = calculateDaysArray(new Date(2021, 1, 1), 1, false);

      expect(daysArray).toBeArrayOfSize(1);
      expectToBeMomentArray(daysArray);
    });

    it('Given 6 days, returns correlative days', () => {
      const initialDay = new Date(2021, 2, 5);
      const nDays = 6;
      const daysArray = calculateDaysArray(initialDay, nDays, false);

      expect(daysArray).toBeArrayOfSize(nDays);
      for (let i = 0; i < nDays; i += 1) {
        const date = daysArray[i].toDate();
        expect(date).toBeValidDate();
        expect(date.getDate()).toBe(initialDay.getDate() + i);
      }
    });

    it('Given 8 days and rightToLeft=true, returns correlative days in reverse', () => {
      const day = new Date(2020, 3, 10);
      const nDays = 8;
      const daysArray = calculateDaysArray(day, nDays, true);

      expect(daysArray).toBeArrayOfSize(nDays);
      for (let i = 0; i < nDays; i += 1) {
        const date = daysArray[nDays - 1 - i].toDate();

        expect(date).toBeValidDate();
        expect(date.getDate()).toBe(day.getDate() + i);
      }
    });
  });
});
