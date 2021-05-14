import React from 'react';
import PropTypes from 'prop-types';
import EventCard from './EventCard';
import Grid from '@material-ui/core/Grid';
import Context from '../../Context';
import {makeStyles} from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import * as Auth from '../../libs/Auth';


const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(3),
    display: 'flex',
    justifyContent: 'center',
    height: '100%',
  },
  eventCard: {
    padding: theme.spacing(2),
  },
  gridContainer: {
    height: '75%',
    widht: '75%',
    flexGrow: 1,
  },
}));

/**
 *
 * @param {*} props
 * @return {object} JSX
 */
const EventGrid = ({publicEvents=false}) => {
  const [events, setEvents] = React.useState([]);
  const context = React.useContext(Context);
  const classes = useStyles();

  React.useEffect(async () => {
    /**
     * Gets public event Data and sets events to it
     * @return {array} Event data
     */
    async function fetchPublicevents() {
      return fetch('http://localhost:3010/api/events/publicEvents', {
        method: 'GET',
      }).then((response) => {
        if (!response.ok) {
          console.log('Error fetching publicEvent data');
          throw response;
        }
        return response.json();
      });
    };

    /**
     * Gets events including member events
     * and sets events to it
     * @return {array} Event data
     */
    async function fetchEvents() {
      return fetch('http://localhost:3010/api/events', {
        method: 'GET',
        headers: Auth.headerJsonJWT(),
      }).then((response) => {
        if (!response.ok) {
          console.log('Error fetching Event data');
          throw response;
        }
        return response.json();
      });
    };

    if (publicEvents) {
      const eventResponse = await fetchPublicevents();
      setEvents(eventResponse);
    } else {
      const eventResponse = await fetchEvents();
      setEvents(eventResponse);
    }
  }, []);

  const gridItems = [];
  events.forEach((item) => {
    gridItems.push(
        <Grid key={item.eventid} item sm={6} md={4} xl={3}>
          <Box className={classes.eventCard}>
            <EventCard
              row={item}
              context={context}
              isBusiness={false}
              buttonType={context.authState ? 'view' : 'login'}
            />
          </Box>
        </Grid>);
  });

  return (
    <Box className={classes.root}>
      <Grid className={classes.gridContainer} container spacing={3}>
        {gridItems}
      </Grid>
    </Box>
  );
};

EventGrid.propTypes = {
  publicEvents: PropTypes.bool,
};

export default EventGrid;