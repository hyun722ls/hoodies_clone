import weeklyMenuPNG from '../../../common/data/Nov_1_WeeklyMenu.PNG'
import hoody from '../../../common/data/hoody.png'
import weekly from './weeklyMenu.module.css'
import Grid from '@mui/material/Grid';

const WeeklyMenu = () => {
    return (
        <Grid className={weekly.menuLocation}>
            <Grid item xs={10} md={10}>
                <img src={weeklyMenuPNG} alt=""/>
                <img className={weekly.hd_style} src={hoody} alt=""/>
            </Grid>
        </Grid>
    )
};

export default WeeklyMenu;
