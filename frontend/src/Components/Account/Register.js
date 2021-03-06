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
import Context from '../../Context';
import 'react-phone-input-2/lib/material.css';
const Auth = require('../../libs/Auth');
import Link from '@material-ui/core/Link';
import DateFnsUtils from '@date-io/date-fns';
import {DatePicker, MuiPickersUtilsProvider}
  from '@material-ui/pickers';

/**
 * Register function
 * @return {object} Register JSX
 */
export default function Register() {
  const [email, setEmail] = React.useState('');
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [phoneNumber, setPhoneNumber] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [showBusiness, setForm] = React.useState(false);
  const [showPassword, setVisibility] = React.useState(false);
  const [dob, setDob] = React.useState(null);
  const [errors, setErrors] = React.useState({
    'name': false,
    'email': false,
    'emailMsg': '',
    'password': false,
    'description': false,
    'dob': false,
    'dobMsg': '',
    'phone': false,
  });
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
      info['description'] = description;
    } else {
      info['birthdate'] = dob.toISOString();
    }
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
              setErrors({...errors, 'email': true,
                'emailMsg': 'Email already in use.'});
              setEmailMsg('Email already in use.');
            }
            throw response;
          } else {
            return response.json();
          }
        })
        .then((json) => {
          Auth.saveJWT(json.auth_token);
          context.setAuthState(true);
          context.setBusinessState(true);
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
    const emailRegex = new RegExp([
      '^(([^<>()[\\]\\\.,;:\\s@\"]+(\\.[^<>()\\[\\]\\\.,;:\\s@\"]+)*)',
      '|(".+"))@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.',
      '[0-9]{1,3}\])|(([a-zA-Z\\-0-9]+\\.)+',
      '[a-zA-Z]{2,}))$'].join(''));
    const phoneRegex =
        /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
    const errors = {
      'name': false,
      'email': false,
      'emailMsg': '',
      'password': false,
      'description': false,
      'dob': false,
      'dobMsg': '',
      'phone': false,
    };
    errors.password = password === '';
    errors.name = username === '';
    if (!emailRegex.test(email)) {
      // display error if email is invalid
      errors.email = true;
      errors.emailMsg = 'Invalid email.';
    } else {
      errors.email = false;
    }
    errors.description = description.length > 500;
    errors.phone = !phoneRegex.test(phoneNumber);

    errors.dob = !dob || dob > new Date();
    errors.dobMsg = !dob ? 'Date of birth is required.' :
      'Date of birth must be past date.';
    setErrors(errors);
    if (!(errors.email || errors.description && showBusiness ||
      errors.phone && showBusiness || errors.dob && !showBusiness ||
      errors.name || errors.password)) {
      // don't submit if input is invalid
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
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    textentry: {
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(0),
    },
    avatar: {
      margin: theme.spacing(1),
      backgroundColor: theme.palette.secondary.main,
    },
    form: {
      width: '420px',
      marginTop: theme.spacing(1),
    },
    dateselect: {
      width: '100%',
      marginTop: theme.spacing(1),
    },
    submit: {
      margin: theme.spacing(2, 0, 2),
      backgroundColor: theme.palette.secondary.main,
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
            Create Account
          </Typography>
          <div className={classes.form}>
            <FormControlLabel
              control={<Checkbox id='businessCheckbox'
                value='remember'
                color='primary'
                onChange={(event) => {
                  setForm(event.target.checked);
                }}/>}
              label='Business Account'
            />
            <TextField
              className={classes.textentry}
              variant='outlined'
              margin='normal'
              error={errors.name}
              helperText={errors.name ? 'Name is required.' : ''}
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
            {!showBusiness && <MuiPickersUtilsProvider
              width='100%'
              utils={DateFnsUtils}
              className={classes.form}>
              <DatePicker
                width='100%'
                error={errors.dob}
                helperText={errors.dob ? errors.dobMsg : ''}
                clearable
                required
                className={classes.dateselect}
                format='MM/dd/yyyy'
                label='Date of Birth'
                inputVariant='outlined'
                id='dob'
                value={dob}
                onChange={setDob}
                onKeyPress={handleKeypress}
              />
            </MuiPickersUtilsProvider>}
            <TextField
              className={classes.textentry}
              error={errors.email}
              helperText={errors.email ? errors.emailMsg : ''}
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
              <InputLabel htmlFor='outlined-adornment-password'>
                Password
              </InputLabel>
              <OutlinedInput
                variant='outlined'
                required
                fullWidth
                error={errors.password}
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
            {showBusiness && <PhoneInput
              id='phonenumber'
              style={{marginTop: 10}}
              inputStyle={{background: 'transparent', width: '100%'}}
              isValid={!errors.phone}
              country={'us'}
              value={phoneNumber}
              onChange={(phone) => {
                setPhoneNumber(phone);
              }}
              onKeyDown={(event) => {
                handleKeypress(event);
              }}
            />}
            {showBusiness && <TextField
              style={{marginTop: 10}}
              error={errors.description}
              helperText={errors.description ?
                'Description must be less than 500 characters.' : ''}
              variant='outlined'
              fullWidth
              id='description'
              label='Description (max 500 chars)'
              name='description'
              multiline
              placeholder='Brief Description of Business'
              onChange={(event) => {
                setDescription(event.target.value);
              }}
              onKeyPress={handleKeypress}
            />}
            <Button
              id='submit'
              type='submit'
              fullWidth
              variant='contained'
              className={classes.submit}
              onClick={validateInput}
            >
              Create Account
            </Button>
            <Link href="/login" variant="body2" id="login">
                Already have an account? Log In
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}
