import React from 'react';
import { StyleProp, ViewStyle, TextStyle } from 'react-native';
import { Moment } from 'moment';

export interface Event extends Record<string, any> {
  id: number;
  description: string;
  startDate: Date;
  endDate: Date;
  color: string;
}

export interface HeaderComponentProps {
  date: Moment;
  formattedDate: string;
  textStyle: StyleProp<TextStyle>;
  isToday: boolean;
}

export interface EventComponentProps {
  event: Event;
  position: {
    top: number;
    left: number;
    height: number;
    width: number;
  };
}

export interface WeekViewProps {
  events: Event[];
  selectedDate: Date;
  numberOfDays: 1 | 3 | 5 | 7;

  formatDateHeader?: string;
  formatTimeLabel?: string;
  /**
   * Show or hide the selected month and year in the top-left corner (a.k.a the title).
   */
  showTitle?: boolean;
  showNowLine?: boolean;
  nowLineColor?: string;
  fixedHorizontally?: boolean;
  isRefreshing?: boolean;
  hoursInDisplay?: number;
  beginAgendaAt?: number;
  endAgendaAt?: number;
  timeStep?: number;
  locale?: string;
  rightToLeft?: boolean;

  prependMostRecent?: boolean;

  headerStyle?: StyleProp<ViewStyle>;
  headerTextStyle?: StyleProp<ViewStyle>;
  hourTextStyle?: StyleProp<TextStyle>;
  eventContainerStyle?: StyleProp<ViewStyle>;
  gridRowStyle?: StyleProp<ViewStyle>;
  gridColumnStyle?: StyleProp<ViewStyle>;

  EventComponent?: React.FC<EventComponentProps>;
  TodayHeaderComponent?: React.FC<HeaderComponentProps>;
  DayHeaderComponent?: React.FC<HeaderComponentProps>;
  footerComponent?: React.FC<HeaderComponentProps>;
  RefreshComponent?: React.Component;

  // Week-view customizations
  /**
   * Vertical position of the week-view in the first render (vertically in the agenda).
   *
   * Default value: 8 (8 am)
   */
  startHour?: number

  /**
   * First day of the week, i.e. day to show at the left of the week-view
   * (0 is Sunday, 1 is Monday, and so on). Only useful when numberOfDays === 7
   * or fixedHorizontally is true.
   *
   * Default value: 1 (Monday)
   */
  weekStartsOn?: number;

  /**
   * Callback when an event item is pressed, receives the event-item pressed
   * @param event
   */
  onEventPress?: (event: Event) => void;

  /**
   * Callback when an event item is long pressed, same signature as onEventPress
   * @param event
   */
  onEventLongPress?: (event: Event) => void;

  /**
   * Callback when week-view is swiped to next week/days,
   * receives new date shown.
   * @param date
   */
  onSwipeNext?(date: Date): void;

  /**
   * Callback when week-view is swiped to previous week/days,
   * same signature as onSwipeNext.
   * @param date
   */
  onSwipePrev?(date: Date): void;

  /**
   * Callback when the grid view is pressed. Arguments: pressEvent:
   * object passed by the
   * [react-native-gesture-handler](https://docs.swmansion.com/react-native-gesture-handler/docs/api/gestures/touch-events)
   * touch events (not an event item); startHour: Number, hour pressed;
   * date Date, date object indicating day and time pressed with precision up
   * to seconds.
   *
   * Note: startHour is redundant (can be extracted from date),
   * but is kept for backward-compatibility.
   * @param pressEvent
   * @param startHour
   * @param date
   */
  onGridClick?(pressEvent: TouchEvent, startHour: number, date: Date): void;

  /**
   * Callback when the grid view is long-pressed. Same signature as onGridClick
   * @param pressEvent
   * @param startHour
   * @param date
   */
  onGridLongPress?(pressEvent: TouchEvent, startHour: number, date: Date): void;

  /**
   * Callback when an event item is dragged to another position.
   * Arguments: event: event-item moved,and the newStartDate and newEndDate
   * are Date objects with day and hour of the new position (precision up
   * to minutes). With this callback you must trigger an update on the events
   * prop (i.e. update your DB), with the updated information from the event.
   * @param event
   * @param newStartDate
   * @param newEndDate
   */
  onDragEvent?(event: Event, newStartDate: Date, newEndDate: Date): void;

  /**
   * Callback when a day from the header is pressed.
   * @param date
   * @param formattedDate
   */
  onDayPress(date: Date, formattedDate: string): void;

  /**
   * Callback when the month at the top left (title) is pressed.
   * @param date
   * @param formattedDate
   */
  onMonthPress(date: Date, formattedDate: string): void;

  /**
   * Callback when the agenda is scrolled vertically.
   * @param dateWithTime
   */
  onTimeScrolled(dateWithTime: Date): void;
}

declare const WeekView: React.ComponentType<WeekViewProps>;

export default WeekView;
