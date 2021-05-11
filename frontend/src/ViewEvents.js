import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Carousel from 'react-elastic-carousel';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import {Link} from 'react-router-dom';

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
        },
        (error) => {
          console.log(error);
        },
        );
  };

  /**
   * getMemberEvents
   * API call to get all events for businesses the user
   * is a part of
   * @param {string} email
   */
  function getMemberEvents(email) {
    console.log(email);
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
  console.log(memberEvents);
  React.useEffect(() => {
    getEvents();
    getUserInfo();
  }, []);

  /**
   * getCard
   * This function gets the individual event data
   * for each card and displays it. When the card
   * is clicked, it goes to URL /event/{eventid}.
   * @param {*} row
   * @return {object} JSX
   */
  function getCard(row) {
    return (
      <Card key={row.eventid}>
        <CardContent>
          <Typography variant='h5' component='h2' align='center'>
            {row.eventname}
          </Typography>
          <Typography className={classes.pos}
            color='textSecondary' variant='body2' align='center'>
            Start: {new Date(row.starttime).toLocaleString('en-US',
                {weekday: 'short', month: 'short', day: 'numeric',
                  year: 'numeric'})} at {new Date(row.starttime)
                .toLocaleString(
                    'en-US', {hour: 'numeric', minute: 'numeric'})}
          </Typography>
          <Typography className={classes.pos}
            color='textSecondary' variant='body2' align='center'>
            End: {new Date(row.endtime).toLocaleString('en-US',
                {weekday: 'short', month: 'short', day: 'numeric',
                  year: 'numeric'})} at {new Date(row.endtime)
                .toLocaleString(
                    'en-US', {hour: 'numeric', minute: 'numeric'})}
          </Typography>
          <Typography className={classes.pos}
            variant='subtitle1' align='center'
            color={row.attendees === row.capacity ?
                'primary' : 'textPrimary'}>
            {row.capacity - row.attendees} of {row.capacity} spots open
          </Typography>
        </CardContent>
        <CardActions>
          <Button size='small'
            variant='contained'
            color='secondary'
            href={context.businessState === false ?
              '/event/' + row.eventid : '/profile/'}
            style={{margin: 'auto'}}>
            {context.businessState === false ?
              'View Event' : 'View Event in Profile'}
          </Button>
        </CardActions>
      </Card>
    );
  };

  const breakPoints = [
    {width: 1, itemsToShow: 1},
    {width: 550, itemsToShow: 3},
    {width: 768, itemsToShow: 4},
    {width: 1200, itemsToShow: 5},
    {width: 1700, itemsToShow: 6},
    {width: 2000, itemsToShow: 7},
  ];

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
              getCard(event),
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
              getCard(event),
            )}
          </Carousel>
        </Box>
      </Box>
    </React.Fragment>
  );
}
