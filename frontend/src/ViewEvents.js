import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import { Box } from '@material-ui/core'

const Auth = require('./libs/Auth');

const columns = [
    { id: 'event', label: 'Event', minWidth: 100},
    { id: 'start', label: 'Start Time', minWidth: 100},
    { id: 'end', label: 'End Time', minWidth: 100},
    { id: 'capacity', label: 'Capacity', minWidth: 100},
];

const useStyles = makeStyles({
    root: {
        width: '100%',
    },
    container: {
        maxHeight: 440,
    },
});

export default function ViewEvents() {
    const classes = useStyles();
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
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
    console.log(rows);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    return (
        <Paper className={classes.root}>
            <Typography variant = "h4" align="center">Events</Typography>
                <TableContainer className={classes.container}>
                    <Table stickyHeader aria-label="sticky table">
                        <TableHead>
                            <TableRow>
                                {columns.map((column) => (
                                    <TableCell
                                        key={column.id}
                                        align={column.align}
                                        style={{ minWidth: column.minWidth }}
                                    >
                                        {column.label}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rows.map((row) => (
                                <TableRow key={row.eventname}>
                                <TableCell component="th" scope="row">
                                    {row.eventname}
                                </TableCell>
                                <TableCell align="left">{row.starttime}</TableCell>
                                <TableCell align="left">{row.endtime}</TableCell>
                                <TableCell align="left">{row.capacity}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            <TablePagination
                rowsPerPageOptions={[10, 25, 100]}
                component="div"
                count={rows.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onChangePage={handleChangePage}
                onChangeRowsPerPage={handleChangeRowsPerPage}
            />
        </Paper>
    );
}