import React from 'react';
import PropTypes from 'prop-types';
import {Calendar, momentLocalizer} from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import '../../CSS/EventCalendar.css';
import {useHistory} from 'react-router-dom';

import {getUsersEvents} from '../../API/EventAPI';
import {getMemberBusinesses} from '../../API/BusinessAPI';
import {getUserInfo} from '../../API/UserAPI';

const localizer = momentLocalizer(moment);

/**
 *
 * @param {*} props
 * @return {object} JSX
 */
export const EventCalendar = ({BusinessList, EventList, colorDict,
  ...rest}) => {
  const history = useHistory();

  const calendars = [];
  BusinessList.forEach((element) => {
    calendars.push({id: element.businessid, name: element.businessname});
  });
  const events = [];
  EventList.forEach((element) => {
    const event = {
      id: element.eventid,
      businessid: element.businessid,
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
      eventPropGetter={
        (event, start, end, isSelected) => {
          const color = colorDict.hasOwnProperty(event.businessid) ?
            colorDict[event.businessid] : '#edc97c';
          console.log(colorDict);
          console.log(event.businessid);
          return {
            style: {backgroundColor: color},
          };
        }
      }
      titleAccessor={
        (event) => {
          return event.title;
        }
      }
      formats={{
        eventTimeRangeFormat: () => {
          return '';
        },
      }}
      onDoubleClickEvent={
        (event, e) => {
          history.push('/event/' + event.id);
        }
      }
      onS
    />
  );
};
EventCalendar.propTypes = {
  BusinessList: PropTypes.arrayOf(PropTypes.object),
  EventList: PropTypes.arrayOf(PropTypes.object),
  colorDict: PropTypes.objectOf(PropTypes.string),
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

