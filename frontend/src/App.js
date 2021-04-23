import React, { useEffect } from 'react';
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
const Auth = require('./libs/Auth');

import {ButtonGroup, Button, Toolbar, AppBar, makeStyles} from '@material-ui/core';
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
  const [authState, setAuthState] = React.useState(null);
  const [businessState, setBusinessState] = React.useState(undefined);


  function validateBusiness() {
    fetch('http://localhost:3010/api/businesses/checkBusinessID', {
      method: "GET",
      headers: Auth.JWTHeaderJson(),
    }).then((response) => {
      if (response.status === 200) {
        setBusinessState(true);
        console.log("update");
      } else {
        setBusinessState(false);
        console.log("update2");
      }
    })
    .catch((error) => {
      console.log(error);
    });
  };

  if (Auth.getJWT() !== authState) {
    setAuthState(Auth.getJWT());
  }

  const logout = () => {
    Auth.removeJWT();
    setAuthState(null);
  };

  React.useEffect(() => {
    validateBusiness();
  }, []);

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
          onClick={() => {console.log("test click bus state",businessState)}}
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
  console.log("business STATE", businessState, authState);
  return (
    <Router>
      <CssBaseline /> {/* I moved Css basline to here so that it applies to the whole project */}
      <AppBar
        position="static"
      >
        <Toolbar>
          {/* classes.leftMenu has flexGrow: 1 meaning it will try to take up as much space as possible
          this will push the content outside of the box to the right */}
          {leftSide}
          {rightSide}
        </Toolbar>
      </AppBar>
      {/* Used a container so that there would be top margin between nav and content */}
      <Container className={classes.content}>
        <Context.Provider value={{
            authState, setAuthState,
            businessState, setBusinessState
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
              {(authState) ? <UserProfile/> : <Redirect to="/"/>}
            </Route>
            <Route exact path="/events" render={(props) => <ViewEvents {...props} />} />
            <Route
              exact path="/event/:eventid"
              render={(props) => <IndividualEvent {...props} />}
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
