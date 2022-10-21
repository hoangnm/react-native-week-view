import { minutesInDay, daysInBetweenInclusive } from '../utils/dates';
import { minutesInDayToTop, minutesToHeight } from '../utils/dimensions';

const EVENT_HORIZONTAL_PADDING = 8 / 100;
const STACK_OFFSET_FRACTION = 15 / 100;
const MIN_ITEM_WIDTH = 4; // pixels

const computeWidthByLane = (overlap, dayWidth) =>
  dayWidth / (overlap.nLanes || 1);

const computeHorizontalPadding = (overlap, dayWidth) => {
  const widthByLane = computeWidthByLane(overlap, dayWidth);
  const paddingByLane = EVENT_HORIZONTAL_PADDING / (overlap.nLanes || 1);
  return widthByLane * paddingByLane;
};

const computeStackOffset = (overlap, dayWidth) => {
  const widthByLane = computeWidthByLane(overlap, dayWidth);
  return widthByLane * STACK_OFFSET_FRACTION * (overlap.stackPosition || 0);
};

export const computeWidth = (box, overlap, dayWidth) => {
  const nDays = daysInBetweenInclusive(box.startDate, box.endDate);
  const width =
    computeWidthByLane(overlap, dayWidth) * nDays -
    computeHorizontalPadding(overlap, dayWidth) -
    computeStackOffset(overlap, dayWidth);
  return Math.max(width, MIN_ITEM_WIDTH);
};

const computeLaneOffset = (overlap, dayWidth) =>
  computeWidthByLane(overlap, dayWidth) * (overlap.lane || 0);

export const computeLeft = (overlap, dayWidth) => {
  const left =
    computeLaneOffset(overlap, dayWidth) +
    computeStackOffset(overlap, dayWidth);
  return Math.min(left, dayWidth);
};

export const computeHeight = (box, verticalResolution) =>
  minutesToHeight(
    minutesInDay(box.endDate) - minutesInDay(box.startDate),
    verticalResolution,
  );

export const computeTop = (box, verticalResolution, beginAgendaAt) =>
  minutesInDayToTop(
    minutesInDay(box.startDate),
    verticalResolution,
    beginAgendaAt,
  );
