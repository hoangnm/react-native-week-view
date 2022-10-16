import React from 'react';
import { Dimensions } from 'react-native';
import { render, fireEvent } from '@testing-library/react-native';
import WeekView from '../../WeekView/WeekView';
import { computeHorizontalDimensions } from '../../utils/dimensions';
import { PAGES_OFFSET, DEFAULT_WINDOW_SIZE } from '../../utils/pages';

/** Utility function */
const addDays = (date, nDays) => {
  const newDate = new Date(date);
  newDate.setDate(date.getDate() + nDays);
  return newDate;
};

/**
 * FIXME: this test is somewhat limited, it requires
 * knowing the scroll-dimensions (contentWidth, layoutWidth, etc)
 * to perform the scroll.
 * Ideally, we would use something like pointer-events for react
 * (https://testing-library.com/docs/user-event/pointer), but it does
 * not exist for react-native (AFAIK).
 * */
describe('Swiping pages', () => {
  const { width: SCREEN_WIDTH } = Dimensions.get('window');

  const getScrollDimensions = (numberOfDays) => {
    const { pageWidth } = computeHorizontalDimensions(
      SCREEN_WIDTH,
      numberOfDays,
    );

    return {
      pageWidth,
      contentWidth: pageWidth * DEFAULT_WINDOW_SIZE,
      layoutWidth: pageWidth,
      initialXPosition: pageWidth * PAGES_OFFSET,
    };
  };

  const selectedDate = new Date(2022, 9, 12);
  const events = [
    {
      id: 34,
      startDate: new Date(2022, 9, 12, 10),
      endDate: new Date(2022, 9, 12, 12),
      description: 'some event',
    },
    {
      id: 91,
      startDate: new Date(2022, 9, 13, 11),
      endDate: new Date(2022, 9, 13, 13, 15),
      description: 'other event',
    },
  ];

  const renderGridAndFireScroll = (props, nextOrPrevDirection) => {
    const { getByHintText } = render(
      <WeekView
        events={events}
        selectedDate={selectedDate}
        hoursInDisplay={24}
        startHour={0}
        pageStartAt={{ left: 0 }}
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...props}
      />,
    );
    const grid = getByHintText('Grid with horizontal scroll');

    const {
      initialXPosition,
      pageWidth,
      contentWidth,
      layoutWidth,
    } = getScrollDimensions(props.numberOfDays || 7);

    const horizontalInverted = props.rightToLeft !== props.prependMostRecent;
    const scrollDirection = nextOrPrevDirection * (horizontalInverted ? -1 : 1);

    fireEvent(grid, 'onMomentumScrollBegin');
    fireEvent(grid, 'onMomentumScrollEnd', {
      nativeEvent: {
        /**
         * NOTE: The target position is set with respect to the initial position,
         * this method:
         * --> can be used to swipe only one page from the initial position,
         * --> cannot be used to swipe multiple times or multiple pages!
         */
        contentOffset: {
          x: initialXPosition + pageWidth * scrollDirection,
        },
        contentSize: {
          width: contentWidth,
        },
        layoutMeasurement: {
          width: layoutWidth,
        },
      },
    });
  };

  describe.each([
    [3, {}],
    [5, {}],
    [5, { prependMostRecent: true }],
    [7, {}],
  ])('with %d days and props %p', (numberOfDays, moreProps) => {
    it.each([
      ['prev', 'onSwipePrev', 'onSwipeNext', -1],
      ['next', 'onSwipeNext', 'onSwipePrev', 1],
    ])(
      'when swiping %s, calls %s once, with the correct date',
      (_, target, nonTarget, direction) => {
        const mockProps = {
          numberOfDays,
          ...(moreProps || {}),
          onSwipePrev: jest.fn(),
          onSwipeNext: jest.fn(),
        };
        renderGridAndFireScroll(mockProps, direction);

        expect(mockProps[nonTarget]).not.toHaveBeenCalled();

        const newPageDate = addDays(selectedDate, direction * numberOfDays);
        const callback = mockProps[target];
        expect(callback).toHaveBeenCalledOnce();
        expect(callback).toHaveBeenCalledWith(
          expect.toBeSameDayAs(newPageDate),
        );
      },
    );
  });
});
