import { minutesInDay } from '../utils/dates';
import { minutesInDayToTop, minutesToHeight } from '../utils/dimensions';

const EVENT_HORIZONTAL_PADDING = 8 / 100;
const STACK_OFFSET_FRACTION = 15 / 100;
const MIN_ITEM_WIDTH = 4; // pixels

const computeWidthByLane = (nLanes, dayWidth) => {
  'worklet';

  return dayWidth / (nLanes || 1);
};

const computeHorizontalPadding = (nLanes, dayWidth) => {
  'worklet';

  const widthByLane = computeWidthByLane(nLanes, dayWidth);
  const paddingByLane = EVENT_HORIZONTAL_PADDING / (nLanes || 1);
  return widthByLane * paddingByLane;
};

const computeStackOffset = (nLanes, stackPosition, dayWidth) => {
  'worklet';

  const widthByLane = computeWidthByLane(nLanes, dayWidth);
  return widthByLane * STACK_OFFSET_FRACTION * (stackPosition || 0);
};

const daysInBetweenInclusive = (startTimestamp, endTimestamp) => {
  'worklet';

  const startWeekDay = new Date(startTimestamp).getDay();
  const endWeekDay = new Date(endTimestamp).getDay();

  const positiveDayDiffExclusive = (endWeekDay + 7 - startWeekDay) % 7;
  return positiveDayDiffExclusive + 1;
};

export const computeWidth = (
  boxStartTimestamp,
  boxEndTimestamp,
  nLanes,
  stackPosition,
  dayWidth,
) => {
  'worklet';

  const nDays = daysInBetweenInclusive(boxStartTimestamp, boxEndTimestamp);
  const width =
    computeWidthByLane(nLanes, dayWidth) * nDays -
    computeHorizontalPadding(nLanes, dayWidth) -
    computeStackOffset(nLanes, stackPosition, dayWidth);
  return Math.max(width, MIN_ITEM_WIDTH);
};

const computeLaneOffset = (lane, nLanes, dayWidth) => {
  'worklet';

  return computeWidthByLane(nLanes, dayWidth) * (lane || 0);
};

export const computeLeft = (lane, nLanes, stackPosition, dayWidth) => {
  'worklet';

  const left =
    computeLaneOffset(lane, nLanes, dayWidth) +
    computeStackOffset(nLanes, stackPosition, dayWidth);
  return Math.min(left, dayWidth);
};

export const computeHeight = (
  boxStartTimestamp,
  boxEndTimestamp,
  verticalResolution,
) => {
  'worklet';

  return minutesToHeight(
    minutesInDay(boxEndTimestamp) - minutesInDay(boxStartTimestamp),
    verticalResolution,
  );
};

export const computeTop = (
  boxStartTimestamp,
  verticalResolution,
  beginAgendaAt,
) => {
  'worklet';

  return minutesInDayToTop(
    minutesInDay(boxStartTimestamp),
    verticalResolution,
    beginAgendaAt,
  );
};
