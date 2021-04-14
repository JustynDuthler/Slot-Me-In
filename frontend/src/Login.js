import React from 'react';
const Auth = require('./libs/Auth');

/**
 * Register class
 */
export default function Login() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showBusiness, setForm] = React.useState(false);
  /**
   * Handles form submission
   * @param {event} event
   */
  function handleSubmit(event) {
    event.preventDefault();
    var apicall = 'http://localhost:3010/api/'+
      (showBusiness?'businesses':'users')+'/login';
    fetch(apicall, {
      method: 'POST',
      body: JSON.stringify({"email":email,
        "password":password}),
      headers: {
        'Content-Type': 'application/json',
      },
    })
        .then((response) => {
          if (!response.ok) {
            throw response;
          }
          return response.json();
        })
        .then((json) => {
          Auth.saveJWT(json.auth_token);
          console.log(json);
        })
        .catch((error) => {
          console.log(error);
        });
  };
  return (
    <div>
    {showBusiness && <form onSubmit={handleSubmit}>
      <label>
        Business Email:
        <input type="text" value={email}
          onChange={(event) => {setEmail(event.target.value);}} />
      </label><br/>
      <label>
        Password:
        <input type="text" value={password}
          onChange={(event) => {setPassword(event.target.value);}} />
      </label><br/>
      <input type="submit" value="Submit" />
    </form>}
    {showBusiness && <button onClick={(event) => {setForm(!showBusiness);}}>Toggle User Login</button>}
    {!showBusiness && <form onSubmit={handleSubmit}>
      <label>
        Email:
        <input type="text" value={email}
          onChange={(event) => {setEmail(event.target.value);}} />
      </label><br/>
      <label>
        Password:
        <input type="text" value={password}
          onChange={(event) => {setPassword(event.target.value);}} />
      </label><br/>
      <input type="submit" value="Submit" />
    </form>}
    {!showBusiness && <button onClick={(event) => {setForm(!showBusiness);}}>Toggle Business Login</button>}
    </div>

  );
}
