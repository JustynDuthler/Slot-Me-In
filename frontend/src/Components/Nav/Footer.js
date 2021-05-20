import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme) => ({
  paper: {
    background: theme.palette.back.main,
    paddingTop: 10,
    paddingBottom: 10,
    height: 49,
    justifyContent: 'center',
    display: 'flex',
    flexDirection: 'row',
  },
  item: {
    paddingLeft: 20,
    paddingRight: 20,
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
        <Typography className={classes.item}>
          About
        </Typography>
        <Typography className={classes.item}>
          Contact Us
        </Typography>
        <Typography className={classes.item}>
          &copy; 2021 SlotMeIn
        </Typography>
      </Paper>
    </Box>
  );
};
