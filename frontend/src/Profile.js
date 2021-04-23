import React from 'react';
import Container from '@material-ui/core/Container';
import {makeStyles} from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import Context from './Context';
import Auth from './libs/Auth';




export default function Profile() {
  const [error, setError] = React.useState(null);
  const [isLoaded1, setIsLoaded1] = React.useState(false);
  const [isLoaded2, setIsLoaded2] = React.useState(false);
  const [userData, setUserData] = React.useState([]);
  const [eventList, setEventList] = React.useState([]);
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
  React.useEffect(() => {
    console.log(context);
    console.log(context.businessState);
    const apicall = 'http://localhost:3010/api/' + (context.businessState ? 'businesses/getBusiness' : 'users/getUser');
    console.log(apicall);
    fetch(apicall, {
      method: 'GET',
      headers: Auth.JWTHeaderJson(),
    })
      .then(res => res.json())
      .then((data) => {
          setUserData(data);
          setIsLoaded1(true);
        },
        (error) => {
          setIsLoaded1(true);
          setError(error);
        }
      )
  }, []);

  // Get user attending information
  React.useEffect(() => {
    const apicall = 'http://localhost:3010/api/' + (context.businessState ? 'businesses/getBusinessEvents' : 'users/getUserEvents');
    console.log(apicall);
    fetch(apicall, {
      method: 'GET',
      headers: Auth.JWTHeaderJson(),
    })
      .then(res => res.json())
      .then((data) => {

          // Create a dict with businessname as key
          // The value is an array of events for that business
          let eventDict = {};
          for (var index in data) {
            if (eventDict[data[index].businessname] == null) {
              eventDict[data[index].businessname] = [];
            }
            eventDict[data[index].businessname].push(data[index]);
          }
          setEventList(eventDict);
          setIsLoaded2(true);
        },
        (error) => {
          setError(error);
          setIsLoaded2(true);
        }
      )
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
  } else if (!isLoaded1 || !isLoaded2) {
    return <div>Loading...</div>;
  } else {
    const items = [];
    for (var key in eventList) {
      items.push(<h1 key={key}>{key}</h1>);
      for (var value in eventList[key]){
        items.push(
        <h3
          key={eventList[key][value].eventid}>{eventList[key][value].eventname}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            onClick={() => {removeUserAndReload(eventList[key][value].eventid)}}
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
