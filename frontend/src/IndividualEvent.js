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
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import LocationOnOutlinedIcon from '@material-ui/icons/LocationOnOutlined';
import {EventCard} from './Components';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Context from './Context';
const Auth = require('./libs/Auth');
const Util = require('./libs/Util');

const useStyles = makeStyles((theme) => ({
  root: {
    marginLeft: 20,
    marginRight: 20,
  },
  grid: {
    marginTop: 20,
    justifyContent: 'center',
  },
  dialogText: {
    marginLeft: 15,
    marginRight: 15,
  },
  avatar: {
    margin: '0 auto',
    fontSize: '6rem',
    width: theme.spacing(16),
    height: theme.spacing(16),
    [theme.breakpoints.up('md')]: {
      fontSize: '10rem',
      width: theme.spacing(25),
      height: theme.spacing(25),
    },
  },
  businessName: {
    marginTop: theme.spacing(3),
  },
  businessDescription: {
    marginTop: theme.spacing(3),
    marginLeft: 20,
    marginRight: 20,
  },
  iconText: {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  date: {
    color: theme.palette.secondary.dark,
  },
  location: {
    color: theme.palette.primary.dark,
  },
  description: {
    marginTop: theme.spacing(3),
    marginLeft: 10,
  },
  capacity: {
    marginTop: theme.spacing(3),
    marginLeft: 10,
  },
  signupButton: {
    marginTop: 15,
    marginLeft: 10,
  },
  share: {
    marginTop: theme.spacing(3),
  },
  shareIcon: {
    color: theme.palette.secondary.main,
    width: 50,
    height: 50,
  },
  card: {
    [theme.breakpoints.up('lg')]: {
      width: 250,
    },
    [theme.breakpoints.down('md')]: {
      width: 175,
    },
    margin: '0 auto',
    marginTop: theme.spacing(3),
  },
}));

/**
 * IndividualEvent component
 * @param {*} props
 * @return {object} JSX
 */
const IndividualEvent = (props) => {
  const classes = useStyles();
  const context = React.useContext(Context);
  // const history = useHistory();
  // const location = useLocation();
  const eventid = props.eventID;

  const [eventData, setEventData] = useState({});
  const [businessData, setBusinessData] = useState({});
  // const [signupError, setSignupError] = useState(false);
  const [signupType, setSignupType] = useState(undefined);
  const [numAttendees, setNumAttendees] = useState(undefined);
  const [confirmDialog, setConfirmDialog] = React.useState(false);
  const [eventList, setEventList] = React.useState([]);

  useEffect(() => {
    getEventData();
    getTotalAttendees();
    getRegistration();
  }, []);

  /**
   * getBusinessEvents
   * API call to get events
   * @param {string} businessid ID of business that created this event
   */
  function getBusinessEvents(businessid) {
    const apicall = 'http://localhost:3010/api/businesses/' +
        businessid + '/events';
    fetch(apicall, {
      method: 'GET',
      headers: Auth.headerJsonJWT(),
    }).then((response) => {
      if (!response.ok) {
        throw response;
      }
      return response.json();
    }).then((json) => {
      setEventList(json.slice(0, 3));
      setEventList(eventList.filter((event) =>
        event.eventid !== eventid,
      ));
    })
        .catch((error) => {
          console.log(error);
        });
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
          getBusinessEvents(json.businessid);
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

  return (
    <div>
      <Grid container spacing={3} className={classes.grid}>
        <Grid item xs={3} className={classes.businessInfo}>
          <Avatar
            alt={businessData.businessname}
            src={'./picture'}
            className={classes.avatar}
          />
          <Typography className={classes.businessName}
            variant='h3' align='center'>
            {businessData.businessname}
          </Typography>
          <Typography variant='body1' align='center'>
            {businessData.email}
          </Typography>
          <Typography variant='body1' align='center'>
            {businessData.phonenumber}
          </Typography>
          <Typography className={classes.businessDescription}
            variant='body1' align='center'>
            {businessData.description}
          </Typography>
        </Grid>

        <Grid item xs={4} className={classes.eventInfo}>
          <Typography className={classes.title} variant='h2'>
            {eventData.eventname}
          </Typography>
          <Box className={classes.iconText}>
            <AccessTimeIcon className={classes.date}/>
            <Typography className={classes.date} variant='h6'>
              {Util.formatDate(eventData.starttime, eventData.endtime)}
            </Typography>
          </Box>
          <Box className={classes.iconText}>
            <LocationOnOutlinedIcon className={classes.location}/>
            <Typography className={classes.location} variant='h6'>
              Science &amp; Engineering Library
            </Typography>
          </Box>

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
          <Typography variant='h5' align='center'>
            More {businessData.businessname} Events
          </Typography>
          <Box className={classes.eventCards}>
            {eventList.length > 0 ?
              eventList.map((event) =>
                <EventCard
                  className={classes.card}
                  row={event} context={context} key={event.eventid} />,
              ) :
              <Card className={classes.card}>
                <CardContent>
                  <Typography variant='h6' component='h2' align='center'>
                    No Other Events Available
                  </Typography>
                </CardContent>
              </Card>
            }
          </Box>
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
