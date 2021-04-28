import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import {makeStyles} from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Container from '@material-ui/core/Container';
import InputAdornment from '@material-ui/core/InputAdornment';
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import Typography from '@material-ui/core/Typography';
import InputLabel from '@material-ui/core/InputLabel';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import Checkbox from '@material-ui/core/Checkbox';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import IconButton from '@material-ui/core/IconButton';
import {useHistory} from 'react-router-dom';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/material.css';
const Auth = require('./libs/Auth');

/**
 * Register function
 * @return {object} Register JSX
 */
export default function Register() {
  const [email, setEmail] = React.useState('');
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [phoneNumber, setPhoneNumber] = React.useState('');
  const [showBusiness, setForm] = React.useState(false);
  const [showPassword, setVisibility] = React.useState(false);
  const [emailError, setEmailError] = React.useState(false);
  const [emailMsg, setEmailMsg] = React.useState('');
  const context = React.useContext(Context);
  const history = useHistory();
  /**
  * Handles form submission
  * @param {event} event
  */
  function handleSubmit(event) {
    event.preventDefault();
    const apicall = 'http://localhost:3010/api/'+
      (showBusiness?'businesses':'users')+'/signup';
    const info = {'email': email,
      'password': password, 'name': username};
    if (showBusiness) {
      info['phonenumber'] = phoneNumber;
    }
    console.log(info);
    fetch(apicall, {
      method: 'POST',
      body: JSON.stringify(info),
      headers: {
        'Content-Type': 'application/json',
      },
    })
        .then((response) => {
          if (!response.ok) {
            // on 409, show error message in email field
            if (response.status === 409) {
              setEmailError(true);
              setEmailMsg('Email already in use.');
            }
            throw response;
          } else {
            setEmailError(false);
            return response.json();
          }
        })
        .then((json) => {
          Auth.saveJWT(json.auth_token);
          context.setAuthState(true);
          console.log(json);
          history.push('/');
        })
        .catch((error) => {
          console.log(error);
        });
  };

  /**
   * validateInput
   * Validates input on form submission
   * @param {*} event
   */
  const validateInput = (event) => {
    // regex to check for valid email and phone
    const emailRegex = /^(([^<>()[\]\\.,;:\s@']+(\.[^<>()[\]\\.,;:\s@']+)*)|('.+'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
    if (!emailRegex.test(email)) {
      // don't submit and display error if email is invalid
      setEmailError(true);
      setEmailMsg('Invalid email.');
      return;
    } else if (showBusiness && !phoneRegex.test(phoneNumber)) {
      // don't submit a business form if phone is invalid
      return;
    } else {
      handleSubmit(event);
    }
  };

  /**
   * handleKeypress
   * Checks if keypress was enter, then submits form
   * @param {*} event Event submission event
   */
  const handleKeypress = (event) => {
    // only start submit process if enter is pressed
    if (event.key === 'Enter') {
      validateInput(event);
    }
  };

  const useStyles = makeStyles((theme) => ({
    paper: {
      marginTop: theme.spacing(8),
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    avatar: {
      margin: theme.spacing(1),
      backgroundColor: theme.palette.primary.main,
    },
    form: {
      width: '100%', // Fix IE 11 issue.
      marginTop: theme.spacing(1),
    },
    submit: {
      margin: theme.spacing(3, 0, 2),
      backgroundColor: theme.palette.primary.main,
    },
  }));
  const classes = useStyles();

  return (
    <div>
      <Container component='main' maxWidth='xs'>
        <CssBaseline />
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <AccountBoxIcon />
          </Avatar>
          <Typography component='h1' variant='h5'>
            Register
          </Typography>
          <div className={classes.form}>
            <TextField
              variant='outlined'
              margin='normal'
              required
              fullWidth
              id='username'
              label={!showBusiness ? 'Name' : 'Business Name'}
              name='username'
              onChange={(event) => {
                setUsername(event.target.value);
              }}
              onKeyPress={handleKeypress}
              autoFocus
            />
            <TextField
              error={emailError}
              helperText={emailError?emailMsg:''}
              variant='outlined'
              margin='normal'
              required
              fullWidth
              id='email'
              label='Email Address'
              name='email'
              autoComplete='email'
              onChange={(event) => {
                setEmail(event.target.value);
              }}
              onKeyPress={handleKeypress}
              autoFocus
            />

            <FormControl className={classes.form} variant='outlined'>
              <InputLabel htmlFor='outlined-adornment-password'>Password</InputLabel>
              <OutlinedInput
                variant='outlined'
                required
                fullWidth
                name='password'
                label='Password'
                type={showPassword ? 'text' : 'password'}
                id='password'
                onChange={(event) => {
                  setPassword(event.target.value);
                }}
                onKeyPress={handleKeypress}
                autoComplete='current-password'
                endAdornment={
                  <InputAdornment position='end'>
                    <IconButton
                      aria-label='toggle password visibility'
                      onClick={(event) => {
                        setVisibility(!showPassword);
                      }}
                      edge='end'
                    >
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                }
              />
            </FormControl>
            <FormControlLabel
              control={<Checkbox value='remember'
                color='primary'
                onChange={(event) => {
                  setForm(event.target.checked);
                }}/>}
              label='Business Account'
            />
            {showBusiness && <PhoneInput
              isValid={(value) => {
                // show error if phone number is invalid
                if (!value.match(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/)) {
                  return 'Invalid phone number.';
                } else {
                  return true;
                }
              }}
              inputStyle={{width: '100%'}}
              country={'us'}
              value={phoneNumber}
              onChange={(phone) => {
                setPhoneNumber(phone);
              }}
              onKeyDown={(event) => {
                handleKeypress(event);
              }}
            />}
            <Button
              type='submit'
              fullWidth
              variant='contained'
              color='primary'
              className={classes.submit}
              onClick={validateInput}
            >
              Register
            </Button>
          </div>
        </div>
      </Container>
    </div>
  );
}
