import resolveEventOverlaps from '../../pipeline/overlap';
import buildExampleWithIgnore from './overlap.example';

const makeEventWithMetaBuilder = () => {
  let counter = 0;
  return ({ startDate, endDate }) => {
    const nextId = counter;
    counter += 1;
    return {
      box: {
        background: false,
        startDate,
        endDate,
      },
      ref: {
        id: nextId,
        color: 'blue',
        description: 'Event 1',
        startDate,
        endDate,
      },
    };
  };
};

const hasNoOverlap = (overlap) =>
  overlap == null || (overlap.nLanes === 1 && overlap.lane === 0);

describe('resolveEventOverlaps', () => {
  let inputEventsWithMeta;
  describe('with overlapping events', () => {
    beforeEach(() => {
      const builder = makeEventWithMetaBuilder();
      inputEventsWithMeta = [
        builder({
          startDate: new Date(2023, 1, 21, 12),
          endDate: new Date(2023, 1, 21, 18),
        }),
        builder({
          startDate: new Date(2023, 1, 21, 14),
          endDate: new Date(2023, 1, 21, 16),
        }),
      ];
    });

    it('puts them in parallel lanes', () => {
      const outputEvents = resolveEventOverlaps(inputEventsWithMeta);

      expect(outputEvents).toBeArrayOfSize(2);
      outputEvents.forEach((ev) => expect(ev.overlap.nLanes).toEqual(2));

      const [firstEvent, secondEvent] = outputEvents;
      expect(firstEvent.overlap.lane).not.toEqual(secondEvent.overlap.lane);
    });
  });

  describe('with non-overlapping events', () => {
    beforeEach(() => {
      const builder = makeEventWithMetaBuilder();
      inputEventsWithMeta = [
        builder({
          startDate: new Date(2023, 1, 21, 12),
          endDate: new Date(2023, 1, 21, 16),
        }),
        builder({
          startDate: new Date(2023, 1, 21, 18),
          endDate: new Date(2023, 1, 21, 20),
        }),
      ];
    });

    it('does not overlap them', () => {
      const outputEvents = resolveEventOverlaps(inputEventsWithMeta);

      expect(outputEvents).toBeArrayOfSize(2);
      outputEvents.forEach((ev) =>
        expect(hasNoOverlap(ev.overlap)).toBeTruthy(),
      );
    });
  });

  describe('when using "ignore" as method', () => {
    beforeEach(() => {
      inputEventsWithMeta = buildExampleWithIgnore();
    });

    it('does not overlap event that is far away', () => {
      // Target issue 291
      const outputEvents = resolveEventOverlaps(inputEventsWithMeta);

      expect(outputEvents).toBeArrayOfSize(inputEventsWithMeta.length);

      const evtFarAway = outputEvents.find(({ ref }) => ref.id === 1);
      expect(evtFarAway).toBeTruthy();
      expect(evtFarAway.overlap).toSatisfy(hasNoOverlap);
    });
  });
});
