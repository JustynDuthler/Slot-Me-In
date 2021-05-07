import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import {Grid} from '@material-ui/core';
import Box from '@material-ui/core/Box';
import Pagination from '@material-ui/lab/Pagination';
import {useHistory} from 'react-router-dom';
import './Stylesheet.css';

import Context from './Context';
const Auth = require('./libs/Auth');

const useStyles = makeStyles({
  root: {
    minWidth: 275,
  },
  box: {
    marginTop: -15,
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginTop: 8,
  },
  gridContainer: {
    paddingLeft: '10px',
    paddingRight: '10px',
  },
  pageBox: {
    position: 'fixed',
    left: '50vw',
    bottom: 15,
    transform: 'translate(-50%, -50%)',
  },
});

/**
 * ViewEvents component
 * @return {object} ViewEvents JSX
 */
export default function ViewEvents() {
  const history = useHistory();
  const classes = useStyles();
  const [eventList, setEventList] = React.useState([]);
  const [pageEvents, setPageEvents] = React.useState([]);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [postsPerPage] = React.useState(9);
  const context = React.useContext(Context);

  /**
   * getEvents
   * API call to get data for an event
   * @param {int} pageNumber
   */
  function getEvents(pageNumber) {
    const apicall = 'http://localhost:3010/api/events';
    fetch(apicall, {
      method: 'GET',
      headers: Auth.headerJsonJWT(),
    }).then((response) => {
      if (!response.ok) {
        if (response.status === 401) {
          Auth.removeJWT();
          context.setAuthState(false);
          throw response;
        }
      }
      return response.json();
    }).then((json) => {
      setEventList(json);

      // events if it's on first page
      if (pageNumber === 1) {
        setPageEvents(json.slice(0, postsPerPage));
      } else {
        // events for other pages
        setPageEvents(json.slice(((pageNumber-1)*9),
            pageNumber*9));
      }
    })
        .catch((error) => {
          console.log(error);
        });
  };

  React.useEffect(() => {
    // if the url is just /events, get page 1 events
    if (window.location.href === 'http://localhost:3000/events') {
      getEvents(1);
    } else {
      // parse url to get the page number and pass it to getEvents
      const parsedURL = (window.location.href).split('=');
      setCurrentPage(parseInt(parsedURL[1]));
      getEvents(parsedURL[1]);
    }
  }, []);

  /**
   * getCard
   * This function gets the individual event data
   * for each card and displays it. When the card
   * is clicked, it goes to URL /event/{eventid}.
   * @param {*} row
   * @return {object} JSX
   */
  function getCard(row) {
    return (
      <Grid item xs={12} sm={6} md={4} key={row.eventid}>
        <Card>
          <CardContent>
            <Typography variant='h5' component='h2' align='center'>
              {row.eventname}
            </Typography>
            <Typography className={classes.pos}
              variant='body2' align='center' noWrap>
              Description: {row.description ? row.description : 'N/A'}
            </Typography>
            <Typography className={classes.pos}
              color='textSecondary' variant='body2' align='center'>
              Start: {new Date(row.starttime).toLocaleString('en-US',
                  {weekday: 'short', month: 'short', day: 'numeric',
                    year: 'numeric'})} at {new Date(row.starttime)
                  .toLocaleString(
                      'en-US', {hour: 'numeric', minute: 'numeric'})}
            </Typography>
            <Typography className={classes.pos}
              color='textSecondary' variant='body2' align='center'>
              End: {new Date(row.endtime).toLocaleString('en-US',
                  {weekday: 'short', month: 'short', day: 'numeric',
                    year: 'numeric'})} at {new Date(row.endtime)
                  .toLocaleString(
                      'en-US', {hour: 'numeric', minute: 'numeric'})}
            </Typography>
            <Typography className={classes.pos}
              variant='subtitle1' align='center'
              color={row.attendees === row.capacity ? 'error' : 'textPrimary'}>
              {row.capacity - row.attendees} of {row.capacity} spots open
            </Typography>
          </CardContent>
          <CardActions>
            <Button size='small'
              variant='contained'
              className='button'
              href={context.businessState === false ?
                '/event/' + row.eventid : '/profile/'}
              style={{margin: 'auto'}}>
              {context.businessState === false ?
                'View Event' : 'View Event in Profile'}
            </Button>
          </CardActions>
        </Card>
      </Grid>
    );
  };

  /**
   * handleChange
   * This function gets the events for a new page
   * @param {event} event
   * @param {int} value
   */
  const handleChange = (event, value) => {
    setCurrentPage(value);
    if (value === 1) {
      // if on first page, change url to /events
      history.push('/events');
    } else {
      // if on other page, change url depending on number
      history.push('/events?page='+value);
    }

    // get events for the current page
    const currentPosts = eventList.slice(((value-1)*9),
        value*9);
    setPageEvents(currentPosts);
  };

  return (
    <React.Fragment>
      <h1 style={{marginLeft: 12}}>Events</h1>
      <Box mt={5} mb={5} className={classes.box}>
        <Grid
          container
          spacing={2}
          className={classes.gridContainer}
          justify='center'
        >
          {pageEvents.map((row) =>
            getCard(row),
          )}
        </Grid>
        <Box mt={5} display="flex" justifyContent="center" alignItems="center"
          className={classes.pageBox}>
          <Pagination
            page={currentPage}
            count={Math.ceil(eventList.length / postsPerPage)}
            variant="outlined"
            color="primary"
            onChange={handleChange} />
        </Box>
      </Box>
    </React.Fragment>
  );
}
