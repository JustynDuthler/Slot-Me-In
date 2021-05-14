import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Carousel from 'react-elastic-carousel';
import Box from '@material-ui/core/Box';
import {Link} from 'react-router-dom';
import EventCard from './Components/Events/EventCard';
import {Grid} from '@material-ui/core';
import Typography from '@material-ui/core/Typography';

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
    })
        .catch((error) => {
          console.log(error);
        });
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
      setMemberEvents(json.slice(0, 8));
    })
        .catch((error) => {
          console.log(error);
        });
  };

  /**
   * getEvents
   * API call to get data for an event
   */
  function getEvents() {
    const apicall = 'http://localhost:3010/api/events/publicEvents';
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

  const breakPoints = [
    {width: 1, itemsToShow: 1},
    {width: 750, itemsToShow: 3},
    {width: 1020, itemsToShow: 4},
    {width: 1300, itemsToShow: 5},
    {width: 1700, itemsToShow: 6},
    {width: 2000, itemsToShow: 7},
  ];

  // only show if it is a user account
  let showMemberEvents;
  if (context.businessState === false) {
    if (memberEvents.length === 0) {
      showMemberEvents = (
        <Grid item xs={8}>
          <Box display="flex"
            mt={10}>
            <Typography variant="h4" style={{float: 'left'}}>
              Member Events
            </Typography>
          </Box>
          <Box display="flex">
            You are not a member of any businesses.
          </Box>
        </Grid>
      );
    } else {
      showMemberEvents = (
        <Grid item xs={8}>
          <Box mt={10}>
            <Typography variant="h4" style={{float: 'left'}}>
              Member Events
            </Typography>
            <Box pt={5}>
              <Link to="/allevents" style={{float: 'right'}}>
                See All Events
              </Link>
            </Box>
            <Box mt={5} mb={5} className={classes.box}>
              <Carousel breakPoints={breakPoints}>
                {memberEvents.map((event) =>
                  <EventCard key={event.eventid} context={context}
                    row={event}/>,
                )}
              </Carousel>
            </Box>
          </Box>
        </Grid>
      );
    }
  } else {
    showMemberEvents = (
      <div></div>
    );
  }

  // only show if it is a user account
  let showBusinesses;
  if (context.businessState === false) {
    if (memberBusinesses.length === 0) {
      showBusinesses = (
        <Grid item xs={4}>
          <Box display="flex" alignItems="center" justifyContent="center"
            mt={10}>
            <Typography variant="h4">
              My Businesses
            </Typography>
          </Box>
          <Box display="flex" border={3} alignItems="center"
            justifyContent="center" mr={15} ml={15} mt={3}>
            You are not a member of any businesses.
          </Box>
        </Grid>
      );
    } else {
      showBusinesses = (
        <Grid item xs={4}>
          <Box display="flex" alignItems="center" justifyContent="center"
            mt={10}>
            <Typography variant="h4">
              My Businesses
            </Typography>
          </Box>
          <Box display="flex" border={3} alignItems="center"
            justifyContent="center" mr={15} ml={15} mt={3}>
            <Grid item xs={4}>
              {memberBusinesses.map((business) =>
                <Box key={business.businessid}>
                  <Typography
                    variant="h5"
                    align="center">
                    {business.businessname}
                  </Typography>
                </Box>,
              )}
            </Grid>
          </Box>
        </Grid>
      );
    }
  } else {
    showBusinesses = (
      <div></div>
    );
  }

  return (
    <React.Fragment>
      <Box p={5} ml={20}>
        <Box>
          <input type="text" placeholder="Ignore this search bar..." />
        </Box>
        <Grid container spacing={0}>
          {showMemberEvents}
          {showBusinesses}
          <Grid item xs={8}>
            <Box mt={10}>
              <Typography variant="h4" style={{float: 'left'}}>
                All Events
              </Typography>
              <Box pt={5}>
                <Link to="/allevents" style={{float: 'right'}}>
                  See All Events
                </Link>
              </Box>
              <Box mt={5} mb={5} className={classes.box}>
                <Carousel breakPoints={breakPoints}>
                  {eventList.map((event) =>
                    <EventCard key={event.eventid} context={context}
                      row={event}/>,
                  )}
                </Carousel>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </React.Fragment>
  );
}
