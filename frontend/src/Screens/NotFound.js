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
    fontSize: '25rem',
    [theme.breakpoints.down('sm')]: {
      fontSize: '10rem',
    },

    marginBottom: 50,
    fontWeight: 'bold',
  },
  subheading: {
    fontSize: '5rem',
    [theme.breakpoints.down('sm')]: {
      fontSize: '2rem',
    },
    marginBottom: 10,
  },
}));

/**
 * Not Found page
 * @return {object} 404 Not Found JSX
 */
export default function NotFound() {
  const classes = useStyles();

  return (
    <Box className={classes.box}>
      <Typography variant='h1' align='center' className={classes.heading}>
        404
      </Typography>
      <Typography variant='h2' align='center' className={classes.subheading}>
        Page Not Found
      </Typography>
    </Box>
  );
};
