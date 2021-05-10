import React from 'react';
import Context from './Context';
import {makeStyles} from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import { Button, Typography } from '@material-ui/core';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';

import Hidden from '@material-ui/core/Hidden';

import Login from './Login';
import Register from './Register';



const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'row',
    [theme.breakpoints.down('md')]:{
      flexDirection: 'column',
    },
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 'auto',
    width: '100vw',
    height: '100vh',
  },
  events: {
    backgroundColor: 'white',
    flex: "3 2",
  },
  right: {
    minWidth: '25rem',
    flex: "2 0",
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
    [theme.breakpoints.down('md"')]: {
      width: '100vw',
    },
  },
  title: {
    color: theme.palette.primary.main,
    marginBottom: theme.spacing(3),
    fontWeight: 350,
  },
  underText: {
    color: theme.palette.primary.light,
    marginBottom: theme.spacing(4),
  }
}));

const LoginWrapper = (props) => {
  const classes = useStyles()

  return (
    <Box className={classes.login}>
      <Login/>
    </Box>
  );
}

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

const UnAuthHome = (props) => {
  const classes = useStyles();
  

  return (
    <Box className={classes.root}>
      <Hidden mdDown>
        <Box className={classes.events}>
          Event Info
        </Box>
      </Hidden>
      <Box id="rightSide" className={classes.right}>
        <Route exact path="/login" component={LoginWrapper}/>
        <Route exact path="/register" component={Register}/>
        <Route exact path="/" component={NavButtons}/>
      </Box>
      <Hidden only={['lg', 'xl', 'md', 'xs']}>
        <Box className={classes.events}>
          Event Info
        </Box>
      </Hidden>
    </Box>
  )
};

const AuthHome = (props) => {
  const classes = useStyles();

  return (
    <Box>
      temp
    </Box>
  )
};

/**
 *
 * @return {object} JSX
 */
const Home = (props) => {
  const context = React.useContext(Context);
  
  if (context.authState === false) {
    return <UnAuthHome/>;
  } else {
    return <AuthHome/>;
  }
}

export default Home;