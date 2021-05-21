import React from 'react';
import Context from '../Context';
import {makeStyles} from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import {Button, Typography} from '@material-ui/core';
import {Route} from 'react-router-dom';
import Hidden from '@material-ui/core/Hidden';

import Login from '../Components/Account/Login';
import Register from '../Components/Account/Register';
import EventGrid from '../Components/Events/EventGrid';
import {UserAttendingCalendar} from '../Components/Events/EventCalendar';

// This page is is the react-route for /

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'row',
    [theme.breakpoints.down('md')]: {
      flexDirection: 'column-reverse',
    },
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 'auto',
    width: '100vw',
    maxWidth: '100%',
    minHeight: 'calc(100vh - 50px)',
  },
  events: {
    backgroundColor: 'white',
    flex: '3 2',
  },
  right: {
    minWidth: '25rem',
    flex: '2 0',
    [theme.breakpoints.down('md')]: {
      minWidth: '0rem',
      minHeight: '25rem',
    },
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    padding: theme.spacing(2),
  },
  login: {
    padding: theme.spacing(2),
  },
  register: {
    padding: theme.spacing(2),
  },
  loginBtn: {
    marginBottom: theme.spacing(3),
    padding: theme.spacing(0, 4, 0, 4),
    maxWidth: '380px',
    minHeight: '2rem',
  },
  registerBtn: {
    marginBottom: theme.spacing(3),
    padding: theme.spacing(0, 4, 0, 4),
    maxWidth: '380px',
    minHeight: '2rem',
    borderWidth: '2px',
  },
  switchDiv: {
    display: 'flex',
    flexDirection: 'column',
  },
  title: {
    color: theme.palette.primary.main,
    marginBottom: theme.spacing(3),
    fontWeight: 350,
  },
  underText: {
    color: theme.palette.primary.light,
    marginBottom: theme.spacing(4),
  },
  homeTitle: {
    color: theme.palette.primary.main,
    marginTop: 15,
    marginLeft: 15,
    marginBottom: 15,
    fontWeight: 350,
  },
}));


/**
 * Used for applying css to the login page
 * @param {*} props
 * @return {objext} JSX
 */
const LoginWrapper = (props) => {
  const classes = useStyles();

  return (
    <Box className={classes.login}>
      <Login/>
    </Box>
  );
};

/**
 * Used for applying css to the register page
 * @param {*} props
 * @return {objext} JSX
 */
const RegisterWrapper = (props) => {
  const classes = useStyles();

  return (
    <Box className={classes.register}>
      <Register/>
    </Box>
  );
};

/**
 * This is the default for unauthhome to show
 * Buttons for navigating to login and account creation
 * @param {*} props
 * @return {object} JSX
 */
const NavButtons = (props) => {
  const classes = useStyles();

  return (
    <Box id="switch div" className={classes.switchDiv}>
      <Hidden mdDown>
        <Typography
          variant="h1"
          className={classes.title}
        >
          SlotMeIn
        </Typography>
        <Typography
          variant="h5"
          className={classes.underText}
        >
          Join today!
        </Typography>
        <Button
          className={classes.loginBtn}
          variant="contained"
          href="/login"
          color="secondary"
          size="large"
        >
          Log In
        </Button>
        <Button
          className={classes.registerBtn}
          variant="outlined"
          href="/register"
          color="primary"
          size="large"
        >
          Create Account
        </Button>
      </Hidden>
      <Hidden lgUp>
        <Typography
          variant="h2"
          className={classes.title}
        >
          SlotMeIn
        </Typography>
        <Typography
          variant="h5"
          className={classes.underText}
        >
          Join today!
        </Typography>
        <Button
          className={classes.loginBtn}
          variant="contained"
          href="/login"
          color="secondary"
          size="small"
        >
          Log In
        </Button>
        <Button
          className={classes.registerBtn}
          variant="outlined"
          href="/register"
          color="primary"
          size="small"
        >
          Create Account
        </Button>
      </Hidden>
    </Box>
  );
};

/**
 * A double column view with login register and nav on the right
 * @param {*} props
 * @return {object} JSX
 */
const UnAuthHome = (props) => {
  const classes = useStyles();

  return (
    <Box className={classes.root}>
      <Hidden only={'xs'}>
        <Box className={classes.events}>
          <EventGrid publicEvents={true}/>
        </Box>
      </Hidden>
      <Box id="rightSide" className={classes.right}>
        <Route exact path="/login" component={LoginWrapper}/>
        <Route exact path="/register" component={RegisterWrapper}/>
        <Route exact path="/" component={NavButtons}/>
      </Box>
    </Box>
  );
};

/**
 * @param {*} props
 * @return {object} JSX
 */
const AuthHome = (props) => {
  const classes = useStyles();

  return (
    <Box>
      <Typography variant='h3' align='left' className={classes.homeTitle}>
        Your Upcoming Schedule
      </Typography>
      <UserAttendingCalendar/>
    </Box>
  );
};


/**
 * Home shows either UnAuthHome or AuthHome depending on the auth
 * context variable
 * @param {*} props
 * @return {object} JSX
 */
const Home = (props) => {
  const context = React.useContext(Context);

  if (context.authState === false) {
    return <UnAuthHome/>;
  } else {
    return <AuthHome/>;
  }
};

export default Home;
