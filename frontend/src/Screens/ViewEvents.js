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

import NavBar from '../Components/Nav/NavBar';
import EventCard from '../Components/Events/EventCard';
import Context from '../Context';
const Auth = require('../libs/Auth');

import '../CSS/Scrollbar.css';

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
  category: {
    textTransform: 'capitalize',
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
  const [eventList, setEventList] = React.useState([]);
  const [memberEvents, setMemberEvents] = React.useState([]);
  const [publicEvents, setPublicEvents] = React.useState([]);
  const [businessEvents, setBusinessEvents] = React.useState([]);
  const [allBusinessEvents, setAllBusinessEvents] = React.useState([]);
  const [memberBusinesses, setMemberBusinesses] = React.useState([]);
  const [businessList, setBusinessList] = React.useState([]);
  const [categoryList, setCategoryList] = React.useState([]);
  const [searchValue, setSearch] = React.useState('');
  const [searchEventsList, setSearchEventsList] = React.useState([]);
  const [filteredEventsList, setFilteredEventsList] = React.useState([]);
  const [searchBoolean, setSearchBoolean] = React.useState(false);
  const [filterBoolean, setFilterBoolean] = React.useState(false);
  const [startDateTime, changeStartDateTime] = React.useState(null);
  const [endDateTime, changeEndDateTime] = React.useState(null);
  const [restrictions, setRestrictions] = React.useState({
    membersonly: false,
    over18: false,
    over21: false,
    public: false,
  });
  const [categories, setCategories] = React.useState({});
  const [businesses, setBusinesses] = React.useState({});

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
          if (json.useremail) {
            getMemberEvents(json.useremail);
            getMemberBusinesses(json.useremail);
            getPublicAndMemberEvents(json.useremail);
            setUserEmail(json.useremail);
          }

          if (window.location.href === 'http://localhost:3000/') {
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
   * getPublicAndMemberEvents
   * API call to get all public events and member restricted events
   * for businesses the member is a part of
   * @param {string} email
   */
  function getPublicAndMemberEvents(email) {
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
    })
        .catch((error) => {
          console.log(error);
        });
  }

  /**
   * getMemberBusinesses
   * API call to get all businesses the user is a part of
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
   * API call to get all events for businesses the user is a part of
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
   * Gets all public events
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
   * Gets events for a business when in a business account
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
      setAllBusinessEvents(json);
      setBusinessEvents(json.slice(0, 8));
    })
        .catch((error) => {
          console.log(error);
        });
  };

  /**
   * getAllBusinesses
   * Obtains all businesses for the business filters
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
        setBusinesses({...businesses, [business.businessid]: false}),
      );
    })
        .catch((error) => {
          console.log(error);
        });
  };

  /**
   * getCategories
   * Obtains all event categories for the filters
   */
  function getCategories() {
    const apicall = 'http://localhost:3010/api/events/categories';
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
      setCategoryList(json);
      json.map((category1) =>
        // attach to category state
        setCategories({...categories, [category1.category]: false}),
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
      if (window.location.href === 'http://localhost:3000/') {
        /* show all events */
        setSearchBoolean(false);
      } else {
        setSearchBoolean(true);
        const parsedURL = (window.location.href).split('?');
        /* stick parsedURL in an api call and pass it to search events */
        searchFromURL(parsedURL[1]);
      }
    }
    getCategories();
  }, [context.businessState]);

  /**
   * searchFromURL
   * Searches events by parsing the URL
   * @param {string} url
   * @param {email} email
   */
  function searchFromURL(url, email) {
    let apicall = 'http://localhost:3010/api/events';
    /* if user account */
    if (context.businessState === false) {
      if (url !== '') {
        apicall += '/search/'+encodeURIComponent(email)+'?'+url;
      }
    } else {
      /* if business account */
      apicall += '?'+url;
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
    })
        .catch((error) => {
          console.log(error);
        });
  };

  /**
   * searchEvents
   * Searches events using date and time
   * @param {*} event
   */
  const searchEvents = (event) => {
    setFilterBoolean(false);
    // reset all filters to false
    if (context.businessState === false) {
      for (const i in businesses) {
        if (businesses[i] === true) {
          businesses[i] = false;
        }
      }
    }
    for (const i in categories) {
      if (categories[i] === true) {
        categories[i] = false;
      }
    }
    for (const i in restrictions) {
      if (restrictions[i] === true) {
        restrictions[i] = false;
      }
    }
    if (searchValue !== '' || startDateTime !== null ||
      endDateTime !== null) {
      setSearchBoolean(true);
    }
    let apicall;
    if (context.businessState === false) {
      // search api call for users
      apicall = 'http://localhost:3010/api/events/search/'+
        encodeURIComponent(userEmail);
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
      const parsedCall = (apicall).split('?');
      if (parsedCall[1] !== undefined) {
        history.push('/?'+parsedCall[1]);
      } else {
        history.push('/');
      }
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
      const parsedCall = (apicall).split('?');
      if (parsedCall[1] !== undefined) {
        history.push('/'+parsedCall[1]);
      } else {
        history.push('/');
      }
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
    })
        .catch((error) => {
          console.log(error);
        });
  };

  /**
   * applyFilters
   * Filter through events using filters that are set to true
   */
  function applyFilters() {
    setFilterBoolean(true);
    const filteredEvents = [];
    if (searchBoolean === true) {
      for (let i = 0; i < searchEventsList.length; i++) {
        let added = false;
        // filtering restrictions
        for (const j in restrictions) {
          if (j === 'public') {
            if (restrictions.public === true &&
              searchEventsList[i]['membersonly'] === false) {
              added = true;
              break;
            }
          } else if (restrictions[j] === true && searchEventsList[i][j] ===
            true) {
            filteredEvents.push(searchEventsList[i]);
            added = true;
            break;
          }
        }
        // filtering categories
        for (const j in categories) {
          if (categories[j] === true && j === searchEventsList[i].category &&
            added === false) {
            filteredEvents.push(searchEventsList[i]);
            added = true;
            break;
          }
        }
        // filtering businesses
        for (const j in businesses) {
          if (businesses[j] === true && j === searchEventsList[i].businessid &&
            added === false) {
            filteredEvents.push(searchEventsList[i]);
            added = true;
            break;
          }
        }
      }
    } else if (context.businessState === false) {
      for (let i = 0; i < eventList.length; i++) {
        let added = false;
        // filtering restrictions
        for (const j in restrictions) {
          if (j === 'public') {
            if (restrictions.public === true &&
              eventList[i]['membersonly'] === false) {
              filteredEvents.push(eventList[i]);
              added = true;
              break;
            }
          } else if (restrictions[j] === true && eventList[i][j] ===
            true) {
            filteredEvents.push(eventList[i]);
            added = true;
            break;
          }
        }
        // filtering categories
        for (const j in categories) {
          if (categories[j] === true && j === eventList[i].category &&
            added === false) {
            filteredEvents.push(eventList[i]);
            added = true;
            break;
          }
        }
        // filtering businesses
        for (const j in businesses) {
          if (businesses[j] === true && j === eventList[i].businessid &&
            added === false) {
            filteredEvents.push(eventList[i]);
            added = true;
            break;
          }
        }
      }
    } else {
      for (let i = 0; i < allBusinessEvents.length; i++) {
        let added = false;
        // filtering restrictions
        for (const j in restrictions) {
          if (j === 'public') {
            if (restrictions.public === true &&
              allBusinessEvents[i]['membersonly'] === false) {
              filteredEvents.push(allBusinessEvents[i]);
              added = true;
              break;
            }
          } else if (restrictions[j] === true && allBusinessEvents[i][j] ===
            true) {
            filteredEvents.push(allBusinessEvents[i]);
            added = true;
            break;
          }
        }
        // filtering categories
        for (const j in categories) {
          if (categories[j] === true && j === allBusinessEvents[i].category &&
            added === false) {
            filteredEvents.push(allBusinessEvents[i]);
            added = true;
            break;
          }
        }
        // filtering businesses
        for (const j in businesses) {
          if (businesses[j] === true && j === allBusinessEvents[i].businessid &&
            added === false) {
            filteredEvents.push(allBusinessEvents[i]);
            added = true;
            break;
          }
        }
      }
    }
    let noFilter = true;
    for (const i in businesses) {
      if (businesses[i] === true) {
        noFilter = false;
      }
    }
    for (const i in categories) {
      if (categories[i] === true) {
        noFilter = false;
      }
    }
    for (const i in restrictions) {
      if (restrictions[i] === true) {
        noFilter = false;
      }
    }
    if (noFilter === true && context.businessState === false &&
      searchBoolean === false) {
      setFilteredEventsList(eventList);
    } else if (noFilter === true && context.businessState === true &&
      searchBoolean === false) {
      setFilteredEventsList(allBusinessEvents);
    } else if (noFilter === false) {
      setFilteredEventsList(filteredEvents);
    } else {
      setFilteredEventsList(searchEventsList);
    }
  }

  /**
   * handleRestrictionChange
   * Change state of restriction filter
   * @param {*} event
   */
  const handleRestrictionChange = (event) => {
    setRestrictions({...restrictions, [event.target.name]:
      event.target.checked});
  };

  /**
   * handleCategoryChange
   * Change state of category filter
   * @param {*} event
   */
  const handleCategoryChange = (event) => {
    setCategories({...categories, [event.target.name]: event.target.checked});
  };

  /**
   * handleBusinessChange
   * Change state of business filter
   * @param {*} event
   */
  const handleBusinessChange = (event) => {
    setBusinesses({...businesses, [event.target.name]: event.target.checked});
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
                    checked={businesses.businessid}
                    onChange={handleBusinessChange}
                    name={business.businessid}
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

  /* Show searched events if something is searched for */
  let showSearchedEvents;
  if (searchBoolean === false && filterBoolean === false) {
    showSearchedEvents = (
      <main className={classes.content}>
        {showMemberEvents}
        {showPublicEvents}
        {showBusinessEvents}
      </main>
    );
  } else if (searchBoolean === true && filterBoolean === false) {
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
  } else if (filterBoolean === true) {
    showSearchedEvents = (
      <main className={classes.content}>
        <Typography variant="h4" className={classes.eventHeader}>
          Events
        </Typography>
        <Grid className={classes.gridContainer}
          container spacing={3}>
          {filteredEventsList.map((event) =>
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
      event.preventDefault();
      history.push('/?search='+searchValue);
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
              <Box textAlign='center'>
                <Button size='medium'
                  variant='contained'
                  color='secondary'
                  style={{width: '90%'}}
                  onClick={applyFilters}>
                  Apply Filters
                </Button>
              </Box>

              {showBusinessFilters}
              <Box>
                <ListItem>
                  <ListItemText primary='Categories' />
                </ListItem>
                <ListItem>
                  <FormGroup>
                    {categoryList.map((category1) =>
                      <FormControlLabel
                        key={category1.category}
                        control={
                          <Checkbox
                            checked={categories.category}
                            onChange={handleCategoryChange}
                            name={category1.category}
                            color="secondary"
                          />
                        }
                        className={classes.category}
                        label={category1.category}
                      />,
                    )}
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
                          checked={restrictions.membersonly}
                          onChange={handleRestrictionChange}
                          name="membersonly"
                          color="secondary"
                        />
                      }
                      label="Members Only"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={restrictions.public}
                          onChange={handleRestrictionChange}
                          name="public"
                          color="secondary"
                        />
                      }
                      label="Public Events"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={restrictions.over18}
                          onChange={handleRestrictionChange}
                          name="over18"
                          color="secondary"
                        />
                      }
                      label="18+"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={restrictions.over21}
                          onChange={handleRestrictionChange}
                          name="over21"
                          color="secondary"
                        />
                      }
                      label="21+"
                    />
                  </FormGroup>
                </ListItem>
              </Box>
              <Box textAlign='center' mt={2}>
                <Button size='medium'
                  variant='contained'
                  color='secondary'
                  style={{width: '90%'}}
                  href={'/events'}>
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
