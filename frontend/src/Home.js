import React from 'react';
import Context from './Context';
import {makeStyles} from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import { Button, Typography } from '@material-ui/core';

import Login from './Login';
import Register from './Register';


const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'row',
    widht: '100vw',
    height: '100vh',
  },
  left: {
    backgroundColor: 'white',
    flex: 3,
  },
  right: {
    flex: 2,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  login: {
    flex: 0,
    marginBottom: theme.spacing(40),
  },
}));

const UnAuthHome = (props) => {
  const classes = useStyles();
  const [rightView, setRightView] = React.useState(2);
  

  let content;
  if (rightView === 0) {
    content = (
      <Box>
        <Button>
          Log In
        </Button>
        <Button>
          Create Account
        </Button>
      </Box>
    );
  } else if (rightView === 1) {
    content = (
      <Box id="loginBox" className={classes.login}>
        <Login/>
      </Box>
    );
  } else if (rightView === 2) {
    content = (
      <Box id="loginBox" className={classes.login}>
          <Register/>
      </Box>
    );
  } else {
    content = <h1>Error with rightview state</h1>;
  }

  return (
    <Box className={classes.root}>
      
      <Box className={classes.left}>
        hello1
      </Box>
      <Box id="rightSide" className={classes.right}>
        <Box id="loginBox" className={classes.login}>
          {content}
        </Box>
      </Box>
    </Box>
  )
};

const AuthHome = (props) => {
  const classes = useStyles();

  return (
    <Box className={classes.root}>
      
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