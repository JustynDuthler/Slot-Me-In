import React from 'react';
export default class Register extends React.Component {
  constructor(props) {
    super(props);
    this.state = {username: '', email: '', password: ''};

    this.changeUsername = this.changeUsername.bind(this);
    this.changeEmail = this.changeEmail.bind(this);
    this.changePassword = this.changePassword.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  changeUsername(event) {
    this.setState({username: event.target.value});
  }
  changeEmail(event) {
    this.setState({email: event.target.value});
  }
  changePassword(event) {
    this.setState({password: event.target.value});
  }

  handleSubmit(event) {
    alert('A name was submitted: ' + this.state.username+' '+
      this.state.password);
    event.preventDefault();
    fetch('http://localhost:3010/api/users/signup', {method: 'POST', body: JSON.stringify(this.state)})
        .then((response) => {
          if (!response.ok) {
            throw response;
          }
          return response.json();
        })
        .then((json) => {
          console.log(json.message);
        })
        .catch((error) => {
          console.log(error.toString());
        });
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Username:
          <input type="text" value={this.state.username}
            onChange={this.changeUsername} />
        </label><br/>
        <label>
          Email:
          <input type="text" value={this.state.email}
            onChange={this.changeEmail} />
        </label><br/>
        <label>
          Password:
          <input type="text" value={this.state.password}
            onChange={this.changePassword} />
        </label><br/>
        <input type="submit" value="Submit" />
      </form>
    );
  }
}
/* export default function Register() {
  return (
    <div>
      <h1>Register</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="fname">First name:</label><br></br>
        <input type="text" id="fname" name="fname"></input><br></br>
        <label htmlFor="lname">Last name:</label><br></br>
        <input type="text" id="lname" name="lname"></input><br></br>
        <input type="submit" value="Submit" />
      </form>
    </div>
  );
}
*/
