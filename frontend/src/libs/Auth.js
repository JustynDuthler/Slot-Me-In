// A module for dealing with JWT storage

// Saves JWT in local storage
exports.saveJWT = (jwt) => {
    localStorage.setItem('auth_token', jwt);
};

// Gets JWT from local storage
// Returns null if no JWT in localStorage
exports.getJWT = () => {
    return localStorage.getItem('auth_token');
};

// Removes JWT from local storage
exports.removeJWT = () => {
    localStorage.removeItem('auth_token');
};

// Creates JWT header or returns null
exports.JWTHeader = () => {
    const jwt = localStorage.getItem('auth_token');
    if (jwt) {
        return {'Authorization': 'Bearer ' + jwt,};
    } else {
        return null;
    }
};

// Creates JWT header with json Content-Type or returns null
exports.JWTHeaderJson = () => {
    const jwt = localStorage.getItem('auth_token');
    if (jwt) {
        return {'Authorization': 'Bearer ' + jwt,
        'Content-Type':'application/json'};
    } else {
        return null;
    }
};
exports.updateToken = async () => {
  const response = await fetch("http://localhost:3010/api/test/get_token");
  const res = await response.json();
  const token = res.auth_token;
  return token;
};
