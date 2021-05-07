import React from 'react';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import PropTypes from 'prop-types';
import Paper from '@material-ui/core/Paper';
import {makeStyles} from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';

/**
 * UserInfo component
 * @return {object} UserInfo JSX
 */
export default function UserInfo({picture: path, name: name, email: email,
  description: description, className: className, ...rest}) {
  const useStyles = makeStyles((theme) => ({
    paper: {
      padding: theme.spacing(2),
      paddingTop: theme.spacing(8),
      paddingBottom: theme.spacing(8),
      flexDirection: 'column',
      textAlign: 'center',
      width: '100%',
    },
    grid: {
      backgroundColor: theme.palette.back.main,
      border: `1px solid ${theme.palette.primary.light}`,
    },
    text: {
      paddingTop: theme.spacing(2),
      paddingBottom: theme.spacing(1),
      fontSize: '24px',
    },
    email: {
      paddingTop: theme.spacing(1),
      paddingBottom: theme.spacing(1),
      fontSize: '14px',
    },
    description: {
      paddingTop: theme.spacing(2),
      backgroundColor: theme.palette.back.main,
      borderRadius: '2px',
      textAlign: 'center',
    },
    divider: {
      width: '100%',
      backgroundColor: theme.palette.primary.light,
    },
  }));
  const classes = useStyles();
  return (
    <Grid item container direction="column"
      justify="flex-start"
      alignItems="center"
      className={classes.grid}
      {...rest}>
      <Paper className={classes.paper}>path</Paper>
      <Typography className={classes.text}>{name}
      </Typography>
      <Divider className={classes.divider}/>
      <Typography className={classes.email}>{email}
      </Typography>
      <Divider className={classes.divider}/>
      <Typography className={classes.description}>{description}
      </Typography>
    </Grid>
  );
}
UserInfo.propTypes = {
  picture: PropTypes.string,
  name: PropTypes.string,
  email: PropTypes.string,
  description: PropTypes.string,
  className: PropTypes.string,
};
/**
 * EventInfo component
 * @return {object} EventInfo JSX
 */
export function EventInfo() {
  return (
    <Grid item container md={2}>
      <Typography>2</Typography>
    </Grid>
  );
}
/**
 * ShareBar component
 * @return {object} ShareBar JSX
 */
export function ShareBar({...rest}) {
  const useStyles = makeStyles((theme) => ({
    grid: {
      backgroundColor: theme.palette.back.main,
      border: `1px solid ${theme.palette.primary.light}`,
    },
  }));
  const classes = useStyles();
  return (
    <Grid item container md={9} className={classes.grid}>
    </Grid>
  );
}
