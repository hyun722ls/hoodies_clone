import { useEffect, useState } from "react";
import { previewPros } from "../../common/data/dummyData";
import Grid from '@mui/material/Grid';
import Header from "../../common/UI/header/header";
import WeeklyMenu from "./mainComponent/weeklyMenu"
import JobInfo from "./mainComponent/jobInfo"
import Articles from "./mainComponent/articles";
import PopularText from "./mainComponent/popularText";
import Staffs from "./mainComponent/staffs";
// import axios from 'axios';
import { fetchPopularview, fetchPreview, fetchStaffview } from "./mainAPI";
import {tempJobInfo} from "../../common/data/dummyJobData";
import axios from "axios";
import { API_URL } from "../../common/api/url";
import GRID from "./main.module.css";

const Main = () => {
  // const [weeklyMenu, setWeeklyMenu] = useState([]);
  const [jobInfo, setJobInfo] = useState([]);
  const [articles, setArticles] = useState([]);
  const [popularText, setPopularText] = useState([]);
  const [staffs, setStaffs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const reissueToken = (event) => {
    event.preventDefault()
    axios
    .get(API_URL + "user/reissue", { withCredentials: true })
    .then((response) => {
      console.log("reissue 정상");
    }).catch((err)=>{
      console.log("reissue 비정상")
    })
  }
  useEffect(() => {
    (async () => {
      // const info = await fetchWeeklyMenu()
      // const info1 = await fetchJobInfo()
      const response = await fetchPreview()
      const response1 = await fetchPopularview()
      const responseStaffs = await fetchStaffview()

    setJobInfo(tempJobInfo)
    setArticles(response)    
    setPopularText(response1)
    setStaffs(responseStaffs)
    // setStaffs(previewPros)
    setIsLoading(false);
    })()
  }, []);
  return (
    !isLoading &&
    articles &&
    popularText &&
    staffs && (
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
              <button onClick={reissueToken}>토큰 재발행</button>
        </div>
    )
  );
};

export default Main;
