import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, {tableCellClasses} from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TableTitle from './jobInfo.module.css'
import HomeIcon from '../../../common/data/user-home-symbolic.svg'

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
        {
            id: 'home',
            label: '',
            minWidth: 30,
            align: 'center'
        },
    ];


    return (
        <Paper sx={{ margin: '10px'}}>
            <TableContainer sx={{ maxHeight: 500 }}>
                <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                        <TableRow>
                            {columns.map((column) => (
                                <TableCell className={TableTitle.label}
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
                                        <TableCell className={TableTitle.content} align="center" component="th" scope="row">{row.name.replace(getName(row), '')}</TableCell>
                                        <TableCell className={TableTitle.content} align="left">{row.job}</TableCell>
                                        <TableCell className={TableTitle.content} align="right">{row.period}</TableCell>
                                        <TableCell className={TableTitle.content} align="left">{row.method.replace(getEmail(row), '')} -&nbsp; <br/>
                                            <a className={TableTitle.none} href="mailto:{getEmail(info).substr(1,getEmail(info).length-2)}}">{getEmail(row).substr(0,getEmail(row).length)}</a>
                                            <br/>
                                        </TableCell>
                                        <TableCell className={TableTitle.content} align="center">{row.favor}</TableCell>
                                        <TableCell className={TableTitle.content}>
                                            <a href={row.url}>
                                                <img src={HomeIcon} alt=""/>
                                            </a>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>
    );
};

export default JobInfo;