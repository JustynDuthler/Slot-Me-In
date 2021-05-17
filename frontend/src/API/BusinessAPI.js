
/**
 * Returns promise to the api call for getting businesses of a user
 * @param {string} email
 * @return {Promise} array of businesses
 */
export const getMemberBusinesses = (email) => {
  const apicall = 'http://localhost:3010/api/members/getMemberBusinesses/'+email;
  return fetch(apicall, {
    method: 'GET',
  }).then((response) => {
    if (!response.ok) {
      throw response;
    }
    return response.json();
  });
};
