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




export default function BusinessProfile() {
  const [error, setError] = React.useState(null);
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [businessData, setBusinessData] = React.useState([]);
  const [eventList, setEventList] = React.useState({});
  const [emailInput, setEmailInput] = React.useState("");
  const [emailError, setEmailError] = React.useState(false);
  const [emailMsg, setEmailMsg] = React.useState("");
  const context = React.useContext(Context);
  // handles removing the user from the event id the button click corresponds to
  function deleteEvent(eventid) {
    console.log(eventid);
    var apicall = 'http://localhost:3010/api/events/'+eventid;
    return fetch(apicall, {
      method: 'DELETE',
      headers: Auth.JWTHeaderJson(),
    }).then((response)=>{
      if (!response.ok) {
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

  async function deleteEventAndReload(eventid, eventList) {
    const test = await deleteEvent(eventid);                      // call API to remove event from events table
    if (test !== 1) {                                             // if delete failed, don't remove event from list.
      console.log("Could not remove event");
      return;
    }
    console.log("Deleted event",eventList[eventid]);
    var eventListCopy = JSON.parse(JSON.stringify(eventList));    // copy eventlist
    delete eventListCopy[eventid];                                // delete event
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
  const classes = useStyles();
  if (error) {
    return <div>Error: {error.message}</div>;
  } else if (!isLoaded) {
    return <div>Loading...</div>;
  } else {
    const items = [];
    let eventListJSX = [];
    for (var key in eventList) {
      let eventid = eventList[key].eventid;
      let eventName = eventList[key].eventname;
      let startDate = new Date(eventList[key].starttime);
      let dateString = (startDate.getHours() % 12) + ":" + startDate.getMinutes() + (startDate.getHours() / 12 >= 1 ? "PM" : "AM") + " " + startDate.toDateString();
      eventListJSX.push(
        <ListItem key={eventid}>
          <ListItemText key={eventid}
            primary={eventName}
            secondary={dateString}
          />
          <ListItemSecondaryAction key={eventid}>
            <Button key={eventid}
              type="submit"
              variant="contained"
              color="primary"
              onClick={() => {deleteEventAndReload(eventid, eventList)}}
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
          Created Events
        </Typography>
        <Divider/>
        <List>
        {eventListJSX}
        </List>
      </Grid>
    );
    items.push(
      <Grid item item xs={6} md={6} key={"test"}>
        <Typography variant="h6">
          Members
        </Typography>
        <Divider/>
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
          autoFocus
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
    const items2 = [];
    items2.push(<Grid key="eventList" container spacing={8}>{items}</Grid>);
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
