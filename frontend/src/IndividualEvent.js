import React from 'react';
import Button from '@material-ui/core/Button';
import AccountIcon from '@material-ui/icons/AccountCircle';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import { ButtonGroup } from '@material-ui/core';

/**
 *
 * @return {object} JSX
 */
export default function IndividualEvent(props) {
  const { match } = props;
  const { params } = match;
  const { eventID } = params;

  const body = {
    textAlign: 'center',
  };

  return (
    <div style={body}>
      <h1>Individual Event Page for EventID: ${eventID}</h1>
    </div>

  );
}
