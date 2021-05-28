import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import SearchIcon from '@material-ui/icons/Search';
import IconButton from '@material-ui/core/IconButton';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import {Grid} from '@material-ui/core';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Hidden from '@material-ui/core/Hidden';
import {useHistory} from 'react-router-dom';
import DateFnsUtils from '@date-io/date-fns';
import {DateTimePicker, MuiPickersUtilsProvider}
  from '@material-ui/pickers';

import NavBar from './Components/Nav/NavBar';
import EventCard from './Components/Events/EventCard';
import Context from './Context';
const Auth = require('./libs/Auth');

import './CSS/Scrollbar.css';
// import { endOfToday } from 'date-fns';

const drawerWidth = 260;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    overflowY: 'scroll',
    scrollbarWidth: 'none',
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerContainer: {
    overflow: 'auto',
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    // flexDirection: row,
  },
  allButFooter: {
    minHeight: 'calc(100vh - 50px)',
  },
  datePicker: {
    backgroundColor: theme.palette.common.white,
  },
  searchBar: {
    padding: '2px 4px',
    display: 'flex',
    width: 400,
  },
  searchInput: {
    marginLeft: theme.spacing(1),
    backgroundColor: theme.palette.common.white,
    flex: 1,
  },
  searchIcon: {
    padding: 10,
    backgroundColor: theme.palette.common.white,
  },
  gridContainer: {
    paddingLeft: '100px',
    paddingRight: '10px',
    marginBottom: '20px',
  },
  eventHeader: {
    paddingLeft: '110px',
    paddingRight: '10px',
    marginBottom: '10px',
  },
  card: {
    width: 275,
  },
}));

/**
 * ViewEvents
 * @return {object} ViewEvents JSX
 */
export default function ViewEvents() {
  const history = useHistory();
  const classes = useStyles();
  const context = React.useContext(Context);
  const [userEmail, setUserEmail] = React.useState('');
  const [memberEvents, setMemberEvents] = React.useState([]);
  const [publicEvents, setPublicEvents] = React.useState([]);
  const [businessEvents, setBusinessEvents] = React.useState([]);
  const [memberBusinesses, setMemberBusinesses] = React.useState([]);
  const [businessList, setBusinessList] = React.useState([]);
  const [searchValue, setSearch] = React.useState('');
  const [searchEventsList, setSearchEventsList] = React.useState([]);
  const [searchBoolean, setSearchBoolean] = React.useState(false);
  const [startDateTime, changeStartDateTime] = React.useState(null);
  const [endDateTime, changeEndDateTime] = React.useState(null);
  // change to get category query
  const [checkState, setCheckState] = React.useState({
    gym: false,
    club: false,
    party: false,
    conference: false,
    workshop: false,
    tutoring: false,
    members: false,
    eighteen: false,
    twentyone: false,
    public: false,
  });

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
          getMemberEvents(json.useremail);
          getMemberBusinesses(json.useremail);
          setUserEmail(json.useremail);

          if (window.location.href === 'http://localhost:3000/events') {
            /* show all events */
            setSearchBoolean(false);
          } else {
            setSearchBoolean(true);
            const parsedURL = (window.location.href).split('?');
            /* stick parsedURL in an api call and pass it to search events */
            searchFromURL(parsedURL[1], json.useremail);
          }
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
      setPublicEvents(json.slice(0, 8));
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
      setBusinessEvents(json.slice(0, 8));
    })
        .catch((error) => {
          console.log(error);
        });
  };

  /**
   * getAllBusinesses
   * obtains all businesses
   */
  function getAllBusinesses() {
    const apicall = 'http://localhost:3010/api/businesses';
    fetch(apicall, {
      method: 'GET',
    }).then((response) => {
      if (!response.ok) {
        if (response.status === 401) {
          throw response;
        }
      }
      return response.json();
    }).then((json) => {
      setBusinessList(json);
      json.map((business) =>
        // attach to checkstate
        setCheckState({...checkState, [business.businessname]: false}),
      );
    })
        .catch((error) => {
          console.log(error);
        });
  };

  React.useEffect(() => {
    if (context.businessState === false) {
      getPublicEvents();
      getUserInfo();
      getAllBusinesses();
    } else {
      getBusinessEvents();
    }

    /* set it so the url is parsed and you can get the searched events again */
    if (window.location.href === 'http://localhost:3000/events') {
      /* show all events */
      setSearchBoolean(false);
    } else {
      setSearchBoolean(true);
      const parsedURL = (window.location.href).split('?');
      /* stick parsedURL in an api call and pass it to search events */
      searchFromURL(parsedURL[1]);
    }
  }, []);

  /**
   * searchFromURL
   * obtains all businesses
   * @param {string} url
   * @param {email} email
   */
  function searchFromURL(url, email) {
    console.log('url'+url);
    let apicall = 'http://localhost:3010/api/events';
    /* if user account */
    if (context.businessState === false) {
      apicall += '/search/'+email+'?search='+url;
    } else {
      /* if business account */
      apicall += '?'+url;
    }
    console.log('api: '+apicall);
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
      console.log(json);
      console.log(searchEventsList);
    })
        .catch((error) => {
          console.log(error);
        });
  };

  /**
   * searchEvents
   * takes input and searches events
   * @param {*} event
   */
  const searchEvents = (event) => {
    setSearchBoolean(true);
    let apicall;
    if (context.businessState === false) {
      apicall = 'http://localhost:3010/api/events/search/';
      if (searchValue !== '') {
        // setSearchBoolean(true);
        apicall += userEmail+'?search='+searchValue;
        history.push('/events?search='+searchValue);
      } else {
        // setSearchBoolean(true);
        apicall += userEmail;
        history.push('/events?search=');
      }
      console.log(apicall);
    } else {
      // search api call for business accounts
      apicall = 'http://localhost:3010/api/events';
      if (startDateTime !== null) {
        const startTime = startDateTime.toISOString();
        apicall += '?start='+encodeURIComponent(startTime);
        if (endDateTime !== null) {
          const endTime = endDateTime.toISOString();
          apicall += '&end='+encodeURIComponent(endTime);
        }
        if (searchValue !== '') {
          apicall += '&search='+searchValue;
        }
      } else if (endDateTime !== null) {
        const endTime = endDateTime.toISOString();
        apicall += '?end='+encodeURIComponent(endTime);
        if (searchValue !== '') {
          apicall += '&search='+searchValue;
        }
      } else if (searchValue !== '') {
        apicall += '?search='+searchValue;
      }
      console.log('business apicall '+apicall);
      const parsedCall = (apicall).split('?');
      history.push('/events?'+parsedCall[1]);
    }

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
      console.log(json);
      console.log(searchEventsList);
      // setSearch('');
    })
        .catch((error) => {
          console.log(error);
        });
  };

  /**
   * handleChange
   * used for filter checkboxes
   * @param {*} event
   */
  const handleChange = (event) => {
    setCheckState({...checkState, [event.target.name]: event.target.checked});
    console.log(event.target.name + ' ' + event.target.checked);
  };

  /* Show member events if user is part of any businesses */
  let showMemberEvents;
  if (context.businessState === false) {
    if (memberEvents.length === 0) {
      showMemberEvents = (
        <div></div>
      );
    } else {
      showMemberEvents = (
        <div>
          <Typography variant="h4" className={classes.eventHeader}>
            Events From Your Businesses
          </Typography>
          <Grid className={classes.gridContainer}
            container spacing={3}>
            {memberEvents.map((event) =>
              <EventCard className={classes.card} key={event.eventid}
                context={context}
                row={event}/>,
            )}
          </Grid>
        </div>
      );
    }
  } else {
    showMemberEvents = (
      <div></div>
    );
  }

  /* Show public events if it is a user account */
  let showPublicEvents;
  if (context.businessState === false) {
    showPublicEvents = (
      <div>
        <Typography variant="h4" className={classes.eventHeader}>
          Public Events
        </Typography>
        <Grid className={classes.gridContainer}
          container spacing={3}>
          {publicEvents.map((event) =>
            <EventCard className={classes.card} key={event.eventid}
              context={context}
              row={event}/>,
          )}
        </Grid>
      </div>
    );
  } else {
    showPublicEvents = (
      <div></div>
    );
  }

  let showBusinessList;
  if (context.businessState === false) {
    if (memberBusinesses.length === 0) {
      showBusinessList = (
        <div></div>
      );
    } else {
      showBusinessList = (
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
          >
            <Typography variant="h5">Your Businesses</Typography>
          </AccordionSummary>
          {memberBusinesses.map((business) =>
            <ListItem
              key={business.businessid}
              button
              component="a"
              href={'/business/profile/'+business.businessid}>
              <AccordionDetails>
                <Grid item xs={4}>
                  <Typography
                    variant="h6">
                    {business.businessname}
                  </Typography>
                </Grid>
              </AccordionDetails>
            </ListItem>,
          )}
        </Accordion>
      );
    }
  } else {
    showBusinessList = (
      <div></div>
    );
  }

  /* Show business's events if it is a business account */
  let showBusinessEvents;
  if (context.businessState === true) {
    showBusinessEvents = (
      <div>
        <Typography variant="h4" className={classes.eventHeader}>
          Your Events
        </Typography>
        <Grid className={classes.gridContainer}
          container spacing={3}>
          {businessEvents.map((event) =>
            <EventCard className={classes.card} key={event.eventid}
              context={context}
              row={event}/>,
          )}
        </Grid>
      </div>
    );
  } else {
    showBusinessEvents = (
      <div></div>
    );
  }

  /* Show business filters if it is a user account */
  let showBusinessFilters;
  if (context.businessState === false) {
    showBusinessFilters = (
      <Box>
        <ListItem>
          <ListItemText primary='Businesses' />
        </ListItem>
        <ListItem>
          <FormGroup>
            {businessList.map((business) =>
              <FormControlLabel
                key={business.businessid}
                control={
                  <Checkbox
                    checked={checkState.businessname}
                    onChange={handleChange}
                    name={business.businessname}
                    color="secondary"
                  />
                }
                label={business.businessname}
              />,
            )}
          </FormGroup>
        </ListItem>
        <Divider variant="middle" />
      </Box>
    );
  } else {
    showBusinessFilters = (
      <div></div>
    );
  }

  let showSearchedEvents;
  if (searchBoolean === false) {
    showSearchedEvents = (
      <main className={classes.content}>
        {showMemberEvents}
        {showPublicEvents}
        {showBusinessEvents}
      </main>
    );
  } else {
    showSearchedEvents = (
      <main className={classes.content}>
        <Typography variant="h4" className={classes.eventHeader}>
          Events
        </Typography>
        <Grid className={classes.gridContainer}
          container spacing={3}>
          {searchEventsList.map((event) =>
            <EventCard className={classes.card} key={event.eventid}
              context={context}
              row={event}/>,
          )}
        </Grid>
      </main>
    );
  }

  /**
   * handleKeypress
   * Checks if keypress was enter, then submits form
   * @param {*} event Event submission event
   */
  const handleKeypress = (event) => {
    // only start submit process if enter is pressed
    if (event.key === 'Enter') {
      console.log(searchValue);
      history.push('/events?search='+searchValue);
      searchEvents(event);
    }
  };

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="fixed" className={classes.appBar}>
        <NavBar userType={context.businessState === false ?
          'user' : 'business'}>
        </NavBar>
      </AppBar>
      <Hidden smDown>
        <Drawer
          className={classes.drawer}
          variant="permanent"
          classes={{
            paper: classes.drawerPaper,
          }}
        >
          <Toolbar />
          <div className={classes.drawerContainer}>
            {showBusinessList}
            <List>
              <ListItem>
                <ListItemText>
                  <Typography variant="h5">
                    Filters
                  </Typography>
                </ListItemText>
              </ListItem>

              {showBusinessFilters}

              <Box>
                <ListItem>
                  <ListItemText primary='Event Type' />
                </ListItem>
                <ListItem>
                  <FormGroup>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={checkState.gym}
                          onChange={handleChange}
                          name="gym"
                          color="secondary"
                        />
                      }
                      label="Gym"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={checkState.club}
                          onChange={handleChange}
                          name="club"
                          color="secondary"
                        />
                      }
                      label="Club"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={checkState.party}
                          onChange={handleChange}
                          name="party"
                          color="secondary"
                        />
                      }
                      label="Party"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={checkState.conference}
                          onChange={handleChange}
                          name="conference"
                          color="secondary"
                        />
                      }
                      label="Conference"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={checkState.workshop}
                          onChange={handleChange}
                          name="workshop"
                          color="secondary"
                        />
                      }
                      label="Workshop"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={checkState.tutoring}
                          onChange={handleChange}
                          name="tutoring"
                          color="secondary"
                        />
                      }
                      label="Tutoring"
                    />
                  </FormGroup>
                </ListItem>
                <Divider variant="middle" />
              </Box>

              <Box>
                <ListItem>
                  <ListItemText primary='Restrictions' />
                </ListItem>
                <ListItem>
                  <FormGroup>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={checkState.members}
                          onChange={handleChange}
                          name="members"
                          color="secondary"
                        />
                      }
                      label="Members Only"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={checkState.public}
                          onChange={handleChange}
                          name="public"
                          color="secondary"
                        />
                      }
                      label="Public Events"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={checkState.eighteen}
                          onChange={handleChange}
                          name="eighteen"
                          color="secondary"
                        />
                      }
                      label="18+"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={checkState.twentyone}
                          onChange={handleChange}
                          name="twentyone"
                          color="secondary"
                        />
                      }
                      label="21+"
                    />
                  </FormGroup>
                </ListItem>
              </Box>
              <Box textAlign='center'>
                <Button size='small'
                  variant='contained'
                  color='secondary'>
                  Apply Filters
                </Button>
              </Box>
              <Box textAlign='center' mt={2}>
                <Button size='medium'
                  variant='contained'
                  color='secondary'
                  href={'/allevents'}>
                  See All Events
                </Button>
              </Box>

            </List>
          </div>
        </Drawer>
      </Hidden>

      <Grid container>
        <Box mt={3} ml={13} className={classes.content} style={{width: '100%'}}>
          <Grid container direction={'row'}>
            <MuiPickersUtilsProvider
              utils={DateFnsUtils}>
              <DateTimePicker
                className={classes.datePicker}
                clearable
                label='Start Date/Time'
                inputVariant='outlined'
                id='startdatetime'
                value={startDateTime}
                onChange={changeStartDateTime}
                onKeyPress={handleKeypress}
              />
            </MuiPickersUtilsProvider>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <DateTimePicker
                className={classes.datePicker}
                clearable
                label='End Date/Time'
                inputVariant='outlined'
                value={endDateTime}
                onChange={changeEndDateTime}
                onKeyPress={handleKeypress}
              />
            </MuiPickersUtilsProvider>
            <Paper component="form" className={classes.searchBar}>
              <InputBase
                className={classes.searchInput}
                placeholder="Search Events..."
                onChange={(event) => {
                  setSearch(event.target.value);
                }}
                onKeyPress={handleKeypress}
              />
              <IconButton
                className={classes.searchIcon}
                aria-label="search"
                onClick={searchEvents}>
                <SearchIcon />
              </IconButton>
            </Paper>
          </Grid>
        </Box>
        <Box>
          {showSearchedEvents}
        </Box>
      </Grid>
    </div>
  );
}
