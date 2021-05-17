import React from 'react';
import PropTypes from 'prop-types';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';
import Context from './Context';
import Home from './Screens/Home';
import AuthTest from './Screens/AuthTest';
import CreateEvent from './Screens/CreateEvent';
import IndividualEvent from './IndividualEvent';
import PublicBusinessProfile from './Screens/PublicBusinessProfile';
import ViewEvents from './ViewEvents';
import UserProfile from './Screens/UserProfile';
import BusinessProfile from './Screens/BusinessProfile';
import AllEvents from './AllEvents';
import NavBar from './Components/Nav/NavBar';
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
      main: '#ffffff',
      light: '#fffcac',
      dark: '#dddddd',
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


/**
 *
 * @return {object} JSX
 */
function App() {
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
  const path = window.location.pathname;
  let menu;
  if (path !== '/' && path !== '/login' && path !== '/register') {
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
              <Route path="/allevents">
                <AllEvents/>
              </Route>
              <Route path="/" component={Home}/>
            </Switch>
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
