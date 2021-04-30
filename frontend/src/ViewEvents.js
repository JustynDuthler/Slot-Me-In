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

import Context from './Context';
const Auth = require('./libs/Auth');

const useStyles = makeStyles({
  root: {
    minWidth: 275,
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
    marginTop: 12,
  },
  gridContainer: {
    paddingLeft: '10px',
    paddingRight: '10px',
  },
});

/**
 * ViewEvents component
 * @return {object} ViewEvents JSX
 */
export default function ViewEvents() {
  const classes = useStyles();
  const [eventList, setEventList] = React.useState([]);
  const [pageEvents, setPageEvents] = React.useState([]);
  const [postsPerPage] = React.useState(9);
  const context = React.useContext(Context);

  /**
   * getEvents
   * API call to get data for an event
   */
  function getEvents() {
    const apicall = 'http://localhost:3010/api/events';
    fetch(apicall, {
      method: 'GET',
      headers: Auth.headerJsonJWT(),
    }).then((response) => {
      if (!response.ok) {
        if (response.status === 401) {
          Auth.removeJWT();
          context.setAuthState(false);
        }
      }
      return response.json();
    }).then((json) => {
      setEventList(json);
      setPageEvents(json.slice(0, postsPerPage));
    })
        .catch((error) => {
          console.log(error);
        });
  };

  React.useEffect(() => {
    getEvents();
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
              Start Time: {new Date(row.starttime).toLocaleString('en-US',
                  {weekday: 'long', month: 'short', day: 'numeric',
                    year: 'numeric'})} at {new Date(row.starttime)
                  .toLocaleString(
                      'en-US', {hour: 'numeric', minute: 'numeric'})}
            </Typography>
            <Typography className={classes.pos}
              color='textSecondary' variant='body2' align='center'>
              End Time: {new Date(row.endtime).toLocaleString('en-US',
                  {weekday: 'long', month: 'short', day: 'numeric',
                    year: 'numeric'})} at {new Date(row.endtime)
                  .toLocaleString(
                      'en-US', {hour: 'numeric', minute: 'numeric'})}
            </Typography>
          </CardContent>
          <CardActions>
            <Button size='small'
              variant='contained'
              color='primary'
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
    const currentPosts = eventList.slice(((value-1)*9),
        value*9);
    setPageEvents(currentPosts);
  };

  return (
    <Box mt={5} mb={5}>
      <h1 style={{margin: 12}}>Events</h1>
      <Grid
        container
        spacing={5}
        className={classes.gridContainer}
        justify='center'
      >
        {pageEvents.map((row) =>
          getCard(row),
        )}
      </Grid>
      <Box mt={5} display="flex" justifyContent="center" alignItems="center">
        <Pagination
          count={Math.ceil(eventList.length / postsPerPage)}
          variant="outlined"
          color="primary"
          onChange={handleChange} />
      </Box>
    </Box>
  );
}
