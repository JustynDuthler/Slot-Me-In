import React, {useEffect, useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
// import {useHistory, useLocation} from 'react-router-dom';
import {Grid} from '@material-ui/core';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import {BusinessInfo} from '../Components';
import EventCard from '../Components/Events/EventCard';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Context from '../Context';
import Hidden from '@material-ui/core/Hidden';
const Auth = require('../libs/Auth');

const useStyles = makeStyles((theme) => ({
  root: {
    marginLeft: 15,
    marginRight: 15,
  },
  grid: {
    marginTop: 10,
    marginBottom: 10,
    justifyContent: 'center',
  },
  dialogText: {
    marginLeft: 15,
    marginRight: 15,
  },
  smallAvatar: {
    width: '4px',
    [theme.breakpoints.down('sm')]: {
      width: '20px',
    },
  },
  businessName: {
    [theme.breakpoints.down('sm')]: {
      fontSize: '1rem',
    },
  },
  title: {
    [theme.breakpoints.down('sm')]: {
      fontSize: '2.5rem',
    },
  },
  dateIcon: {
    color: theme.palette.secondary.dark,
    width: '40px',
    height: '40px',
  },
  locationIcon: {
    color: theme.palette.primary.dark,
    width: '40px',
    height: '40px',
  },
  date: {
    color: theme.palette.secondary.dark,
    [theme.breakpoints.down('sm')]: {
      fontSize: '1rem',
    },
  },
  location: {
    color: theme.palette.primary.dark,
    [theme.breakpoints.down('sm')]: {
      fontSize: '1rem',
    },
  },
  description: {
    marginTop: theme.spacing(3),
    marginLeft: 10,
  },
  capacity: {
    marginTop: theme.spacing(3),
    marginLeft: 10,
  },
  signupButton: {
    marginTop: 15,
    marginLeft: 10,
  },
  share: {
    marginTop: theme.spacing(3),
  },
  shareIcon: {
    color: theme.palette.secondary.main,
    width: 50,
    height: 50,
  },
  card: {
    marginTop: theme.spacing(2),
    margin: '0 auto',
    [theme.breakpoints.up('lg')]: {
      width: 275,
    },
    [theme.breakpoints.down('md')]: {
      width: 225,
    },
    [theme.breakpoints.down('sm')]: {
      width: 250,
      marginLeft: 5,
      marginRight: 5,
    },
  },
}));

/**
 * PublicBusinessProfile component
 * @param {*} props
 * @return {object} JSX
 */
const PublicBusinessProfile = (props) => {
  const classes = useStyles();
  const context = React.useContext(Context);
  // const history = useHistory();
  // const location = useLocation();
  const businessid = props.businessid;
  const [businessData, setBusinessData] = useState({});
  // const [signupError, setSignupError] = useState(false);
  const [eventList, setEventList] = React.useState([]);

  useEffect(() => {
    getBusinessData(businessid);
    getBusinessEvents(businessid);
  }, []);

  /**
   * getBusinessEvents
   * API call to get events
   * @param {string} businessid ID of business that created this event
   */
  function getBusinessEvents(businessid) {
    const apicall = 'http://localhost:3010/api/businesses/' +
        businessid + '/events';
    fetch(apicall, {
      method: 'GET',
      headers: Auth.headerJsonJWT(),
    }).then((response) => {
      if (!response.ok) {
        throw response;
      }
      return response.json();
    }).then((json) => {
      console.log(json);
      setEventList(json.slice(0, 10));
    })
        .catch((error) => {
          console.log(error);
        });
  };

  /**
   * getBusinessData
   * API call to get info for a business
   * @param {string} businessid
   */
  function getBusinessData(businessid) {
    const apicall = 'http://localhost:3010/api/businesses/'+businessid;
    fetch(apicall, {
      method: 'GET',
    })
        .then((response) => {
          if (!response.ok) {
            throw response;
          } else {
            return response.json();
          }
        })
        .then((json) => {
          setBusinessData(json);
        })
        .catch((error) => {
          console.log(error);
        });
  };

  return (
    <div style={{overflow: 'hidden'}}>
      <Grid container spacing={6} className={classes.grid}>
        <Hidden xsDown>
          <Grid item md={3}>
            <BusinessInfo
              picture='picture'
              name={businessData.businessname}
              email={businessData.email}
              phonenumber={businessData.phonenumber}
              description={businessData.description}
            />
          </Grid>
        </Hidden>

        <Grid item xs={false} md={6}
          style={{height: '800px', overflow: 'auto'}}>
          <Typography variant='h5' align='center'>
            {businessData.businessname} Events
          </Typography>
          <Grid container direction='row'
            className={classes.grid}>
            {eventList.length > 0 ?
              eventList.map((event) =>
                <EventCard
                  className={classes.card}
                  row={event} context={context} key={event.eventid} />,
              ) :
              <Card className={classes.card}>
                <CardContent>
                  <Typography variant='h6' component='h2' align='center'>
                    No Other Events Available
                  </Typography>
                </CardContent>
              </Card>
            }
          </Grid>
        </Grid>
      </Grid>
    </div>

  );
};

PublicBusinessProfile.propTypes = {
  businessid: PropTypes.string,
};

export default PublicBusinessProfile;
