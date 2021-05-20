import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Carousel from 'react-elastic-carousel';
import Box from '@material-ui/core/Box';
import EventCard from './Components/Events/EventCard';
import {Grid} from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import InputBase from '@material-ui/core/InputBase';
import SearchIcon from '@material-ui/icons/Search';
import IconButton from '@material-ui/core/IconButton';
// import InputAdornment from '@material-ui/core/InputAdornment';
import Paper from '@material-ui/core/Paper';

import Context from './Context';
const Auth = require('./libs/Auth');

const useStyles = makeStyles((theme) => ({
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
  searchBox: {
    backgroundColor: theme.palette.primary.main,
    paddingBottom: 50,
    paddingTop: 50,
  },
  searchBar: {
    backgroundColor: theme.palette.common.white,
  },
  searchRoot: {
    padding: '2px 4px',
    display: 'flex',
    alignItems: 'center',
    width: 400,
    margin: 'auto',
  },
  input: {
    marginLeft: theme.spacing(1),
    backgroundColor: theme.palette.common.white,
    flex: 1,
  },
  iconButton: {
    padding: 10,
    backgroundColor: theme.palette.common.white,
  },
  wrapper: {
    display: 'horizontal',
    overflowX: 'auto',
    maxHeight: 120,
  },
  wrapperitem: {
    alignItems: 'center',
  },
}));

/**
 * ViewEvents component
 * @return {object} ViewEvents JSX
 */
export default function ViewEvents() {
  const classes = useStyles();
  const [eventList, setEventList] = React.useState([]);
  const [memberEvents, setMemberEvents] = React.useState([]);
  const [memberBusinesses, setMemberBusinesses] = React.useState([]);
  const [searchValue, setSearch] = React.useState('');
  const [searchEventsList, setSearchEventsList] = React.useState([]);
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
   * getPublicEvents
   * gets all public events
   */
  function getPublicEvents() {
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

  /**
   * getBusinessEvents
   * gets events for a business when in a business account
   */
  function getBusinessEvents() {
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
    if (context.businessState === false) {
      getPublicEvents();
      getUserInfo();
    } else {
      getBusinessEvents();
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

  /**
   * searchEvents
   * takes input and searches events
   * @param {object} event
   */
  const searchEvents = (event) => {
    let apicall = 'http://localhost:3010/api/events';
    if (searchValue !== '') {
      apicall += '?search='+searchValue;
    }
    console.log(apicall);
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
      setSearchEventsList(json);
      setSearch('');
    })
        .catch((error) => {
          console.log(error);
        });
  };
  console.log(searchEventsList);

  // only show if it is a user account
  let showMemberEvents;
  if (context.businessState === false) {
    if (memberEvents.length === 0) {
      showMemberEvents = (
        <Grid item xs={8}>
          <Box display="flex">
            <Typography variant="h4" style={{float: 'left'}}>
              Member Events
            </Typography>
          </Box>
          <Box display="flex">
            No restricted events available.
          </Box>
        </Grid>
      );
    } else {
      showMemberEvents = (
        <Grid item xs={8}>
          <Box>
            <Typography variant="h4" style={{float: 'left'}}>
              Member Events
            </Typography>
            <Box pt={5}>
              <Button size='small'
                variant='contained'
                color='secondary'
                href={'/allevents'}
                style={{float: 'right'}}>
                See All Events
              </Button>
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
          <Box display="flex" alignItems="center" justifyContent="center">
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
          <Box display="flex" alignItems="center" justifyContent="center">
            <Typography variant="h4">
              My Businesses
            </Typography>
          </Box>
          <Box display="flex" border={3} alignItems="center"
            justifyContent="center" mr={15} ml={15} mt={3}>
            <Grid item xs={4}>
              {memberBusinesses.map((business) =>
                <Box key={business.businessid} alignItems="center"
                  justifyContent="center" textAlign='center' mb={3}>
                  <Typography
                    variant="h5"
                    align="center">
                    {business.businessname}
                  </Typography>
                  <Button size='small'
                    variant='contained'
                    color='secondary'
                    href={'/business/profile/' + business.businessid}
                    style={{margin: 'auto'}}>
                    See Profile
                  </Button>
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

  // console.log(searchValue);

  return (
    <React.Fragment>
      <Box className={classes.searchBox}
        justifyContent="center"
        textAlign='center'>
        <Paper component="form" className={classes.searchRoot}>
          <InputBase
            className={classes.input}
            placeholder="Search Events..."
            onChange={(event) => {
              // console.log(event.target.value);
              setSearch(event.target.value);
              console.log(searchValue);
            }}
          />
          <IconButton
            className={classes.iconButton}
            aria-label="search"
            onClick={searchEvents}>
            <SearchIcon />
          </IconButton>
        </Paper>
      </Box>
      <Box p={5} ml={context.businessState === false ? 20 : 0}>
        <Grid container
          spacing={0}>
          {showMemberEvents}
          {showBusinesses}
          <Grid item xs={context.businessState === false ? 8 : 12}>
            <Box mt={5}>
              <Typography variant="h4" style={{float: 'left'}}>
                {context.businessState === false ?
                'All Events' : 'My Events'}
              </Typography>
              <Box pt={5}>
                <Button size='small'
                  variant='contained'
                  color='secondary'
                  href={'/allevents'}
                  style={{float: 'right'}}>
                  See All Events
                </Button>
              </Box>
              <Box mt={5} mb={5}>
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
