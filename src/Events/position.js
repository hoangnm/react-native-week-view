import { minutesInDay } from '../utils/dates';
import { minutesInDayToTop, minutesToHeight } from '../utils/dimensions';

const EVENT_HORIZONTAL_PADDING = 8; // percentage
const STACK_OFFSET = 15; // percentage
const MIN_ITEM_WIDTH = 4; // pixels
const MIN_ITEM_PADDING = 2;

const padItemWidth = (width, paddingPercentage = EVENT_HORIZONTAL_PADDING) =>
  paddingPercentage > 0
    ? width - Math.max(MIN_ITEM_PADDING, (width * paddingPercentage) / 100)
    : width;

const computeWidthByLane = (overlap, dayWidth) =>
  dayWidth / (overlap.nLanes || 1);

const computePaddedWidth = (overlap, dayWidth) => {
  const widthByLane = computeWidthByLane(overlap, dayWidth);
  const paddingByLane = EVENT_HORIZONTAL_PADDING / (overlap.nLanes || 1);
  return padItemWidth(widthByLane, paddingByLane);
};

const computeStackOffset = (overlap, dayWidth) => {
  const widthByLane = computeWidthByLane(overlap, dayWidth);
  const stackOffset = (STACK_OFFSET * widthByLane) / 100;
  return stackOffset * (overlap.stackPosition || 0);
};

export const computeWidth = (overlap, dayWidth) => {
  const width =
    computePaddedWidth(overlap, dayWidth) -
    computeStackOffset(overlap, dayWidth);
  return Math.max(width, MIN_ITEM_WIDTH);
};

export const computeLeft = (overlap, dayWidth) => {
  const widthByLane = computeWidthByLane(overlap, dayWidth);
  const stackOffset = computeStackOffset(overlap, dayWidth);
  const left = widthByLane * (overlap.lane || 0) + stackOffset;
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
