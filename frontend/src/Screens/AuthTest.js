import React from 'react';
const Auth = require('../libs/Auth');


/**
 *
 * @return {object} JSX
 */
export default function AuthTest() {
  const [token, setToken] = React.useState('');
  const [auth, setAuth] = React.useState(false);
  const [serverResponse, setResponse] = React.useState('none');

  /**
   * getToken
   */
  async function getToken() {
    const response = await fetch('http://localhost:3010/api/test/get_token');
    const res = await response.json();
    const token = res.auth_token;
    Auth.saveJWT(token);
    setToken(token);
  };

  /**
   * getInvalidToken
   */
  async function getInvalidToken() {
    const token = 'invalid_token';
    Auth.saveJWT(token);
    setToken(token);
  };

  /**
   * removeToken
   */
  const removeToken = () => {
    Auth.removeJWT();
    setToken('');
    setAuth(false);
  };

  /**
   * testToken
   */
  const testToken = async () => {
    const foundToken = localStorage.getItem('auth_token');
    if (foundToken) {
      await fetch('http://localhost:3010/api/test/test_token', {
        method: 'POST',
        headers: Auth.headerJWT(),
      })
          .then((res) => res.json())
          .then((data) => setResponse(data.auth));
    }
  };


  if (!auth) {
    const foundToken = Auth.getJWT();
    if (foundToken) {
      setToken(foundToken);
      setAuth(true);
    }
  }

  return (
    <div>
      <button onClick={getToken}>Get Token</button>
      <button onClick={getInvalidToken}>Get Invalid Token</button>
      <button onClick={removeToken}>Remove Token</button>
      <button onClick={testToken}>Test Token</button>

      <h1>Token Test:{serverResponse}</h1>
      <h1>Token: {token}</h1>
      <h1>{auth ? 'authenticated' : 'not authenticated'}</h1>
    </div>
  );
}
