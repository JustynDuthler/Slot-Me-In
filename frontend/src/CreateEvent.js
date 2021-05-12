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
import EventIcon from '@material-ui/icons/Event';
import Typography from '@material-ui/core/Typography';
import {makeStyles} from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';
import RadioButtonCheckedIcon from '@material-ui/icons/RadioButtonChecked';
import FormHelperText from '@material-ui/core/FormHelperText';
import Context from './Context';
import DateFnsUtils from '@date-io/date-fns';
import {DatePicker, DateTimePicker, MuiPickersUtilsProvider}
  from '@material-ui/pickers';
import {useHistory} from 'react-router-dom';
const Auth = require('./libs/Auth');

/**
 * CreateEvent Function
 * @return {Component} CreateEvent component
 */
export default function CreateEvent() {
  const context = React.useContext(Context);
  const [eventName, changeName] = React.useState('');
  const [startDateTime, changeStartDateTime] = React.useState(null);
  const [endDateTime, changeEndDateTime] = React.useState(null);
  const [capacity, changeCapacity] = React.useState('');
  const [description, changeDescription] = React.useState('');
  const [repeat, changeRepeat] = React.useState(false);
  const [membersOnly, changeMembersOnly] = React.useState(false);
  const [age, setAge] = React.useState(-1);
  const [repeatDays, changeRepeatDays] =
    React.useState({'monday': false, 'tuesday': false, 'wednesday': false,
      'thursday': false, 'friday': false, 'saturday': false, 'sunday': false});
  const [repeatEnd, changeRepeatEnd] = React.useState(null);
  const [errors, setErrors] = React.useState({
    'repeatEnd': false,
    'repeatDays': false,
    'repeatPrecede': false,
    'repeat': false,
    'name': false,
    'start': false,
    'end': false,
    'precede': false,
    'capacity': false,
    'description': false,
  });
  const days =
    ['sunday', 'monday', 'tuesday', 'wednesday',
      'thursday', 'friday', 'saturday', 'sunday'];
  const history = useHistory();

  /**
   * handleSubmit
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
    eventObj.membersonly = membersOnly;
    // properties for repeating events only
    if (repeat) {
      eventObj.repeattype = 'w';
      eventObj.repeatdays = repeatDays;
      eventObj.repeatend = repeatEnd.toISOString();
    }
    if (context.businessState) {
      fetch('http://localhost:3010/api/events', {
        method: 'POST',
        body: JSON.stringify(eventObj),
        headers: Auth.headerJsonJWT(),
      }).then((response) => {
        if (!response.ok) {
          if (response.status === 401) {
            Auth.removeJWT();
            context.setAuthState(false);
          }
          throw response;
        }
        return response.json();
      }).then((json) => {
        console.log(json);
        history.push('/events');
      })
          .catch((error) => {
            console.log(error);
          });
    } else {
      alert('Error: Only business accounts may create events.');
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
      backgroundColor: theme.palette.secondary.main,
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
      backgroundColor: theme.palette.secondary.main,
    },
  }));
  const classes = useStyles();

  /**
   * validateInput
   * @param {*} event Form submission event
   */
  const validateInput = async (event) => {
    // check that all fields are filled before submitting
    const errors = {
      'name': !eventName,
      'start': !startDateTime,
      'end': !endDateTime,
      'repeatEnd': (repeat && !repeatEnd),
      'precede': startDateTime && endDateTime && (startDateTime > endDateTime),
      'repeat': (repeat && startDateTime &&
        !repeatDays[days[startDateTime.getDay()]]),
      'repeatPrecede': (repeat && repeatEnd && startDateTime > repeatEnd),
      'repeatDays': (repeat && !repeatDays['sunday'] && !repeatDays['monday'] &&
        !repeatDays['tuesday'] && !repeatDays['wednesday'] &&
        !repeatDays['thursday'] && !repeatDays['friday'] &&
        !repeatDays['saturday']),
      'capacity': (!capacity || capacity % 1 !== 0),
      'description': description.length > 500,
    };

    // only submit if all fields are filled out
    for (const error in errors) {
      if (errors.hasOwnProperty(error)) {
        if (errors[error]) {
          setErrors(errors);
          return;
        }
      }
    }
    setErrors(errors);
    handleSubmit(event);
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

  if (context.businessState === false) {
    return <Redirect to={{pathname: '/'}}/>;
  }
  return (
    <div>
      <Container component='main' maxWidth='xs'>
        <CssBaseline />
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <EventIcon />
          </Avatar>
          <Typography component='h1' variant='h5'>
            Create an Event
          </Typography>
          <div className={classes.form}>
            <TextField
              error={errors.name}
              helperText={errors.name ? 'Event name is required.' : ''}
              variant='outlined'
              margin='normal'
              fullWidth
              id='eventname'
              label='Event Name'
              name='eventname'
              onChange={(event) => {
                changeName(event.target.value);
              }}
              onKeyPress={handleKeypress}
              autoFocus
            />
            <MuiPickersUtilsProvider
              utils={DateFnsUtils}
              className={classes.form}>
              <DateTimePicker
                error={errors.start}
                helperText={errors.start ? 'Start date/time is required.' : ''}
                clearable
                className={classes.dateselect}
                label='Start Date/Time'
                inputVariant='outlined'
                value={startDateTime}
                onChange={changeStartDateTime}
                onKeyPress={handleKeypress}
              />
            </MuiPickersUtilsProvider>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <DateTimePicker
                error={errors.end || errors.precede}
                helperText={errors.precede ?
                  'End date/time must follow Start date/time.' : errors.end ?
                  'End date/time is required.' : ''}
                clearable
                className={classes.dateselect}
                label='End Date/Time'
                inputVariant='outlined'
                value={endDateTime}
                onChange={changeEndDateTime}
                onKeyPress={handleKeypress}
              />
            </MuiPickersUtilsProvider>
            <FormControlLabel
              control={<Checkbox value='repeat' color='primary'
                onChange={(event) => {
                  changeRepeat(event.target.checked);
                }}/>}
              label='Repeat'
            />
            <FormControlLabel
              control={<Checkbox value='membersonly' color='primary'
                onChange={(event) => {
                  changeMembersOnly(event.target.checked);
                }}/>}
              label='Members Only'
            />
            <FormControlLabel
              control={<Checkbox value='18plus' color='primary'
                icon={<RadioButtonUncheckedIcon />}
                checkedIcon={<RadioButtonCheckedIcon />}
                checked={age===18}
                onChange={(event) => {
                  setAge(event.target.checked ? 18 : -1);
                }}/>}
              label='18+'
            />
            <FormControlLabel
              control={<Checkbox value='21plus' color='primary'
                icon={<RadioButtonUncheckedIcon />}
                checkedIcon={<RadioButtonCheckedIcon />}
                checked={age===21}
                onChange={(event) => {
                  setAge(event.target.checked ? 21 : -1);
                }}/>}
              label='21+'
            />
            {repeat && <FormControl required
              error={errors.repeat || errors.repeatDays}
              component='fieldset'>
              <FormGroup row>
                <FormControlLabel
                  control={<Checkbox icon={<RadioButtonUncheckedIcon />}
                    checkedIcon={<RadioButtonCheckedIcon />}
                    value='monday'
                    color='primary'
                    onChange={(event) => {
                      changeRepeatDays({...repeatDays,
                        ['sunday']: event.target.checked});
                    }}/>}
                  label='S'
                />
                <FormControlLabel
                  control={<Checkbox icon={<RadioButtonUncheckedIcon />}
                    checkedIcon={<RadioButtonCheckedIcon />}
                    value='tuesday'
                    color='primary'
                    onChange={(event) => {
                      changeRepeatDays({...repeatDays,
                        ['monday']: event.target.checked});
                    }}/>}
                  label='M'
                />
                <FormControlLabel
                  control={<Checkbox icon={<RadioButtonUncheckedIcon />}
                    checkedIcon={<RadioButtonCheckedIcon />}
                    value='wednesday'
                    color='primary'
                    onChange={(event) => {
                      changeRepeatDays({...repeatDays,
                        ['tuesday']: event.target.checked});
                    }}/>}
                  label='T'
                />
                <FormControlLabel
                  control={<Checkbox icon={<RadioButtonUncheckedIcon />}
                    checkedIcon={<RadioButtonCheckedIcon />}
                    value='thursday'
                    color='primary'
                    onChange={(event) => {
                      changeRepeatDays({...repeatDays,
                        ['wednesday']: event.target.checked});
                    }}/>}
                  label='W'
                />
                <FormControlLabel
                  control={<Checkbox icon={<RadioButtonUncheckedIcon />}
                    checkedIcon={<RadioButtonCheckedIcon />}
                    value='friday'
                    color='primary'
                    onChange={(event) => {
                      changeRepeatDays({...repeatDays,
                        ['thursday']: event.target.checked});
                    }}/>}
                  label='T'
                />
                <FormControlLabel
                  control={<Checkbox icon={<RadioButtonUncheckedIcon />}
                    checkedIcon={<RadioButtonCheckedIcon />}
                    value='saturday'
                    color='primary'
                    onChange={(event) => {
                      changeRepeatDays({...repeatDays,
                        ['friday']: event.target.checked});
                    }}/>}
                  label='F'
                />
                <FormControlLabel
                  control={<Checkbox icon={<RadioButtonUncheckedIcon />}
                    checkedIcon={<RadioButtonCheckedIcon />}
                    value='sunday'
                    color='primary'
                    onChange={(event) => {
                      changeRepeatDays({...repeatDays,
                        ['saturday']: event.target.checked});
                    }}/>}
                  label='S'
                />
              </FormGroup>
              {errors.repeat &&
                <FormHelperText>
                  Selected days must include day of start date
                </FormHelperText>}
              {errors.repeatDays &&
                <FormHelperText>
                  Must select at least one day to repeat on
                </FormHelperText>}
            </FormControl>}
            {repeat && <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <DatePicker
                error={errors.repeatEnd || errors.repeatPrecede}
                helperText={errors.repeatPrecede ?
                  'Repeat end date must follow Start date/time.' :
                  errors.repeatEnd ? 'Repeat end date is required.' : ''}
                clearable
                className={classes.dateselect}
                label='Repeat End Date'
                inputVariant='outlined'
                value={repeatEnd}
                onChange={changeRepeatEnd}
                onKeyPress={handleKeypress}
              />
            </MuiPickersUtilsProvider>}
            <TextField
              error={errors.capacity}
              helperText={errors.capacity ?
                'Capacity is required and must be an integer.' : ''}
              variant='outlined'
              margin='normal'
              fullWidth
              id='capacity'
              label='Capacity'
              name='capacity'
              type='number'
              onChange={(event) => {
                changeCapacity(event.target.value);
              }}
              onKeyPress={handleKeypress}
            />
            <TextField
              error={errors.description}
              helperText={errors.description ?
                'Description must be less than 500 characters.' : ''}
              variant='outlined'
              margin='normal'
              fullWidth
              id='description'
              label='Description (max 500 chars)'
              name='description'
              multiline
              placeholder='Brief Description of Event'
              onChange={(event) => {
                changeDescription(event.target.value);
              }}
              onKeyPress={handleKeypress}
            />
            <Button
              type='submit'
              fullWidth
              variant='contained'
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
