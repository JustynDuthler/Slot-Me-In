import React from 'react';
import Container from '@material-ui/core/Container';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import {makeStyles} from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import Context from './Context';
import Auth from './libs/Auth';
import IndividualEvent from './IndividualEvent';
import Paper from '@material-ui/core/Paper';





export default function UserProfile() {
  const [error, setError] = React.useState(null);
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [userData, setUserData] = React.useState([]);
  const [eventList, setEventList] = React.useState({});
  const [eventViewID, setEventViewID] = React.useState(null);

  const context = React.useContext(Context);
  // handles removing the user from the event id the button click corresponds to
  async function removeUserAttending(eventid) {
    var apicall = 'http://localhost:3010/api/users/removeUserAttending';
    return fetch(apicall, {
      method: 'DELETE',
      body: JSON.stringify({"eventid":eventid}),
      headers: Auth.JWTHeaderJson(),
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
  };

  async function removeUserAndReload(eventid, eventKey, eventValue, eventList) {
    const test = await removeUserAttending(eventid);                        // call API to remove user from attendees table
    if (test !== 1) {                                             // if withdraw failed, don't remove event from list.
      console.log("Could not withdraw from event");
      return;
    }
    eventList[eventKey].splice(eventValue, 1);                    // splice out event
    let updatedEventList = JSON.parse(JSON.stringify(eventList)); // copy eventlist into a new object so state can update
    if (updatedEventList[eventKey].length == 0) {                 // if no more events for a business remove business from dict
      delete updatedEventList[eventKey];
    }
    setEventList(updatedEventList);                               // update eventList state
  };

  // I wrote this how react recommends
  // https://reactjs.org/docs/faq-ajax.html
  // Since the dependents array provided at the end is empty, this
  // should only ever run once
  React.useEffect(async () => {
    const userRes = fetch('http://localhost:3010/api/users/getUser', {
      method: 'GET',
      headers: Auth.JWTHeaderJson(),
    }).then(res => res.json())
    .then((data) => {
        setUserData(data);
      },
      (error) => {
        setError(error);
      }
    )
    const eventRes = fetch('http://localhost:3010/api/users/getUserEvents', {
      method: 'GET',
      headers: Auth.JWTHeaderJson(),
    }).then(res => res.json())
    .then((data) => {
      // The value is an array of events for that business
          let eventDict = {};
          for (var index in data) {
            if (eventDict[data[index].businessname] == null) {
              eventDict[data[index].businessname] = [];
            }
      eventDict[data[index].businessname].push(data[index]);
    }
    setEventList(eventDict);
    },
      (error) => {
        setError(error);
        }
      )
    await Promise.all([userRes, eventRes]);
    setIsLoaded(true);
  }, []);


  const useStyles = makeStyles((theme) => ({
    paper: {
      marginTop: theme.spacing(8),
      flexGrow:1,
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


  // UI Stuff
  const items = [];
  if (error) {
    return <div>Error: {error.message}</div>;
  } else if (!isLoaded) {
    return <div>Loading...</div>;

  } else if (eventViewID !== null) {
    items.push(
      <div key="event" className={classes.eventStyle}>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          onClick={() => setEventViewID(null)}
        >
          Back
        </Button>
        <IndividualEvent eventID={eventViewID}/>
      </div>
    );
  } else {
    const items2 = [];
    // Var key is the business name
    for (var key in eventList) {
      let eventListJSX = [];
      // Value is the index of the event
      for (var value in eventList[key]){
        let eventid = eventList[key][value].eventid;
        let eventName = eventList[key][value].eventname;
        let startDate = new Date(eventList[key][value].starttime);
        let dateString = (startDate.getHours() % 12) + ":" + startDate.getMinutes() + (startDate.getHours() / 12 >= 1 ? "PM" : "AM") + " " + startDate.toDateString();
        let eventKey = key;
        let eventValue = value;

        eventListJSX.push(
          <ListItem button={true} onClick={() => setEventViewID(eventid)} key={eventid}>
            <ListItemText key={eventid}
              primary={eventName}
              secondary={dateString}
            />
            <ListItemSecondaryAction key={eventid}>
              <Button key={eventid}
                type="submit"
                variant="contained"
                color="primary"
                onClick={() => {removeUserAndReload(eventid, eventKey, eventValue, eventList)}}
              >
                Withdraw
              </Button>
            </ListItemSecondaryAction>
          </ListItem>
        );
      }

      items2.push(
        <Grid item xs={12} md={6} key={key}>
          <Typography variant="h6">
            {key}
          </Typography>
          <Divider/>
          <List>
          {eventListJSX}
          </List>
        </Grid>
      );
    }

    return (
      <Container component="main" maxWidth="md">
        <div className={classes.paper}>
          <Typography className={classes.typography} variant="h1">
            {userData.username}
          </Typography>
          <Typography className={classes.typography} variant="h4">
            {userData.email}
          </Typography>
          {items.length === 0 && <Typography component="h1" variant="h5">
          No registered events.
          </Typography>}
          {items.length === 0 &&
          <Button
            href="/events"
            color="primary"
            size="large"
            variant="contained"
          >
            Find Events
          </Button>}
          {items}
        </div>
      </Container>
  );

}
}
