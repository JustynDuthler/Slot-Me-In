import React from 'react';
import Container from '@material-ui/core/Container';
import {makeStyles} from '@material-ui/core/styles';
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
import Box from '@material-ui/core/Box';


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
  const [showRepeating, setShowRepeating] = React.useState(false);
  const [repeatingEventList,setRepeatingEventList] = React.useState({});
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
  }));
  function repeatInfo(eventid) {
    setEventState(eventid);
    setShowRepeating(true);
    var repeating = [];
  }
  function formatDate(dateString) {
    return (dateString.getHours() % 12) + ":" +
    // display 2 digit minutes if less than 10 minutes
    // https://stackoverflow.com/questions/8935414/getminutes-0-9-how-to-display-two-digit-numbers
    ((dateString.getMinutes()<10?'0':'') + dateString.getMinutes()) +
    (dateString.getHours() / 12 >= 1 ? "PM" : "AM") + " " + dateString.toDateString();
  }
  const classes = useStyles();
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
      let eventid = eventList[key].eventid;
      let eventName = eventList[key].eventname;
      let startDate = new Date(eventList[key].starttime);
      let dateString = formatDate(startDate);
      let repeatDateString = eventList[key].repeatid ? formatDate(new Date(eventList[key].repeatstart)) : '';
      eventListJSX.push(
        <ListItem button onClick={() => {setEventState(eventid);setShowRepeating(false);}} key={eventid}>
          <ListItemText key={eventid}
            primary={eventName}
            secondary={eventList[key].repeatid ? ("Next: \n "+dateString) : dateString}
          />
          <ListItemSecondaryAction key={eventid}>
            <Button key={eventid}
              type="submit"
              variant="contained"
              color="primary"
              onClick={() => {eventList[key].repeatid ? repeatInfo(eventid) : deleteEventAndReload(eventid, null)}}
            >
              {eventList[key].repeatid ? "See more" : "Cancel event"}
            </Button>
          </ListItemSecondaryAction>
        </ListItem>
      );

    }
    if (eventState !== null) {
      // if the eventState is set to an eventID then show an individualEvent page with a back button
      if (!showRepeating) {
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
        let rev = repeatingEventList[eventList[eventState].repeatid];
        let eventName = "";
        for (var key in rev) {
          let eventid = rev[key].eventid;
          eventName = rev[key].eventname;
          let startDate = new Date(rev[key].starttime);
          let endDate = new Date(rev[key].endtime);
          let dateString = formatDate(startDate);
          let rid = rev[key].repeatid;
          let repeatDateString = rid ? formatDate(new Date(rev[key].repeatstart)) : '';
          repEventListJSX.push(
            <ListItem key={eventid}>
              <ListItemText key={eventid}
                primary={"Starts: "+dateString}
                secondary={"Ends: "+formatDate(endDate)}
              />
              <ListItemSecondaryAction key={eventid}>
                <Button key={eventid}
                  type="submit"
                  variant="contained"
                  color="primary"
                  onClick={() => {deleteEventAndReload(eventid, rid)}}
                >
                  Cancel event
                </Button>
              </ListItemSecondaryAction>
            </ListItem>
          );

        }
        items.push(
          <Grid item item xs={6} md={6} key={businessData.businessname}>
            <Typography variant="h6">
              {eventName}
            </Typography>
            <Divider/>
            <List>
            {repEventListJSX}
            </List>
          </Grid>
        );
        items2.push(<div key="buttons"><Button
          key="backbutton"
          type="submit"
          variant="contained"
          color="primary"
          onClick={() => {setEventState(null)}}
        > Back
        </Button><Button
          key="deleteall"
          type="submit"
          variant="contained"
          color="primary"
          onClick={() => {deleteEventAndReload(rev[0].eventid,rev[0].repeatid,true)}}
        > Delete All
        </Button></div>);
        items2.push(<Grid key="eventList" container justify="center" spacing={8}>{items}</Grid>);
      }
    } else {
      items.push(
        <Grid item item xs={6} md={6} key={businessData.businessname}>
          <Typography variant="h6">
            Created Events
          </Typography>
          <Divider/>
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
