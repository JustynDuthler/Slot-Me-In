import React, { useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

const Auth = require('./libs/Auth');

/**
 *
 * @return {object} JSX
 */


function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
}));

const IndividualEvent = (props) => {
  const classes = useStyles();
  const eventid = props.eventID;

  const [eventData, setEventData] = useState({});
  const [attendeesData, setAttendeesData] = useState([]);
  const [signupError, setSignupError] = useState(false);
  const [signupType, setSignupType] = useState(undefined);
  const [numAttendees, setNumAttendees] = useState(undefined);

  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

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
            setNumAttendees(numAttendees+1)
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
      setNumAttendees(json.length);
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
    <div>
      <Box mt={5}>
        <h1>{eventData.eventname}</h1>
      </Box>
      <AppBar position="static" style={body}>
        <Tabs value={value} onChange={handleChange} aria-label="simple tabs example">
        <Tab label="Event Info" {...a11yProps(0)} />
        <Tab label="Business Info" {...a11yProps(1)} />
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={0} style={body}>

        <Box mb={-2}>
          <h3>Description</h3>
        </Box>
        <Box mt={-2}>
          <p>{eventData.description ? eventData.description : "N/A"}</p>
        </Box>

        <Box mb={-2}>
          <h3>Start Time</h3>
        </Box>
        <Box mt={-2}>
          <p>
            {new Date(eventData.starttime).toLocaleString('en-US',
              {weekday: 'long', month: 'short', day: 'numeric',
              year: 'numeric'})} at {new Date(eventData.starttime).toLocaleString('en-US', {hour: 'numeric', minute: 'numeric'})}
          </p>
        </Box>

        <Box mb={-2}>
          <h3>End Time</h3>
        </Box>
        <Box mt={-2}>
          <p>
            {new Date(eventData.endtime).toLocaleString('en-US',
                {weekday: 'long', month: 'short', day: 'numeric',
                year: 'numeric'})} at {new Date(eventData.endtime).toLocaleString('en-US', {hour: 'numeric', minute: 'numeric'})}
          </p>
        </Box>

        <p>Capacity: {numAttendees}/{eventData.capacity}</p>
        {signupType !== undefined && (<Button variant="contained" color="secondary" onClick={() => {signupType === true ? signUp() : withdraw()}}>
          {signupType === true ? "Sign Up" : "Withdraw"}
        </Button>)}

      </TabPanel>
      <TabPanel value={value} index={1} style={body}>
        Business info will go here
      </TabPanel>


    </div>

  );
};

export default IndividualEvent;
