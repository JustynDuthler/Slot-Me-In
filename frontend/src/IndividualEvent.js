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
  const [signupType, setSignupType] = useState(undefined);

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
        if (signupType != undefined) {
          setSignupType(false);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  function withdraw() {
    console.log(eventid);
    var apicall = 'http://localhost:3010/api/users/removeUserAttending';
    fetch(apicall, {
      method: 'DELETE',
      body: JSON.stringify({"eventid":eventid}),
      headers: Auth.JWTHeaderJson(),
    }).then((response)=>{
      if (!response.ok) {
        throw response;
      }
      return response;
    }).then((json)=>{
      console.log(json);
      if (signupType != undefined) {
        setSignupType(true);
      }
    })
    .catch((error) => {
      console.log(error);
      return -1;
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

  function getRegistration() {
    const eventRes = fetch('http://localhost:3010/api/users/getUserEvents', {
      method: 'GET',
      headers: Auth.JWTHeaderJson(),
    }).then((res) => {
      if (!res.ok) {
        throw res;
      }
      return res.json();
    }) .then((data) => {
      // The value is an array of events for that business

          for (var index in data) {
            if (data[index].eventid === eventid) {

              setSignupType(false);
              return;
            }

          }

          setSignupType(true);
    }).catch((error)=>{
      console.log(error);
    })
    };

  useEffect(() => {
    getEventData();
    getTotalAttendees();
    getRegistration();
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
      {signupType !== undefined && (<Button variant="contained" color="secondary" onClick={() => {signupType === true ? signUp() : withdraw()}}>
        {signupType === true ? "Sign Up" : "Withdraw"}
      </Button>)}


    </div>

  );
};

export default IndividualEvent;
