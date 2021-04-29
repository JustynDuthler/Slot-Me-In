import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { Grid } from "@material-ui/core";
import Box from '@material-ui/core/Box';
import Context from './Context';

const Auth = require('./libs/Auth');

const useStyles = makeStyles({
  root: {
    minWidth: 275,
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginTop: 12,
  },
  gridContainer: {
    paddingLeft: "10px",
    paddingRight: "10px",
  }
});

export default function ViewEvents() {
  const classes = useStyles();
  const [rows, getRows] = React.useState([]);
  const [numEvents, setNumEvents] = React.useState(undefined);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;
  const [postsPerPage] = useState(9);
  const context = React.useContext(Context);

  /* API call to get event data */
  function getEvents() {
    var apicall = 'http://localhost:3010/api/events';
    fetch(apicall, {
      method: 'GET',
      headers: Auth.JWTHeaderJson(),
    })
      .then((response) => {
        if (!response.ok) {
          if (response.status === 401) {
            Auth.removeJWT();
            context.setAuthState(null);
          }
          throw response;
        } else {
          return response.json();
        }
      })
      .then((json) => {
        getRows(json);
        setNumEvents(json.length);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    getEvents();
  }, []);

  /*
    This function gets the individual event data for each card and displays it. When the card
    is clicked, it goes to URL /event/{eventid}.
  */
  function getCard(row) {
    return (
      <Grid item xs={12} sm={6} md={4} key={row.eventid}>
        <Card>
        <CardContent>
          <Typography variant="h5" component="h2" align="center">
            {row.eventname}
          </Typography>
          <Typography className={classes.pos} variant="body2" align="center" noWrap>
            Description: {row.description ? row.description : "N/A"}
          </Typography>
          <Typography className={classes.pos} color="textSecondary" variant="body2" align="center">
            Start Time: {new Date(row.starttime).toLocaleString('en-US',
              {weekday: 'long', month: 'short', day: 'numeric',
              year: 'numeric'})} at {new Date(row.starttime).toLocaleString('en-US', {hour: 'numeric', minute: 'numeric'})}
          </Typography>

          <Typography className={classes.pos} color="textSecondary" variant="body2" align="center">
            End Time: {new Date(row.endtime).toLocaleString('en-US',
              {weekday: 'long', month: 'short', day: 'numeric',
              year: 'numeric'})} at {new Date(row.endtime).toLocaleString('en-US', {hour: 'numeric', minute: 'numeric'})}
          </Typography>
        </CardContent>
        <CardActions>
          <Button size="small" variant="contained" color="primary" href={context.businessState === false ? '/event/' + row.eventid : '/profile/'}
          style={{ margin: "auto" }}>
            {context.businessState === false ? 'View Event' : 'View Event in Profile'}
          </Button>
        </CardActions>
        </Card>
      </Grid>
    );
  };

  const Pagination = ({ postsPerPage, totalPosts }) => {
    console.log('hi');
    const pageNumbers = [];
  
    for (let i = 1; i <= Math.ceil(totalPosts / postsPerPage); i++) {
      pageNumbers.push(i);
    }
  
    return (
      <nav>
        <ul>
          {pageNumbers.map(number => (
            <li key={number}>
              <a onClick={() => {paginate(number)}} href={'/events/'+number}>
                {number}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    );
  };

  const Posts = ({ posts }) => {
    return (
      posts.map(post => (
          getCard(post)
      ))
    );
  };

  // Get current posts
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = rows.slice(indexOfFirstPost, indexOfLastPost);

  // Change page
  const paginate = pageNumber => setCurrentPage(pageNumber);

  return (
    <Box mt={5} mb={5}>
      <Box mb={5}>
        <h1 style={{ margin:12 }}>Events</h1>
        <Grid
          container
          spacing={5}
          className={classes.gridContainer}
          justify="center"
        >
          <Posts posts={currentPosts} />
        </Grid>
      </Box>
      <Pagination
        postsPerPage={postsPerPage}
        totalPosts={numEvents}
        paginate={paginate}
      />
    </Box>
  );
}
