import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';
import Context from './Context';
import Login from './Login';
import Register from './Register';
import Home from './Home';
import AuthTest from './AuthTest';
import CreateEvent from './CreateEvent';
import ViewEvents from './ViewEvents';
const Auth = require('./libs/Auth');

import {ButtonGroup, Button, Toolbar, AppBar, makeStyles} from '@material-ui/core';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import AccountIcon from '@material-ui/icons/AccountCircle';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import HomeIcon from '@material-ui/icons/Home';
import AccountBoxIcon from '@material-ui/icons/AccountBox';

const useStyles = makeStyles((theme) => ({
  content: {
    marginTop: theme.spacing(2),
  },
  leftMenu: {
    flexGrow: 1,
  },
}));

/**
 *
 * @return {object} JSX
 */
function App() {
  const classes = useStyles();
  const [authState, setAuthState] = React.useState(null);

  if (Auth.getJWT() !== authState) {
    setAuthState(Auth.getJWT());
  }
  

  // RightSide navigation changes depending on if the user is
  // logged in or not
  // This could be improved so that when someone logs-in or out it automatically changes
  // Might be good to setup a React.useContext system
  let rightSide;
  if (authState) {
    rightSide = (
      <Button
        startIcon={<AccountBoxIcon />}
        href="/profile" 
        color="primary"
        size="large"
        variant="contained"
      >
        Profile
      </Button>
    );
  } else {
    rightSide = (
    <ButtonGroup
      anchororigin={{
        vertical: 'top',
        horizonal: 'right',
      }}
    >
      <Button 
        startIcon={<AccountIcon />}
        href="/register" 
        color="primary"
        size="large"
        variant="contained"
      >
        Sign Up
      </Button>

      <Button 
        startIcon={<LockOutlinedIcon />}
        href="/Login" 
        color="primary"
        size="large"
        variant="contained"
      >
        Login
      </Button>
    </ButtonGroup>
    );
  }

  return (
    <Router>
      <AppBar
        position="static"
      >
        <Toolbar>
          {/*classes.leftMenu has flexGrow: 1 meaning it will try to take up as much space as possible
          this will push the content outside of the box to the right */}
          <Box className={classes.leftMenu}>
            <Button
              startIcon={<HomeIcon/>}
              href="/home"
              color="primary"
              size="large"
              variant="contained"
            >
              Home
            </Button>
            <Button
              href="/events/create"
              color="primary"
              size="large"
              variant="contained"
            >
              Create Event
            </Button>
            <Button
              href="/events"
              color="primary"
              size="large"
              variant="contained"
            >
              Events
            </Button>
            <Button
              href="/authtest"
              color="primary"
              size="large"
              variant="contained"
            >
              AuthTest
            </Button>
          </Box>
          {rightSide}
        </Toolbar>
      </AppBar>
      {/* Used a container so that there would be top margin between nav and content */}
      <Container className={classes.content}>
        <Switch>
          <Route path="/login">
            <Context.Provider value={{authState, setAuthState}}>
              <Login/>
            </Context.Provider>
          </Route>
          <Route path="/register">
            <Register/>
          </Route>
          <Route path="/authtest">
            <AuthTest />
          </Route>
          <PrivateRoute 
            path="/events/create"
            authed={authState}
            component={CreateEvent}
          />
          <PrivateRoute 
            path="/events"
            authed={authState}
            component={ViewEvents}
          />
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </Container>
    </Router>
  );
}

// PrivateRoute that redirects to login page if not authenticated
function PrivateRoute ({component: Component, authed, ...rest}) {
  return (
    <Route
      {...rest}
      render={(props) => authed !== null
        ? <Component {...props} />
        : <Redirect to={{pathname: '/login'}} />}
    />
  )
}

export default App;
