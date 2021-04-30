import React from 'react';
import Container from '@material-ui/core/Container';
import {makeStyles} from '@material-ui/core/styles';
import {IconButton} from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import Context from './Context';
import Auth from './libs/Auth';
import TextField from '@material-ui/core/TextField';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IndividualEvent from './IndividualEvent';
import DateFnsUtils from '@date-io/date-fns';
import {DatePicker, MuiPickersUtilsProvider} from '@material-ui/pickers';
import clsx from 'clsx';
import format from 'date-fns/format';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';
import PropTypes from 'prop-types';

/**
 * BusinessProfile component
 * @return {object} BusinessProfile JSX
 */
export default function BusinessProfile() {
  const [error, setError] = React.useState(null);
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [businessData, setBusinessData] = React.useState([]);
  const [memberList, setMemberList] = React.useState([]);
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

  /**
   * deleteEvent
   * API call for deleting event
   * @param {*} eventid
   * @param {*} all
   * @return {Number}
   */
  function deleteEvent(eventid, all) {
    return 1;
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
          setMemberList(data);
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
      marginTop: theme.spacing(8),
      flexGrow: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    eventStyle: {
      marginTop: theme.spacing(2),
      flexGrow: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    typography: {
      flexGrow: 1,
    },
    select: {
      background: theme.palette.secondary.main,
      color: theme.palette.common.white,
    },
    noselect: {
      background: theme.palette.secondary.light,
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
    const eventListJSX = [];
    for (const m in memberList) {
      if (memberList.hasOwnProperty(m)) {
        const member = memberList[m];
        members.push(<ListItem button={true}
          key={member.userid}
          onClick={() => {
            /* Link to public user profile page ? */
          }}>
          <ListItemText key={member.userid}
            primary={member.username}
            secondary={member.useremail.toLowerCase()}/>
          <ListItemSecondaryAction>
            <Button
              type='submit'
              variant='contained'
              color='primary'
              onClick={() => {
                removeMember(member.userid);
              }}
            >
              Remove
            </Button>
          </ListItemSecondaryAction>
        </ListItem>);
      }
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
                    color='primary'
                    onClick={() => {
                      setCancelEventID(eventid);
                      setDeleteAll(false);
                      setConfirmDialog(true);
                    }}
                  >
                    {'Cancel event'}
                  </Button><br/>
                  {eventList[key].repeatid &&
                      <Button key={eventList[key].repeatid}
                        type='submit'
                        variant='contained'
                        color='secondary'
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
    if (eventState !== null) {
      // if the eventState is set to an eventID
      // then show an individualEvent page with a back button
      items2.push(
          <div key='event' className={classes.eventStyle}>
            <Button
              type='submit'
              variant='contained'
              color='primary'
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
                color='primary'
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
                  color='primary'
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
    /**
     * tabProps
     * @param {*} index
     * @return {object}
     */
    function tabProps(index) {
      return {
        'id': 'simple-tab-${index}',
        'aria-controls': 'simple-tabpanel-${index}',
      };
    }
    const body = {
      textAlign: 'center',
    };
    return (
      <Container component='main' maxWidth='md'>
        <div className={classes.paper}>
          <AppBar position="static">
            <Tabs value={tab}
              centered
              onChange={(event, newTab)=>{
                setTab(newTab);
              }}
              aria-label="business tabs">
              <Tab label="Created Events" {...tabProps(0)} />
              <Tab label="Members" {...tabProps(1)} />
            </Tabs>
          </AppBar>
          <TabPanel value={tab} index={0}>
            <Grid container justify='center' direction='row' spacing={8}>
              {eventState === null &&showAll === false&&
              <Grid item xs={6} container justify='center'>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <DatePicker
                    variant='static'
                    label='Event select'
                    value={selectedDate}
                    onChange={(date) => {
                      setSelectedDate(date);
                    }}
                    renderDay={renderWrappedDays}
                  />
                </MuiPickersUtilsProvider>
              </Grid>}
              <Grid item container xs={6} md={showAll ? 12 : 6}>
                {items2}
              </Grid>
            </Grid>

            {/* Confirmation dialog for cancelling events */}
            <Dialog open={confirmDialog} onClose={() => {
              setConfirmDialog(false);
            }}
            aria-labelledby="confirm-dialog-title">
              <DialogTitle id="confirm-dialog-title">
                {deleteAll ? 'Cancel Repeating Event' : 'Cancel Event'}
              </DialogTitle>
              <DialogContentText className={classes.dialogText}>
                {/* Change message for deleting all vs. cancelling one event */}
                {deleteAll ?
                    'Are you sure you want to delete all instances of' +
                    ' this repeating event?' :
                    'Are you sure you want to cancel this event?'}
              </DialogContentText>
              <DialogActions>
                <Button
                  color="primary"
                  onClick={() => {
                    // Call deleteEventAndReload,close dialog if user clicks Yes
                    deleteEventAndReload(cancelEventID, deleteAll);
                    setConfirmDialog(false);
                  }}>
                  Yes
                </Button>
                <Button
                  color="primary"
                  onClick={() => {
                    // Close dialog and don't delete event if user clicks No
                    setConfirmDialog(false);
                  }}>
                  No
                </Button>
              </DialogActions>
            </Dialog>
          </TabPanel>
          <TabPanel value={tab} index={1} style={body}>
            <Grid container spacing={8}>
              <Grid item>
                <Typography variant='h6'>
                  Members
                </Typography>
                <Divider/>
                <List>
                  {members}
                </List>
                {members.length === 0 && <Typography>
                  Currently added 0 members
                </Typography>}
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
                  color='primary'
                  className={classes.submit}
                  onClick={validateInput}
                >
                  Add Members
                </Button>
              </Grid>
            </Grid>
          </TabPanel>
        </div>
      </Container>
    );
  }
}
