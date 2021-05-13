import React from 'react';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import PropTypes from 'prop-types';
import {makeStyles} from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import Avatar from '@material-ui/core/Avatar';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import {cropImage} from './libs/Util.js';
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

BusinessInfo.propTypes = {
  picture: PropTypes.string,
  name: PropTypes.string,
  email: PropTypes.string,
  description: PropTypes.string,
  phonenumber: PropTypes.string,
  className: PropTypes.string,
};
/**
 * BusinessInfo component
 * @return {object} BusinessInfo JSX
 */
export function BusinessInfo({picture: path, name: name, email: email,
  phonenumber: phonenumber, description: description,
  className: className, ...rest}) {
  const useStyles = makeStyles((theme) => ({
    avatar: {
      margin: '0 auto',
      fontSize: '6rem',
      width: theme.spacing(16),
      height: theme.spacing(16),
      [theme.breakpoints.up('md')]: {
        fontSize: '10rem',
        width: theme.spacing(25),
        height: theme.spacing(25),
      },
    },
    businessName: {
      marginTop: theme.spacing(3),
      [theme.breakpoints.down('sm')]: {
        fontSize: '2rem',
      },
    },
    businessDescription: {
      [theme.breakpoints.down('sm')]: {
        maxWidth: 125,
      },
      marginTop: theme.spacing(3),
      marginLeft: 20,
      marginRight: 20,
    },
  }));
  const classes = useStyles();
  return (
    <Grid item className={classes.businessInfo} {...rest}>
      <Avatar className={classes.avatar}
        alt={name}
        src={'./picture'}
      />
      <Typography className={classes.businessName}
        variant='h3' align='center'>
        {name}
      </Typography>
      <Typography variant='body1' align='center'>
        {email}
      </Typography>
      <Typography variant='body1' align='center'>
        {phonenumber}
      </Typography>
      <Typography className={classes.businessDescription}
        variant='body1' align='center'>
        {description}
      </Typography>
    </Grid>
  );
};
