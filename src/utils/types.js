import PropTypes from 'prop-types';

export const EditEventConfigPropType = PropTypes.shape({
  left: PropTypes.bool,
  top: PropTypes.bool,
  right: PropTypes.bool,
  bottom: PropTypes.bool,
});

export const OVERLAP_METHOD = {
  STACK: 'stack',
  LANE: 'lane',
  IGNORE: 'ignore',
};

export const ResolveOverlapPropType = PropTypes.oneOf(
  Object.values(OVERLAP_METHOD),
);

export const EVENT_KINDS = {
  BLOCK: 'block',
  STANDARD: 'standard',
};

export const EventKindPropType = PropTypes.oneOf(Object.values(EVENT_KINDS));

export const EventPropType = PropTypes.shape({
  color: PropTypes.string,
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  description: PropTypes.string,
  startDate: PropTypes.instanceOf(Date).isRequired,
  endDate: PropTypes.instanceOf(Date).isRequired,
  style: PropTypes.object,
  textStyle: PropTypes.object,
  disableDrag: PropTypes.bool,
  disablePress: PropTypes.bool,
  disableLongPress: PropTypes.bool,
  eventKind: EventKindPropType,
  resolveOverlap: ResolveOverlapPropType,
  stackKey: PropTypes.string,
  allDay: PropTypes.bool,
});

export const EventWithMetaPropType = PropTypes.shape({
  ref: EventPropType.isRequired,
  box: PropTypes.shape({
    startTimestamp: PropTypes.number.isRequired,
    endTimestamp: PropTypes.number.isRequired,
  }).isRequired,
});

export const AllDayEventsWithMetaPropType = PropTypes.shape({
  ref: EventPropType.isRequired,
  overlap: PropTypes.shape({
    lane: PropTypes.number.isRequired,
    width: PropTypes.number.isRequired,
  }).isRequired,
});

export const DragEventConfigPropType = PropTypes.shape({
  afterLongPressDuration: PropTypes.number,
});

export const GridRowPropType = PropTypes.shape({
  borderColor: PropTypes.string,
  borderTopWidth: PropTypes.number,
});

export const GridColumnPropType = PropTypes.shape({
  borderColor: PropTypes.string,
  borderLeftWidth: PropTypes.number,
});

export const PageStartAtOptionsPropType = PropTypes.shape({
  left: PropTypes.number,
  weekday: PropTypes.number,
});

export const ReanimatedSharedValue = PropTypes.shape({
  value: PropTypes.number,
});
