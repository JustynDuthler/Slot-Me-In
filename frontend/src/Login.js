import React from 'react';
/**
 * Register class
 */
export default class Login extends React.Component {
  /**
   *
   * @param {*} props
   */
  constructor(props) {
    super(props);
    this.state = {email: '', password: '', showBusiness: false};

    this.changeForm = this.changeForm.bind(this);

    this.changeEmail = this.changeEmail.bind(this);
    this.changePassword = this.changePassword.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  /**
   *
   * @param {event} event
   */
  changeForm(event) {
    this.setState({showBusiness: !this.state.showBusiness});
  }
  /*
   *
   * @param {*} event
   */
  changeEmail(event) {
    this.setState({email: event.target.value});
  }
  /**
   *
   * @param {event} event
   */
  changePassword(event) {
    this.setState({password: event.target.value});
  }

  /**
   *
   * @param {event} event
   */
  changePassword(event) {
    this.setState({password: event.target.value});
  }

  /**
   * Handles form submission
   * @param {event} event
   */
  handleSubmit(event) {
    event.preventDefault();
    var apicall = 'http://localhost:3010/api/'+
      (this.state.showBusiness?'businesses':'users')+'/login';
    fetch(apicall, {
      method: 'POST',
      body: JSON.stringify({"email":this.state.email,
        "password":this.state.password}),
      headers: {
        'Content-Type': 'application/json',
      },
    })
        .then((response) => {
          if (!response.ok) {
            throw response;
          }
          return response;
        })
        .then((json) => {
          console.log(json);
        })
        .catch((error) => {
          console.log(error);
        });
  }

  /**
   * Renders register page
   * @return {object} JSX
   */
  render() {
    const showBusiness = this.state.showBusiness;
    console.log(showBusiness);
    return (
      <div>
      {showBusiness && <form onSubmit={this.handleSubmit}>
        <label>
          Business Email:
          <input type="text" value={this.state.email}
            onChange={this.changeEmail} />
        </label><br/>
        <label>
          Password:
          <input type="text" value={this.state.password}
            onChange={this.changePassword} />
        </label><br/>
        <input type="submit" value="Submit" />
      </form>}
      {showBusiness && <button onClick={this.changeForm}>Toggle User Login</button>}
      {!showBusiness && <form onSubmit={this.handleSubmit}>
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
      </form>}
      {!showBusiness && <button onClick={this.changeForm}>Toggle Business Login</button>}
      </div>

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
