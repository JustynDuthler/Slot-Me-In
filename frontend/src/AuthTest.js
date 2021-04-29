import React from 'react';
const Auth = require('./libs/Auth');


/**
 *
 * @return {object} JSX
 */
export default function AuthTest() {
  const [token, setToken] = React.useState('');
  const [auth, setAuth] = React.useState(false);
  const [serverResponse, setResponse] = React.useState('none');

  async function get_token(){
    const response = await fetch("http://localhost:3010/api/test/get_token");
    const res = await response.json();
    const token = res.auth_token;
    Auth.saveJWT(token);
    setToken(token);
  };

  async function get_invalid_token(){
    const token = 'invalid_token';
    Auth.saveJWT(token);
    setToken(token);
  };

  const remove_token = () => {
    Auth.removeJWT();
    setToken("");
    setAuth(false);
  };

  const test_token = async () => {
    const foundToken = localStorage.getItem('auth_token');
    if (foundToken) {
      await fetch("http://localhost:3010/api/test/test_token", {
        method : "POST",
        headers : Auth.JWTHeader(),
      })
      .then(res => res.json())
      .then(data => setResponse(data.auth));
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
      <button onClick={get_token}>Get Token</button>
      <button onClick={get_invalid_token}>Get Invalid Token</button>
      <button onClick={remove_token}>Remove Token</button>
      <button onClick={test_token}>Test Token</button>

      <h1>Token Test:{serverResponse}</h1>
      <h1>Token: {token}</h1>
      <h1>{auth ? "authenticated" : "not authenticated"}</h1>
    </div>
  );
}
