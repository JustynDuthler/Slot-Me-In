import React from 'react';
import PropTypes from 'prop-types';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import makeStyles from '@material-ui/core/styles/makeStyles';

// import AccountCircleOutlinedIcon
//   from '@material-ui/icons/AccountCircleOutlined';
// import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import HomeIcon from '@material-ui/icons/Home';
import AccountBoxOutlinedIcon from '@material-ui/icons/AccountBoxOutlined';
import EventIcon from '@material-ui/icons/Event';
import AddIcon from '@material-ui/icons/Add';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import Context from '../../Context';
const Auth = require('../../libs/Auth');


const useStyles = makeStyles((theme) => ({
  leftMenu: {
    flexGrow: 1,
  },
}));

/**
 *
 * @param {*} params
 * @return {object} JSX
 */
const NavBar = ({userType}) => {
  const classes = useStyles();

  const context = React.useContext(Context);

  /**
   * logout()
   * Removes JWT and sets authState to null upon logout
   */
  const logout = () => {
    Auth.removeJWT();
    context.setAuthState(false);
  };

  const rightSide = (
    <ButtonGroup>
      <Button
        startIcon={<AccountBoxOutlinedIcon />}
        href="/profile"
        color="secondary"
        size="large"
        variant="contained"
      >
        Profile
      </Button>
      <Button
        startIcon={<ExitToAppIcon/>}
        color="secondary"
        size="large"
        variant="contained"
        onClick={logout}
      >
        Logout
      </Button>
    </ButtonGroup>
  );
    // rightSide = (
    //   <ButtonGroup
    //     anchororigin={{
    //       vertical: 'top',
    //       horizonal: 'right',
    //     }}
    //   >
    //     <Button
    //       startIcon={<AccountCircleOutlinedIcon />}
    //       href="/register"
    //       color="secondary"
    //       size="large"
    //       variant="contained"
    //     >
    //       Register Account
    //     </Button>
    //     <Button
    //       startIcon={<LockOutlinedIcon />}
    //       href="/Login"
    //       color="secondary"
    //       size="large"
    //       variant="contained"
    //     >
    //       Login
    //     </Button>
    //   </ButtonGroup>
    // );


  let leftSide;
  if (userType == 'business') {
    leftSide = (
      <Box className={classes.leftMenu}>
        <ButtonGroup>
          <Button
            startIcon={<HomeIcon/>}
            href="/"
            color="secondary"
            size="large"
            variant="contained"
          >
            Home
          </Button>
          <Button
            startIcon={<AddIcon/>}
            href="/events/create"
            color="secondary"
            size="large"
            variant="contained"
          >
            Create Event
          </Button>
          <Button
            startIcon={<EventIcon/>}
            href="/events"
            color="secondary"
            size="large"
            variant="contained"
          >
            Events
          </Button>
          <Button
            href="/authtest"
            color="secondary"
            size="large"
            variant="contained"
          >
            AuthTest
          </Button>
        </ButtonGroup>
      </Box>
    );
  } else {
    leftSide = (
      <Box className={classes.leftMenu}>
        <ButtonGroup>
          <Button
            startIcon={<HomeIcon/>}
            href="/"
            color="secondary"
            size="large"
            variant="contained"
          >
            Home
          </Button>
          <Button
            startIcon={<EventIcon/>}
            href="/events"
            color="secondary"
            size="large"
            variant="contained"
          >
            Events
          </Button>
          <Button
            href="/authtest"
            color="secondary"
            size="large"
            variant="contained"
          >
            AuthTest
          </Button>
        </ButtonGroup>
      </Box>
    );
  }

  return (
    <AppBar position="static">
      <Toolbar>
        {leftSide}
        {rightSide}
      </Toolbar>
    </AppBar>
  );
};

NavBar.propTypes = {
  userType: PropTypes.string,
};


export default NavBar;
