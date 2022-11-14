import { useEffect, useState } from "react";
import { DUMMY_STAFF } from "../../common/data/dummyData";
import Grid from '@mui/material/Grid';
import Header from "../../common/UI/header/header";
import WeeklyMenu from "./mainComponent/weeklyMenu"
import JobInfo from "./mainComponent/jobInfo"
import Articles from "./mainComponent/articles";
import PopularText from "./mainComponent/popularText";
import Staffs from "./mainComponent/staffs";
import { fetchPopularview, fetchPreview, fetchStaffview } from "./mainAPI";
import {tempJobInfo} from "../../common/data/dummyJobData";
import axios from "axios";
import { API_URL } from "../../common/api/url";
import GRID from "./main.module.css";
import { freeData, mentorPreview, popularData } from "../../common/data/styleData";

const Main = () => {
  // const [weeklyMenu, setWeeklyMenu] = useState([]);
  const [jobInfo, setJobInfo] = useState([]);
  const [articles, setArticles] = useState([]);
  const [popularText, setPopularText] = useState([]);
  const [staffs, setStaffs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
   
      // 배포용
      const response = await fetchPreview()
      const response1 = await fetchPopularview()
      const responseStaffs = await fetchStaffview()

      if (response){
        setArticles(response)

      }
      if (response1){
        setPopularText(response1)

      }
      setStaffs(responseStaffs)
      
      setJobInfo(tempJobInfo)
      
      // setArticles(freeData)
      // setPopularText(popularData)
      // setStaffs(mentorPreview)
      

      
      setIsLoading(false);
      })()
    }, []);
    return (
      !isLoading &&
      articles &&
      popularText &&
      staffs &&
      (
          <div>
            <Header />
                <Grid>
                  <WeeklyMenu />
                  <JobInfo jobInfo={jobInfo}/>
                  <Grid container spacing={3} className={GRID.container}>
                    <Articles articles={articles} />
                    <PopularText popularText={popularText} />
                  </Grid>
                  <Staffs staffs={staffs} />
                </Grid>
          </div>
      )
    );
  };

  export default Main;
