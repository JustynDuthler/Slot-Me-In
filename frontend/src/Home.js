import React from 'react';
import Button from '@material-ui/core/Button';
import AccountIcon from '@material-ui/icons/AccountCircle';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import {ButtonGroup} from '@material-ui/core';

/**
 *
 * @return {object} JSX
 */
export default function Home() {
  const body = {
    textAlign: 'center',
  };

  return (
    <div style={body}>
      <h1>SlotMeIn</h1>
      <ButtonGroup>
        <Button
          startIcon={<AccountIcon />}
          href="/register"
          color="primary"
          size="large"
          variant="contained">
          Sign Up
        </Button>

        <Button
          startIcon={<LockOutlinedIcon />}
          href="/Login"
          color="primary"
          size="large"
          variant="contained">
          Login
        </Button>
      </ButtonGroup>
    </div>

  );
}
