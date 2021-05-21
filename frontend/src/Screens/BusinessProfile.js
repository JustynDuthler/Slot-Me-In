import React from 'react';
import Container from '@material-ui/core/Container';
import {makeStyles} from '@material-ui/core/styles';
import {IconButton} from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import Context from '../Context';
import * as Auth from '../libs/Auth';
import TextField from '@material-ui/core/TextField';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IndividualEvent from '../IndividualEvent';
import DateFnsUtils from '@date-io/date-fns';
import {DatePicker, MuiPickersUtilsProvider} from '@material-ui/pickers';
import clsx from 'clsx';
import format from 'date-fns/format';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Box from '@material-ui/core/Box';
import PropTypes from 'prop-types';
import {useHistory} from 'react-router-dom';
import Paper from '@material-ui/core/Paper';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import UserInfo from '../Components';
import {ShareBar} from '../Components';
import EventCard from '../Components/Events/EventCard';

/**
 * BusinessProfile component
 * @return {object} BusinessProfile JSX
 */
export default function BusinessProfile() {
  const [error, setError] = React.useState(null);
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [businessData, setBusinessData] = React.useState([]);
  const [memberList, setMemberList] = React.useState({});
  const [eventList, setEventList] = React.useState({});
  const [emailInput, setEmailInput] = React.useState('');
  const [emailError, setEmailError] = React.useState(false);
  const [emailMsg, setEmailMsg] = React.useState('');
  const [eventState, setEventState] = React.useState(null);
  const [selectedDate, setSelectedDate] = React.useState(new Date());
  const [confirmDialog, setConfirmDialog] = React.useState(false);
  const [cancelEventID, setCancelEventID] = React.useState('');
  const [deleteAll, setDeleteAll] = React.useState(false);
  const [showAll, setShowAll] = React.useState(false);
  const [tab, setTab] = React.useState(0);
  const context = React.useContext(Context);
  const history = useHistory();
  /**
   * deleteEvent
   * API call for deleting event
   * @param {*} eventid
   * @param {*} all
   * @return {Number}
   */
  function deleteEvent(eventid, all) {
    return 1; // what is this?
    console.log(eventid);
    const apicall = 'http://localhost:3010/api/events/'+eventid;
    return fetch(apicall, {
      method: 'DELETE',
      body: JSON.stringify({'eventid': eventid, 'deleteAll': all}),
      headers: Auth.headerJsonJWT(),
    }).then((response)=>{
      if (!response.ok) {
        if (response.status === 401) {
          Auth.removeJWT();
          context.setAuthState(false);
        }
        throw response;
      }
      return response;
    }).then((json)=>{
      console.log(json);
      return 1;
    })
        .catch((error) => {
          console.log(error);
          return -1;
        });
  };

  /**
   * deleteEventAndReload
   * Calls deleteEvent then sets state
   * @param {*} eventid
   * @param {*} all
   */
  async function deleteEventAndReload(eventid, all=false) {
    // call API to remove event from events table
    const test = await deleteEvent(eventid, all);
    // if delete failed, don't remove event from list.
    if (test !== 1) {
      return;
    }
    // copy eventlist
    const eventListCopy = JSON.parse(JSON.stringify(eventList));
    if (all) {
      for (const event in eventList) {
        if (eventList[event].repeatid == eventList[eventid].repeatid) {
          delete eventListCopy[event];
        }
      }
    } else {
      // delete event
      delete eventListCopy[eventid];
    }
    // update eventList state
    setEventList(eventListCopy);
  };

  // I wrote this how react recommends
  // https://reactjs.org/docs/faq-ajax.html
  // Since the dependents array provided at the end is empty, this
  // should only ever run once
  React.useEffect(async () => {
    const businessRes = fetch('http://localhost:3010/api/businesses/getBusiness', {
      method: 'GET',
      headers: Auth.headerJsonJWT(),
    }).then((res) => res.json())
        .then((data) => {
          setBusinessData(data);
        },
        (error) => {
          setError(error);
        },
        );
    const eventRes = fetch('http://localhost:3010/api/businesses/getBusinessEvents', {
      method: 'GET',
      headers: Auth.headerJsonJWT(),
    }).then((res) => res.json())
        .then((data) => {
          // The value is an array of events for that business
          const eventDict = {};
          for (const index in data) {
            if (data.hasOwnProperty(index)) {
              eventDict[data[index].eventid] = data[index];
            }
          }
          setEventList(eventDict);
        },
        (error) => {
          setError(error);
        },
        );
    /* Uncomment when member retrieval api is done */
    const memberRes = fetch('http://localhost:3010/api/members/getMembers', {
      method: 'GET',
      headers: Auth.headerJsonJWT(),
    }).then((res) => res.json())
        .then((data) => {
          const memberDict = {};
          for (const i in data) {
            if (data.hasOwnProperty(i)) {
              memberDict[data[i].email] = data[i];
            }
          }
          setMemberList(memberDict);
        },
        (error) => {
          setError(error);
        },
        );
    await Promise.all([businessRes, eventRes, memberRes]);
    setIsLoaded(true);
  }, []);
  /**
   * handleSubmit
   * Handles adding members to a business
   * @param {*} event
   * @param {*} memberlist
   */
  function handleSubmit(event, memberlist) {
    event.preventDefault();
    fetch('http://localhost:3010/api/members/insertMembers', {
      method: 'POST',
      body: JSON.stringify(memberlist),
      headers: Auth.headerJsonJWT(),
    })
        .then((response) => {
          if (!response.ok) {
            if (response.status === 409) {
              setEmailError(true);
              setEmailMsg(
                  'Error: Some members don\'t exist or are already added');
            }
            throw response;
          } else {
            setEmailError(false);
            return response.json();
          }
        })
        .then((json) => {
          console.log(json);
          const membersCopy = JSON.parse(JSON.stringify(memberList));
          for (let i = 0; i < json.length; i++) {
            membersCopy[json[i].email] = json[i];
          }
          setMemberList(membersCopy);
          setEmailInput('');
        })
        .catch((error) => {
          console.log(error);
        });
  }

  /**
   * validateInput
   * Validates input for adding members to business
   * @param {*} event
   */
  const validateInput = (event) => {
    // regex to check for valid email format
    const emailRegex = new RegExp([
      '^(([^<>()[\\]\\\.,;:\\s@\"]+(\\.[^<>()\\[\\]\\\.,;:\\s@\"]+)*)',
      '|(".+"))@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.',
      '[0-9]{1,3}\])|(([a-zA-Z\\-0-9]+\\.)+',
      '[a-zA-Z]{2,}))$'].join(''));
    const memberArray = emailInput.split(',');
    for (const e in memberArray) {
      if (memberArray.hasOwnProperty(e)) {
        // convert emails to lowercase to avoid errors in backend
        memberArray[e] = memberArray[e].toLowerCase();
        if (!emailRegex.test(memberArray[e])) {
          setEmailError(true);
          setEmailMsg('One or more invalid email(s).');
          return;
        }
      }
    }
    handleSubmit(event, memberArray);
  };

  /**
   * handleKeypress
   * Checks if keypress was enter, then submits form
   * @param {*} event Event submission event
   */
  const handleKeypress = (event) => {
    // only start submit process if enter is pressed
    if (event.key === 'Enter') {
      validateInput(event);
    }
  };
  /**
   * TabPanel
   * @param {object} props Props
   * @return {object} JSX
   */
  function TabPanel(props) {
    const {children, value, index, ...other} = props;

    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box p={3}>
            {children}
          </Box>
        )}
      </div>
    );
  }
  TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
  };

  const useStyles = makeStyles((theme) => ({
    paper: {
      padding: theme.spacing(2),
      flexDirection: 'column',
      textAlign: 'center',
      color: theme.palette.text.secondary,
    },
    paper2: {
      backgroundColor: theme.palette.primary.main,
    },
    testgrid: {
      flexGrow: 1,
    },
    eventStyle: {
      marginTop: theme.spacing(2),
      alignItems: 'center',
    },
    mainGrid: {
      alignItems: 'center',
    },
    typography: {
      flexGrow: 1,
    },
    select: {
      background: theme.palette.primary.light,
      color: theme.palette.common.white,
    },
    noselect: {
      background: theme.palette.primary.light,
      color: theme.palette.common.white,
    },
    highlight: {
      background: theme.palette.primary.light,
      color: theme.palette.common.white,
    },
    highlight2: {
      background: theme.palette.primary.main,
      color: theme.palette.common.white,
    },
    nonCurrentMonthDay: {
      color: theme.palette.text.disabled,
    },
    day: {
      width: 36,
      height: 36,
      fontSize: theme.typography.caption.fontSize,
      margin: '0 2px',
      color: 'inherit',
    },
    customDayHighlight: {
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: '2px',
      right: '2px',
      border: `1px solid ${theme.palette.secondary.main}`,
      borderRadius: '50%',
    },
    dialogText: {
      marginLeft: 15,
      marginRight: 15,
    },
    no: {
      color: theme.palette.error.main,
    },
    yes: {
      color: theme.palette.secondary.dark,
    },
    buttonGroup: {
      color: '#dd0000',
    },
    buttonGroupBox: {
      alignItems: 'center',
      flexDirection: 'column',
      backgroundColor: theme.palette.primary.main,
    },
    menuButton: {
      'color': theme.palette.primary.main,
      'paddingRight': theme.spacing(2),
      'paddingLeft': theme.spacing(2),
      'backgroundColor': theme.palette.secondary.main,
      '&:hover': {
        'backgroundColor': theme.palette.secondary.dark,
        'color': theme.palette.primary.main,
      },
    },
    menuButton2: {
      'color': theme.palette.secondary.main,
      'paddingRight': theme.spacing(2),
      'paddingLeft': theme.spacing(2),
      'backgroundColor': theme.palette.primary.main,
      '&:hover': {
        'backgroundColor': theme.palette.primary.light,
      },
    },
    grid: {
      backgroundColor: theme.palette.back.main,
      border: `1px solid ${theme.palette.primary.light}`,
    },
    grid2: {
      backgroundColor: theme.palette.back.main,
    },
    divider: {
      width: '100%',
      backgroundColor: theme.palette.primary.light,
    },
  }));

  /**
   * formatDate
   * @param {string} dateString
   * @param {boolean} includeDate
   * @return {string} formatted date string
   */
  function formatDate(dateString, includeDate=true) {
    return (dateString.getHours() % 12) + ':' +
    // display 2 digit minutes if less than 10 minutes
    // https://stackoverflow.com/questions/8935414/getminutes-0-9-how-to-display-two-digit-numbers
    ((dateString.getMinutes()<10?'0':'') + dateString.getMinutes()) +
    (dateString.getHours() / 12 >= 1 ? 'PM' : 'AM') +
        ' ' + (includeDate ? dateString.toDateString():'');
  }

  /**
   * removeMember
   * @param {string} email
   */
  async function removeMember(email) {
    console.log(email);
    return fetch('http://localhost:3010/api/members/deleteMember', {
      method: 'Delete',
      body: JSON.stringify({'email': email}),
      headers: Auth.headerJsonJWT(),
    }).then((response)=>{
      if (!response.ok) {
        throw response;
      }
      return response;
    }).then((json)=>{
      return 1;
    })
        .catch((error) => {
          console.log(error);
          return -1;
        });
  }

  const classes = useStyles();

  /**
   * renderWrappedDays
   * determines the CSS for each day displayed on the calendar
   * @param {*} date
   * @param {*} selectedDate
   * @param {*} dayInCurrentMonth
   * @return {object} JSX
   */
  const renderWrappedDays = (date, selectedDate, dayInCurrentMonth) => {
    const dateClone = new Date(date);
    // true if date is the currently selected date
    const currentDay = dateClone.getDate() == selectedDate.getDate() &&
        dateClone.getMonth() == selectedDate.getMonth() &&
        dateClone.getYear() == selectedDate.getYear();
    let isEvent = false;
    // loops until it finds an event on the date
    for (const e in eventList) {
      if (eventList.hasOwnProperty(e)) {
        const date = new Date(eventList[e].starttime);
        if (date.getDate() == dateClone.getDate() &&
            date.getMonth() == dateClone.getMonth() &&
            date.getYear() == dateClone.getYear()) {
          isEvent = true;
          break;
        }
      }
    }
    /* selected day is red, days with events are highlighted, days outside of
    current month are faded*/
    const wrapperClassName = clsx({
      [classes.select]: isEvent && currentDay && dayInCurrentMonth,
      [classes.noselect]: !isEvent && currentDay && dayInCurrentMonth,
      [classes.highlight]: isEvent && dateClone.getDay() % 2 &&
          !currentDay && dayInCurrentMonth,
      [classes.highlight2]: isEvent && dateClone.getDay() % 2 === 0 &&
          !currentDay && dayInCurrentMonth,
      [classes.nonCurrentMonthDay]: !dayInCurrentMonth,
    });
    // the example needed this part as well not sure the difference specifically
    const dayClassName = clsx(classes.day, {
      [classes.highlightNonCurrentMonthDay]: !dayInCurrentMonth,
    });
    // This is just the format shown for custom day CSS at https://next.material-ui.com/components/date-picker/
    return (
      <div className={wrapperClassName}>
        <IconButton className={dayClassName}>
          <span> {format(dateClone, 'd')} </span>
        </IconButton>
      </div>
    );
  };
  /**
   * memberListInfo
   * list entry for member given member info object
   * @param {*} member
   * @return {object} JSX
   */
  function memberListInfo(member=null) {
    return (<ListItem button={true}
      key={member ? member.email : 'noMembers'}
      onClick={() => {
        /* Link to public user profile page ? */
      }}>
      <ListItemText
        primary={member ? member.username : 'None'}
        secondary={member ? member.email.toLowerCase() : ''}/>
      {member && <ListItemSecondaryAction>
        <Button
          type='submit'
          variant='contained'
          color='secondary'
          onClick={() => {
            if (removeMember(member.email)) {
              const membersCopy = JSON.parse(JSON.stringify(memberList));
              delete membersCopy[member.email];
              setMemberList(membersCopy);
            }
          }}
        >
          Remove
        </Button>
      </ListItemSecondaryAction>}
    </ListItem>);
  }
  /**
   * upcomingEvents
   * @param {int} range number of events to display
   * @return {array} list of upcoming events with the closest one at the front
   */
  function upcomingEvents(range) {
    const recentEvents = [];
    for (const i in eventList) {
      if (eventList.hasOwnProperty(i)) {
        recentEvents.push(eventList[i]);
      }
    }
    recentEvents.sort((firstEl, secondEl) => {
      return (new Date(firstEl.starttime)) < (new Date(secondEl.endtime));
    });
    return recentEvents;
  }
  if (error) {
    return <div>Error: {error.message}</div>;
  } else if (!isLoaded) {
    return <div>Loading...</div>;
  } else {
    // items2 is the outer grid which will hold items.
    const items = [];
    const items2 = [];
    // members will hold a list of member data
    // eventListJSX will hold a list of event data
    const members = [];
    const existingmembers = [];

    const recentEvents = upcomingEvents(6);

    const eventListJSX = [];
    for (const m in memberList) {
      if (memberList.hasOwnProperty(m)) {
        const member = memberList[m];
        if (member.userid !== null) {
          existingmembers.push(memberListInfo(member));
        } else {
          members.push(memberListInfo(member));
        }
      }
    }
    if (members.length === 0) {
      members.push(memberListInfo(null));
    }
    if (existingmembers.length === 0) {
      existingmembers.push(memberListInfo(null));
    }
    for (const key in eventList) {
      if (eventList.hasOwnProperty(key)) {
        const eventid = eventList[key].eventid;
        const eventName = eventList[key].eventname;
        const startDate = new Date(eventList[key].starttime);
        const dateString = formatDate(startDate);
        // only show event if it is on the date that is currently selected
        if (showAll || (startDate.getDate() == selectedDate.getDate() &&
            startDate.getMonth() == selectedDate.getMonth() &&
            startDate.getYear() == selectedDate.getYear())) {
          eventListJSX.push(
              <ListItem button
                key={eventid}
                onClick={() => {
                  setEventState(eventid);
                }}>
                <ListItemText key={eventid}
                  primary={eventName}
                  secondary={dateString}
                />
                <ListItemSecondaryAction key={eventid}>
                  <Button key={eventid}
                    type='submit'
                    variant='contained'
                    color='secondary'
                    onClick={() => {
                      setCancelEventID(eventid);
                      setDeleteAll(false);
                      setConfirmDialog(true);
                    }}
                  >
                    {'Cancel Event'}
                  </Button><br/>
                  {eventList[key].repeatid &&
                      <Button key={eventList[key].repeatid}
                        type='submit'
                        variant='contained'
                        color='primary'
                        onClick={() => {
                          setCancelEventID(eventid);
                          setDeleteAll(true);
                          setConfirmDialog(true);
                        }}
                      >
                        {'Delete All'}
                      </Button>}
                </ListItemSecondaryAction>
              </ListItem>,
          );
        }
      }
    }
    if (eventListJSX.length === 0) {
      eventListJSX.push(
          <ListItem button
            key="noEvents"
            onClick={()=>{
              history.push('/events/create');
            }}
          >
            <ListItemText
              primary="No events for selected date"
              secondary="Click to create an event"
            />
            <ListItemSecondaryAction>
              <Button
                type='submit'
                variant='contained'
                color='secondary'
                onClick={() => {
                  setShowAll(true);
                }}
              >
                {'Show all'}
              </Button><br/>
            </ListItemSecondaryAction>
          </ListItem>,
      );
    }
    if (eventState !== null) {
      // if the eventState is set to an eventID
      // then show an individualEvent page with a back button
      items2.push(
          <div key='event' className={classes.eventStyle}>
            <Button
              type='submit'
              variant='contained'
              color='secondary'
              onClick={() => {
                setEventState(null);
              }}
            >
              Back
            </Button>
            <IndividualEvent eventID={eventState}/>
          </div>,
      );
    } else {
      // otherwise show calendar and eventlist
      items.push(
          <Grid item xs={12} key={businessData.businessname}>
            <Typography variant='h6'>
              Created Events
            </Typography>
            <Divider/>
            <List>
              {eventListJSX}
            </List>
          </Grid>,
      );
      if (items.length === 0) {
        items.push(
            <Grid container item xs={12}
              key='noEvents'
              alignItems='center'
              justify='center'
              direction='column'>
              <Typography variant='h6'>
                No events for selected date
              </Typography><br/>
              <Button key='showAll'
                type='submit'
                variant='contained'
                color='secondary'
                onClick={() => {
                  setShowAll(true);
                }}
              >
                Show All Registered Events
              </Button>
            </Grid>,
        );
      } else {
        items.push(
            <Grid container item xs={12}
              key='hasEvents'
              alignItems='center'
              justify='center'
              direction='column'>
              <div key='event' className={classes.eventStyle}>
                <Button key='showAll'
                  type='submit'
                  variant='contained'
                  color='secondary'
                  onClick={() => {
                    setShowAll(!showAll);
                  }}
                >
                  {showAll? 'Show Only For Date' : 'Show All Registered Events'}
                </Button>
              </div>
            </Grid>,
        );
      }
      items2.push(<Grid item key='eventList'
        container justify='flex-end' spacing={8}>{items}
      </Grid>);
    }

    return (
      <Container component='main'>
        <div className={classes.paper}>
          <Paper>
          </Paper>
        </div>
        <div className={classes.testgrid}>
          <Grid container spacing={0}>
            <Grid item container md={12}
              direction="row">
              <Grid item md={3} className={classes.buttonGroupBox}>
              </Grid>
              <Divider orientation="vertical" flexItem
                style={{marginRight: '-1px', color: '#ff0000'}} />
              <Grid item container md={8} className={classes.buttonGroupBox}>

                <ButtonGroup variant="text"
                  className={classes.buttonGroup}
                  fullWidth
                >
                  <Button
                    className={tab === 0 ? classes.menuButton :
                      classes.menuButton2}
                    onClick={()=>{
                      setTab(0);
                    }}>Overview
                  </Button>
                  <Button
                    className={tab === 1 ? classes.menuButton :
                      classes.menuButton2}
                    onClick={()=>{
                      setTab(1);
                    }}>Members
                  </Button>
                  <Button
                    className={tab === 2 ? classes.menuButton :
                      classes.menuButton2}
                    onClick={()=>{
                      setTab(2);
                    }}>Events
                  </Button>
                </ButtonGroup>

              </Grid>
              <Grid item md={1} className={classes.buttonGroupBox}>
              </Grid>
            </Grid>
            <Grid container item md={3} direction="column">
              <UserInfo picture="picture"
                name={businessData.businessname}
                email={businessData.email}
                description={businessData.description}
                className={classes.paper2}
                style={{height: '700px'}}
              />
            </Grid>
            {tab === 0 &&
            <Divider orientation="vertical" flexItem
              style={{marginRight: '-1px'}} />}
            {tab === 0 &&
            <Grid item md={9} container style={{height: 700}}
              className={classes.grid}>
              <Typography style={{margin: 8, fontSize: '24px'}}>
                Upcoming Events:</Typography>
              <Box width='100%' height='550px'>
                <Grid item md={12} container justify='space-evenly'
                  className={classes.grid2}>
                  {recentEvents.map((event) => {
                    return (
                      <Box width='275px' key={event.eventid}>
                        <EventCard row={event} context={context}/>
                      </Box>
                    );
                  })}
                </Grid>
              </Box>
              <ShareBar style={{flexGrow: 1}}/>
            </Grid>}
            {tab === 1 && <Grid item container md={9} direction="row"
              justify="center" style={{height: 700, overflow: 'auto',
                maxHeight: 700}}
              className={classes.grid}>
              {existingmembers.length > 0 && <Box width='40%'
                style={{margin: '5%'}}>
                <Typography variant='h6'>
                  Existing Members
                </Typography>
                <Divider/>
                <List
                  style={{width: '100%', height: 220,
                    maxHeight: 220, overflow: 'auto'}}>
                  {existingmembers}
                </List>
              </Box>}
              {members.length > 0 && <Box width='40%' style={{margin: '5%'}}>
                <Typography variant='h6'>
                  Inactive Members
                </Typography>
                <Divider/>
                <List
                  style={{width: '100%', height: 220,
                    maxHeight: 220, overflow: 'auto'}}>
                  {members}
                </List>
              </Box>}
              {members.length+existingmembers.length === 0 && <Typography>
                Currently added 0 members
              </Typography>}
              <Box width='50%'>
                <TextField
                  error={emailError}
                  helperText={emailError ? emailMsg : ''}
                  variant='filled'
                  margin='normal'
                  fullWidth
                  id='email'
                  label='Email Addresses'
                  name='email'
                  autoComplete='email'
                  multiline
                  onChange={(event) => {
                    setEmailInput(event.target.value);
                  }}
                  onKeyPress={handleKeypress}
                />
                <Button
                  type='submit'
                  fullWidth
                  variant='contained'
                  color='secondary'
                  className={classes.submit}
                  onClick={validateInput}
                >
                  Add Members
                </Button>
              </Box>
            </Grid>}
            {tab === 2 && <Grid item container md={9}
              direction={eventState !== null || showAll ? 'column' : 'row'}
              alignItems='center'
              style={{height: 700, overflow: 'auto',
                maxHeight: 700}}
              className={classes.grid}>
              {eventState!==null && <div key='event'
                className={classes.eventStyle}>
                <IndividualEvent eventID={eventState}/>
              </div>}
              {eventState!==null && <Button
                type='submit'
                variant='contained'
                color='secondary'
                onClick={() => {
                  setEventState(null);
                }}
              >
                Back
              </Button>}
              {eventState === null &&showAll === false&&
              <Box width='50%'>
                <Grid container justify='center'>
                  <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <DatePicker
                      variant='static'
                      label='Event select'
                      value={selectedDate}
                      onChange={(date) => {
                        setSelectedDate(date);
                      }}
                      renderDay={renderWrappedDays}
                      align="center"
                    />
                  </MuiPickersUtilsProvider>
                </Grid>
              </Box>}
              {eventState===null && <Box width='50%'>
                <List>
                  {eventListJSX}
                </List>
              </Box>}
              {showAll && <Button
                type='submit'
                variant='contained'
                color='secondary'
                onClick={() => {
                  setShowAll(false);
                }}
              >
                Back
              </Button>}
              {/* Confirmation dialog for cancelling events */}
              <Dialog open={confirmDialog} onClose={() => {
                setConfirmDialog(false);
              }}
              aria-labelledby="confirm-dialog-title">
                <DialogTitle id="confirm-dialog-title">
                  {deleteAll ? 'Cancel Repeating Event' : 'Cancel Event'}
                </DialogTitle>
                <DialogContentText className={classes.dialogText}>
                  {/* Change message for deleting all vs. cancelling one
                    event */}
                  {deleteAll ?
                      'Are you sure you want to delete all instances of' +
                      ' this repeating event?' :
                      'Are you sure you want to cancel this event?'}
                </DialogContentText>
                <DialogActions>
                  <Button
                    className={classes.no}
                    onClick={() => {
                      // Close dialog and don't delete event if user clicks No
                      setConfirmDialog(false);
                    }}>
                    No
                  </Button>
                  <Button
                    className={classes.yes}
                    onClick={() => {
                      /* Call deleteEventAndReload,close dialog if user
                      clicks Yes */
                      deleteEventAndReload(cancelEventID, deleteAll);
                      setConfirmDialog(false);
                    }}>
                    Yes
                  </Button>
                </DialogActions>
              </Dialog>
            </Grid>}
          </Grid>
        </div>
      </Container>
    );
  }
}
