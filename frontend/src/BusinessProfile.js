import React from 'react';
import Container from '@material-ui/core/Container';
import {makeStyles} from '@material-ui/core/styles';
import {IconButton} from "@material-ui/core";
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import Context from './Context';
import Auth from './libs/Auth';
import TextField from '@material-ui/core/TextField';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import IndividualEvent from './IndividualEvent';
import DateFnsUtils from '@date-io/date-fns';
import { DatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import Box from '@material-ui/core/Box';
import clsx from "clsx";
import format from "date-fns/format";


export default function BusinessProfile() {
  const [error, setError] = React.useState(null);
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [businessData, setBusinessData] = React.useState([]);
  const [memberData, setMemberData] = React.useState([]);
  const [eventList, setEventList] = React.useState({});
  const [emailInput, setEmailInput] = React.useState("");
  const [emailError, setEmailError] = React.useState(false);
  const [emailMsg, setEmailMsg] = React.useState("");
  const [eventState, setEventState] = React.useState(null);
  const [repeatingEventList,setRepeatingEventList] = React.useState({});
  const [selectedDate, setSelectedDate] = React.useState(new Date());
  const context = React.useContext(Context);
  // handles removing the user from the event id the button click corresponds to
  function deleteEvent(eventid,all) {
    console.log(eventid);
    var apicall = 'http://localhost:3010/api/events/'+eventid;
    return fetch(apicall, {
      method: 'DELETE',
      body: JSON.stringify({'eventid':eventid,'deleteAll':all}),
      headers: Auth.JWTHeaderJson(),
    }).then((response)=>{
      if (!response.ok) {
        if (response.status === 401) {
          Auth.removeJWT();
          context.setAuthState(null);
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

  async function deleteEventAndReload(eventid, repeatid=null,all=false) {
    const test = await deleteEvent(eventid,all);                      // call API to remove event from events table
    if (test !== 1) {                                             // if delete failed, don't remove event from list.
      return;
    }
    if (repeatid) {
      var repeatingEventListCopy = JSON.parse(JSON.stringify(repeatingEventList));
      var eventListCopy = JSON.parse(JSON.stringify(eventList));
      if (all) { // to delete all of a repeating event, remove the event from the event list and delete the entry in the repeating event dict
        delete eventListCopy[eventid];
        delete repeatingEventListCopy[repeatid];
        setEventState(null);
        setEventList(eventListCopy);
        setRepeatingEventList(repeatingEventListCopy);
        return;
      }
      // gets index of to-be deleted event in repeated event array
      var index = -1;
      for (let e in repeatingEventListCopy[repeatid]) {
        if (repeatingEventListCopy[repeatid][e].eventid === eventid) {
          index = e;
          break;
        }
      }
      var newEventState = null;
      // if only one element is left, we need to delete the repeated event entry
      if (index > -1 && repeatingEventListCopy[repeatid].length === 1) {delete eventListCopy[eventid]; delete repeatingEventListCopy[repeatid];newEventState = null;}
      // else if we delete the first element, we need to update the event list
      else if (index == 0) {
        delete eventListCopy[eventid]; eventListCopy[repeatingEventListCopy[repeatid][1].eventid] = repeatingEventListCopy[repeatid][1];
        newEventState = repeatingEventListCopy[repeatid][1].eventid;
        repeatingEventListCopy[repeatid].splice(index,1);
      }
      // otherwise just splice the element
      else if (index > -1) {
        repeatingEventListCopy[repeatid].splice(index,1);
        newEventState = eventState;
      }
      // kinda jank, but it will prevent the full page from being loaded before everything has updated
      setIsLoaded(false);
      setEventList(eventListCopy);
      setEventState(newEventState);
      setRepeatingEventList(repeatingEventListCopy);
      setIsLoaded(true);
    } else {
      var eventListCopy = JSON.parse(JSON.stringify(eventList));    // copy eventlist
      delete eventListCopy[eventid];                                // delete event
      setEventList(eventListCopy);                                  // update eventList state
    }
  };

  // I wrote this how react recommends
  // https://reactjs.org/docs/faq-ajax.html
  // Since the dependents array provided at the end is empty, this
  // should only ever run once
  React.useEffect(async () => {
    const businessRes = fetch('http://localhost:3010/api/businesses/getBusiness', {
      method: 'GET',
      headers: Auth.JWTHeaderJson(),
    }).then(res => res.json())
    .then((data) => {
        setBusinessData(data);
      },
      (error) => {
        setError(error);
      }
    )
    const eventRes = fetch('http://localhost:3010/api/businesses/getBusinessEvents', {
      method: 'GET',
      headers: Auth.JWTHeaderJson(),
    }).then(res => res.json())
    .then((data) => {
      // The value is an array of events for that business
      let eventDict = {};
      let repeatDict = {};
      // holds all repeating events by repeat id
      let repeatEvents = {};
      for (var index in data) {
        if ('repeatid' in data[index]) {
          if (!(data[index].repeatid in repeatDict)) {
            repeatDict[data[index].repeatid] = data[index];
            repeatEvents[data[index].repeatid] = [];
            repeatEvents[data[index].repeatid].push(data[index]);
          } else {
            repeatEvents[data[index].repeatid].push(data[index]);
          }
        } else {
          eventDict[data[index].eventid] = data[index];
        }
      }
      var sortdates = (event1,event2) => {return (new Date(event1.starttime) > new Date(event2.endtime));}
      for (let repeatid in repeatEvents) {
        repeatEvents[repeatid].sort(sortdates);
        eventDict[repeatEvents[repeatid][0].eventid]=repeatEvents[repeatid][0];
      }
      setEventList(eventDict);
      setRepeatingEventList(repeatEvents);
    },
      (error) => {
        setError(error);
        }
      )
    /* Uncomment this when the get member api route is made */
    // const memberRes = fetch('http://localhost:3010/api/businesses/members', {
    //   method: 'GET',
    //   headers: Auth.JWTHeaderJson(),
    // }).then(res => res.json())
    // .then((data) => {
    //     setMemberData(data);
    //   },
    //   (error) => {
    //     setError(error);
    //   }
    // )
    await Promise.all([businessRes, eventRes]);
    setIsLoaded(true);
  }, []);
  function handleSubmit(event) {
    event.preventDefault();
  }
  const validateInput = (event) => {
    // regex to check for valid email format
    const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!emailRegex.test(emailInput)) {
      setEmailError(true);
      setEmailMsg("Invalid email.");
    } else {
      handleSubmit(event);
    }
  }
  const handleKeypress = (event) => {
    // only start submit process if enter is pressed
    if (event.key === "Enter") {
      validateInput(event);
    }
  }

  const useStyles = makeStyles((theme) => ({
    paper: {
      marginTop: theme.spacing(8),
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    eventStyle: {
      marginTop: theme.spacing(2),
      flexGrow:1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    typography: {
      flexGrow:1,
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
    firstHighlight: {
      extend: "highlight",
      borderTopLeftRadius: "50%",
      borderBottomLeftRadius: "50%",
    },
    endHighlight: {
      extend: "highlight",
      borderTopRightRadius: "50%",
      borderBottomRightRadius: "50%",
    },
    nonCurrentMonthDay: {
      color: theme.palette.text.disabled,
    },
    highlightNonCurrentMonthDay: {
      color: "#676767",
    },
    day: {
      width: 36,
      height: 36,
      fontSize: theme.typography.caption.fontSize,
      margin: "0 2px",
      color: "inherit",
    },
    customDayHighlight: {
      position: "absolute",
      top: 0,
      bottom: 0,
      left: "2px",
      right: "2px",
      border: `1px solid ${theme.palette.secondary.main}`,
      borderRadius: "50%",
    },
  }));

  function formatDate(dateString,includeDate=true) {
    return (dateString.getHours() % 12) + ":" +
    // display 2 digit minutes if less than 10 minutes
    // https://stackoverflow.com/questions/8935414/getminutes-0-9-how-to-display-two-digit-numbers
    ((dateString.getMinutes()<10?'0':'') + dateString.getMinutes()) +
    (dateString.getHours() / 12 >= 1 ? "PM" : "AM") + " " + (includeDate ? dateString.toDateString():'');
  }
  const classes = useStyles();
  const renderWrappedDays = (date, selectedDate, dayInCurrentMonth) => {
    let dateClone = new Date(date);
    let selectedDateClone = new Date(selectedDate);
    let currentDay = dateClone.getDate() == selectedDate.getDate() && dateClone.getMonth() == selectedDate.getMonth() && dateClone.getYear() == selectedDate.getYear();

    let isEvent = false;
    if (eventState) {
      let rev = repeatingEventList[eventList[eventState].repeatid];
      for (let re in rev) {
        let reDate = new Date(rev[re].starttime);
        if (reDate.getDate() == dateClone.getDate()) {
        }
        if (reDate.getDate() == dateClone.getDate()&&reDate.getMonth() == dateClone.getMonth()&&reDate.getYear() == dateClone.getYear()) {
          isEvent = true;
          break;
        }
      }
    } else {
      for (let e in eventList) {
        if (eventList[e].repeatid) {
          let rev = repeatingEventList[eventList[e].repeatid];
          for (let re in rev) {
            let reDate = new Date(rev[re].starttime);
            if (reDate.getDate() == dateClone.getDate()&&reDate.getMonth() == dateClone.getMonth()&&reDate.getYear() == dateClone.getYear()) {
              isEvent = true;
              break;
            }
          }
          if (isEvent) {break};
        } else {
          let date = new Date(eventList[e].starttime);
          if (date.getDate() == dateClone.getDate()&&date.getMonth() == dateClone.getMonth()&&date.getYear() == dateClone.getYear()) {
            isEvent = true;
            break;
          }
        }
      }
    }
    const wrapperClassName = clsx({
      [classes.select]: isEvent && currentDay && dayInCurrentMonth,
      [classes.noselect]: !isEvent && currentDay && dayInCurrentMonth,
      [classes.highlight]: isEvent && dateClone.getDay() % 2 && !currentDay && dayInCurrentMonth,
      [classes.highlight2]: isEvent && dateClone.getDay() % 2 === 0 && !currentDay && dayInCurrentMonth,
      [classes.nonCurrentMonthDay]: !dayInCurrentMonth,
    });

    const dayClassName = clsx(classes.day, {
      [classes.highlightNonCurrentMonthDay]: !dayInCurrentMonth,
    });

    return (
      <div className={wrapperClassName}>
        <IconButton className={dayClassName}>
          <span> {format(dateClone, "d")} </span>
        </IconButton>
      </div>
    );
  }
  if (error) {
    return <div>Error: {error.message}</div>;
  } else if (!isLoaded) {
    return <div>Loading...</div>;
  } else {
    const items = [];
    const items2 = [];
    const members = [];
    let eventListJSX = [];
    let repEventListJSX = [];
    for (var key in eventList) {
      if (eventList[key].repeatid) {
        let rev = repeatingEventList[eventList[key].repeatid];
        for (let re in rev) {
          let eventid = rev[re].eventid;
          let eventName = rev[re].eventname;
          let startDate = new Date(rev[re].starttime);
          let dateString = formatDate(startDate);
          let rid = rev[re].repeatid;
          if (startDate.getDate() == selectedDate.getDate() && startDate.getMonth() == selectedDate.getMonth() && startDate.getYear() == selectedDate.getYear())
          eventListJSX.push(
            <ListItem button onClick={() => {setEventState(eventid);}} key={eventid}>
              <ListItemText key={eventid}
                primary={eventName}
                secondary={rid ? ("Next: \n "+dateString) : dateString}
              />
              <ListItemSecondaryAction key={eventid}>
                <Button key={eventid}
                  type="submit"
                  variant="contained"
                  color="primary"
                  onClick={() => {deleteEventAndReload(eventid, rid)}}
                >
                  Cancel Event
                </Button><br/>
                <Button key={rid}
                  type="submit"
                  variant="contained"
                  color="primary"
                  onClick={() => {deleteEventAndReload(eventid, rid,true)}}
                >
                  Delete All
                </Button>
              </ListItemSecondaryAction>
            </ListItem>
          );
        }
      } else {
        let eventid = eventList[key].eventid;
        let eventName = eventList[key].eventname;
        let startDate = new Date(eventList[key].starttime);
        let dateString = formatDate(startDate);
        let repeatDateString = eventList[key].repeatid ? formatDate(new Date(eventList[key].repeatstart)) : '';
        eventListJSX.push(
          <ListItem button onClick={() => {setEventState(eventid);}} key={eventid}>
            <ListItemText key={eventid}
              primary={eventName}
              secondary={eventList[key].repeatid ? ("Next: \n "+dateString) : dateString}
            />
            <ListItemSecondaryAction key={eventid}>
              <Button key={eventid}
                type="submit"
                variant="contained"
                color="primary"
                onClick={() => {deleteEventAndReload(eventid, null)}}
              >
                {eventList[key].repeatid ? "See more" : "Cancel event"}
              </Button>
            </ListItemSecondaryAction>
          </ListItem>
        );
      }

    }
    if (eventState !== null) {
      // if the eventState is set to an eventID then show an individualEvent page with a back button
      items2.push(
        <div key="event" className={classes.eventStyle}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            onClick={() => {setEventState(null)}}
          >
            Back
          </Button>
          <IndividualEvent eventID={eventState}/>
        </div>
      );
    } else {
      items.push(
        <Grid item item xs={6} md={6} key={businessData.businessname}>
          <Typography variant="h6">
            Created Events
          </Typography>
          <Divider/>
          <Grid container justify="center">
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <DatePicker
            variant="static"
            label="Event select"
            value={selectedDate}
            onChange={(date) => {setSelectedDate(date)}}
            renderDay={renderWrappedDays}
          />
          </MuiPickersUtilsProvider>
          </Grid>
          <List>
          {eventListJSX}
          </List>
          {eventListJSX.length === 0 && <Typography>
            Currently created 0 events
          </Typography>}
          {eventListJSX.length === 0 && <Button
              type="submit"
              variant="contained"
              color="primary"
              href="/events/create"
          >
            Create Events
          </Button>}
        </Grid>
      );
      items.push(
        <Grid item item xs={6} md={6} key={"test"}>
          <Typography variant="h6">
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
            helperText={emailError ? emailMsg : ""}
            variant="filled"
            margin="normal"
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            onChange={(event) => {setEmailInput(event.target.value);}}
            onKeyPress={handleKeypress}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={validateInput}
          >
            Add Member
          </Button>
        </Grid>
      );
      items2.push(<Grid key="eventList" container spacing={8}>{items}</Grid>);
    }
    return (
      <Container component="main" maxWidth="md">
        <div className={classes.paper}>
          <Typography className={classes.typography} variant="h1">
            {businessData.businessname}
          </Typography>
          <Typography className={classes.typography} variant="h4">
            {businessData.email}
          </Typography>
          {items2}

        </div>
      </Container>
    );
  }
}
