import React from 'react';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import {makeStyles} from '@material-ui/core/styles';
import {EventCalendar} from '../Components/Events/EventCalendar';
import Button from '@material-ui/core/Button';
import PropTypes from 'prop-types';


import {getUsersEvents} from '../API/EventAPI';
import {getMemberBusinesses} from '../API/BusinessAPI';
import {getUserInfo} from '../API/UserAPI';
import {Hidden} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100%',
  },
  container: {
    marginTop: theme.spacing(4),
    margin: 'auto',
    width: '80rem',
    display: 'flex',
    [theme.breakpoints.up('lg')]: {
      flexDirection: 'row',
    },
    [theme.breakpoints.down('md')]: {
      flexDirection: 'column',
    },
  },
  userInfo: {
    // height: '5rem',
    display: 'flex',
    [theme.breakpoints.up('lg')]: {
      flexDirection: 'column',
    },
    [theme.breakpoints.down('md')]: {
      flexDirection: 'row',
    },
    alignItems: 'baseline',
    marginBottom: theme.spacing(4),
  },
  textpadding: {
    paddingRight: theme.spacing(4),
  },
  content: {
    width: '100%',
  },
}));

/**
 *
 * @return {object} JSX
 */
const UserInfo = ({info}) => {
  const classes = useStyles();

  return (
    <Box className={classes.userInfo}>
      <Typography
        variant='h1'
        className={classes.textpadding}
      >
        {info.username}
      </Typography>
      <Typography
        variant='h6'
      >
        {info.useremail}
      </Typography>
    </Box>
  );
};
UserInfo.propTypes = {
  info: PropTypes.object,
};


/**
 *
 * @return {object} JSX
 */
const Content = ({businessList, eventList}) => {
  const [contentState, setContentState] = React.useState('calendar');
  const classes = useStyles();

  if (contentState === 'calendar') {
    return (
      <Box className={classes.content}>
        <Button onClick={() => setContentState('calendar')}>
          Set calendar
        </Button>
        <Hidden mdDown>
          <EventCalendar
            style={{height: 800, width: 1200}}
            EventList={eventList}
            BusinessList={businessList}
          />
        </Hidden>
        <Hidden lgUp>
          <EventCalendar
            style={{height: 800, width: 1200}}
            EventList={eventList}
            BusinessList={businessList}
          />
        </Hidden>
      </Box>
    );
  } else {
    return (
      <Box>
        <h1>
          {'Shouldn\'t be here'}
        </h1>
      </Box>
    );
  }
};
Content.propTypes = {
  businessList: PropTypes.arrayOf(PropTypes.object),
  eventList: PropTypes.arrayOf(PropTypes.object),
};


/**
 *
 * @param {*} props
 * @return {object} JSX
 */
const UserProfile = (props) => {
  const [userState, setUserState] = React.useState(null);
  const [businessList, setBusinessList] = React.useState([]);
  const [eventList, setEventList] = React.useState([]);
  const [error, setError] = React.useState(null);
  const [isLoaded, setIsLoaded] = React.useState(false);

  const classes = useStyles();

  React.useEffect(async () => {
    try {
      const userInfo = await getUserInfo();
      const businessInfo = await getMemberBusinesses(userInfo.useremail);
      const eventInfo = await getUsersEvents();
      setUserState(userInfo);
      setBusinessList(businessInfo);
      setEventList(eventInfo);
      setIsLoaded(true);
    } catch (error) {
      console.log(error);
      setError(error);
    }
  }, []);

  if (!isLoaded) {
    return <h1>Loading...</h1>;
  }
  if (error) {
    return <h1>Error</h1>;
  }

  return (
    <Box className={classes.root}>
      <Box className={classes.container}>
        <UserInfo info={userState}/>
        <Content businessList={businessList} eventList={eventList}/>
      </Box>
    </Box>
  );
};

export default UserProfile;
