// A module for dealing with JWT storage

// Saves JWT in local storage
exports.saveJWT = (jwt) => {
    localStorage.setItem('auth_token', jwt);
};

// Gets JWT from local storage
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