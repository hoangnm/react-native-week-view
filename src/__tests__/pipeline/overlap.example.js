const INPUT_EVENTS_WITH_META = [
  {
    box: {
      background: true,
      startDate: new Date(2023, 1, 21, 12, 30),
      endDate: new Date(2023, 1, 21, 17),
    },
    ref: {
      id: 10,
      color: 'green',
      description: '',
      startDate: new Date(2023, 1, 21, 12, 30),
      endDate: new Date(2023, 1, 21, 17),
      eventKind: 'block',
      resolveOverlap: 'ignore',
    },
  },
  {
    box: {
      background: false,
      startDate: new Date(2023, 1, 21, 10),
      endDate: new Date(2023, 1, 21, 11, 30),
    },
    ref: {
      id: 1,
      color: 'blue',
      description: 'Event 1',
      startDate: new Date(2023, 1, 21, 10),
      endDate: new Date(2023, 1, 21, 11, 30),
    },
  },
  {
    box: {
      background: false,
      startDate: new Date(2023, 1, 21, 12),
      endDate: new Date(2023, 1, 21, 16),
    },
    ref: {
      color: 'red',
      description: 'Event 3',
      id: 3,
      startDate: new Date(2023, 1, 21, 12),
      endDate: new Date(2023, 1, 21, 16),
    },
  },
  {
    box: {
      background: false,
      startDate: new Date(2023, 1, 21, 13),
      endDate: new Date(2023, 1, 21, 14, 30),
    },
    ref: {
      color: 'orange',
      description: 'Event 2',
      id: 2,
      startDate: new Date(2023, 1, 21, 13),
      endDate: new Date(2023, 1, 21, 14, 30),
    },
  },
];

const buildExampleWithIgnore = () => INPUT_EVENTS_WITH_META;

export default buildExampleWithIgnore;
