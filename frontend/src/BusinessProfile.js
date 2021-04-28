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
  const [memberList, setMemberList] = React.useState([]);
  const [eventList, setEventList] = React.useState({});
  const [emailInput, setEmailInput] = React.useState("");
  const [emailError, setEmailError] = React.useState(false);
  const [emailMsg, setEmailMsg] = React.useState("");
  const [eventState, setEventState] = React.useState(null);
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

  async function deleteEventAndReload(eventid,all=false) {
    const test = await deleteEvent(eventid,all);                      // call API to remove event from events table
    if (test !== 1) {                                             // if delete failed, don't remove event from list.
      return;
    }
    var eventListCopy = JSON.parse(JSON.stringify(eventList));    // copy eventlist
    if (all) {
      for (let event in eventList) {
        if (eventList[event].repeatid == eventList[eventid].repeatid) {
          delete eventListCopy[event];
        }
      }
    }
    else {
      delete eventListCopy[eventid];                                // delete event
    }
    setEventList(eventListCopy);                                  // update eventList state
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
      for (var index in data) {
        eventDict[data[index].eventid] = data[index];
      }
      setEventList(eventDict);
    },
      (error) => {
        setError(error);
        }
      )
    /* Uncomment when member retrieval api is done */
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
  function handleSubmit(event,memberlist) {
    event.preventDefault();
    fetch('http://localhost:3010/api/members/insertMembers', {
      method: 'POST',
      body: JSON.stringify(memberlist),
      headers: Auth.JWTHeaderJson(),
    })
    .then((response) => {
      if (!response.ok) {
        if (response.status === 409) {
          setEmailError(true);
          setEmailMsg("Error: Either some members don't exist or are already added")
        }
        throw response;
      } else {
        setEmailError(false);
        return response;
      }
    })
    .then((json) => {
      console.log(json);
    })
    .catch((error) => {
      console.log(error);
    });
  }
  const validateInput = (event) => {
    // regex to check for valid email format

    const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const memberArray = emailInput.split(',');
    for (let e in memberArray) {
      if (!emailRegex.test(memberArray[e])) {
        setEmailError(true);
        setEmailMsg("One or more invalid email(s).");
        return;
      }
    }
    handleSubmit(event,memberArray);
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
    nonCurrentMonthDay: {
      color: theme.palette.text.disabled,
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

    for (let e in eventList) {
      let date = new Date(eventList[e].starttime);
      if (date.getDate() == dateClone.getDate()&&date.getMonth() == dateClone.getMonth()&&date.getYear() == dateClone.getYear()) {
        isEvent = true;
        break;
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
    for (var m in memberList) {
      const member = memberList[m];
      <ListItem button={true} key={member.userid} onClick={() => {/* Link to public user profile page ? */}}>
        <ListItemText key={member.userid} primary={member.username} secondary={member.email}/>
        <ListItemSecondaryAction>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            onClick={() => {removeMember(member.userid)}}
          >
            Remove
          </Button>
        </ListItemSecondaryAction>
      </ListItem>
    }
    for (var key in eventList) {
      let eventid = eventList[key].eventid;
      let eventName = eventList[key].eventname;
      let startDate = new Date(eventList[key].starttime);
      let dateString = formatDate(startDate);
      if (startDate.getDate() == selectedDate.getDate() && startDate.getMonth() == selectedDate.getMonth() && startDate.getYear() == selectedDate.getYear())
      eventListJSX.push(
        <ListItem button onClick={() => {setEventState(eventid);}} key={eventid}>
          <ListItemText key={eventid}
            primary={eventName}
            secondary={dateString}
          />
          <ListItemSecondaryAction key={eventid}>
            <Button key={eventid}
              type="submit"
              variant="contained"
              color="primary"
              onClick={() => {deleteEventAndReload(eventid, false)}}
            >
              {"Cancel event"}
            </Button><br/>
            {eventList[key].repeatid&&<Button key={eventList[key].repeatid}
              type="submit"
              variant="contained"
              color="secondary"
              onClick={() => {deleteEventAndReload(eventid,true)}}
            >
              {"Delete All"}
            </Button>}
          </ListItemSecondaryAction>
        </ListItem>
      );

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
          {eventList.length === 0 && <Typography>
            Currently created 0 events
          </Typography>}
          {eventList.length === 0 && <Button
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
        <Grid key="member list" item item xs={6} md={6} key={"test"}>
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
            label="Email Addresses"
            name="email"
            autoComplete="email"
            multiline
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
            Add Members
          </Button>
        </Grid>
      );
      items2.push(<Grid key="eventList2" container spacing={8}>{items}</Grid>);
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
