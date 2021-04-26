import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { Grid } from "@material-ui/core";
import Box from '@material-ui/core/Box';

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
  const [pageNumber, setPageNumber] = useState(0);
  const usersPerPage = 10;
  const pagesVisited = pageNumber * usersPerPage;

  /* API call to get event data */
  function getEvents() {
    var apicall = 'http://localhost:3010/api/events';
    fetch(apicall, {
      method: 'GET',
      headers: Auth.JWTHeaderJson(),
    })
      .then((response) => {
        if (!response.ok) {
          throw response;
        } else {
          return response.json();
        }
      })
      .then((json) => {
        getRows(json);
        console.log(rows);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect((eventid) => {
    getEvents();
  }, []);

  const changePage = ({ selected }) => {
    setPageNumber(selected);
  };

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
                  year: 'numeric', hour: 'numeric', minute: 'numeric'})}
          </Typography>
          <Typography className={classes.pos} color="textSecondary" variant="body2" align="center">
            End Time: &nbsp;{new Date(row.endtime).toLocaleString('en-US',
                {weekday: 'long', month: 'short', day: 'numeric',
                  year: 'numeric', hour: 'numeric', minute: 'numeric'})}
          </Typography>
        </CardContent>
        <CardActions>
          <Button size="small" variant="contained" color="primary" href={ '/event/' + row.eventid }
          style={{ margin: "auto" }}>
            View Event
          </Button>
        </CardActions>
        </Card>
      </Grid>
    );
  };

  return (
    <Box mt={5} mb={5}>
      <h1 style={{ margin:12 }}>Events</h1>
      <Grid
        container
        spacing={4}
        className={classes.gridContainer}
        justify="center"
      >
        {rows.map((row) =>
          getCard(row)
        )}
      </Grid>
    </Box>
);
}
