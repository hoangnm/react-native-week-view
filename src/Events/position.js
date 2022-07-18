import { minutesInDay } from '../utils/dates';
import { minutesInDayToTop, minutesToHeight } from '../utils/dimensions';

const EVENT_HORIZONTAL_PADDING = 8; // percentage
const STACK_OFFSET = 30; // percentage
const MIN_ITEM_WIDTH = 4; // pixels
const MIN_ITEM_PADDING = 2;

const padItemWidth = (width, paddingPercentage = EVENT_HORIZONTAL_PADDING) =>
  paddingPercentage > 0
    ? width - Math.max(MIN_ITEM_PADDING, (width * paddingPercentage) / 100)
    : width;

const computeWidthByLane = (path, dayWidth) => dayWidth / (path.nLanes || 1);

const computePaddedWidth = (path, dayWidth) => {
  const widthByLane = computeWidthByLane(path, dayWidth);
  const paddingByLane = EVENT_HORIZONTAL_PADDING / (path.nLanes || 1);
  return padItemWidth(widthByLane, paddingByLane);
};

const computeStackOffset = (path, dayWidth) => {
  const widthByLane = computeWidthByLane(path, dayWidth);
  const widthByStacked = widthByLane / (path.nStacked || 1);
  const stackOffset = (STACK_OFFSET * widthByStacked) / 100;
  return stackOffset * (path.stackPosition || 0);
};

export const computeWidth = (path, dayWidth) => {
  const width =
    computePaddedWidth(path, dayWidth) - computeStackOffset(path, dayWidth);
  return Math.max(width, MIN_ITEM_WIDTH);
};

export const computeLeft = (path, dayWidth) => {
  const widthByLane = computeWidthByLane(path, dayWidth);
  const stackOffset = computeStackOffset(path, dayWidth);
  const left = widthByLane * (path.lane || 0) + stackOffset;
  return left;
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
