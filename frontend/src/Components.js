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
import IconButton from '@material-ui/core/IconButton';
const Auth = require('./libs/Auth');

/**
 * UserInfo component
 * @return {object} UserInfo JSX
 */
export default function UserInfo({picture: path, name: name, email: email,
  description: description, className: className, ...rest}) {
  const profileImage = React.createRef();
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
  React.useEffect(async () => {
    fetch('http://localhost:3010/api/businesses/getProfileImage', {
      method: 'GET',
      headers: Auth.headerJsonJWT(),
    }).then((data) => {
      data.arrayBuffer().then(function(buffer) {
        console.log(buffer);
        const url = URL.createObjectURL(new Blob([buffer],
            {type: 'image/png'}));
        console.log(url);
        cropImage(url, 1).then((canvas) => {
          setImage({
            preview: canvas.toDataURL('image/png'),
            raw: buffer,
          });
        });
      });
    },
    (error) => {
      console.log(error);
    },
    );
  }, []);
  /**
   * changeImage function
   * @param {e} e
   * sets the current image to the one uploaded
   */
  const changeImage = (e) => {
    if (e.target.files.length) {
      const url = URL.createObjectURL(e.target.files[0]);
      console.log(url);
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
   * @param {image} image
   * @return {nothing} nothing
   */
  function uploadProfileImage(image) {
    const formData = new FormData();
    formData.append('file', image);
    return fetch('http://localhost:3010/api/businesses/'+
      'uploadProfileImage', {
      method: 'POST',
      headers: Auth.headerFormDataJWT(),
      body: formData,
    }).then((result) => {
      console.log(result);
    }).then((error) => {
      console.log(error);
    });
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
            <img src={image.preview} alt="dummy" width='100%' height='auto'
              ref={profileImage}/>
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
            uploadProfileImage(image.raw);
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
        {/* This won't work unless we put the webapp on an actual website and
        not localhost */}
        <FacebookShareButton url={'http://google.com'}
          className={classes.shareIcon}/>
        <TwitterShareButton url="localhost:3000/home"
          msg="Join us on SlotMeIn to sign up for our events:"/>
      </Box>
    </Grid>
  );
}
TwitterShareButton.propTypes = {
  msg: PropTypes.string,
  url: PropTypes.string,
};
/**
 * TwitterShareButton component
 * @param {string} msg displayed along with URL in tweet
 * @param {string} url actual URL to be tweeted
 * @return {object} TwitterShareButton JSX
 */
export function TwitterShareButton({msg: msg, url: url, ...rest}) {
  const useStyles = makeStyles((theme) => ({
    shareIcon: {
      color: theme.palette.secondary.main,
      width: 50,
      height: 50,
    },
  }));
  const classes = useStyles();
  const encodedmsg = 'https://twitter.com/intent/tweet?text='+
    encodeURIComponent(msg)+'&url='+encodeURIComponent(url);
  return (
    <IconButton {...rest}>
      <a href={encodedmsg} target="_blank" rel="noreferrer"
        data-show-count="false">
        <TwitterIcon className={classes.shareIcon}/>
      </a>
      <script async src="https://platform.twitter.com/widgets.js"
        charSet="utf-8">
      </script>
    </IconButton>
  );
}
FacebookShareButton.propTypes = {
  msg: PropTypes.string,
  url: PropTypes.string,
};
/**
 * FacebookShareButton component
 * @param {string} msg displayed along with URL in tweet
 * @param {string} url actual URL to be tweeted
 * @return {object} FacebookShareButton JSX
 */
export function FacebookShareButton({msg: msg, url: url, ...rest}) {
  const useStyles = makeStyles((theme) => ({
    shareIcon: {
      color: theme.palette.secondary.main,
      width: 50,
      height: 50,
    },
  }));
  const classes = useStyles();
  const encodedmsg = 'https://www.facebook.com/sharer/sharer.php?u='+
    encodeURIComponent(url)+'%2F&amp;src=sdkpreparse';
  // const encodedmsg = 'https://www.facebook.com/sharer/sharer.php?s=500&'+
  // 'p[title]=SlotMeIn&p[summary]=JoinusonSlotMeInto&p[url]='+
  //   eurl;
  return (
    <IconButton>
      <div className="fb-share-button"
        data-layout="button" data-size="large">
        <a href={encodedmsg} target="_blank" rel="noreferrer"
          title="send to Facebook"
          className="fb-xfbml-parse-ignore">
          <FacebookIcon className={classes.shareIcon}/></a></div>
    </IconButton>
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
