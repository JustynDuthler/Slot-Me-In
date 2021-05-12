import React from 'react';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import PropTypes from 'prop-types';
import {makeStyles} from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import Avatar from '@material-ui/core/Avatar';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import {cropImage, formatDate} from './libs/Util.js';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import FacebookIcon from '@material-ui/icons/Facebook';
import TwitterIcon from '@material-ui/icons/Twitter';
import InstagramIcon from '@material-ui/icons/Instagram';
import IconButton from '@material-ui/core/IconButton';

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
    avatar: {
      margin: '0 auto',
      width: '100%',
      height: '300px',
    },
  }));
  const classes = useStyles();
  const [image, setImage] = React.useState({preview: '', raw: ''});
  /**
   * changeImage function
   * @param {e} e
   * sets the current image to the one uploaded
   */
  const changeImage = (e) => {
    if (e.target.files.length) {
      const url = URL.createObjectURL(e.target.files[0]);
      console.log(e.target.files[0]);
      cropImage(url, 1).then((canvas) => {
        setImage({
          preview: canvas.toDataURL('image/png'),
          raw: e.target.files[0],
        });
      });
    }
  };
  /**
   * uploadProfileImage function
   * uploads the profile image
   */
  function uploadProfileImage() {
    // Does nothing yet
  }
  return (
    <Grid item container direction="column"
      justify="flex-start"
      alignItems="center"
      className={classes.grid}
      {...rest}>
      <Box width='100%' height='300px'>
        <label htmlFor="upload-button" width='100%'>
          {image.preview ? (
            <img src={image.preview} alt="dummy" width='100%' height='auto' />
          ) : (
            <>
              <Avatar
                alt={'pfp'}
                className={classes.avatar}
              />
            </>
          )}
        </label>
        <input
          type="file"
          id="upload-button"
          style={{display: 'none'}}
          onChange={changeImage}
        />
      </Box>
      <Box>
        <Button
          style={{fontSize: '12px'}}
          variant='outlined'
          onClick={()=>{
            uploadProfileImage();
          }}>Upload
        </Button>
      </Box>
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
 * ShareBar component
 * @return {object} ShareBar JSX
 */
export function ShareBar({...rest}) {
  const useStyles = makeStyles((theme) => ({
    grid: {
      backgroundColor: theme.palette.primary.main,
    },
    gridbordered: {
      backgroundColor: theme.palette.back.main,
      border: `1px solid ${theme.palette.primary.light}`,
    },
    shareIcon: {
      color: theme.palette.secondary.main,
      width: 50,
      height: 50,
    },
    share: {
      fontSize: '20px',
      color: theme.palette.secondary.main,
    },
  }));
  const classes = useStyles();
  return (
    <Grid item container className={classes.grid}
      justify="flex-start"
      alignItems="center"
      direction="row"
      {...rest}>
      <Grid item container md={3} className={classes.grid}
        justify="center">
        <Typography className={classes.share}>Share</Typography>
      </Grid>
      <Box className={classes.share}>
        <IconButton>
          <FacebookIcon className={classes.shareIcon}/>
        </IconButton>
        <IconButton>
          <TwitterIcon className={classes.shareIcon}/>
        </IconButton>
        <IconButton>
          <InstagramIcon className={classes.shareIcon}/>
        </IconButton>
      </Box>
    </Grid>
  );
}
EventCard.propTypes = {
  row: PropTypes.object,
  context: PropTypes.object,
  isBusiness: PropTypes.bool,
};
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
export function EventCard({row: row, context: context, isBusiness: isBusiness,
  ...rest}) {
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
