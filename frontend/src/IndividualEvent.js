import React, {useEffect, useState} from 'react';
import {useHistory} from 'react-router-dom';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import PropTypes from 'prop-types';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Typography from '@material-ui/core/Typography';
import {makeStyles} from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  dialogText: {
    marginLeft: 15,
    marginRight: 15,
  },
  signupButton: {
    margin: 15,
  },
}));

const Auth = require('./libs/Auth');

/**
 * TabPanel
 * @param {object} props Props
 * @return {object} JSX
 */
function TabPanel(props) {
  const {children, value, index, ...other} = props;

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
          {children}
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

/**
 * a11yProps
 * @param {*} index
 * @return {object}
 */
function a11yProps(index) {
  return {
    'id': 'simple-tab-${index}',
    'aria-controls': 'simple-tabpanel-${index}',
  };
}

// const useStyles = makeStyles((theme) => ({
//   root: {
//     flexGrow: 1,
//     backgroundColor: theme.palette.background.paper,
//   },
// }));

/**
 * IndividualEvent component
 * @param {*} props
 * @return {object} JSX
 */
const IndividualEvent = (props) => {
  const history = useHistory();
  const classes = useStyles();
  const eventid = props.eventID;

  const [eventData, setEventData] = useState({});
  const [businessData, setBusinessData] = useState({});
  // const [signupError, setSignupError] = useState(false);
  const [signupType, setSignupType] = useState(undefined);
  const [numAttendees, setNumAttendees] = useState(undefined);
  const [confirmDialog, setConfirmDialog] = React.useState(false);

  const [value, setValue] = React.useState(0);

  /**
   * handleChange
   * @param {*} event
   * @param {*} newValue
   */
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  /**
   * signUp
   * API call to signup for event
   */
  function signUp() {
    const apicall = 'http://localhost:3010/api/events/'+eventid+'/signup';
    fetch(apicall, {
      method: 'PUT',
      headers: Auth.headerJsonJWT(),
    })
        .then((response) => {
          if (!response.ok) {
            if (response.status === 401) {
              Auth.removeJWT();
              context.setAuthState(false);
            } else if (response.status === 409) {
              // setSignupError(true);
              setSignupType(true);
            } else {
              // setSignupError(false);
            }
          } else {
            setSignupType(false);
            setNumAttendees(numAttendees+1);
            return response;
          }
        })
        .catch((error) => {
          console.log(error);
        });
  };

  /**
   * withdraw
   * Withdraw user from event
   */
  function withdraw() {
    const apicall = 'http://localhost:3010/api/users/removeUserAttending';
    fetch(apicall, {
      method: 'DELETE',
      body: JSON.stringify({'eventid': eventid}),
      headers: Auth.headerJsonJWT(),
    }).then((response)=>{
      if (!response.ok) {
        if (response.status === 401) {
          Auth.removeJWT();
          context.setAuthState(false);
        }
        throw response;
      } else {
        setSignupType(true);
        setNumAttendees(numAttendees-1);
        return response;
      }
    }).catch((error) => {
      console.log(error);
      return -1;
    });
  };

  /**
   * getBusinessData
   * API call to get info for a business
   * @param {string} businessid
   */
  function getBusinessData(businessid) {
    const apicall = 'http://localhost:3010/api/businesses/'+businessid;
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
          setBusinessData(json);
          console.log(json);
        })
        .catch((error) => {
          console.log(error);
        });
  };

  /**
   * getEventData
   * API call to get data for an event
   */
  function getEventData() {
    const apicall = 'http://localhost:3010/api/events/'+eventid;
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
          getBusinessData(json.businessid);
        })
        .catch((error) => {
          console.log(error);
        });
  };

  /**
   * getTotalAttendees
   * API call to get attendees for an event
   */
  function getTotalAttendees() {
    const apicall = 'http://localhost:3010/api/attendees/'+eventid;
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
          setNumAttendees(json.length);
        })
        .catch((error) => {
          console.log(error);
        });
  };

  /**
   * getRegistration
   * API call to get events a user has signed up for
   */
  function getRegistration() {
    fetch('http://localhost:3010/api/users/getUserEvents', {
      method: 'GET',
      headers: Auth.headerJsonJWT(),
    }).then((res) => {
      if (!res.ok) {
        if (res.status === 401) {
          Auth.removeJWT();
          context.setAuthState(false);
        }
        throw res;
      }
      return res.json();
    }) .then((data) => {
      // The value is an array of events for that business
      for (const index in data) {
        if (data[index].eventid === eventid) {
          setSignupType(false);
          return;
        }
      }
      setSignupType(true);
    }).catch((error)=>{
      console.log(error);
    });
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
      <Box mt={3}>
        <button onClick={() => history.goBack()}>Back</button>
        <h1>{eventData.eventname}</h1>
      </Box>
      <AppBar position="static" style={body}>
        <Tabs value={value}
          centered
          onChange={handleChange}
          aria-label="simple tabs example">
          <Tab label="Event Info" {...a11yProps(0)} />
          <Tab label="Business Info" {...a11yProps(1)} />
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={0} style={body}>

        <Box mb={-2}>
          <h3>Description</h3>
        </Box>
        <Box mt={-2}>
          <p>{eventData.description ? eventData.description : 'N/A'}</p>
        </Box>

        <Box mb={-2}>
          <h3>Start Time</h3>
        </Box>
        <Box mt={-2}>
          <p>
            {new Date(eventData.starttime).toLocaleString('en-US',
                {weekday: 'long', month: 'short', day: 'numeric',
                  year: 'numeric'})} at {new Date(eventData.starttime)
                .toLocaleString('en-US', {hour: 'numeric', minute: 'numeric'})}
          </p>
        </Box>

        <Box mb={-2}>
          <h3>End Time</h3>
        </Box>
        <Box mt={-2}>
          <p>
            {new Date(eventData.endtime).toLocaleString('en-US',
                {weekday: 'long', month: 'short', day: 'numeric',
                  year: 'numeric'})} at {new Date(eventData.endtime)
                .toLocaleString('en-US', {hour: 'numeric', minute: 'numeric'})}
          </p>
        </Box>

        <Typography
          variant='h6' align='center'
          color={numAttendees === eventData.capacity ? 'error' : 'textPrimary'}>
          {eventData.capacity - numAttendees} of {eventData.capacity} spots open
        </Typography>
        {signupType !== undefined &&
          (<Button className={classes.signupButton}
            variant="contained" color="secondary"
            disabled={signupType && numAttendees == eventData.capacity}
            onClick={() => {
              signupType === true ? signUp() : setConfirmDialog(true);
            }}>
            {signupType === true ? 'Sign Up' : 'Withdraw'}
          </Button>)
        }

      </TabPanel>
      <TabPanel value={value} index={1} style={body}>
        <h1>{businessData.businessname}</h1>
        <Box mb={-2}>
          <h3>Contact Information</h3>
        </Box>
        <Box mt={-2} mb={-2}>
          <p>
            Email: {businessData.email}
          </p>
        </Box>
        <Box mt={-2}>
          <p>
            Phone Number: {businessData.phonenumber}
          </p>
        </Box>
      </TabPanel>

      {/* Confirmation dialog for withdrawing from events */}
      <Dialog open={confirmDialog} onClose={() => {
        setConfirmDialog(false);
      }}
      aria-labelledby="confirm-dialog-title">
        <DialogTitle id="confirm-dialog-title">
          Withdraw From Event
        </DialogTitle>
        <DialogContentText className={classes.dialogText}>
          Are you sure you want to withdraw from this event?
        </DialogContentText>
        <DialogActions>
          <Button
            color="primary"
            onClick={() => {
              // Call withdraw, close dialog if user clicks Yes
              withdraw();
              setConfirmDialog(false);
            }}>
            Yes
          </Button>
          <Button
            color="primary"
            onClick={() => {
              // Close dialog and don't withdraw if user clicks No
              setConfirmDialog(false);
            }}>
            No
          </Button>
        </DialogActions>
      </Dialog>
    </div>

  );
};

IndividualEvent.propTypes = {
  eventID: PropTypes.string,
};

export default IndividualEvent;
