import * as Auth from '../libs/Auth';

/**
 * Returns a promise to the array of events
 * @return {Promise} array of events
 */
export const getUsersEvents = () => {
  return fetch('http://localhost:3010/api/users/getUserEvents', {
    method: 'GET',
    headers: Auth.headerJsonJWT(),
  })
      .then((response) => {
        if (!response.ok) {
          console.log('Error fetching Event data');
          throw response;
        }
        return response.json();
      });
};
