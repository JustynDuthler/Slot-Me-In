import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
} from 'react-router-dom';
import Login from './Login';
import Register from './Register';
import Home from './Home';
import AuthTest from './AuthTest';
import CreateEvent from './CreateEvent';
import ViewEvents from './ViewEvents';

/**
 *
 * @return {object} JSX
 */
function App() {
  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/login">Login</Link>
            </li>
            <li>
              <Link to="/register">Create Account</Link>
            </li>
            <li>
              <Link to="/events/create">Create Event</Link>
            </li>
            <li>
              <Link to="/events">View Events</Link>
            </li>
            <li>
              <Link to="/authtest">Auth Test</Link>
            </li>
          </ul>
        </nav>
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
          <Route path="/events/create">
            <CreateEvent />
          </Route>
          <Route path="/events">
            <ViewEvents />
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
