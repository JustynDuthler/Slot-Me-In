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
import IconButton from '@material-ui/core/IconButton';
import FacebookIcon from '@material-ui/icons/Facebook';
import TwitterIcon from '@material-ui/icons/Twitter';
import InstagramIcon from '@material-ui/icons/Instagram';
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
  const [signupType, setSignupType] = useState(undefined);
  const [numAttendees, setNumAttendees] = useState(undefined);
  const [confirmDialog, setConfirmDialog] = React.useState(false);
  const [eventList, setEventList] = React.useState([]);
  const [chipData, setChipData] = React.useState([]);
  // property names from DB
  const chipProperties = ['membersonly', 'over18', 'over21'];
  // formatted strings to display on Chips
  const chipNames = ['Members Only', '18+', '21+'];

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
      setEventList(json.filter((event) =>
        event.eventid !== eventid,
      ).slice(0, 3));
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
              console.log(response);
            } else {
              return;
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
          const chipList = [];
          // check if each property is true
          for (const index in chipProperties) {
            if (chipProperties.hasOwnProperty(index)) {
              if (json[chipProperties[index]]) {
                // if true, push object with key and formatted name
                // ex: if property membersonly true, push label of Members Only
                chipList.push(
                    {key: chipProperties.length, label: chipNames[index]});
              }
            }
          }
          setChipData(chipList);
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
   * tweetURL
   * @return {string} The URL for making a tweet with pre-filled text and the
   * URL of the event
   */
  function tweetURL() {
    // const orig = encodeURIComponent('localhost:3000');
    const msg = encodeURIComponent('I am going to '+eventData.eventname+
      ' at '+Util.formatDate(eventData.starttime, eventData.endtime))+
      '. Sign up!';
    const url = encodeURIComponent('localhost:3000/events/'+eventid);
    return 'https://twitter.com/intent/tweet?text='+
      msg+'&url='+url;
  }

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
            {chipData.map((data) => {
              return (
                <Chip
                  key={data.key}
                  label={data.label}
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
              <a className="twitter-share-button"
                href={tweetURL()}>
                <TwitterIcon className={classes.shareIcon}/></a>
            </IconButton>
            <IconButton>
              <InstagramIcon className={classes.shareIcon}/>
            </IconButton>
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
          You do not meet the age requirements for this event.
        </Alert>
      </Snackbar>

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
