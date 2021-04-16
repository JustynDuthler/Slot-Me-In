import React from 'react';
/**
 * Register class
 */
export default class Register extends React.Component {
  /**
   *
   * @param {*} props
   */
  constructor(props) {
    super(props);
    this.state = {username: '', email: '', password: '', showBusiness: false, flag: 0};

    this.changeForm = this.changeForm.bind(this);

    this.changeUsername = this.changeUsername.bind(this);
    this.changeEmail = this.changeEmail.bind(this);
    this.changePassword = this.changePassword.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  /**
   *
   * @param {*} event
   */
  changeForm(event) {
    this.setState({showBusiness: !this.state.showBusiness});
  }

  /**
   *
   * @param {*} event
   */
  changeUsername(event) {
    this.setState({username: event.target.value});
  }
  /**
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
   * Handles form submission
   * @param {event} event
   */
  handleSubmit(event) {
    alert('A name was submitted: ' + this.state.username+' '+
      this.state.password);
    event.preventDefault();
    var apicall = 'http://localhost:3010/api/'+
      (this.state.showBusiness?'businesses':'users')+'/signup';
    fetch(apicall, {
      method: 'POST',
      body: JSON.stringify({"email":this.state.email,
        "password":this.state.password,"name":this.state.username}),
      headers: {
        'Content-Type': 'application/json',
      },
    })
        .then((response) => {
          if (!response.ok) {
            this.setState({flag: 1}); 
            throw response;
          }
          this.setState({flag: 0}); 
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
    return (
      <div>
      {showBusiness && <form onSubmit={this.handleSubmit}>
        <label>
          Business Name:
          <input type="text" value={this.state.username}
            onChange={this.changeUsername} />
        </label><br/>
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
        <input type="submit" value="Sign Up" />
      </form>}
      {showBusiness && <button onClick={this.changeForm}>Toggle User Signup</button>}
      {!showBusiness && <form onSubmit={this.handleSubmit}>
        <label>
          Name:
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
        <input type="submit" value="Sign Up" />
      </form>}
      {!showBusiness && <button onClick={this.changeForm}>Toggle Business Signup</button>}
      {this.state.flag === 1 && <p>The email you entered is already in use.</p>}
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
