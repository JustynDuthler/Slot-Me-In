import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import EmailIcon from '@material-ui/icons/Email';
import GitHubIcon from '@material-ui/icons/GitHub';

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
  link: {
    color: theme.palette.primary.main,
  },
  icon: {
    marginRight: 10,
  },
}));

/**
 * Contact page
 * @return {object} Contact JSX
 */
export default function Contact() {
  const classes = useStyles();

  return (
    <Box className={classes.box}>
      <Typography variant='h2' align='center' className={classes.heading}>
        Contact Us
      </Typography>

      <Typography variant='body2' align='left' className={classes.bodyText}>
        Feel free to contact us to ask a question,
        report a bug, or request a feature!
      </Typography>

      <Typography variant='h4' align='left' className={classes.subheading}>
        <EmailIcon className={classes.icon}/>
        Email
      </Typography>
      <Typography variant='body2' align='left' className={classes.bodyText}>
        <Link href='mailto:contact@slot-me-in.com' className={classes.link}>
          contact@slot-me-in.com
        </Link>
      </Typography>

      <Typography variant='h4' align='left' className={classes.subheading}>
        <GitHubIcon className={classes.icon} />
        GitHub
      </Typography>
      <Typography variant='body2' align='left' className={classes.bodyText}>
        <Link href='https://github.com/JustynDuthler/CSE-115a' className={classes.link}>
          github.com/JustynDuthler/CSE-115a
        </Link>
      </Typography>
    </Box>
  );
};
