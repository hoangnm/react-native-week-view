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
  numberOfDays: number;

  formatDateHeader?: string;
  formatTimeLabel?: string;
  showTitle?: boolean;
  hoursInDisplay?: number;
  hourTextStyle?: StyleProp<TextStyle>;
  eventContainerStyle?: StyleProp<ViewStyle>;
  headerStyle?: StyleProp<ViewStyle>;
  gridRowStyle?: StyleProp<ViewStyle>;
  gridColumnStyle?: StyleProp<ViewStyle>;
  EventComponent?: React.FC<EventComponentProps>;
  TodayHeaderComponent?: React.FC<HeaderComponentProps>;
  DayHeaderComponent?: React.FC<HeaderComponentProps>;

  onEventPress?: (event: Event) => void;
}

declare const WeekView: React.ComponentType<WeekViewProps>;

export default WeekView;
