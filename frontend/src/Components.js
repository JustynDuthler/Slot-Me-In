import React from 'react';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import PropTypes from 'prop-types';
import {makeStyles} from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import Avatar from '@material-ui/core/Avatar';
import Box from '@material-ui/core/Box';
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
      fontSize: '15px',
    },
    divider: {
      width: '100%',
      backgroundColor: theme.palette.primary.light,
    },
    avatar: {
      'margin': '0',
      'width': '100%',
      'height': '100%',
      '&:hover': {
        'border-style': 'dashed',
        'border-color': theme.palette.primary.dark,
      },
    },
    pfp: {
      '&:hover': {
        'backgroundColor': theme.palette.back.main,
        'color': theme.palette.primary.dark,
        'border-style': 'dashed',
      },
    },
  }));
  const classes = useStyles();
  const [image, setImage] = React.useState({preview: '', raw: ''});
  React.useEffect(async () => {
    // fetch('https://upload.wikimedia.org/wikipedia/'+
    //   'commons/7/77/Delete_key1.jpg')
    //     .then((res) => res.blob())
    //     .then((res) => {
    //       const url = URL.createObjectURL(res);
    //       cropImage(url, 1).then((canvas) => {
    //         setImage({
    //           preview: canvas.toDataURL('image/png'),
    //           raw: res,
    //         });
    //       });
    //     });
    fetch('http://localhost:3010/api/businesses/'+
      'getProfileImage', {
      method: 'GET',
      headers: Auth.headerJsonJWT(),
    }).then((data) => {
      console.log(data);
      return data.json();
    }).then((json) => {
      console.log(json);
      // setImage({
      //   preview: 'http://localhost:3010/static/businessProfileImages/'+
      //     json,
      //   raw: '',
      // });
      const url = 'http://localhost:3010/static/businessProfileImages/' + json;
      cropImage(url, 1).then((canvas) => {
        setImage({
          preview: canvas.toDataURL('image/png'),
          raw: '',
        });
      });
    });
  }, []);
  /**
   * changeImage function
   * @param {e} e
   * sets the current image to the one uploaded
   */
  const changeImage = (e) => {
    if (e.target.files.length) {
      const url = URL.createObjectURL(e.target.files[0]);
      // console.log(url);
      // console.log(e.target.files[0]);
      cropImage(url, 1).then((canvas) => {
        setImage({
          preview: canvas.toDataURL('image/png'),
          raw: e.target.files[0],
        });
        uploadProfileImage(e.target.files[0]);
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
      <Box width='90%' height='270px'>
        <label htmlFor="upload-button">
          {image.preview ? (
            <Box>
              <img src={image.preview} alt="dummy" width='100%' height='auto'
                style={{marginTop: '10px', cursor: 'copy'}}
                className={classes.pfp}
                ref={profileImage}/>
            </Box>
          ) : (
            <Box width='100%' height='100%'>
              <Avatar
                alt={'pfp'} width='auto'
                className={classes.avatar}
              />
            </Box>
          )}
        </label>
        <input
          type="file"
          id="upload-button"
          style={{display: 'none'}}
          onChange={changeImage}
        />
      </Box>
      <Typography className={classes.text}>{name}
      </Typography>
      <Divider className={classes.divider}/>
      <Typography className={classes.email}>{email}
      </Typography>
      <Divider className={classes.divider}/>
      <Box width='95%'>
        <Typography className={classes.description}>{description}
        </Typography>
      </Box>
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
      fontSize: '24px',
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
      <Box width='90px' alignItems='flex-end' justifyContent='flex-end'
        display="flex">
        <Typography className={classes.share}>Share</Typography>
      </Box>
      <Box className={classes.share} display='flex' justifyContent='center'
        width='170px'>
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
  businessid: PropTypes.string,
};
/**
 * BusinessInfo component
 * @return {object} BusinessInfo JSX
 */
export function BusinessInfo({picture: path, name: name, email: email,
  phonenumber: phonenumber, description: description, businessid: businessid,
  className: className, ...rest}) {
  const useStyles = makeStyles((theme) => ({
    avatar: {
      margin: '0 auto',
      fontSize: '6rem',
      width: '100%',
      height: '100%',
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
  const [image, setImage] = React.useState({preview: '', raw: ''});
  console.log(businessid);
  React.useEffect(async () => {
    // fetch('https://upload.wikimedia.org/wikipedia/'+
    //   'commons/7/77/Delete_key1.jpg')
    //     .then((res) => res.blob())
    //     .then((res) => {
    //       const url = URL.createObjectURL(res);
    //       cropImage(url, 1).then((canvas) => {
    //         setImage({
    //           preview: canvas.toDataURL('image/png'),
    //           raw: res,
    //         });
    //       });
    //     });
    if (!businessid || image.prevew) {
      return;
    };
    console.log('help', businessid);
    fetch('http://localhost:3010/api/'+'businesses/'+
      businessid+'/getProfileImage', {
      method: 'GET',
      headers: {'Content-Type': 'application/json'},
    }).then((data) => {
      console.log(data);
      return data.json();
    }).then((json) => {
      console.log(json);
      // setImage({
      //   preview: 'http://localhost:3010/static/businessProfileImages/'+
      //     json,
      //   raw: '',
      // });
      const url = 'http://localhost:3010/static/businessProfileImages/' + json;
      cropImage(url, 1).then((canvas) => {
        setImage({
          preview: canvas.toDataURL('image/png'),
          raw: '',
        });
      });
    });
  }, []);
  return (
    <Grid item className={classes.businessInfo} {...rest}>
      {image.preview ? (
        <img src={image.preview} alt="dummy" width='100%' height='auto'
          style={{marginTop: '10px'}}/>
      ) : (
        <Box width='100%' height='100%'>
          <img
            src={'http://localhost:3010/static/businessProfileImages/stockPhoto.png'}
            alt="dummy" width='100%' height='auto'
            style={{marginTop: '10px'}}/>
        </Box>
      )}
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
