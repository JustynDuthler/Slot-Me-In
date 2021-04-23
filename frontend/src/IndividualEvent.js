import React, { useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';

const Auth = require('./libs/Auth');

/**
 *
 * @return {object} JSX
 */
const IndividualEvent = (props) => {
  const eventid = props.eventID;

  
  const [eventData, setEventData] = useState({});
  const [attendeesData, setAttendeesData] = useState([]);
  const [signupError, setSignupError] = useState(false);

  /* API call to sign up for events */
  function signUp() {
    console.log("signing up for event");
    var apicall = 'http://localhost:3010/api/events/'+eventid+'/signup';
    fetch(apicall, {
        method: 'PUT',
        headers: Auth.JWTHeaderJson(),
    })
      .then((response) => {
        if (!response.ok) {
          if (response.status === 409)
            setSignupError(true);
          } else {
            setSignupError(false);
            return response;
          }
      })
      .then((json) => {
        console.log(json);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  /* API call to get event data */
  function getEventData() {
    var apicall = 'http://localhost:3010/api/events/'+eventid;
    fetch(apicall, {
      method: 'GET',
    })
    .then((response) => {
      if (!response.ok) {
        throw response;
      } else {
        return response.json();
      }
    })
    .then((json) => {
      setEventData(json);
    })
    .catch((error) => {
      console.log(error);
    });
  };

  /* API call to get total attendees */
  function getTotalAttendees() {
    var apicall = 'http://localhost:3010/api/attendees/'+eventid;
    console.log('api call: ' + apicall);
    fetch(apicall, {
      method: 'GET',
    })
    .then((response) => {
      if (!response.ok) {
        throw response;
      } else {
        return response.json();
      }
    })
    .then((json) => {
      setAttendeesData(json);
    })
    .catch((error) => {
      console.log(error);
    });
  };

  useEffect(() => {
    getEventData();
    getTotalAttendees();
  }, []);

  const body = {
    textAlign: 'center',
  };
  
  return (
    <div style={body}>
      <h1>{eventData.eventname}</h1>
      <h3>{eventData.description}</h3>
      <p>Start Time: {new Date(eventData.starttime).toLocaleString('en-US',
                {weekday: 'long', month: 'short', day: 'numeric',
                  year: 'numeric', hour: 'numeric', minute: 'numeric'})}</p>
      <p>End Time: {new Date(eventData.endtime).toLocaleString('en-US',
                {weekday: 'long', month: 'short', day: 'numeric',
                  year: 'numeric', hour: 'numeric', minute: 'numeric'})}</p>
      <p>Capacity: {attendeesData.length}/{eventData.capacity}</p>
      <Button variant="contained" color="secondary" onClick={signUp}>
        Sign Up
      </Button>


    </div>

  );
};

export default IndividualEvent;
