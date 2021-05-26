import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme) => ({
  box: {
    marginTop: 15,
    marginLeft: '20vw',
    marginRight: '20vw',
    [theme.breakpoints.down('sm')]: {
      marginLeft: 10,
      marginRight: 10,
    },
  },
  heading: {
    marginBottom: 50,
    fontWeight: 'bold',
  },
  subheading: {
    marginBottom: 10,
    fontWeight: 'bold',
  },
  bodyText: {
    fontSize: '1.4rem',
    fontWeight: 0,
    marginBottom: 20,
  },
  iconAttribution: {
    fontSize: '0.6rem',
    position: 'relative',
    bottom: 10,
  },
  link: {
    textDecoration: 'none',
  },
}));

/**
 * About page
 * @return {object} About JSX
 */
export default function About() {
  const classes = useStyles();

  return (
    <Box className={classes.box}>
      <Typography variant='h2' align='center' className={classes.heading}>
        About SlotMeIn
      </Typography>

      <Typography variant='h4' align='left' className={classes.subheading}>
        What is SlotMeIn?
      </Typography>
      <Typography variant='body2' align='left' className={classes.bodyText}>
        SlotMeIn makes it easy for users to view and sign up for events from
        businesses and organizations.
      </Typography>

      <Typography variant='h4' align='left' className={classes.subheading}>
        How does SlotMeIn work?
      </Typography>
      <Typography variant='body2' align='left' className={classes.bodyText}>
        SlotMeIn allows businesses to easily create events, with the ability to
        specify capacity and age restrictions.
        Businesses that require memberships, such as a gym, can add a
        list of their members by email.
        When creating events, businesses can specify if the event should be
        restricted to members only, or open to everyone.
        <br/>
        <br/>
        Users that create a SlotMeIn account can immediately see events from
        businesses that have already added them as a member, in addition to
        all public events. Users can see all of the events they have signed
        up for on an easy to use calendar view.
      </Typography>
      <br/>
      <Box className={classes.iconAttribution}>
        Favicon derived from icon by
        &nbsp;<a href="https://www.freepik.com" title="Freepik"
          className={classes.link}>Freepik</a> from
        &nbsp;<a href="https://www.flaticon.com/" title="Flaticon"
          className={classes.link}>www.flaticon.com</a>
      </Box>
    </Box>
  );
};
