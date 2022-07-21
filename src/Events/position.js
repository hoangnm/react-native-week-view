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

const computeWidthByLane = (track, dayWidth) => dayWidth / (track.nLanes || 1);

const computePaddedWidth = (track, dayWidth) => {
  const widthByLane = computeWidthByLane(track, dayWidth);
  const paddingByLane = EVENT_HORIZONTAL_PADDING / (track.nLanes || 1);
  return padItemWidth(widthByLane, paddingByLane);
};

const computeStackOffset = (track, dayWidth) => {
  const widthByLane = computeWidthByLane(track, dayWidth);
  const stackOffset = (STACK_OFFSET * widthByLane) / 100;
  return stackOffset * (track.stackPosition || 0);
};

export const computeWidth = (track, dayWidth) => {
  const width =
    computePaddedWidth(track, dayWidth) - computeStackOffset(track, dayWidth);
  return Math.max(width, MIN_ITEM_WIDTH);
};

export const computeLeft = (track, dayWidth) => {
  const widthByLane = computeWidthByLane(track, dayWidth);
  const stackOffset = computeStackOffset(track, dayWidth);
  const left = widthByLane * (track.lane || 0) + stackOffset;
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
