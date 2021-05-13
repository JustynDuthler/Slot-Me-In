import React from 'react';
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types';
import {makeStyles} from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import {formatDate} from '../../libs/Util';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';


/**
 * EventCard
 * This function gets the individual event data
 * for each card and displays it. When the card
 * is clicked, it goes to URL /event/{eventid}.
 * @param {object} row - event info - required
 * @param {object} context - react context - required for accessing authstate
 * @param {object} isBusiness - is this card being viewed as a business, doesn't
 *  do anything yet
 * @return {object} JSX
 */
export default function EventCard({row: row, context: context,
  isBusiness: isBusiness, ...rest}) {
  const useStyles = makeStyles((theme) => ({
    pos: {
      marginTop: 8,
    },
  }));
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
              'primary' : 'textPrimary'}>
          {row.capacity - row.attendees} of {row.capacity} spots open
        </Typography>
      </CardContent>
      <CardActions>
        <Button size='small'
          variant='contained'
          color='secondary'
          href={context.businessState === false ?
            '/event/' + row.eventid : '/profile/'}
          style={{margin: 'auto'}}>
          {context.businessState === false ?
            'View Event' : 'View Event in Profile'}
        </Button>
      </CardActions>
    </Card>
  );
};

EventCard.propTypes = {
  row: PropTypes.object,
  context: PropTypes.object,
  isBusiness: PropTypes.bool,
};
