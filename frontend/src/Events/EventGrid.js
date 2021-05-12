import React from 'react';
import PropTypes from 'prop-types';
import {EventCard} from '../Components';
import Grid from '@material-ui/core/Grid';
import Context from '../Context';

/**
 *
 * @param {*} props
 * @return {object} JSX
 */
const EventGrid = ({publicEvents}) => {
  const [events, setEvents] = React.useState([]);
  const context = React.useContext(Context);

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

    if (publicEvents) {
      const eventResponse = await fetchPublicevents();
      setEvents(eventResponse);
    }
  }, []);

  const gridItems = [];
  events.forEach((item) => {
    gridItems.push(
        <Grid key={item.eventid} item>
          <EventCard row={item} context={context} isBusiness={false}/>
        </Grid>);
  });

  return (
    <Grid container>
      {gridItems}
    </Grid>
  );
};

EventGrid.propTypes = {
  publicEvents: PropTypes.bool,
};

export default EventGrid;
