/* eslint-disable max-classes-per-file */
import moment from 'moment';
import { DATE_STR_FORMAT } from '../utils/dates';

export const getDaysSpan = (startDate, endDate) => {
  const days = [];
  for (
    let date = moment(startDate);
    date.isSameOrBefore(endDate, 'days');
    date.add(1, 'days')
  ) {
    days.push(date.format(DATE_STR_FORMAT));
  }
  return days;
};

class Lane {
  constructor() {
    this.usedDays = {};
  }

  hasAvailable = (days) => {
    if (!days || days.length === 0) return false;
    return days.every((day) => !this.usedDays[day]);
  };

  markAsUsed = (days) => {
    if (!days) return;
    days.forEach((day) => {
      this.usedDays[day] = true;
    });
  };
}

export class AllDayLayout {
  constructor() {
    this.lanes = [];
    this.maxLaneByDay = {};
  }

  getMaxLaneByDay = (day) => {
    const maxLane = this.maxLaneByDay[day];
    if (maxLane == null) return -1;
    return maxLane;
  };

  getLaneWithAvailableDays = (days) =>
    this.lanes.findIndex((lane) => lane.hasAvailable(days));

  useNextAvailableLane = (days) => {
    let laneIndex = this.getLaneWithAvailableDays(days);
    if (laneIndex === -1) {
      this.lanes.push(new Lane());
      laneIndex = this.lanes.length - 1;
    }
    this.lanes[laneIndex].markAsUsed(days);
    days.forEach((day) => {
      this.maxLaneByDay[day] = Math.max(laneIndex, this.getMaxLaneByDay(day));
    });
    return laneIndex;
  };

  computeMaxLanesVisible = (visibleDays) => {
    return Math.max(...visibleDays.map((day) => this.getMaxLaneByDay(day))) + 1;
  };
}
