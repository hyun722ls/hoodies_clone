import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, {tableCellClasses} from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TablePagination from '@mui/material/TablePagination';
import Paper from '@mui/material/Paper';


const JobInfo = (props) => {
    const getName = (info) => {
        const findJobUrl = info.name;
        const startUrlIndex = findJobUrl.indexOf("(");
        const endUrlIndex = findJobUrl.indexOf(")");
        return findJobUrl.substring(startUrlIndex, endUrlIndex + 1)
    }
    const getEmail = (info) => {
        const findEmailUrl = info.method;
        const startUrlIndex = findEmailUrl.indexOf("(");
        const endUrlIndex = findEmailUrl.indexOf(")");
        return findEmailUrl.substring(startUrlIndex, endUrlIndex + 1)
    }

    const columns = [
        { id: 'name', label: '회사명', minWidth: 70, align: 'center' },
        { id: 'job', label: '모집\u00a0분야', minWidth: 200, align: 'center' },
        {
            id: 'period',
            label: '모집\u00a0기간',
            minWidth: 170,
            align: 'center'
        },
        {
            id: 'method',
            label: '지원\u00a0방식',
            minWidth: 170,
            align: 'center'
        },
        {
            id: 'favor',
            label: '우대사항',
            minWidth: 170,
            align: 'center'
        },
    ];

    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };
    return (
        <Paper sx={{ width: '100%' , margin: '15px'}}>
            <TableContainer sx={{ maxHeight: 440 }}>
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
                        {props.jobInfo
                            .map((row) => {
                                return (
                                    <TableRow sx={{width:'100%'}} key={row.id}>
                                        <TableCell align="center" component="th" scope="row">{row.name.replace(getName(row), '')}</TableCell>
                                        <TableCell align="left">{row.job}</TableCell>
                                        <TableCell align="right">{row.period}</TableCell>
                                        <TableCell align="left">{row.method.replace(getEmail(row), '')}
                                            <a href="mailto:{getEmail(info).substr(1,getEmail(info).length-2)}}">{getEmail(row).substr(0,getEmail(row).length)}</a>
                                            <br/>
                                            <a href={getName(row).substr(1, getName(row).length-2)}>{getName(row).substr(1, getName(row).length-2)}</a>
                                        </TableCell>
                                        <TableCell align="center">{row.favor}</TableCell>
                                    </TableRow>
                                );
                            })}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[10, 25, 100]}
                component="div"
                count={props.jobInfo.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </Paper>
    );
};

export default JobInfo;