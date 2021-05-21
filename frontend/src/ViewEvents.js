// import React from 'react';
// import {makeStyles} from '@material-ui/core/styles';
// import Carousel from 'react-elastic-carousel';
// import Box from '@material-ui/core/Box';
// import EventCard from './Components/Events/EventCard';
// import {Grid} from '@material-ui/core';
// import Typography from '@material-ui/core/Typography';
// import Button from '@material-ui/core/Button';
// import InputBase from '@material-ui/core/InputBase';
// import SearchIcon from '@material-ui/icons/Search';
// import IconButton from '@material-ui/core/IconButton';
// // import Drawer from '@material-ui/core/Drawer';
// import Paper from '@material-ui/core/Paper';

// import Context from './Context';
// const Auth = require('./libs/Auth');

// const useStyles = makeStyles((theme) => ({
//   root: {
//     minWidth: 275,
//   },
//   box: {
//     marginTop: -15,
//   },
//   bullet: {
//     display: 'inline-block',
//     margin: '0 2px',
//     transform: 'scale(0.8)',
//   },
//   title: {
//     fontSize: 14,
//   },
//   pos: {
//     marginTop: 8,
//   },
//   gridContainer: {
//     paddingLeft: '10px',
//     paddingRight: '10px',
//   },
//   pageBox: {
//     position: 'fixed',
//     left: '50vw',
//     bottom: 15,
//     transform: 'translate(-50%, -50%)',
//   },
//   searchBox: {
//     backgroundColor: theme.palette.primary.main,
//     paddingBottom: 50,
//     paddingTop: 50,
//   },
//   searchBar: {
//     backgroundColor: theme.palette.common.white,
//   },
//   searchRoot: {
//     padding: '2px 4px',
//     display: 'flex',
//     alignItems: 'center',
//     width: 400,
//     margin: 'auto',
//   },
//   input: {
//     marginLeft: theme.spacing(1),
//     backgroundColor: theme.palette.common.white,
//     flex: 1,
//   },
//   iconButton: {
//     padding: 10,
//     backgroundColor: theme.palette.common.white,
//   },
// }));

// /**
//  * ViewEvents component
//  * @return {object} ViewEvents JSX
//  */
// export default function ViewEvents() {
//   const classes = useStyles();
//   const [eventList, setEventList] = React.useState([]);
//   const [memberEvents, setMemberEvents] = React.useState([]);
//   const [memberBusinesses, setMemberBusinesses] = React.useState([]);
//   const [searchValue, setSearch] = React.useState('');
//   const [searchEventsList, setSearchEventsList] = React.useState([]);
//   // const [userInfo, setUserInfo] = React.useState([]);
//   const context = React.useContext(Context);

//   /**
//    * getUserInfo
//    * API call to get the info for the user
//    */
//   function getUserInfo() {
//     const apicall = 'http://localhost:3010/api/users/getUser';
//     fetch(apicall, {
//       method: 'GET',
//       headers: Auth.headerJsonJWT(),
//     }).then((response) => response.json())
//         .then((json) => {
//           // setUserInfo(json);
//           getMemberEvents(json.useremail);
//           getMemberBusinesses(json.useremail);
//         },
//         (error) => {
//           console.log(error);
//         },
//         );
//   };

//   /**
//    * getMemberBusinesses
//    * API call to get all businesses the user
//    * is a part of
//    * @param {string} email
//    */
//   function getMemberBusinesses(email) {
//     const apicall = 'http://localhost:3010/api/members/getMemberBusinesses/'+email;
//     fetch(apicall, {
//       method: 'GET',
//     }).then((response) => {
//       if (!response.ok) {
//         throw response;
//       } else {
//         return response.json();
//       }
//     }).then((json) => {
//       setMemberBusinesses(json);
//     })
//         .catch((error) => {
//           console.log(error);
//         });
//   };

//   /**
//    * getMemberEvents
//    * API call to get all events for businesses the user
//    * is a part of
//    * @param {string} email
//    */
//   function getMemberEvents(email) {
//     const apicall = 'http://localhost:3010/api/members/getRestrictedEvents/'+email;
//     fetch(apicall, {
//       method: 'GET',
//     }).then((response) => {
//       if (!response.ok) {
//         throw response;
//       } else {
//         return response.json();
//       }
//     }).then((json) => {
//       setMemberEvents(json.slice(0, 8));
//     })
//         .catch((error) => {
//           console.log(error);
//         });
//   };

//   /**
//    * getPublicEvents
//    * gets all public events
//    */
//   function getPublicEvents() {
//     const apicall = 'http://localhost:3010/api/events/publicEvents';
//     fetch(apicall, {
//       method: 'GET',
//       headers: Auth.headerJsonJWT(),
//     }).then((response) => {
//       if (!response.ok) {
//         if (response.status === 401) {
//           Auth.removeJWT();
//           context.setAuthState(false);
//           throw response;
//         }
//       }
//       return response.json();
//     }).then((json) => {
//       setEventList(json.slice(0, 8));
//     })
//         .catch((error) => {
//           console.log(error);
//         });
//   };

//   /**
//    * getBusinessEvents
//    * gets events for a business when in a business account
//    */
//   function getBusinessEvents() {
//     const apicall = 'http://localhost:3010/api/events';
//     fetch(apicall, {
//       method: 'GET',
//       headers: Auth.headerJsonJWT(),
//     }).then((response) => {
//       if (!response.ok) {
//         if (response.status === 401) {
//           Auth.removeJWT();
//           context.setAuthState(false);
//           throw response;
//         }
//       }
//       return response.json();
//     }).then((json) => {
//       setEventList(json.slice(0, 8));
//     })
//         .catch((error) => {
//           console.log(error);
//         });
//   };

//   React.useEffect(() => {
//     if (context.businessState === false) {
//       getPublicEvents();
//       getUserInfo();
//     } else {
//       getBusinessEvents();
//     }
//   }, []);

//   const breakPoints = [
//     {width: 1, itemsToShow: 1},
//     {width: 750, itemsToShow: 3},
//     {width: 1020, itemsToShow: 4},
//     {width: 1300, itemsToShow: 5},
//     {width: 1700, itemsToShow: 6},
//     {width: 2000, itemsToShow: 7},
//   ];

//   /**
//    * searchEvents
//    * takes input and searches events
//    * @param {object} event
//    */
//   const searchEvents = (event) => {
//     let apicall = 'http://localhost:3010/api/events';
//     if (searchValue !== '') {
//       apicall += '?search='+searchValue;
//     }
//     console.log(apicall);
//     fetch(apicall, {
//       method: 'GET',
//       headers: Auth.headerJsonJWT(),
//     }).then((response) => {
//       if (!response.ok) {
//         if (response.status === 401) {
//           Auth.removeJWT();
//           context.setAuthState(false);
//           throw response;
//         }
//       }
//       return response.json();
//     }).then((json) => {
//       setSearchEventsList(json);
//       setSearch('');
//     })
//         .catch((error) => {
//           console.log(error);
//         });
//   };
//   console.log(searchEventsList);

//   // only show if it is a user account
//   let showMemberEvents;
//   if (context.businessState === false) {
//     if (memberEvents.length === 0) {
//       showMemberEvents = (
//         <Grid item xs={8}>
//           <Box display="flex">
//             <Typography variant="h4" style={{float: 'left'}}>
//               Member Events
//             </Typography>
//           </Box>
//           <Box display="flex">
//             No restricted events available.
//           </Box>
//         </Grid>
//       );
//     } else {
//       showMemberEvents = (
//         <Grid item xs={8}>
//           <Box>
//             <Typography variant="h4" style={{float: 'left'}}>
//               Member Events
//             </Typography>
//             <Box pt={5}>
//               <Button size='small'
//                 variant='contained'
//                 color='secondary'
//                 href={'/allevents'}
//                 style={{float: 'right'}}>
//                 See All Events
//               </Button>
//             </Box>
//             <Box mt={5} mb={5} className={classes.box}>
//               <Carousel breakPoints={breakPoints}>
//                 {memberEvents.map((event) =>
//                   <EventCard key={event.eventid} context={context}
//                     row={event}/>,
//                 )}
//               </Carousel>
//             </Box>
//           </Box>
//         </Grid>
//       );
//     }
//   } else {
//     showMemberEvents = (
//       <div></div>
//     );
//   }

//   // only show if it is a user account
//   let showBusinesses;
//   if (context.businessState === false) {
//     if (memberBusinesses.length === 0) {
//       showBusinesses = (
//         <Grid item xs={4}>
//           <Box display="flex" alignItems="center" justifyContent="center">
//             <Typography variant="h4">
//               My Businesses
//             </Typography>
//           </Box>
//           <Box display="flex" border={3} alignItems="center"
//             justifyContent="center" mr={15} ml={15} mt={3}>
//             You are not a member of any businesses.
//           </Box>
//         </Grid>
//       );
//     } else {
//       showBusinesses = (
//         <Grid item xs={4}>
//           <Box display="flex" alignItems="center" justifyContent="center">
//             <Typography variant="h4">
//               My Businesses
//             </Typography>
//           </Box>
//           <Box display="flex" border={3} alignItems="center"
//             justifyContent="center" mr={15} ml={15} mt={3}>
//             <Grid item xs={4}>
//               {memberBusinesses.map((business) =>
//                 <Box key={business.businessid} alignItems="center"
//                   justifyContent="center" textAlign='center' mb={3}>
//                   <Typography
//                     variant="h5"
//                     align="center">
//                     {business.businessname}
//                   </Typography>
//                   <Button size='small'
//                     variant='contained'
//                     color='secondary'
//                     href={'/business/profile/' + business.businessid}
//                     style={{margin: 'auto'}}>
//                     See Profile
//                   </Button>
//                 </Box>,
//               )}
//             </Grid>
//           </Box>
//         </Grid>
//       );
//     }
//   } else {
//     showBusinesses = (
//       <div></div>
//     );
//   }

//   // console.log(searchValue);

//   return (
//     <React.Fragment>
//       <Box className={classes.searchBox}
//         justifyContent="center"
//         textAlign='center'>
//         <Paper component="form" className={classes.searchRoot}>
//           <InputBase
//             className={classes.input}
//             placeholder="Search Events..."
//             onChange={(event) => {
//               setSearch(event.target.value);
//             }}
//           />
//           <IconButton
//             className={classes.iconButton}
//             aria-label="search"
//             onClick={searchEvents}>
//             <SearchIcon />
//           </IconButton>
//         </Paper>
//       </Box>
//       <Box p={5} ml={context.businessState === false ? 15 : 0}>
//         <Grid container
//           spacing={0}>
//           {showMemberEvents}
//           {showBusinesses}
//           <Grid item xs={context.businessState === false ? 8 : 12}>
//             <Box mt={5}>
//               <Typography variant="h4" style={{float: 'left'}}>
//                 {context.businessState === false ?
//                 'All Events' : 'My Events'}
//               </Typography>
//               <Box pt={5}>
//                 <Button size='small'
//                   variant='contained'
//                   color='secondary'
//                   href={'/allevents'}
//                   style={{float: 'right'}}>
//                   See All Events
//                 </Button>
//               </Box>
//               <Box mt={5} mb={5}>
//                 {/* <Carousel breakPoints={breakPoints}>
//                   {eventList.map((event) =>
//                     <EventCard key={event.eventid} context={context}
//                       row={event}/>,
//                   )}
//                 </Carousel> */}
//                 <Grid className={classes.gridContainer}
//                    container spacing={3}>
//                   {eventList.map((event) =>
//                     <EventCard key={event.eventid} context={context}
//                       row={event}/>,
//                   )}
//                 </Grid>
//               </Box>
//             </Box>
//           </Grid>
//         </Grid>
//       </Box>
//     </React.Fragment>
//   );
// }

import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import SearchIcon from '@material-ui/icons/Search';
import IconButton from '@material-ui/core/IconButton';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import {Grid} from '@material-ui/core';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';

import NavBar from './Components/Nav/NavBar';
import EventCard from './Components/Events/EventCard';
import Context from './Context';
const Auth = require('./libs/Auth');

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerContainer: {
    overflow: 'auto',
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  allButFooter: {
    minHeight: 'calc(100vh - 50px)',
  },
  searchBar: {
    padding: '2px 4px',
    display: 'flex',
    alignItems: 'center',
    width: 400,
    margin: 'auto',
  },
  searchInput: {
    marginLeft: theme.spacing(1),
    backgroundColor: theme.palette.common.white,
    flex: 1,
  },
  searchIcon: {
    padding: 10,
    backgroundColor: theme.palette.common.white,
  },
  gridContainer: {
    paddingLeft: '100px',
    paddingRight: '10px',
    marginBottom: '20px',
  },
  eventHeader: {
    paddingLeft: '110px',
    paddingRight: '10px',
    marginBottom: '10px',
  },
  allEventsButton: {
    marginTop: '-40px',
    marginRight: '250px',
  },
}));

/**
 * ViewEvents
 * @return {object} ViewEvents JSX
 */
export default function ViewEvents() {
  const classes = useStyles();
  const context = React.useContext(Context);
  const [memberEvents, setMemberEvents] = React.useState([]);
  const [publicEvents, setPublicEvents] = React.useState([]);
  const [businessEvents, setBusinessEvents] = React.useState([]);
  const [memberBusinesses, setMemberBusinesses] = React.useState([]);
  const [searchValue, setSearch] = React.useState('');
  const [searchEventsList, setSearchEventsList] = React.useState([]);
  const [checkState, setCheckState] = React.useState({
    business: false,
    gym: false,
    club: false,
    party: false,
    conference: false,
    workshop: false,
    tutoring: false,
    members: false,
    eighteen: false,
    twentyone: false,
    public: false,
  });

  /**
   * getUserInfo
   * API call to get the info for the user
   */
  function getUserInfo() {
    const apicall = 'http://localhost:3010/api/users/getUser';
    fetch(apicall, {
      method: 'GET',
      headers: Auth.headerJsonJWT(),
    }).then((response) => response.json())
        .then((json) => {
          getMemberEvents(json.useremail);
          getMemberBusinesses(json.useremail);
        },
        (error) => {
          console.log(error);
        },
        );
  };

  /**
   * getMemberBusinesses
   * API call to get all businesses the user
   * is a part of
   * @param {string} email
   */
  function getMemberBusinesses(email) {
    const apicall = 'http://localhost:3010/api/members/getMemberBusinesses/'+email;
    fetch(apicall, {
      method: 'GET',
    }).then((response) => {
      if (!response.ok) {
        throw response;
      } else {
        return response.json();
      }
    }).then((json) => {
      setMemberBusinesses(json);
    })
        .catch((error) => {
          console.log(error);
        });
  };

  /**
   * getMemberEvents
   * API call to get all events for businesses the user
   * is a part of
   * @param {string} email
   */
  function getMemberEvents(email) {
    const apicall = 'http://localhost:3010/api/members/getRestrictedEvents/'+email;
    fetch(apicall, {
      method: 'GET',
    }).then((response) => {
      if (!response.ok) {
        throw response;
      } else {
        return response.json();
      }
    }).then((json) => {
      setMemberEvents(json.slice(0, 8));
    })
        .catch((error) => {
          console.log(error);
        });
  };

  /**
   * getPublicEvents
   * gets all public events
   */
  function getPublicEvents() {
    const apicall = 'http://localhost:3010/api/events/publicEvents';
    fetch(apicall, {
      method: 'GET',
      headers: Auth.headerJsonJWT(),
    }).then((response) => {
      if (!response.ok) {
        if (response.status === 401) {
          Auth.removeJWT();
          context.setAuthState(false);
          throw response;
        }
      }
      return response.json();
    }).then((json) => {
      setPublicEvents(json.slice(0, 8));
    })
        .catch((error) => {
          console.log(error);
        });
  };

  /**
   * getBusinessEvents
   * gets events for a business when in a business account
   */
  function getBusinessEvents() {
    const apicall = 'http://localhost:3010/api/events';
    fetch(apicall, {
      method: 'GET',
      headers: Auth.headerJsonJWT(),
    }).then((response) => {
      if (!response.ok) {
        if (response.status === 401) {
          Auth.removeJWT();
          context.setAuthState(false);
          throw response;
        }
      }
      return response.json();
    }).then((json) => {
      setBusinessEvents(json.slice(0, 8));
    })
        .catch((error) => {
          console.log(error);
        });
  };

  React.useEffect(() => {
    if (context.businessState === false) {
      getPublicEvents();
      getUserInfo();
    } else {
      getBusinessEvents();
    }
  }, []);

  /**
   * searchEvents
   * takes input and searches events
   * @param {object} event
   */
  const searchEvents = (event) => {
    let apicall = 'http://localhost:3010/api/events';
    if (searchValue !== '') {
      apicall += '?search='+searchValue;
    }
    console.log(apicall);
    fetch(apicall, {
      method: 'GET',
      headers: Auth.headerJsonJWT(),
    }).then((response) => {
      if (!response.ok) {
        if (response.status === 401) {
          Auth.removeJWT();
          context.setAuthState(false);
          throw response;
        }
      }
      return response.json();
    }).then((json) => {
      setSearchEventsList(json);
      setSearch('');
    })
        .catch((error) => {
          console.log(error);
        });
  };

  /**
   * handleChange
   * @param {*} event
   */
  const handleChange = (event) => {
    setCheckState({...checkState, [event.target.name]: event.target.checked});
  };

  console.log(memberEvents);
  console.log(publicEvents);
  console.log(searchEventsList);
  console.log(memberBusinesses);

  /* Show member events if user is part of any businesses */
  let showMemberEvents;
  if (context.businessState === false) {
    if (memberEvents.length === 0) {
      showMemberEvents = (
        <div></div>
      );
    } else {
      showMemberEvents = (
        <div>
          <Typography variant="h4" className={classes.eventHeader}>
            My Business Events
          </Typography>
          <Grid className={classes.gridContainer}
            container spacing={3}>
            {memberEvents.map((event) =>
              <EventCard key={event.eventid} context={context}
                row={event}/>,
            )}
          </Grid>
        </div>
      );
    }
  } else {
    showMemberEvents = (
      <div></div>
    );
  }

  /* Show public events if it is a user account */
  let showPublicEvents;
  if (context.businessState === false) {
    showPublicEvents = (
      <div>
        <Typography variant="h4" className={classes.eventHeader}>
          Public Events
        </Typography>
        <Grid className={classes.gridContainer}
          container spacing={3}>
          {publicEvents.map((event) =>
            <EventCard key={event.eventid} context={context}
              row={event}/>,
          )}
        </Grid>
      </div>
    );
  } else {
    showPublicEvents = (
      <div></div>
    );
  }

  /* Show business's events if it is a business account */
  let showBusinessEvents;
  if (context.businessState === true) {
    showBusinessEvents = (
      <div>
        <Typography variant="h4" className={classes.eventHeader}>
          My Events
        </Typography>
        <Grid className={classes.gridContainer}
          container spacing={3}>
          {businessEvents.map((event) =>
            <EventCard key={event.eventid} context={context}
              row={event}/>,
          )}
        </Grid>
      </div>
    );
  } else {
    showBusinessEvents = (
      <div></div>
    );
  }

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="fixed" className={classes.appBar}>
        <NavBar userType={context.businessState === false ?
          'user' : 'business'}>
        </NavBar>
      </AppBar>
      <Drawer
        className={classes.drawer}
        variant="permanent"
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <Toolbar />
        <div className={classes.drawerContainer}>
          <List>
            {['My Businesses'].map((text, index) => (
              <ListItem button key={text}>
                <ListItemText primary={text} />
              </ListItem>
            ))}
          </List>
          <Divider />
          <List>
            <ListItem>
              <ListItemText>
                <Typography variant="h5">
                  Filters
                </Typography>
              </ListItemText>
            </ListItem>

            <Box>
              <ListItem>
                <ListItemText primary='Businesses' />
              </ListItem>
              <ListItem>
                <FormGroup>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={checkState.business}
                        onChange={handleChange}
                        name="business"
                        color="secondary"
                      />
                    }
                    label="Business 1"
                  />
                </FormGroup>
              </ListItem>
              <Divider variant="middle" />
            </Box>

            <Box>
              <ListItem>
                <ListItemText primary='Event Type' />
              </ListItem>
              <ListItem>
                <FormGroup>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={checkState.gym}
                        onChange={handleChange}
                        name="gym"
                        color="secondary"
                      />
                    }
                    label="Gym"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={checkState.club}
                        onChange={handleChange}
                        name="club"
                        color="secondary"
                      />
                    }
                    label="Club"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={checkState.party}
                        onChange={handleChange}
                        name="party"
                        color="secondary"
                      />
                    }
                    label="Party"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={checkState.conference}
                        onChange={handleChange}
                        name="conference"
                        color="secondary"
                      />
                    }
                    label="Conference"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={checkState.workshop}
                        onChange={handleChange}
                        name="workshop"
                        color="secondary"
                      />
                    }
                    label="Workshop"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={checkState.tutoring}
                        onChange={handleChange}
                        name="tutoring"
                        color="secondary"
                      />
                    }
                    label="Tutoring"
                  />
                </FormGroup>
              </ListItem>
              <Divider variant="middle" />
            </Box>

            <Box>
              <ListItem>
                <ListItemText primary='Restrictions' />
              </ListItem>
              <ListItem>
                <FormGroup>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={checkState.members}
                        onChange={handleChange}
                        name="members"
                        color="secondary"
                      />
                    }
                    label="Members Only"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={checkState.public}
                        onChange={handleChange}
                        name="public"
                        color="secondary"
                      />
                    }
                    label="Public Events"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={checkState.eighteen}
                        onChange={handleChange}
                        name="eighteen"
                        color="secondary"
                      />
                    }
                    label="18+"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={checkState.twentyone}
                        onChange={handleChange}
                        name="twentyone"
                        color="secondary"
                      />
                    }
                    label="21+"
                  />
                </FormGroup>
              </ListItem>
            </Box>
            <Box textAlign='center'>
              <Button size='small'
                variant='contained'
                color='secondary'>
                Apply Filters
              </Button>
            </Box>

          </List>
        </div>
      </Drawer>

      <Grid container>
        <Box justifyContent="center" textAlign='center' width='100%' mt={5}>
          <Paper component="form" className={classes.searchBar}>
            <InputBase
              className={classes.searchInput}
              placeholder="Search Events..."
              onChange={(event) => {
                setSearch(event.target.value);
              }}
            />
            <IconButton
              className={classes.searchIcon}
              aria-label="search"
              onClick={searchEvents}>
              <SearchIcon />
            </IconButton>
          </Paper>
          <Button size='small'
            variant='contained'
            color='secondary'
            href={'/allevents'}
            style={{float: 'right'}}
            className={classes.allEventsButton}>
            See All Events
          </Button>
        </Box>
        <Box>
          <main className={classes.content}>
            {showMemberEvents}
            {showPublicEvents}
            {showBusinessEvents}
          </main>
        </Box>
      </Grid>
    </div>
  );
}
