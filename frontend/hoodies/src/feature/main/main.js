import { useEffect, useState } from "react";
// import mainCss from "./main.module.css";
import { previewPros } from "../../common/data/dummyData";
// import { previewPros } from "../../common/data/dummyData";
import Grid from '@mui/material/Grid';
import Header from "../../common/UI/header/header";
import WeeklyMenu from "./mainComponent/weeklyMenu"
import JobInfo from "./mainComponent/jobInfo"
import Articles from "./mainComponent/articles";
import PopularText from "./mainComponent/popularText";
import Staffs from "./mainComponent/staffs";
// import axios from 'axios';
import { fetchPopularview, fetchPreview } from "./mainAPI";
import {tempJobInfo} from "../../common/data/dummyJobData";
import axios from "axios";
import { API_URL } from "../../common/api/url";

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

    setJobInfo(tempJobInfo)
    setArticles(response)    
    setPopularText(response1)
    setStaffs(previewPros)
    setIsLoading(false);
    })()
    // const response = axios.get('/preview/free');
    // const response1 = axios.get('/preview/popular');
    // const response2 = axios.get(??) api 만들어지면 스웨거에서 주소 확인
    
    // const response = 자유게시글 최근 5개 요청
    // const response1 = 추천 많은 글 5개 요청
    // const response2 = 많은 평가 받은 컨설턴트, 프로 정보(향후는 최근)
    // setArticles(response)


    // setArticles(response);
    // setPopularText(response1);
    // setStaffs(response2); api 만들어지면 넣기 line33 끄기
    
    // setArticles(freePreview);
    // setPopularText(freePreview);
    // setStaffs(previewPros);
    // setIsLoading(false);
  }, []);
  return (
    !isLoading &&
    articles &&
    popularText &&
    staffs && (
        <div>
          <Header />
              <Grid container>
                <WeeklyMenu />
                <JobInfo jobInfo={jobInfo}/>
                <Articles articles={articles} />
                <PopularText popularText={popularText} />
                <Staffs staffs={staffs} />
              </Grid>
              <button onClick={reissueToken}>토큰 재발행</button>
        </div>
    )
  );
};

export default Main;
