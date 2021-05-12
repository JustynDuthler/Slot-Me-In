import React from 'react';
import PropTypes from 'prop-types';

/**
 *
 * @param {*} props
 * @return {object} JSX
 */
const EventGrid = ({publicEvents}) => {
  const [events, setEvents] = React.useState([]);

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

  return (<div>{events.length}</div>);
};

EventGrid.propTypes = {
  publicEvents: PropTypes.bool,
};

export default EventGrid;
