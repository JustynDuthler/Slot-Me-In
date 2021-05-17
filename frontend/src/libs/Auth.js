// A module for dealing with JWT storage

// Saves JWT in local storage
/**
 *
 * @param {string} jwt
 */
export const saveJWT = (jwt) => {
  localStorage.setItem('auth_token', jwt);
};

// Gets JWT from local storage
// Returns null if no JWT in localStorage
/**
 *
 * @return {string} jwt
 */
export const getJWT = () => {
  return localStorage.getItem('auth_token');
};

// Removes JWT from local storage
/**
 *
 */
export const removeJWT = () => {
  localStorage.removeItem('auth_token');
};

// Creates JWT header or returns null
/**
 *
 * @return {json} header
 */
export const headerJWT = () => {
  const jwt = localStorage.getItem('auth_token');
  if (jwt) {
    return {'Authorization': 'Bearer ' + jwt};
  } else {
    return null;
  }
};

// Creates JWT header with json Content-Type or returns null
/**
 *
 * @return {json} header with content type
 */
export const headerJsonJWT = () => {
  const jwt = localStorage.getItem('auth_token');
  if (jwt) {
    return {'Authorization': 'Bearer ' + jwt,
      'Content-Type': 'application/json'};
  } else {
    return {'Authorization': ''};
  }
};

// Creates JWT header with json Multipart-FormData or returns null
/**
 *
 * @return {json} header with content type
 */
export const headerFormDataJWT = () => {
  const jwt = localStorage.getItem('auth_token');
  if (jwt) {
    return {'Authorization': 'Bearer ' + jwt,
      'Content-Type': 'multipart/form-data'};
  } else {
    return {'Authorization': ''};
  }
};
/**
 *
 * @return {string} jwt
 */
export const updateToken = async () => {
  const response = await fetch('http://localhost:3010/api/test/get_token');
  const res = await response.json();
  const token = res.auth_token;
  return token;
};
