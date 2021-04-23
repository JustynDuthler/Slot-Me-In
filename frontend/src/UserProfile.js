import React from 'react';
import Container from '@material-ui/core/Container';
import {makeStyles} from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import Context from './Context';
import Auth from './libs/Auth';




export default function UserProfile() {
  const [error, setError] = React.useState(null);
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [userData, setUserData] = React.useState([]);
  const [eventList, setEventList] = React.useState({});
  const context = React.useContext(Context);
  // handles removing the user from the event id the button click corresponds to
  function removeUserAttending(eventid) {
    console.log(eventid);
    var apicall = 'http://localhost:3010/api/users/removeUserAttending';
    fetch(apicall, {
      method: 'DELETE',
      body: JSON.stringify({"eventid":eventid}),
      headers: Auth.JWTHeaderJson(),
    })
    .catch((error) => {
      console.log(error);
    });
  };

  function removeUserAndReload(eventid) {
    removeUserAttending(eventid);
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
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
  }));
  const classes = useStyles();
  if (error) {
    return <div>Error: {error.message}</div>;
  } else if (!isLoaded) {
    return <div>Loading...</div>;
  } else {
    const items = [];
    for (var key in eventList) {
      items.push(<h1 key={key}>{key}</h1>);
      for (var value in eventList[key]){
        let eventid = eventList[key][value].eventid;
        console.log(eventid);
        items.push(
        <h3
          key={eventList[key][value].eventid}>{eventList[key][value].eventname}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            onClick={() => {removeUserAndReload(eventid)}}
          >
            Cancel event
          </Button>
        </h3>);
      }
    }
    return (
      <Container component="main" maxWidth="md">
        <div className={classes.paper}>
          <Typography component="h1" variant="h1">
            {userData.username}
          </Typography>
          <Typography component="h1" variant="h4">
            {userData.email}
          </Typography>
          {items}
        </div>
      </Container>
    );
  }
}
