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
import AllEvents from './AllEvents';
const Auth = require('./libs/Auth');

import {createMuiTheme, ThemeProvider} from '@material-ui/core/styles';
import {
  ButtonGroup, Button, Toolbar, AppBar, makeStyles,
} from '@material-ui/core';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import AccountCircleOutlinedIcon
  from '@material-ui/icons/AccountCircleOutlined';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import HomeIcon from '@material-ui/icons/Home';
import AccountBoxOutlinedIcon from '@material-ui/icons/AccountBoxOutlined';
import EventIcon from '@material-ui/icons/Event';
import AddIcon from '@material-ui/icons/Add';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import CssBaseline from '@material-ui/core/CssBaseline';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#283044',
      light: '#51596f',
      dark: '#00071d',
    },
    secondary: {
      main: '#edc97c',
      light: '#fffcac',
      dark: '#b9984e',
    },
    back: {
      main: '#ffffff',
      light: '#fffcac',
      dark: '#dddddd',
    },
  },
  typography: {
    useNextVariants: true,
    // Use the system font instead of the default Roboto font.
    fontFamily: [
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
    fontWeightMedium: 500,
    body1: {
      fontWeight: 500,
    },
    subtitle1: {
      fontSize: 12,
    },
  },
});

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
          startIcon={<AccountBoxOutlinedIcon />}
          href="/profile"
          color="secondary"
          size="large"
          variant="contained"
        >
          Profile
        </Button>
        <Button
          startIcon={<ExitToAppIcon/>}
          color="secondary"
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
          startIcon={<AccountCircleOutlinedIcon />}
          href="/register"
          color="secondary"
          size="large"
          variant="contained"
        >
          Register Account
        </Button>

        <Button
          startIcon={<LockOutlinedIcon />}
          href="/Login"
          color="secondary"
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
        <ButtonGroup>
          <Button
            startIcon={<HomeIcon/>}
            href="/"
            color="secondary"
            size="large"
            variant="contained"
          >
            Home
          </Button>
          <Button
            startIcon={<AddIcon/>}
            href="/events/create"
            color="secondary"
            size="large"
            variant="contained"
          >
            Create Event
          </Button>
          <Button
            startIcon={<EventIcon/>}
            href="/events"
            color="secondary"
            size="large"
            variant="contained"
          >
            Events
          </Button>
          <Button
            href="/authtest"
            color="secondary"
            size="large"
            variant="contained"
          >
            AuthTest
          </Button>
        </ButtonGroup>
      </Box>
    );
  } else {
    leftSide = (
      <Box className={classes.leftMenu}>
        <ButtonGroup>
          <Button
            startIcon={<HomeIcon/>}
            href="/"
            color="secondary"
            size="large"
            variant="contained"
          >
            Home
          </Button>
          <Button
            startIcon={<EventIcon/>}
            href="/events"
            color="secondary"
            size="large"
            variant="contained"
          >
            Events
          </Button>
          <Button
            href="/authtest"
            color="secondary"
            size="large"
            variant="contained"
          >
            AuthTest
          </Button>
        </ButtonGroup>
      </Box>
    );
  }

  const menu = authState ? 
  (
    <AppBar position="static">
      <Toolbar>
        {leftSide}
        {rightSide}
      </Toolbar>
    </AppBar>
  ) : null;

  return (
    <Router>
      <ThemeProvider theme={theme}>
        <Context.Provider value={{
          authState, setAuthState,
          businessState, setBusinessState,
        }}>
          <CssBaseline />
          {menu}
            <Switch>
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
              <Route path="/allevents">
                <AllEvents/>
              </Route>
              <Route path="/" component={Home}/>
            </Switch>
        </Context.Provider>
      </ThemeProvider>
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
