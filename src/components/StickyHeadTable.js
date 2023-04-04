import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';

/*
This is a table component in React that displays tweet data in a paginated table.
 It uses the makeStyles hook from the @material-ui/core/styles library to create styles for the table component.
 The component takes in tweet data as props and uses an effect hook to update the state with an array of table rows when the props data changes.
The component has state for pagination and includes functions to handle changing the current page and the number of rows per page. The component renders a Paper, TableContainer, and Table component from the @material-ui/core library, as well as a TableHead, TableBody, and TableRow components.
 It also includes a TablePagination component to handle pagination.
*/
const columns = [
  { id: 'name', label: 'Name', minWidth: 170 },
  { id: 'code', label: 'tweet id', minWidth: 100 },
  {
    id: 'date',
    label: 'Created at',
    minWidth: 100,
  },
  {
    id: 'likes',
    label: 'Likes',
    minWidth: 50,
  },
  {
    id: 'text',
    label: 'text',
    minWidth: 170,
  },
  {
    id: 'place',
    label: 'place',
    minWidth: 40
  }
];

// Function to create data objects for table rows
function createData(name, code, date, likes, text, place) {
  return { name, code, date, likes, text, place };
}

// Hook to create styles for the table component
const useStyles = makeStyles({
  root: {
    width: '100%',
  },
  container: {
    maxHeight: 440,
  },
});

// Table component to display tweet data in a paginated table
export default function StickyHeadTable(props) {

  // State to store table rows
  const [rows, setRows] = useState([])

  // Effect hook to set rows state when props.data changes
  useEffect(() => {
    var array = []
    setRows([])
    for (var i in props.data) {
      if (i === "filename")
        continue
      array.push(createData(props.data[i]['user_name'], props.data[i]['tweet_id'], props.data[i]['created_at'], props.data[i]['favorite_count'], props.data[i]['text'], props.data[i]['place']));
    }
    setRows(array);
  }, [props.data]);

  // Destructuring necessary values from the styles object
  const classes = useStyles();

  // State for table pagination
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  // Function to handle changing the current page
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Function to handle changing the number of rows per page
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <Paper className={classes.root}>
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
            {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
              return (
                <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                  {columns.map((column) => {
                    const value = row[column.id];
                    return (
                      <TableCell key={column.id} align={column.align}>
                        {value}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}
