import * as React from 'react';
import classes from "./articles.module.css";
import Grid from '@mui/material/Grid';
import Weekly from './jobInfo.module.css'
// import {styled} from '@mui/material/styles';
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
        <Paper sx={{ width: '100%' , margin: '30px'}}>
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
    // const StyledTableCell = styled(TableCell)(({ theme,align:center }) => ({
    //     [`&.${tableCellClasses.head}`]: {
    //         backgroundColor: theme.palette.common.black,
    //         color: theme.palette.common.white,
    //     },
    //     [`&.${tableCellClasses.body}`]: {
    //         fontSize: 14,
    //     },
    // }));
    //
    // const StyledTableRow = styled(TableRow)(({ theme }) => ({
    //     '&:nth-of-type(odd)': {
    //         backgroundColor: theme.palette.action.hover,
    //     },
    //     // hide last border
    //     '&:last-child td, &:last-child th': {
    //         border: 0,
    //     },
    // }));

    // return props.jobInfo.length ? (
    //     <TableContainer className={Weekly.infoLocation} component={Paper}>
    //         <Table className={classes.table} sx={{ minWidth: 500 }} aria-label="customized table">
    //             <TableHead>
    //                 <TableRow >
    //                 <StyledTableCell>회사명</StyledTableCell>
    //                 <StyledTableCell align="right">모집 분야</StyledTableCell>
    //                 <StyledTableCell align="right">모집 기간</StyledTableCell>
    //                 <StyledTableCell align="right">지원 방식</StyledTableCell>
    //                 <StyledTableCell align="right">우대사항</StyledTableCell>
    //                 </TableRow>
    //             </TableHead>
    //             <TableBody>
    //             {props.jobInfo.map((info) => {
    //                 return (
    //                     <StyledTableRow key={info.id}>
    //
    //                         <StyledTableCell component="th" scope="row">{info.name.replace(getName(info), '')}</StyledTableCell>
    //                         <StyledTableCell align="right">{info.job}</StyledTableCell>
    //                         <StyledTableCell align="right">{info.period}</StyledTableCell>
    //                         <StyledTableCell align="right">{info.method.replace(getEmail(info), '')}
    //                             <a href="mailto:{getEmail(info).substr(1,getEmail(info).length-2)}}">{getEmail(info).substr(0,getEmail(info).length)}</a>
    //                             <br/>
    //                             <a href={getName(info).substr(1, getName(info).length-2)}>{getName(info).substr(1, getName(info).length-2)}</a>
    //                         </StyledTableCell>
    //                         <StyledTableCell align="right">{info.favor}</StyledTableCell>
    //                     </StyledTableRow>
    //                 );
    //             })}
    //             </TableBody>
    //         </Table>
    //     </TableContainer>
    //
    // ) : (
    //     <Grid item xs={12} md={12}>새로운 취업 정보가 없습니다.</Grid>
    // );

    // return props.jobInfo.length ? (
    //     <TableContainer className={Weekly.infoLocation} component={Paper}>
    //         <Table className={classes.table} sx={{ minWidth: 500 }} aria-label="customized table">
    //             <TableHead>
    //                 <TableRow >
    //                 <StyledTableCell>회사명</StyledTableCell>
    //                 <StyledTableCell align="right">모집 분야</StyledTableCell>
    //                 <StyledTableCell align="right">모집 기간</StyledTableCell>
    //                 <StyledTableCell align="right">지원 방식</StyledTableCell>
    //                 <StyledTableCell align="right">우대사항</StyledTableCell>
    //                 </TableRow>
    //             </TableHead>
    //             <TableBody>
    //             {props.jobInfo.map((info) => {
    //                 return (
    //                     <StyledTableRow key={info.id}>
    //
    //                         <StyledTableCell component="th" scope="row">{info.name.replace(getName(info), '')}</StyledTableCell>
    //                         <StyledTableCell align="right">{info.job}</StyledTableCell>
    //                         <StyledTableCell align="right">{info.period}</StyledTableCell>
    //                         <StyledTableCell align="right">{info.method.replace(getEmail(info), '')}
    //                             <a href="mailto:{getEmail(info).substr(1,getEmail(info).length-2)}}">{getEmail(info).substr(0,getEmail(info).length)}</a>
    //                             <br/>
    //                             <a href={getName(info).substr(1, getName(info).length-2)}>{getName(info).substr(1, getName(info).length-2)}</a>
    //                         </StyledTableCell>
    //                         <StyledTableCell align="right">{info.favor}</StyledTableCell>
    //                     </StyledTableRow>
    //                 );
    //             })}
    //             </TableBody>
    //         </Table>
    //     </TableContainer>
    //
    // ) : (
    //     <Grid item xs={12} md={12}>새로운 취업 정보가 없습니다.</Grid>
    // );



    // return props.jobInfo.length ? (
    //     <Grid>
    //         <table className={classes.table}>
    //             <thead>
    //             <tr className={Weekly.infoLocation}>
    //                 <th>회사명</th>
    //                 <th>모집 분야</th>
    //                 <th>모집 기간</th>
    //                 <th>지원 방식</th>
    //                 <th>우대사항</th>
    //             </tr>
    //             </thead>
    //             <tbody>
    //             {props.jobInfo.map((info) => {
    //                 return (
    //                     <tr
    //                         // onClick={() => {
    //                         //     detailPageHandler(Info);
    //                         // }}
    //                         key={info.id}
    //                     >
    //                         <td>{info.name.replace(getName(info), '')}</td>
    //                         <td>{info.job}</td>
    //                         <td>{info.period}</td>
    //                         <td>{info.method.replace(getEmail(info), '')}
    //                             <a href="mailto:{getEmail(info).substr(1,getEmail(info).length-2)}}">{getEmail(info).substr(0,getEmail(info).length)}</a>
    //                             <br/>
    //                             <a href={getName(info).substr(1, getName(info).length-2)}>{getName(info).substr(1, getName(info).length-2)}</a>
    //                         </td>
    //                         <td>{info.favor}</td>
    //                     </tr>
    //                 );
    //             })}
    //             </tbody>
    //         </table>
    //     </Grid>
    // ) : (
    //     <Grid item xs={12} md={12}>새로운 취업 정보가 없습니다.</Grid>
    // );
};

export default JobInfo;