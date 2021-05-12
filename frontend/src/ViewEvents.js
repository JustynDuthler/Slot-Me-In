import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Carousel from 'react-elastic-carousel';
import Box from '@material-ui/core/Box';
import {Link} from 'react-router-dom';
import {EventCard} from './Components';

import Context from './Context';
const Auth = require('./libs/Auth');

const useStyles = makeStyles({
  root: {
    minWidth: 275,
  },
  box: {
    marginTop: -15,
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginTop: 8,
  },
  gridContainer: {
    paddingLeft: '10px',
    paddingRight: '10px',
  },
  pageBox: {
    position: 'fixed',
    left: '50vw',
    bottom: 15,
    transform: 'translate(-50%, -50%)',
  },
});

/**
 * ViewEvents component
 * @return {object} ViewEvents JSX
 */
export default function ViewEvents() {
  const classes = useStyles();
  const [eventList, setEventList] = React.useState([]);
  const [memberEvents, setMemberEvents] = React.useState([]);
  const [memberBusinesses, setMemberBusinesses] = React.useState([]);
  // const [userInfo, setUserInfo] = React.useState([]);
  const context = React.useContext(Context);

  /**
   * getUserInfo
   * API call to get the info for the user
   */
  function getUserInfo() {
    const apicall = 'http://localhost:3010/api/users/getUser';
    fetch(apicall, {
      method: 'GET',
      headers: Auth.headerJsonJWT(),
    }).then((response) => response.json())
        .then((json) => {
          // setUserInfo(json);
          getMemberEvents(json.useremail);
          getMemberBusinesses(json.useremail);
        },
        (error) => {
          console.log(error);
        },
        );
  };

  /**
   * getMemberBusinesses
   * API call to get all businesses the user
   * is a part of
   * @param {string} email
   */
  function getMemberBusinesses(email) {
    const apicall = 'http://localhost:3010/api/members/getMemberBusinesses/'+email;
    fetch(apicall, {
      method: 'GET',
    }).then((response) => {
      if (!response.ok) {
        throw response;
      } else {
        return response.json();
      }
    }).then((json) => {
      setMemberBusinesses(json);
      console.log(json);
    })
        .catch((error) => {
          console.log(error);
        });
    console.log(memberBusinesses);
  };

  /**
   * getMemberEvents
   * API call to get all events for businesses the user
   * is a part of
   * @param {string} email
   */
  function getMemberEvents(email) {
    const apicall = 'http://localhost:3010/api/members/getRestrictedEvents/'+email;
    fetch(apicall, {
      method: 'GET',
    }).then((response) => {
      if (!response.ok) {
        throw response;
      } else {
        return response.json();
      }
    }).then((json) => {
      setMemberEvents(json);
      console.log(json);
    })
        .catch((error) => {
          console.log(error);
        });
    console.log(memberEvents);
  };

  /**
   * getEvents
   * API call to get data for an event
   */
  function getEvents() {
    const apicall = 'http://localhost:3010/api/events';
    fetch(apicall, {
      method: 'GET',
      headers: Auth.headerJsonJWT(),
    }).then((response) => {
      if (!response.ok) {
        if (response.status === 401) {
          Auth.removeJWT();
          context.setAuthState(false);
          throw response;
        }
      }
      return response.json();
    }).then((json) => {
      setEventList(json.slice(0, 8));
    })
        .catch((error) => {
          console.log(error);
        });
  };

  React.useEffect(() => {
    getEvents();
    if (context.businessState === false) {
      getUserInfo();
    }
  }, []);
  console.log(memberBusinesses);

  const breakPoints = [
    {width: 1, itemsToShow: 1},
    {width: 750, itemsToShow: 3},
    {width: 1020, itemsToShow: 4},
    {width: 1300, itemsToShow: 5},
    {width: 1700, itemsToShow: 6},
    {width: 2000, itemsToShow: 7},
  ];

  // only show this if it is a user account
  let showMemberEvents;
  if (context.businessState === false) {
    showMemberEvents = (
      <Box mt={10}>
        <h1 style={{float: 'left'}}>Member Events</h1>
        <Box pt={5}>
          <Link to="/allevents" style={{float: 'right'}}>
            See All Events
          </Link>
        </Box>
        <Box mt={5} mb={5} className={classes.box}>
          <Carousel breakPoints={breakPoints}>
            {memberEvents.map((event) =>
              <EventCard key={event.eventid} context={context} row={event}/>,
            )}
          </Carousel>
        </Box>
      </Box>
    );
  } else {
    showMemberEvents = (
      <div></div>
    );
  }

  return (
    <React.Fragment>
      <input type="text" placeholder="Ignore this search bar..." />
      {showMemberEvents}
      <Box mt={10}>
        <h1 style={{float: 'left'}}>All Events</h1>
        <Box pt={5}>
          <Link to="/allevents" style={{float: 'right'}}>
            See All Events
          </Link>
        </Box>
        <Box mt={5} mb={5} className={classes.box}>
          <Carousel breakPoints={breakPoints}>
            {eventList.map((event) =>
              <EventCard key={event.eventid} context={context} row={event}/>,
            )}
          </Carousel>
        </Box>
      </Box>
    </React.Fragment>
  );
}
