import React, {useEffect, useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import {useHistory} from 'react-router-dom';
import Box from '@material-ui/core/Box';
import {Grid} from '@material-ui/core';
import Button from '@material-ui/core/Button';
import PropTypes from 'prop-types';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Typography from '@material-ui/core/Typography';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import LocationOnOutlinedIcon from '@material-ui/icons/LocationOnOutlined';
import {BusinessInfo} from './Components';
import EventCard from './Components/Events/EventCard';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Context from './Context';
import Hidden from '@material-ui/core/Hidden';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import Chip from '@material-ui/core/Chip';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import {TwitterShareButton, FacebookShareButton} from './Components';
const Auth = require('./libs/Auth');
const Util = require('./libs/Util');

/**
 * Alert component for error snackbar
 * See "Customized Snackbar" example
 * https://material-ui.com/components/snackbars/
 * @param {*} props
 * @return {object} Alert
 */
function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme) => ({
  root: {
    marginLeft: 15,
    marginRight: 15,
  },
  grid: {
    marginTop: 10,
    marginBottom: 10,
    justifyContent: 'center',
  },
  dialogText: {
    marginLeft: 15,
    marginRight: 15,
  },
  smallAvatar: {
    width: '4px',
    [theme.breakpoints.down('sm')]: {
      width: '20px',
    },
  },
  businessName: {
    [theme.breakpoints.down('sm')]: {
      fontSize: '1rem',
    },
  },
  title: {
    fontWeight: 350,
    [theme.breakpoints.down('sm')]: {
      fontSize: '2.5rem',
    },
  },
  dateIcon: {
    color: theme.palette.secondary.dark,
    width: '40px',
    height: '40px',
  },
  locationIcon: {
    color: theme.palette.primary.dark,
    width: '40px',
    height: '40px',
  },
  date: {
    color: theme.palette.secondary.dark,
    [theme.breakpoints.down('sm')]: {
      fontSize: '1rem',
    },
  },
  location: {
    color: theme.palette.primary.dark,
    [theme.breakpoints.down('sm')]: {
      fontSize: '1rem',
    },
  },
  chip: {
    marginRight: 5,
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
    marginTop: theme.spacing(2),
    margin: '0 auto',
    [theme.breakpoints.up('lg')]: {
      width: 275,
    },
    [theme.breakpoints.down('md')]: {
      width: 225,
    },
    [theme.breakpoints.down('sm')]: {
      width: 250,
      marginLeft: 5,
      marginRight: 5,
    },
  },
  no: {
    color: theme.palette.error.main,
  },
  yes: {
    color: theme.palette.secondary.dark,
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
  const history = useHistory();
  // const location = useLocation();
  const eventid = props.eventID;

  const [eventData, setEventData] = useState({});
  const [businessData, setBusinessData] = useState({});
  const [signupError, setSignupError] = useState(false);
  const [signupErrorMsg, setSignupErrorMsg] = useState('');
  const [signupType, setSignupType] = useState(undefined);
  const [numAttendees, setNumAttendees] = useState(undefined);
  const [confirmDialog, setConfirmDialog] = React.useState(false);
  const [eventList, setEventList] = React.useState([]);
  const properties = [['membersonly', 'Members Only'], ['over18', '18+'],
    ['over21', '21+'], ['category',
      eventData.category ? eventData.category[0].toUpperCase() +
      eventData.category.substring(1) : null]];

  useEffect(() => {
    getEventData();
    getTotalAttendees();
    if (context.authState) getRegistration();
  }, [context.authState]);

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
      if (context.authState) {
        setEventList(json.filter((event) =>
          event.eventid !== eventid,
        ).slice(0, 3));
      } else {
        setEventList(json.filter((event) =>
          event.eventid !== eventid && !event.membersonly,
        ).slice(0, 3));
      }
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
              setSignupType(true);
            } else if (response.status === 403) {
              setSignupError(true);
              return response.json();
            } else {
              return;
            }
          } else {
            setSignupType(false);
            setNumAttendees(numAttendees+1);
            return response;
          }
        })
        .then((json) => {
          if (json) setSignupErrorMsg(json.message);
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
    <div style={{overflow: 'hidden'}}>
      <Grid container spacing={6} className={classes.grid}>
        <Hidden xsDown>
          <Grid item md={3}>
            <BusinessInfo
              picture='picture'
              name={businessData.businessname}
              email={businessData.email}
              phonenumber={businessData.phonenumber}
              description={businessData.description}
              businessid={businessData.businessid}
              onClick={()=>{
                history.push('/business/profile/'+businessData.businessid);
              }}
            />
          </Grid>
        </Hidden>

        <Grid item xs={10} sm={6} md={4} xl={3} className={classes.eventInfo}>
          <Typography className={classes.title} variant='h2'>
            {eventData.eventname}
          </Typography>
          <Hidden smUp>
            <ListItem dense disableGutters>
              <ListItemAvatar className={classes.smallAvatar}>
                <Avatar
                  alt={businessData.businessname}
                  src={'./picture'}
                />
              </ListItemAvatar>
              <ListItemText>
                <Typography className={classes.businessName}
                  variant='h6' align='left'>
                  {businessData.businessname}
                </Typography>
              </ListItemText>
            </ListItem>
          </Hidden>
          <ListItem dense disableGutters>
            <ListItemIcon className={classes.icon}>
              <AccessTimeIcon className={classes.dateIcon}/>
            </ListItemIcon>
            <ListItemText>
              <Typography className={classes.date} variant='h6'>
                {Util.formatDate(eventData.starttime, eventData.endtime)}
              </Typography>
            </ListItemText>
          </ListItem>
          <ListItem dense disableGutters>
            <ListItemIcon className={classes.icon}>
              <LocationOnOutlinedIcon className={classes.locationIcon}/>
            </ListItemIcon>
            <ListItemText>
              <Typography className={classes.location} variant='h6'>
                {eventData.location ? eventData.location : 'N/A'}
              </Typography>
            </ListItemText>
          </ListItem>

          <Box>
            {properties.filter((data) => eventData[data[0]]).map((data) => {
              return (
                <Chip
                  key={data[1]}
                  label={data[1]}
                  className={classes.chip}
                />
              );
            })}
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

          {context.authState && !context.businessState &&
            (<Button className={classes.signupButton}
              variant="contained" color="secondary"
              disabled={signupType && numAttendees == eventData.capacity}
              onClick={() => {
                signupType === true ? signUp() : setConfirmDialog(true);
              }}>
              {signupType === true ? 'Sign Up' : 'Withdraw'}
            </Button>)}
          {!context.authState &&
            (<Button className={classes.signupButton}
              variant="contained" color="secondary"
              href='/login'>
              Login To Sign Up For Event
            </Button>)
          }

          <Box className={classes.share}>
            <FacebookShareButton
              msg={'I am going to '+eventData.eventname+
                ' at '+Util.formatDate(eventData.starttime, eventData.endtime)+
                '. Sign up!'}
              url={'localhost:3000/events/'+eventid}/>
            <TwitterShareButton
              msg={'I am going to '+eventData.eventname+
                ' at '+Util.formatDate(eventData.starttime, eventData.endtime)+
                '. Sign up!'}
              url={'localhost:3000/events/'+eventid}/>
          </Box>
        </Grid>

        <Grid item xs={false} md={3}>
          <Typography variant='h6' align='center'>
            More {businessData.businessname} Events
          </Typography>
          <Grid container className={classes.grid}>
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
          </Grid>
        </Grid>
      </Grid>

      {/* Error snackbar when signing up for age restricted events */}
      <Snackbar open={signupError} autoHideDuration={5000} onClose={() => {
        setSignupError(false);
      }}>
        <Alert onClose={() => {
          setSignupError(false);
        }} severity="error">
          {signupErrorMsg}
        </Alert>
      </Snackbar>

      {/* Confirmation dialog for withdrawing from events */}
      <Dialog
        open={confirmDialog}
        onClose={() => {
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
            className={classes.no}
            onClick={() => {
              // Close dialog and don't withdraw if user clicks No
              setConfirmDialog(false);
            }}>
            No
          </Button>
          <Button
            className={classes.yes}
            onClick={() => {
              // Call withdraw, close dialog if user clicks Yes
              withdraw();
              setConfirmDialog(false);
            }}>
            Yes
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
