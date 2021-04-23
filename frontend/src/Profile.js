import Container from '@material-ui/core/Container';

import React from 'react';
import Auth from './libs/Auth';
import Button from '@material-ui/core/Button';

export default function Profile() {
  const [error, setError] = React.useState(null);
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [userData, setUserData] = React.useState([]);
  const [eventList, setEventList] = React.useState([]);

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

  // I wrote this how react recommends
  // https://reactjs.org/docs/faq-ajax.html
  // Since the dependents array provided at the end is empty, this 
  // should only ever run once
  React.useEffect(() => {
    fetch('http://localhost:3010/api/users/getUser', {
      method: 'GET',
      headers: Auth.JWTHeaderJson(),
    })
      .then(res => res.json())
      .then((data) => {
          setUserData(data);
          setIsLoaded(true);
        },
        (error) => {
          setIsLoaded(true);
          setError(error);
        }
      )
  }, []);

  // Get user attending information
  React.useEffect(() => {
    fetch('http://localhost:3010/api/users/getUserEvents', {
      method: 'GET',
      headers: Auth.JWTHeaderJson(),
    })
      .then(res => res.json())
      .then((data) => {
          setEventList(data);
        },
        (error) => {
          setError(error);
        }
      )
  }, []);

  if (error) {
    return <div>Error: {error.message}</div>;
  } else if (!isLoaded) {
    return <div>Loading...</div>;
  } else {
    return (
      <Container>
        <h1>Profile</h1>
        {userData.username}
        <br/>
        {userData.email}
        <br/>
        {eventList.map(item => (
          <h2 key={item.eventid}>
            {item.eventname}
            {item.businessname}
            <Button  
              type="submit"
              variant="contained"
              color="primary"
              onClick={removeUserAttending(item.eventid)}
            >
              Cancel event 
            </Button>
          </h2>
        ))}
      </Container>
    );
  }
}