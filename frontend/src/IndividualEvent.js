import React, {useEffect, useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
// import {useHistory, useLocation} from 'react-router-dom';
import Box from '@material-ui/core/Box';
import {Grid} from '@material-ui/core';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import PropTypes from 'prop-types';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import FacebookIcon from '@material-ui/icons/Facebook';
import TwitterIcon from '@material-ui/icons/Twitter';
import InstagramIcon from '@material-ui/icons/Instagram';
const Auth = require('./libs/Auth');

const useStyles = makeStyles((theme) => ({
  grid: {
    marginTop: 50,
    marginLeft: 50,
    marginRight: 50,
  },
  eventInfo: {
    margin: '0 auto',
  },
  dialogText: {
    marginLeft: 15,
    marginRight: 15,
  },
  avatar: {
    margin: '0 auto',
    width: theme.spacing(16),
    height: theme.spacing(16),
    [theme.breakpoints.up('md')]: {
      width: theme.spacing(25),
      height: theme.spacing(25),
    },
  },
  date: {
    color: theme.palette.secondary.dark,
  },
  description: {
    marginTop: theme.spacing(6),
  },
  capacity: {
    marginTop: theme.spacing(6),
  },
  signupButton: {
    marginTop: 15,
  },
  share: {
    marginTop: theme.spacing(6),
  },
  shareIcon: {
    color: theme.palette.secondary.main,
    width: 50,
    height: 50,
  },
}));

/**
 * IndividualEvent component
 * @param {*} props
 * @return {object} JSX
 */
const IndividualEvent = (props) => {
  const classes = useStyles();
  // const history = useHistory();
  // const location = useLocation();
  const eventid = props.eventID;

  const [eventData, setEventData] = useState({});
  const [businessData, setBusinessData] = useState({});
  // const [signupError, setSignupError] = useState(false);
  const [signupType, setSignupType] = useState(undefined);
  const [numAttendees, setNumAttendees] = useState(undefined);
  const [confirmDialog, setConfirmDialog] = React.useState(false);

  useEffect(() => {
    getEventData();
    getTotalAttendees();
    getRegistration();
  }, []);

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

  /**
   * formatDate
   * @param {string} startTimestamp start date
   * @param {string} endTimestamp end date
   * @return {string} formatted date string
   */
  function formatDate(startTimestamp, endTimestamp) {
    const now = new Date(Date.now());
    const start = new Date(startTimestamp);
    const end = new Date(endTimestamp);

    const startTime = (start.getHours() % 12) + ':' +
        ((start.getMinutes()<10?'0':'') + start.getMinutes()) +
        (start.getHours() / 12 >= 1 ? 'PM' : 'AM');
    const endTime = (end.getHours() % 12) + ':' +
        ((end.getMinutes()<10?'0':'') + end.getMinutes()) +
        (end.getHours() / 12 >= 1 ? 'PM' : 'AM');

    let startDate;
    let endDate = '';
    // if event starts and ends on same day, don't list end date separately
    if (start.getDate() === end.getDate() &&
    start.getMonth() === end.getMonth() &&
    start.getFullYear() === end.getFullYear()) {
      // don't show year if event is starting this year
      if (start.getFullYear() === now.getFullYear()) {
        startDate = start.toLocaleDateString('en-US',
            {weekday: 'long', month: 'long', day: 'numeric'});
      } else {
        startDate = start.toLocaleDateString('en-US',
            {weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'});
      }
    } else {
      // shortened weekday and month if start and end dates are different
      if (start.getFullYear() === now.getFullYear()) {
        startDate = start.toLocaleDateString('en-US',
            {weekday: 'short', month: 'short', day: 'numeric'});
      } else {
        startDate = start.toLocaleDateString('en-US',
            {weekday: 'short', month: 'short', day: 'numeric',
              year: 'numeric'});
      }
      // don't show year if event is ending this year
      if (end.getFullYear() === now.getFullYear()) {
        endDate = end.toLocaleDateString('en-US',
            {weekday: 'short', month: 'short', day: 'numeric'});
      } else {
        endDate = end.toLocaleDateString('en-US',
            {weekday: 'short', month: 'short', day: 'numeric',
              year: 'numeric'});
      }
    }

    return startDate + ' ' + startTime + ' - ' + endDate + ' ' + endTime;
  }

  return (
    <div>
      <Grid container spacing={4} className={classes.grid}>
        <Grid item xs={3} className={classes.businessInfo}>
          <Avatar
            alt={businessData.businessname}
            className={classes.avatar}
          />
          <h1>{businessData.businessname}</h1>
          <p>
            Email: {businessData.email}
          </p>
          <p>
            Phone Number: {businessData.phonenumber}
          </p>
        </Grid>

        <Grid item xs={6} className={classes.eventInfo}>
          <Typography className={classes.title} variant='h2'>
            {eventData.eventname}
          </Typography>
          <Typography className={classes.date} variant='h6'>
            {formatDate(eventData.starttime, eventData.endtime)}
          </Typography>
          <Typography className={classes.location} variant='h6'>
            Science &amp; Engineering Library
          </Typography>

          <Typography className={classes.description} variant='body1'>
            {eventData.description ?
                  eventData.description :
                  'No description available for this event.'}
          </Typography>

          <Typography
            className={classes.capacity}
            variant='h6'
            color={numAttendees === eventData.capacity ?
              'error' : 'textPrimary'}>
            {eventData.capacity-numAttendees}
            &nbsp;of {eventData.capacity} spots open
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

          <Box className={classes.share}>
            <IconButton>
              <FacebookIcon className={classes.shareIcon}/>
            </IconButton>
            <IconButton>
              <TwitterIcon className={classes.shareIcon}/>
            </IconButton>
            <IconButton>
              <InstagramIcon className={classes.shareIcon}/>
            </IconButton>
          </Box>
        </Grid>

        <Grid item xs={3}>
        </Grid>
      </Grid>


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
