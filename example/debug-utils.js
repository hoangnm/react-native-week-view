/** Debugging utilities. */

export const generateDates = (hours, minutes) => {
  const date = new Date();
  date.setHours(date.getHours() + hours);
  if (minutes != null) {
    date.setMinutes(minutes);
  }
  return date;
};

export const makeBuilder = () => {
  let index = 0;

  return (start, duration, color, more = {}) => {
    index += 1;
    return {
      id: index,
      description: `Event ${index}`,
      startDate: generateDates(start),
      endDate: generateDates(start + duration),
      color,
      ...(more || {}),
    };
  };
};

export const buildDateCycler = (dates = []) => {
  let DATES_SEQUENCE = new Array(...dates);

  return {
    next: (verbose = false) => {
      const nextDate = DATES_SEQUENCE[0];

      DATES_SEQUENCE = DATES_SEQUENCE.slice(1);
      DATES_SEQUENCE.push(nextDate);
      if (verbose) {
        console.log(
          'Cycling dates: ',
          nextDate.getDate(),
          DATES_SEQUENCE.map(d => d.getDate()),
        );
      }
      return nextDate;
    },
  };
};
