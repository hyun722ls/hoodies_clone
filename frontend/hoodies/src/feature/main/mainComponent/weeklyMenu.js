import * as React from 'react';
import weeklyMenuPNG from '../../../common/data/Nov_1_WeeklyMenu.PNG'
import weeklyMenu10PNG from '../../../common/data/10th.png'
import hoody from '../../../common/data/hoody2.png'
import weekly from './weeklyMenu.module.css'
import Grid from '@mui/material/Grid';
import {Box} from "@mui/material";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import {WEEKLY_MENU} from "../../../common/data/dummyData";
import {useState} from "react";
import PropTypes from 'prop-types';
import Typography from '@mui/material/Typography';

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}


const WeeklyMenu = () => {
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };



    return (
        <div>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                    <Tab label="20th" {...a11yProps(0)} />
                    <Tab label="10th" {...a11yProps(1)} />
                </Tabs>
            </Box>
            <TabPanel value={value} index={0}>
                <Grid className={weekly.menuLocation}>
                    <Grid item xs={10} md={10}>
                        <img src={weeklyMenuPNG} alt=""/>
                        <img className={weekly.hd_style} src={hoody} alt=""/>
                    </Grid>
                </Grid>
            </TabPanel>
            <TabPanel value={value} index={1}>
                <Grid className={weekly.menuLocation10}>
                    <Grid item xs={10} md={10}>
                        <img src={weeklyMenu10PNG} alt=""/>
                        <img className={weekly.hd_style} src={hoody} alt=""/>
                    </Grid>
                </Grid>
            </TabPanel>

        </div>
    )
};

export default WeeklyMenu;
