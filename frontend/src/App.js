import React from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import PropTypes from 'prop-types';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';
import Box from '@material-ui/core/Box';
import Context from './Context';
import Home from './Screens/Home';
import AuthTest from './Screens/AuthTest';
import CreateEvent from './Screens/CreateEvent';
import IndividualEvent from './Screens/IndividualEvent';
import PublicBusinessProfile from './Screens/PublicBusinessProfile';
import UserProfile from './Screens/UserProfile';
import BusinessProfile from './Screens/BusinessProfile';
import AllEvents from './Screens/AllEvents';
import About from './Screens/About';
import Contact from './Screens/Contact';
import NavBar from './Components/Nav/NavBar';
import Footer from './Components/Nav/Footer';
import NotFound from './Screens/NotFound';

const Auth = require('./libs/Auth');

import {createMuiTheme, ThemeProvider} from '@material-ui/core/styles';
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
      main: '#f1f4f8',
      light: '#ffffff',
      dark: '#bec1c5',
    },
    error: {
      main: '#ed7f7d',
      light: '#ffb0ac',
      dark: '#b75051',
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
  allButFooter: {
    minHeight: 'calc(100vh - 50px)',
  },
}));

/**
 *
 * @return {object} JSX
 */
function App() {
  const [authState, setAuthState] = React.useState(false);
  const [businessState, setBusinessState] = React.useState(undefined);
  const classes = useStyles();
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
    })
        .catch((error) => {
          console.log(error);
        });
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

  const userType = businessState ? 'business' : 'user';
  const path = window.location.pathname.toLowerCase();
  let menu;
  // do not show NavBar on home, login, or register when not logged in
  if (!(path == '/') && !(path.startsWith('/login')) &&
    !(path.startsWith('/register')) ) {
    menu = authState ?
        <NavBar userType={userType}/> : <NavBar userType='guest'/>;
  } else {
    menu = authState ? <NavBar userType={userType}/> : null;
  }

  return (
    <>
      <Router>
        <ThemeProvider theme={theme}>
          <Context.Provider value={{
            authState, setAuthState,
            businessState, setBusinessState,
          }}>
            <CssBaseline />
            <Box className={classes.allButFooter}>
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
                  component={AllEvents}
                />
                <Route path="/profile">
                  {(authState) ? ((businessState === false) ?
                  <UserProfile/> : <BusinessProfile/>) : <Redirect to="/"/>}
                </Route>
                <Route
                  exact path="/business/profile/:businessid"
                  render={(props) =>
                    <PublicBusinessProfile
                      businessid={props.match.params.businessid}
                      {...props} />}
                />
                <Route
                  exact path="/event/:eventid"
                  render={(props) =>
                    <IndividualEvent eventID={props.match.params.eventid}
                      {...props} />}
                />
                <Route path="/events">
                  <AllEvents/>
                </Route>
                <Route path="/about">
                  <About/>
                </Route>
                <Route path="/contact">
                  <Contact/>
                </Route>
                <Route exact path="/" component={Home}/>
                <Route exact path="/login" component={Home}/>
                <Route exact path="/register" component={Home}/>
                <Route path="/404" component={NotFound}/>
                <Route component={NotFound}/>
              </Switch>
            </Box>
            <Footer className={classes.footer}/>
          </Context.Provider>
        </ThemeProvider>
      </Router>
      <div id="fb-root"></div>
      <script async defer crossOrigin="anonymous"
        src="https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v10.0"
        nonce="W60AWbJd">
      </script>
      <script async src="https://platform.twitter.com/widgets.js"
        charSet="utf-8">
      </script>
    </>
  );
}

App.propTypes = {
  'match': PropTypes.object,
  'match.params': PropTypes.object,
  'match.params.businessid': PropTypes.string,
  'match.params.eventid': PropTypes.string,
};

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
