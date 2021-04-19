import React from 'react';
import {Redirect} from 'react-router-dom';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import EventIcon from '@material-ui/icons/Event';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import Container from '@material-ui/core/Container';
import InputAdornment from '@material-ui/core/InputAdornment';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import Context from './Context';
import DateFnsUtils from '@date-io/date-fns';
import { DateTimePicker, KeyboardDateTimePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
const Auth = require('./libs/Auth');
/**
 * CreateEvent Function
 */
export default function CreateEvent() {
  const context = React.useContext(Context);
  const[eventName, changeName] = React.useState("");
  const[startDateTime, changeStartDateTime] = React.useState(null);
  const[endDateTime, changeEndDateTime] = React.useState(null);
  const[capacity, changeCapacity] = React.useState("");
  const[repeat, changeRepeat] = React.useState(false);

  /**
   * Handles form submission
   * @param {event} event
   */
  function handleSubmit(event) {
    event.preventDefault();
    if (context.businessState) {
      fetch('http://localhost:3010/api/events', {
        method: "POST",
        body: JSON.stringify({
          "eventname":eventName,
          "starttime":startDateTime.toISOString(),
          "endtime":endDateTime.toISOString(),
          "capacity":parseInt(capacity),
          "repeat":repeat,
        }),
        headers: Auth.JWTHeaderJson(),
      }).then(response => response.json())
      .then((json) => {
        console.log(json);
      })
      .catch((error) => {
        console.log(error);
      });
    } else {
      alert("Error: Only business accounts may create events.");
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
    dateselect: {
      width: '100%',
      marginTop: theme.spacing(2),
    },
    submit: {
      margin: theme.spacing(3, 0, 2),
    },
  }));
  const classes = useStyles();
  const validateInput = (event) => {
    // regex to check for valid email format
    //const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
    handleSubmit(event);
  }
  if (Auth.JWTHeader() === null) {
    return <Redirect to={{pathname: '/'}}/>
  }
  return (
    <div>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <EventIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Create an Event
          </Typography>
          <div className={classes.form}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="eventname"
              label="Event Name"
              name="eventname"
              onChange={(event) => {changeName(event.target.value);}}
              autoFocus
            />
            <MuiPickersUtilsProvider utils={DateFnsUtils} className={classes.form}>
              <DateTimePicker
                clearable
                className={classes.dateselect}
                label="Start Date/Time"
                inputVariant="outlined"
                value={startDateTime}
                onChange={changeStartDateTime}
              />
            </MuiPickersUtilsProvider>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <DateTimePicker
                clearable
                className={classes.dateselect}
                label="End Date/Time"
                inputVariant="outlined"
                value={endDateTime}
                onChange={changeEndDateTime}
              />
            </MuiPickersUtilsProvider>
            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              id="capacity"
              label="Capacity"
              name="capacity"
              onChange={(event) => {changeCapacity(event.target.value);}}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              onClick={validateInput}
            >
              Create Event
            </Button>
          </div>
        </div>
      </Container>
    </div>
  );
}
