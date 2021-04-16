import React from 'react';
import Link from '@material-ui/core/Link';



/**
 *
 * @return {object} JSX
 */
export default function Home() {
  return (
    <div>
      <h1>Home</h1>
      <Link to="/login">Login</Link>
    </div>

  );
}
