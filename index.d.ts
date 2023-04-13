import React from 'react';
import { StyleProp, ViewStyle, TextStyle } from 'react-native';
import { Moment } from 'moment';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface WeekViewEvent extends Record<string, any> {
  id: number;
  description: string;
  startDate: Date;
  endDate: Date;
  eventKind: 'block' | 'standard';
  resolveOverlap: 'stack' | 'lane' | 'ignore';
  stackKey: string;
  color: string;
  style?: StyleProp<ViewStyle>;
  disableDrag?: boolean;
  disablePress?: boolean;
  disableLongPress?: boolean;
}

export interface HeaderComponentProps {
  date: Moment;
  formattedDate: string;
  textStyle: StyleProp<TextStyle>;
  isToday: boolean;
}

export interface EventComponentProps {
  event: WeekViewEvent;
  position: {
    top: number;
    left: number;
    height: number;
    width: number;
  };
}

export interface PageStartAtOptions {
  left: number;
  weekday: number;
}

export interface WeekViewProps {
  events: WeekViewEvent[];
  selectedDate: Date;
  numberOfDays: 1 | 3 | 5 | 7;

  // Gesture interactions
  /**
   * Callback when an event item is pressed, receives the event-item pressed
   * @param event
   */
  onEventPress?: (event: WeekViewEvent) => void;

  /**
   * Callback when an event item is long pressed, same signature as onEventPress
   * @param event
   */
  onEventLongPress?: (event: WeekViewEvent) => void;

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
   * Callback when a day from the header is pressed.
   * @param date
   * @param formattedDate
   */
  onDayPress?(date: Date, formattedDate: string): void;

  /**
   * Callback when the month at the top left (title) is pressed.
   * @param date
   * @param formattedDate
   */
  onMonthPress?(date: Date, formattedDate: string): void;

  /**
   * Callback when the agenda is scrolled vertically.
   * @param dateWithTime
   */
  onTimeScrolled?(dateWithTime: Date): void;

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
  onDragEvent?(
    event: WeekViewEvent,
    newStartDate: Date,
    newEndDate: Date,
  ): void;

  /**
   * If provided, events are draggable only after being long pressed
   * for some time.
   * **Requires rn-gesture-handler v2.6.0 or higher.**
   * Disables the `onLongPress` callback.
   */
  dragEventConfig?: {
    afterLongPressDuration: number;
  };

  /**
   * Which event is being edited.
   */
  editingEvent?: number | string;

  /**
   * Callback when an event item is edited by dragging its borders.
   * @param event
   * @param newStartDate
   * @param newEndDate
   */
  onEditEvent?(
    event: WeekViewEvent,
    newStartDate: Date,
    newEndDate: Date,
  ): void;

  editEventConfig?: {
    bottom: boolean;
    top: boolean;
    left: boolean;
    right: boolean;
  };

  // Week-view customizations
  /**
   * Vertical position of the week-view in the first render (vertically in the agenda).
   *
   * Default value: 8 (8 am)
   */
  startHour?: number;

  /**
   * Indicates what date to show in the top-left corner.
   *
   * If `left = value` provided, the `selectedDate` will appear
   * at `value` days from the left.
   *
   * If `weekday = value` _(e.g. tuesday = 2)_ is provided,
   * the latest tuesday will appear in the left.
   */
  pageStartAt?: PageStartAtOptions;

  /**
   * When `true`, the component can scroll horizontally one day at the time.
   * When `false`, the horizontal scroll can only be done one page
   * at the time (i.e. `numberOfDays` at the time).
   */
  allowScrollByDay?: boolean;

  /**
   * Show or hide the selected month and year in the top-left corner (a.k.a the title).
   */
  showTitle?: boolean;

  hoursInDisplay?: number;

  beginAgendaAt?: number;
  endAgendaAt?: number;
  timeStep?: number;
  formatDateHeader?: string;
  formatTimeLabel?: string;
  timesColumnWidth?: number;

  EventComponent?: React.FC<EventComponentProps>;
  TodayHeaderComponent?: React.FC<HeaderComponentProps>;
  DayHeaderComponent?: React.FC<HeaderComponentProps>;

  showNowLine?: boolean;
  nowLineColor?: string;
  fixedHorizontally?: boolean;
  isRefreshing?: boolean;

  RefreshComponent?: React.Component;

  locale?: string;
  rightToLeft?: boolean;

  // Style props
  headerStyle?: StyleProp<ViewStyle>;
  headerTextStyle?: StyleProp<TextStyle>;
  hourTextStyle?: StyleProp<TextStyle>;
  eventContainerStyle?: StyleProp<ViewStyle>;

  // Grid lines props
  gridRowStyle?: StyleProp<ViewStyle>;
  gridColumnStyle?: StyleProp<ViewStyle>;

  // Horizontal list optimizations
  windowSize?: number;
  initialNumToRender?: number;
  maxToRenderPerBatch?: number;
  updateCellsBatchingPeriod?: number;
  removeClippedSubviews?: boolean;
  disableVirtualization?: boolean;

  // Other props (patch RN bugs)
  prependMostRecent?: boolean;
}

declare const WeekView: React.ComponentType<WeekViewProps>;

export default WeekView;
