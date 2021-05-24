import React from 'react';
import PropTypes from 'prop-types';
import {Calendar, momentLocalizer} from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

import {getUsersEvents} from '../../API/EventAPI';
import {getMemberBusinesses} from '../../API/BusinessAPI';
import {getUserInfo} from '../../API/UserAPI';

const localizer = momentLocalizer(moment);

/**
 *
 * @param {*} props
 * @return {object} JSX
 */
export const EventCalendar = ({BusinessList, EventList,
  ...rest}) => {
  const calendars = [];
  BusinessList.forEach((element) => {
    calendars.push({id: element.businessid, name: element.businessname});
  });

  const events = [];
  EventList.forEach((element) => {
    const event = {
      // id: element.eventid,
      // calendarId: element.businessid,
      title: element.eventname,
      start: moment(element.starttime).toDate(),
      end: moment(element.endtime).toDate(),
    };
    events.push(event);
  });


  return (
    <Calendar
      {...rest}
      localizer={localizer}
      defaultDate={new Date()}
      defaultView='week'
      events={events}
    />
  );
};

EventCalendar.propTypes = {
  BusinessList: PropTypes.arrayOf(PropTypes.object),
  EventList: PropTypes.arrayOf(PropTypes.object),
  style: PropTypes.object,
};

/**
 * A calender which event data on a users attending events
 * @param {*} props
 * @return {Object} JSX
 */
export const UserAttendingCalendar = (props) => {
  const [eventList, setEventList] = React.useState([]);
  const [businessList, setBusinessList] = React.useState([]);

  React.useEffect(async () => {
    getUserInfo().then((json) => {
      getMemberBusinesses(json.useremail).then((json) => {
        setBusinessList(json);
      });
    });

    const userEvents = await getUsersEvents();
    setEventList(userEvents);
  }, []);


  return (
    <EventCalendar
      {...props}
      EventList={eventList}
      BusinessList={businessList}
    />
  );
};

