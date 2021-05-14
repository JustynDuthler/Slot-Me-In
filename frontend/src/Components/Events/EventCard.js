import React from 'react';
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types';
import {makeStyles} from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import {formatDate} from '../../libs/Util';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';


const useStyles = makeStyles((theme) => ({
  pos: {
    marginTop: 8,
  },
}));

/**
 * Creates the button for the event card
 * @param {string} buttonType
 * @param {object} context
 * @return {object} JSX
 */
const CardButton = ({buttonType, context, row}) => {
  if (buttonType === 'view') {
    return (
      <Button size='small'
        variant='contained'
        color='secondary'
        href={context.businessState === false ?
          '/event/' + row.eventid : '/profile/'}
        style={{margin: 'auto'}}>
        {context.businessState === false ?
          'View Event' : 'View Event in Profile'}
      </Button>
    );
  } else if (buttonType === 'login') {
    return (
      <Button
        size='small'
        variant='contained'
        color='secondary'
        href='/login'
        style={{margin: 'auto'}}
      >
        Login to View Event
      </Button>
    );
  } else {
    return null;
  }
};
CardButton.propTypes= {
  buttonType: PropTypes.string,
  context: PropTypes.object,
};

/**
 * EventCard
 * This function gets the individual event data
 * for each card and displays it. Each EventCard creates a CardButton
 * which either has a link to the individual event or a link to the login.
 * @param {object} row - event info - required
 * @param {object} context - react context - required for accessing authstate
 * @param {object} isBusiness - is this card being viewed as a business, doesn't
 *  do anything yet
 * @return {object} JSX
 */
export default function EventCard({row, context, isBusiness, buttonType='view',
  ...rest}) {
  const classes = useStyles();
  return (
    <Card key={row.eventid} {...rest}>
      <CardContent>
        <Typography variant='h5' component='h2' align='center'>
          {row.eventname}
        </Typography>
        <Typography className={classes.pos}
          color='textSecondary' variant='body2' align='center'>
          {formatDate(row.starttime, row.endtime)}
        </Typography>
        <Typography className={classes.pos}
          variant='subtitle1' align='center'
          color={row.attendees === row.capacity ?
              'error' : 'textPrimary'}>
          {row.capacity - row.attendees} of {row.capacity} spots open
        </Typography>
      </CardContent>
      <CardActions>
        <CardButton
          context={context}
          buttonType={buttonType}
          row={row}
        />
      </CardActions>
    </Card>
  );
};

EventCard.propTypes = {
  row: PropTypes.object,
  context: PropTypes.object,
  isBusiness: PropTypes.bool,
  buttonType: PropTypes.string,
};
