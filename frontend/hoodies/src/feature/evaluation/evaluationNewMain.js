import {Box} from "@mui/material";
import Typography from "@mui/material/Typography";
import * as React from "react";
import PropTypes from "prop-types";
import weekly from "../main/mainComponent/weeklyMenu.module.css";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Grid from "@mui/material/Grid";
import hoody from "../../common/data/hoody2.png";
import weeklyMenu10PNG from "../../common/data/10th.png";
import {getStaffListByType} from "./evaluationAPI";

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
        id: `${index}`,
    };
}


const WeeklyMenu = () => {
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
        // console.log(getStaffListByType)
    };



    return (
        <div className={weekly.container}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                    <Tab label="전체" {...a11yProps(0)} />
                    <Tab label="컨설턴트" {...a11yProps(1)} />
                    <Tab label="운영프로" {...a11yProps(2)} />
                    <Tab label="실습코치" {...a11yProps(3)} />
                </Tabs>
            </Box>
            <TabPanel value={value} index={0}>
                <Grid className={weekly.menuLocation}>
                    <Grid item xs={10} md={10}>
                        {/*{getStaffListByType(0)}*/}
                        af32war
                    </Grid>
                </Grid>
            </TabPanel>
            <TabPanel value={value} index={1}>
                <Grid className={weekly.menuLocation10}>
                    <Grid item xs={10} md={10}>
                        asdfa234t6a43
                    </Grid>
                </Grid>
            </TabPanel>
            <TabPanel value={value} index={2}>
                <Grid className={weekly.menuLocation10}>
                    <Grid item xs={10} md={10}>
                        ndtyndtyn
                    </Grid>
                </Grid>
            </TabPanel>
            <TabPanel value={value} index={3}>
                <Grid className={weekly.menuLocation10}>
                    <Grid item xs={10} md={10}>
                        a3e4ta34t
                    </Grid>
                </Grid>
            </TabPanel>

        </div>
    )
};

export default WeeklyMenu;
