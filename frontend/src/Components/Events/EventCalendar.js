import React from 'react';
// import PropTypes from 'prop-types';
import Calendar from '@toast-ui/react-calendar';
import 'tui-calendar/dist/tui-calendar.css';


import 'tui-date-picker/dist/tui-date-picker.css';
import 'tui-time-picker/dist/tui-time-picker.css';
/**
 *
 * @param {*} props
 * @return {object} JSX
 */
const EventCalendar = () => {
  const today = new Date();
  return (
    <Calendar
      height={'100%'}
      usageStatistics={false}
      taskView={false}
      disableClick={true}
      isReadOnly={true}
      calendars={[{
        id: '0',
        name: 'Google',
        bgColor: '#9e5fff',
        borderColor: '#9e5fff',
      }]}
      schedules={[
        {
          id: '1',
          calendarId: '0',
          title: 'TOAST UI Calendar Study',
          category: 'time',
          dueDateClass: '',
          start: today.toISOString(),
          end: today.toISOString(),
        }]}
    />
  );
};

export default EventCalendar;
