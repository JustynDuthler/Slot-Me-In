import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import {makeStyles} from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import Container from '@material-ui/core/Container';
import InputAdornment from '@material-ui/core/InputAdornment';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import Context from '../../Context';
import {useHistory} from 'react-router-dom';
const Auth = require('../../libs/Auth');

/**
 * Login class
 * @return {object} Login JSX
 */
export default function Login() {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [showBusiness, setForm] = React.useState(false);
  const [showPassword, setVisibility] = React.useState(false);
  const [emailError, setEmailError] = React.useState(false);
  const [emailMsg, setEmailMsg] = React.useState('');
  const [passError, setPassError] = React.useState(false);
  const context = React.useContext(Context);
  const history = useHistory();
  /**
   * Handles form submission
   * @param {event} event
   */
  function handleSubmit(event) {
    event.preventDefault();
    const apicall = 'http://localhost:3010/api/'+
      (showBusiness?'businesses':'users')+'/login';
    fetch(apicall, {
      method: 'POST',
      body: JSON.stringify({'email': email,
        'password': password}),
      headers: {
        'Content-Type': 'application/json',
      },
    })
        .then((response) => {
          if (!response.ok) {
            if (response.status === 400) {
              setEmailError(email === '');
              setEmailMsg('Invalid email.');
              setPassError(false);
            }
            if (response.status === 404) {
              setEmailError(true);
              setEmailMsg('Account not found.');
              setPassError(false);
            } else if (response.status === 401) {
              setEmailError(false);
              setPassError(true);
            }
            context.setAuthState(false);
            throw response;
          } else {
            setEmailError(false);
            setPassError(false);
            return response.json();
          }
        })
        .then((json) => {
          // save JWT and set authState after logging in
          Auth.saveJWT(json.auth_token);
          context.setAuthState(true);
          console.log(json);
          context.setBusinessState(showBusiness);
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
    // regex to check for valid email format
    const emailRegex = new RegExp([
      '^(([^<>()[\\]\\\.,;:\\s@\"]+(\\.[^<>()\\[\\]\\\.,;:\\s@\"]+)*)',
      '|(".+"))@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.',
      '[0-9]{1,3}\])|(([a-zA-Z\\-0-9]+\\.)+',
      '[a-zA-Z]{2,}))$'].join(''));
    if (!emailRegex.test(email)) {
      setEmailError(true);
      setEmailMsg('Invalid email.');
      setPassError(false);
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
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    avatar: {
      margin: theme.spacing(1),
      backgroundColor: theme.palette.secondary.main,
    },
    form: {
      width: '100%', // Fix IE 11 issue.
      marginTop: theme.spacing(1),
    },
    submit: {
      margin: theme.spacing(3, 0, 2),
      backgroundColor: theme.palette.secondary.main,
    },
  }));
  const classes = useStyles();

  // if authenticated already, redirect to homepage
  return (
    <div>
      <Container component="main" maxWidth="xs">
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <div className={classes.form}>
            <TextField
              error={emailError}
              helperText={emailError ? emailMsg : ''}
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              onChange={(event) => {
                setEmail(event.target.value);
              }}
              onKeyPress={handleKeypress}
              autoFocus
            />

            <FormControl className={classes.form} variant="outlined">
              <TextField
                error={passError}
                helperText={passError?'Incorrect password.':''}
                variant="outlined"
                required
                fullWidth
                name="password"
                label="Password"
                type={showPassword ? 'text' : 'password'}
                id="password"
                onChange={(event) => {
                  setPassword(event.target.value);
                }}
                onKeyPress={handleKeypress}
                autoComplete="current-password"
                InputProps={{
                  endAdornment:
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={(event) => {
                          setVisibility(!showPassword);
                        }}
                        edge="end"
                      >
                        {showPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>,
                }}
              />
            </FormControl>
            <FormControlLabel
              control={<Checkbox value="remember"
                color="primary"
                onChange={(event) => {
                  setForm(event.target.checked);
                }}/>}
              label="Business Account"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              className={classes.submit}
              onClick={validateInput}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link href="/Register" variant="body2">
                  {'Don\'t have an account? Sign Up'}
                </Link>
              </Grid>
            </Grid>
          </div>
        </div>
      </Container>
    </div>
  );
}
