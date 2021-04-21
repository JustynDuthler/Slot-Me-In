import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { Grid } from "@material-ui/core";

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

    function getEvents() {
        var apicall = 'http://localhost:3010/api/events';
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
                getRows(json);
                console.log(rows);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    useEffect(() => {
        getEvents();
    }, []);

    const bull = <span className={classes.bullet}>•</span>;

    return (
        <Grid
            container
            spacing={4}
            className={classes.gridContainer}
            justify="center"
        >
            {rows.map((row) => (
                <Grid item xs={12} sm={6} md={4} key={row.eventid}>
                    <Card className={classes.root} variant="outlined">
                    <CardContent>
                        <Typography variant="h5" component="h2">
                          {row.eventname}
                        </Typography>
                        <Typography className={classes.pos} color="textSecondary">
                          Start Time: {new Date(row.starttime).toLocaleString('en-US',
                              {weekday: 'long', month: 'short', day: 'numeric',
                                year: 'numeric', hour: 'numeric', minute: 'numeric'})}
                        </Typography>
                        <Typography className={classes.pos} color="textSecondary">
                          End Time: &nbsp;{new Date(row.endtime).toLocaleString('en-US',
                              {weekday: 'long', month: 'short', day: 'numeric',
                                year: 'numeric', hour: 'numeric', minute: 'numeric'})}
                        </Typography>
                        <Typography className={classes.pos} variant="body2" noWrap>
                          Description: {row.description ? row.description : "N/A"}
                        </Typography>
                        <Typography variant="body2" component="p">
                          Capacity: {row.capacity}
                        </Typography>
                    </CardContent>
                    <CardActions>
                        <Button size="small">Learn More</Button>
                    </CardActions>
                    </Card>
                </Grid>
            ))}
        </Grid>
    );
}