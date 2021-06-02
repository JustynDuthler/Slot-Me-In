import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';
import Link from '@material-ui/core/Link';

const useStyles = makeStyles((theme) => ({
  paper: {
    background: theme.palette.back.main,
    paddingTop: 10,
    paddingBottom: 10,
    height: 49,
    justifyContent: 'center',
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  link: {
    color: theme.palette.primary.main,
    fontSize: '1rem',
    fontWeight: '500',
    marginLeft: 20,
    marginRight: 20,
  },
  copyright: {
    color: theme.palette.primary.light,
    fontSize: '1rem',
    fontWeight: '500',
    marginLeft: 20,
    marginRight: 20,
  },
}));

/**
 * Footer
 * Component to display info at the bottom of every page
 * @return {object} Footer JSX
 */
export default function Footer() {
  const classes = useStyles();

  return (
    <Box className={classes.box}>
      <Divider />
      <Paper className={classes.paper} elevation={0}>
        <Link className={classes.link}
          color='primary' href='/about'>
          About
        </Link>
        <Link className={classes.link}
          color='primary' href='/contact'>
          Contact Us
        </Link>
        <Link className={classes.copyright} underline='none'>
          &copy; 2021 SlotMeIn
        </Link>
      </Paper>
    </Box>
  );
};
