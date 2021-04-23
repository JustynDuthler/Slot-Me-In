import React, { useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';
import AccountIcon from '@material-ui/icons/AccountCircle';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';

/**
 *
 * @return {object} JSX
 */
const IndividualEvent = (props) => {
  const { match } = props;
  const { params } = match;
  const { eventid } = params;
  const [eventData, setEventData] = useState({});

  /* API call to get event data */
  function getEventData() {
    var apicall = 'http://localhost:3010/api/events/'+eventid;
    console.log(apicall);
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
      setEventData(json)
    })
    .catch((error) => {
      console.log(error);
    });
  };

  useEffect(() => {
    getEventData();
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
      <p>Capacity: {eventData.capacity}</p>
      <Button size="small" variant="contained" color="primary">
        Sign Up
      </Button>

    </div>

  );
};

export default IndividualEvent;
