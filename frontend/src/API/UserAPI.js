import * as Auth from '../libs/Auth';

/**
 * 
 * @return {Promise} UserInfo
 */
export const getUserInfo = () => {
  const apicall = 'http://localhost:3010/api/users/getUser';
  return fetch(apicall, {
    method: 'GET',
    headers: Auth.headerJsonJWT(),
  })
  .then((response) => {
    if (!response.ok){
      throw response;
    }
    return response.json();
  })
};