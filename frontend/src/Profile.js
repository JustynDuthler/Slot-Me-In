import Container from '@material-ui/core/Container';

import React from 'react';
import Auth from './libs/Auth';

export default function Profile() {
  const [error, setError] = React.useState(null);
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [userData, setUserData] = React.useState([]);
  const [eventList, setEventList] = React.useState([]);
  
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

  // Once userData has been set, get user attending information
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
  }, [userData]);

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
          <h2 key={item.eventid}>{item.eventname}</h2> 
        ))}
      </Container>
    );
  }
}