import React from 'react';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import {makeStyles} from '@material-ui/core/styles';
import {EventCalendar} from '../Components/Events/EventCalendar';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';


import {getUsersEvents} from '../API/EventAPI';
import {getMemberBusinesses} from '../API/BusinessAPI';
import {getUserInfo} from '../API/UserAPI';

const useStyles = makeStyles((theme) => ({
  root: {
    // minHeight: '100%',
    // maxHeight: 'calc(100% - 50px)',
  },
  container: {
    marginTop: theme.spacing(4),
    margin: 'auto',
    width: '60rem',
    display: 'flex',
    [theme.breakpoints.up('lg')]: {
      flexDirection: 'row',
    },
    [theme.breakpoints.down('md')]: {
      flexDirection: 'column',
      width: '40rem',
    },
  },
  userInfo: {
    // height: '5rem',
    display: 'flex',
    padding: theme.spacing(2),
    [theme.breakpoints.up('lg')]: {
      flexDirection: 'column',
    },
    [theme.breakpoints.down('md')]: {
      flexDirection: 'row',
    },
    alignItems: 'baseline',
  },
  textpadding: {
    paddingRight: theme.spacing(4),
  },
  content: {
    width: '100%',
  },
}));

/**
 * @return {object} JSX
 */
const BusinessButton = ({elem, ...rest}) => {
  return (
    <Grid item>
      <Button
        component={Link}
        variant="contained"
        to={'/business/profile/'+ elem.businessid}
      >
        {elem.businessname}
      </Button>
    </Grid>
  );
};
BusinessButton.propTypes = {
  // key: PropTypes.string,
  elem: PropTypes.object,
};

/**
 *
 * @return {object} JSX
 */
const UserInfo = ({info, memberBusinesses}) => {
  const classes = useStyles();
  return (
    <Box className={classes.userInfo}>
      <Box className={classes.userText}>
        <Typography
          variant='h3'
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
      <Typography
        variant='h6'
      >
        My Businesses
      </Typography>
      <Box className={classes.businessGrid}>
        <Grid container spacing={2}>
          {memberBusinesses.map((elem) => {
            console.log(elem.businessid);
            return <BusinessButton key={elem.businessid} elem={elem}/>;
          })}
        </Grid>
      </Box>
    </Box>
  );
};
UserInfo.propTypes = {
  info: PropTypes.object,
  memberBusinesses: PropTypes.arrayOf(Object),
};


/**
 *
 * @return {object} JSX
 */
const Content = ({memberBusinesses, eventList, colorDict}) => {
  const [contentState, setContentState] = React.useState('calendar');
  const classes = useStyles();

  if (contentState === 'calendar') {
    return (
      <Box className={classes.content}>
        <Button onClick={() => setContentState('calendar')}>
          Set calendar
        </Button>
        <Box>
          <EventCalendar
            style={{height: '100%', width: '100%'}}
            EventList={eventList}
            BusinessList={memberBusinesses}
            colorDict={colorDict}
          />
        </Box>
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
  memberBusinesses: PropTypes.arrayOf(PropTypes.object),
  eventList: PropTypes.arrayOf(PropTypes.object),
  colorDict: PropTypes.object,
};


/**
 *
 * @param {*} props
 * @return {object} JSX
 */
const UserProfile = (props) => {
  const [userState, setUserState] = React.useState(null);
  const [memberBusinesses, setMemberBusinesses] = React.useState([]);
  // const [publicBusinesses, setPublicBusinesses] = React.useState([]);
  const [eventList, setEventList] = React.useState([]);
  const [error, setError] = React.useState(null);
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [colorDict] = React.useState({});

  const classes = useStyles();

  /**
  * Returns a dict of colors for businessId's
  * @param {Array} businessList
  * @return {Object} colors
  */
  // const setColors = (businessList) => {
  //   const colorArr = ['#4a4e4d', '#0e9aa7', '#3da4ab', '#f6cd61', '#fe8a71'];
  //   const colors = {};
  //   businessList.forEach((elem, index) => {
  //     colors[elem.businessid] = colorArr[index];
  //   });
  //   return colors;
  // };

  React.useEffect(async () => {
    try {
      const userInfo = await getUserInfo();
      const businessInfo = await getMemberBusinesses(userInfo.useremail);
      const eventInfo = await getUsersEvents();
      setUserState(userInfo);
      setMemberBusinesses(businessInfo);
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
        <UserInfo
          info={userState}
          memberBusinesses={memberBusinesses}
          colorDict={colorDict}
        />
        <Content
          memberBusinesses={memberBusinesses}
          eventList={eventList}
          colorDict={colorDict}
        />
      </Box>
    </Box>
  );
};

export default UserProfile;
