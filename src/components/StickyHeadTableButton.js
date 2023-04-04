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
import { Button } from 'react-bootstrap';
import { downloadFile } from '../services/getTweets';
import { removeFile } from '../services/users';

const columns = [
  { id: 'name', label: 'Description', minWidth: 100 },
  { id: 'date', label: 'Date', minWidth: 100 },
  { id: 'time', label: 'Time', minWidth: 100 },
  { id: 'filename', label: 'filename', minWidth: 100 },

];

// Function to create data objects for table rows
function createData(filename) {
  let name  = filename.slice(0,-16)
  let tmp = name.split('-')
  if (tmp.length == 3)
  {
    name = "Trends for " + "lat:" + tmp[0] + " long:" + tmp[1]
  }
  else if (name[0] == '#')
  {
    name = "Hashtag: " + name
  } 
  else if (name[0] == '@')
  {
    name = "Handle: " + name
  } 
  let time  = filename.slice(-10,-4)
  let date  = filename.slice(-16,-10)
  date = date.slice(0,2)+ '-' + date.slice(2,4) + '-' +date.slice(4,6)
  time = time.slice(0,2)+ ':' + time.slice(2,4) + ':' +time.slice(4,6)
  return { name,date,time,filename };
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
export default function StickyHeadTableButton(props) {

  const [rows, setRows] = useState([])

  // Effect hook to set rows state when props.data changes
  useEffect(() => {
    var array = []
    setRows([])
    for (var i in props.data) {
      if (i == 0)
        continue
      array.push(createData(props.data[i]));
    }
    setRows(array);
  }, [props.data]);

  const classes = useStyles();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  // Function to handle changing the current page
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Function to handle removing the file
  const removeFileName = (filename) => {
    removeFile(props.token, filename)
      .then((data) => {
        if (data)
          window.location.reload();
      })
  };

  // Function to handle downloading the file
  const downFile = (filename) => {
    downloadFile(encodeURIComponent(filename))
      .then((data) => {
      })
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
              <TableCell key="Download File">
                Download File
              </TableCell>
              <TableCell key="Remove File">
                Remove File
              </TableCell>
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
                  <TableCell key="Download File">
                    <Button
                      onClick={()=>{
                        downFile(row['filename'])
                      }}
                    >
                      Download File
                    </Button>
                  </TableCell>
                  <TableCell key="Remove File">
                    <Button
                      onClick={()=>{
                        removeFileName(row['filename'])
                      }}
                    >
                      Remove File
                    </Button>
                  </TableCell>
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
