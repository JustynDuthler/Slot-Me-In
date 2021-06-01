import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import {Grid} from '@material-ui/core';
import Box from '@material-ui/core/Box';
import Pagination from '@material-ui/lab/Pagination';
import {useHistory} from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import EventCard from './Components/Events/EventCard';

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
  gridContainer: {
    paddingLeft: '10px',
    paddingRight: '10px',
  },
  pageBox: {
    position: 'relative',
    left: '50vw',
    transform: 'translate(-50%, -20%)',
  },
  title: {
    fontWeight: 350,
    marginTop: 30,
    marginBottom: 10,
  },
  card: {
    width: 400,
  },
});

/**
 * ViewEvents component
 * @return {object} ViewEvents JSX
 */
export default function AllEvents() {
  const history = useHistory();
  const classes = useStyles();
  // const [userInfo, setUserInfo] = React.useState();
  const [eventList, setEventList] = React.useState([]);
  const [pageEvents, setPageEvents] = React.useState([]);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [postsPerPage] = React.useState(9);
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
          // if the url is just /events, get page 1 events
          if (window.location.href === 'http://localhost:3000/events') {
            getEvents(1, json.useremail);
          } else {
            // parse url to get the page number and pass it to getEvents
            const parsedURL = (window.location.href).split('=');
            setCurrentPage(parseInt(parsedURL[1]));
            getEvents(parsedURL[1], json.useremail);
          }
        },
        (error) => {
          console.log(error);
        },
        );
  };

  /**
   * getEvents
   * API call to get data for an event
   * @param {int} pageNumber
   * @param {string} email
   */
  function getEvents(pageNumber, email) {
    const apicall = 'http://localhost:3010/api/events/publicAndMemberEvents/'+email;
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
      // gets all public events + member events
      setEventList(json);

      // events if it's on first page
      if (pageNumber === 1) {
        setPageEvents(json.slice(0, postsPerPage));
      } else {
        // events for other pages
        setPageEvents(json.slice(((pageNumber-1)*9),
            pageNumber*9));
      }
    })
        .catch((error) => {
          console.log(error);
        });
  };

  /**
   * getEvents
   * API call to get data for an event
   * @param {int} pageNumber
   * @param {string} email
   */
  function getBusinessEvents(pageNumber) {
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
      // gets all public events + member events
      setEventList(json);

      // events if it's on first page
      if (pageNumber === 1) {
        setPageEvents(json.slice(0, postsPerPage));
      } else {
        // events for other pages
        setPageEvents(json.slice(((pageNumber-1)*9),
            pageNumber*9));
      }
    })
        .catch((error) => {
          console.log(error);
        });
  };

  React.useEffect(() => {
    if (context.businessState === false) {
      getUserInfo();
    } else {
      if (window.location.href === 'http://localhost:3000/events') {
        getBusinessEvents(1);
      } else {
        // parse url to get the page number and pass it to getEvents
        const parsedURL = (window.location.href).split('=');
        setCurrentPage(parseInt(parsedURL[1]));
        getBusinessEvents(parsedURL[1]);
      }
    }
    // // if the url is just /events, get page 1 events
    // if (window.location.href === 'http://localhost:3000/events') {
    //   getEvents(1);
    // } else {
    //   // parse url to get the page number and pass it to getEvents
    //   const parsedURL = (window.location.href).split('=');
    //   setCurrentPage(parseInt(parsedURL[1]));
    //   getEvents(parsedURL[1]);
    // }
  }, []);

  /**
   * handleChange
   * This function gets the events for a new page
   * @param {event} event
   * @param {int} value
   */
  const handleChange = (event, value) => {
    setCurrentPage(value);
    if (value === 1) {
      // if on first page, change url to /events
      history.push('/events');
    } else {
      // if on other page, change url depending on number
      history.push('/events?page='+value);
    }

    // get events for the current page
    const currentPosts = eventList.slice(((value-1)*9),
        value*9);
    setPageEvents(currentPosts);
  };

  return (
    <div style={{overflow: 'hidden'}}>
      <Box mt={5} mb={5} className={classes.box}>
        <Typography className={classes.title}
          variant='h3' align='center'>
          All Upcoming Events
        </Typography>
        <Grid
          container
          spacing={6}
          className={classes.gridContainer}
          justify='center'
        >
          {pageEvents.map((row) =>
            <EventCard
              className={classes.card}
              row={row} context={context} key={row.eventid} />,
          )}
        </Grid>
        <Box mt={5} display="flex" justifyContent="center"
          alignItems="center" className={classes.pageBox}>
          <Pagination
            page={currentPage}
            count={Math.ceil(eventList.length / postsPerPage)}
            variant="outlined"
            color="secondary"
            onChange={handleChange} />
        </Box>
      </Box>
    </div>
  );
}
