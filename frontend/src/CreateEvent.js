import React from 'react';
import {Redirect} from 'react-router-dom';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import EventIcon from '@material-ui/icons/Event';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import Container from '@material-ui/core/Container';
import InputAdornment from '@material-ui/core/InputAdornment';
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';
import RadioButtonCheckedIcon from '@material-ui/icons/RadioButtonChecked';
import FormHelperText from '@material-ui/core/FormHelperText';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import Context from './Context';
import DateFnsUtils from '@date-io/date-fns';
import { DatePicker, DateTimePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import { useHistory } from "react-router-dom";
const Auth = require('./libs/Auth');
/**
 * CreateEvent Function
 */
export default function CreateEvent() {
  const context = React.useContext(Context);
  const [eventName, changeName] = React.useState("");
  const [startDateTime, changeStartDateTime] = React.useState(null);
  const [endDateTime, changeEndDateTime] = React.useState(null);
  const [capacity, changeCapacity] = React.useState("");
  const [description, changeDescription] = React.useState("");
  const [repeat, changeRepeat] = React.useState(false);
  const [repeatDays,changeRepeatDays] = React.useState({"Monday":false,"Tuesday":false,"Wednesday":false,"Thursday":false,"Friday":false,"Saturday":false,"Sunday":false});
  const [repeatEnd, changeRepeatEnd] = React.useState(null);
  const [repeatEndError,setRepeatEndError] = React.useState(false);
  const [repeatDaysError, setRepeatDaysError] = React.useState(false);
  const [repeatPrecedeError,setRepeatPrecedeError] = React.useState(false);
  const [repeatError,setRepeatError] = React.useState(false);
  const [nameError, setNameError] = React.useState(false);
  const [startError, setStartError] = React.useState(false);
  const [endError, setEndError] = React.useState(false);
  const [precedeError, setPrecedeError] = React.useState(false);
  const [capacityError, setCapacityError] = React.useState(false);
  const [descriptionError, setDescriptionError] = React.useState(false);
  const days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];
  const history = useHistory();

  /**
   * Handles form submission
   * @param {event} event
   */
  function handleSubmit(event) {
    event.preventDefault();
    const eventObj = {};
    // properties for all events
    eventObj.eventname = eventName;
    eventObj.starttime = startDateTime.toISOString();
    eventObj.endtime = endDateTime.toISOString();
    eventObj.capacity = parseInt(capacity);
    eventObj.description = description;
    eventObj.repeat = repeat;
    // properties for repeating events only
    if (repeat) {
      eventObj.repeattype = 'w';
      eventObj.repeatdays = repeatDays;
      eventObj.repeatend = repeatEnd.toISOString();
    }
    if (context.businessState) {
      fetch('http://localhost:3010/api/events', {
        method: "POST",
        body: JSON.stringify(eventObj),
        headers: Auth.JWTHeaderJson(),
      }).then((response) => {
        if (!response.ok) {
          if (response.status === 401) {
            Auth.removeJWT();
            context.setAuthState(null);
          }
          throw response;
        }
        return response.json();
      }).then((json) => {
        console.log(json);
        history.push('/events/');
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
      width: '420px', // Fix IE 11 issue.
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
    // check that all fields are filled before submitting
    (!eventName) ? setNameError(true) : setNameError(false);
    (!startDateTime) ? setStartError(true) : setStartError(false);
    (!endDateTime) ? setEndError(true) : setEndError(false);
    (repeat && !repeatEnd) ? setRepeatEndError(true) : setRepeatEndError(false);
    // start date must precede end date
    (startDateTime && endDateTime && startDateTime > endDateTime) ? setPrecedeError(true) : setPrecedeError(false);
    // repeat days must include day of start date
    (repeat && startDateTime && !repeatDays[days[startDateTime.getDay()]]) ? setRepeatError(true) : setRepeatError(false);
    // start date must precede repeat end date
    (repeat && repeatEnd && startDateTime > repeatEnd) ? setRepeatPrecedeError(true) : setRepeatPrecedeError(false);
    // at least one repeat day must be selected
    (repeat && !repeatDays["Sunday"] && !repeatDays["Monday"] && !repeatDays["Tuesday"] && !repeatDays["Wednesday"] &&
    !repeatDays["Thursday"] && !repeatDays["Friday"] && !repeatDays["Saturday"]) ? setRepeatDaysError(true) : setRepeatDaysError(false);
    // make sure capacity is an integer
    (!capacity || capacity % 1 !== 0)
        ? setCapacityError(true) : setCapacityError(false);
    (description.length > 500 ? setDescriptionError(true) : setDescriptionError(false));
    // only submit if all fields are filled out
    if (!eventName || !startDateTime || !endDateTime || !capacity ||
        precedeError || repeatError || descriptionError || repeatEndError || repeatDaysError) {
      return;
    } else {
      handleSubmit(event);
    }
  }

  const handleKeypress = (event) => {
    // only start submit process if enter is pressed
    if (event.key === "Enter") {
      validateInput(event);
    }
  }

  if (context.businessState === false) {
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
              error={nameError}
              helperText={nameError ? "Event name is required." : ""}
              variant="outlined"
              margin="normal"
              fullWidth
              id="eventname"
              label="Event Name"
              name="eventname"
              onChange={(event) => {changeName(event.target.value);}}
              onKeyPress={handleKeypress}
              autoFocus
            />
            <MuiPickersUtilsProvider utils={DateFnsUtils} className={classes.form}>
              <DateTimePicker
                error={startError}
                helperText={startError ? "Start date/time is required." : ""}
                clearable
                className={classes.dateselect}
                label="Start Date/Time"
                inputVariant="outlined"
                value={startDateTime}
                onChange={changeStartDateTime}
                onKeyPress={handleKeypress}
              />
            </MuiPickersUtilsProvider>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <DateTimePicker
                error={endError || precedeError}
                helperText={precedeError ? "End date/time must follow Start date/time." : endError ? "End date/time is required." : ""}
                clearable
                className={classes.dateselect}
                label="End Date/Time"
                inputVariant="outlined"
                value={endDateTime}
                onChange={changeEndDateTime}
                onKeyPress={handleKeypress}
              />
            </MuiPickersUtilsProvider>
            <FormControlLabel
              control={<Checkbox value="repeat" color="primary" onChange={(event) => {changeRepeat(event.target.checked);}}/>}
              label="Repeat"
            />
            {repeat && <FormControl required error={repeatError || repeatDaysError} component="fieldset"><FormGroup row>
              <FormControlLabel
                control={<Checkbox icon={<RadioButtonUncheckedIcon />} checkedIcon={<RadioButtonCheckedIcon />} value="monday" color="primary" onChange={(event) => {changeRepeatDays({ ...repeatDays, ["Sunday"]: event.target.checked });}}/>}
                label="S"
              />
              <FormControlLabel
                control={<Checkbox icon={<RadioButtonUncheckedIcon />} checkedIcon={<RadioButtonCheckedIcon />} value="tuesday" color="primary" onChange={(event) => {changeRepeatDays({ ...repeatDays, ["Monday"]: event.target.checked });}}/>}
                label="M"
              />
              <FormControlLabel
                control={<Checkbox icon={<RadioButtonUncheckedIcon />} checkedIcon={<RadioButtonCheckedIcon />} value="wednesday" color="primary" onChange={(event) => {changeRepeatDays({ ...repeatDays, ["Tuesday"]: event.target.checked });}}/>}
                label="T"
              />
              <FormControlLabel
                control={<Checkbox icon={<RadioButtonUncheckedIcon />} checkedIcon={<RadioButtonCheckedIcon />} value="thursday" color="primary" onChange={(event) => {changeRepeatDays({ ...repeatDays, ["Wednesday"]: event.target.checked });}}/>}
                label="W"
              />
              <FormControlLabel
                control={<Checkbox icon={<RadioButtonUncheckedIcon />} checkedIcon={<RadioButtonCheckedIcon />} value="friday" color="primary" onChange={(event) => {changeRepeatDays({ ...repeatDays, ["Thursday"]: event.target.checked });}}/>}
                label="T"
              />
              <FormControlLabel
                control={<Checkbox icon={<RadioButtonUncheckedIcon />} checkedIcon={<RadioButtonCheckedIcon />} value="saturday" color="primary" onChange={(event) => {changeRepeatDays({ ...repeatDays, ["Friday"]: event.target.checked });}}/>}
                label="F"
              />
              <FormControlLabel
                control={<Checkbox icon={<RadioButtonUncheckedIcon />} checkedIcon={<RadioButtonCheckedIcon />} value="sunday" color="primary" onChange={(event) => {changeRepeatDays({ ...repeatDays, ["Saturday"]: event.target.checked });}}/>}
                label="S"
              />
              </FormGroup>
              {repeatError && <FormHelperText>Selected days must include day of start date</FormHelperText>}
              {repeatDaysError && <FormHelperText>Must select at least one day to repeat on</FormHelperText>}
              </FormControl>}
              {repeat && <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <DatePicker
                  error={repeatEndError || repeatPrecedeError}
                  helperText={repeatPrecedeError ? "Repeat end date must follow Start date/time." :
                              repeatEndError ? "Repeat end date is required." : ""}
                  clearable
                  className={classes.dateselect}
                  label="Repeat End Date"
                  inputVariant="outlined"
                  value={repeatEnd}
                  onChange={changeRepeatEnd}
                  onKeyPress={handleKeypress}
                />
              </MuiPickersUtilsProvider>}
            <TextField
              error={capacityError}
              helperText={capacityError ? "Capacity is required and must be an integer." : ""}
              variant="outlined"
              margin="normal"
              fullWidth
              id="capacity"
              label="Capacity"
              name="capacity"
              type="number"
              onChange={(event) => {changeCapacity(event.target.value);}}
              onKeyPress={handleKeypress}
            />
            <TextField
              error={descriptionError}
              helperText={descriptionError ? "Description must be less than 500 characters." : ""}
              variant="outlined"
              margin="normal"
              fullWidth
              id="description"
              label="Description (max 500 chars)"
              name="description"
              multiline
              placeholder="Brief Description of Event"
              onChange={(event) => {changeDescription(event.target.value);}}
              onKeyPress={handleKeypress}
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
