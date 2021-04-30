import React from 'react';
import PropTypes from 'prop-types';
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
import IndividualEvent from './IndividualEvent';
import ViewEvents from './ViewEvents';
import UserProfile from './UserProfile';
import BusinessProfile from './BusinessProfile';
const Auth = require('./libs/Auth');

import {
  ButtonGroup, Button, Toolbar, AppBar, makeStyles,
} from '@material-ui/core';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import AccountIcon from '@material-ui/icons/AccountCircle';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import HomeIcon from '@material-ui/icons/Home';
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import CssBaseline from '@material-ui/core/CssBaseline';

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
  const [authState, setAuthState] = React.useState(false);
  const [businessState, setBusinessState] = React.useState(undefined);
  /**
   * validateBusiness()
   * Determines whether logged in user is a business or user
   */
  function validateBusiness() {
    fetch('http://localhost:3010/api/test/get_token_type', {
      method: 'GET',
      headers: Auth.headerJsonJWT(),
    }).then((response) => {
      if (response.status === 200) {
        return response.json();
      }
      if (!response.ok) {
        /* If the response isnt ok then the token is invalid */
        setBusinessState(false);
        setAuthState(false);
        Auth.removeJWT();
        throw response;
      }
      return response;
    }).then((json) => {
      if (json.auth === 'business') {
        setBusinessState(true);
      } else {
        setBusinessState(false);
      }
      console.log('user type:', json);
    })
        .catch((error) => {
          console.log(error);
        });
  };

  /**
   * logout()
   * Removes JWT and sets authState to null upon logout
   */
  const logout = () => {
    Auth.removeJWT();
    setAuthState(false);
  };

  React.useEffect(() => {
    if (Auth.getJWT() === null) {
      setBusinessState(false);
      setAuthState(false);
    } else {
      setAuthState(true);
      validateBusiness();
    }
  }, []);
  if (businessState == undefined) {
    return <div></div>;
  }
  // RightSide navigation changes depending on if the user is
  // logged in or not
  let rightSide;
  if (authState) {
    rightSide = (
      <ButtonGroup>
        <Button
          startIcon={<AccountBoxIcon />}
          href="/profile"
          color="primary"
          size="large"
          variant="contained"
        >
          Profile
        </Button>
        <Button
          color="primary"
          size="large"
          variant="contained"
          onClick={logout}
        >
          Logout
        </Button>
      </ButtonGroup>
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
          Register Account
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

  let leftSide;
  if (businessState == true) {
    leftSide = (
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
    );
  } else {
    leftSide = (
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
    );
  }
  return (
    <Router>
      {/* I moved Css basline here so that it applies to the whole project */}
      <CssBaseline />
      <AppBar
        position="static"
      >
        <Toolbar>
          {/* classes.leftMenu has flexGrow: 1 so it will try to take up
          as much space as possible
          this will push the content outside of the box to the right */}
          {leftSide}
          {rightSide}
        </Toolbar>
      </AppBar>
      {/* Used a container so that there would be
      top margin between nav and content */}
      <Container className={classes.content}>
        <Context.Provider value={{
          authState, setAuthState,
          businessState, setBusinessState,
        }}>
          <Switch>
            <Route path="/login">
              <Login/>
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
            <Route path="/profile">
              {(authState) ? ((businessState === false) ?
              <UserProfile/> : <BusinessProfile/>) : <Redirect to="/"/>}
            </Route>
            <Route exact path="/events">
              <ViewEvents/>
            </Route>
            <Route
              exact path="/event/:eventid"
              render={(props) =>
                <IndividualEvent eventID={props.match.params.eventid}
                  {...props} />}
            />
            <Route path="/">
              <Home />
            </Route>
          </Switch>

        </Context.Provider>
      </Container>

    </Router>
  );
}

// Prop types for PrivateRoute
PrivateRoute.propTypes = {
  component: PropTypes.func,
  authed: PropTypes.bool,
};

/**
 * PrivateRoute
 * @param {*} component Component to protect behind PrivateRoute
 * @param {*} authed current authState
 * @return {object} PrivateRoute that redirects to login if authed is null
 */
function PrivateRoute({component: Component, authed, ...rest}) {
  return (
    <Route
      {...rest}
      render={(props) => authed ?
        <Component {...props} /> : <Redirect to={{pathname: '/login'}} />}
    />
  );
}


export default App;
