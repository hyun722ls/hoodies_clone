import { useEffect, useState } from "react";
import { freePreview } from "../../common/data/dummyData";
import Pagination from "react-js-pagination";
import { fetchArticles, fetchPopularArticles } from "./anonymousBoardAPI";
import Header from "../../common/UI/header/header";
import BoardTable from "./anonymousBoardComponent/boardTable";
import PopularTexts from "./anonymousBoardComponent/popularTexts";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import "./boardMain.css";
import Grid from "@mui/material/Grid";

const Container = styled.div`
  display: grid;
  grid-template-columns: auto;
  column-gap: 20px;
  position: relative;
  margin: 24px auto 24px auto;
`

const AnonymousBoardMain = () => {
  const [articles, setArticles] = useState([]);
  const [activePage, setActivePage] = useState(1);
  const [popularTexts, setPopularTexts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [totalItemsCount, setTotalItemCount] = useState(0)
  const history = useHistory();


  useEffect(() => {
    // const response = 요청(게시글 20개가 한 페이지 = 제목, 닉네임, 시간, 조회수, 추천)
    // const response1 = 인기 게시글(제목, 날짜)
    // setArticles(response)
    // setPopularText(response1
    (async () => {
      const response = await fetchArticles(activePage)
      const response1 = await fetchPopularArticles()
    setTotalItemCount(response.totalElements)
    setArticles(response.content);
    if (response1){
      setPopularTexts(response1);

    }
    setIsLoading(false);
    })()
  }, [activePage]);


  const searchHandler = (event) => {
    event.preventDefault();
  };

  const handlePageChange = (pageNumber) => {
    setActivePage(pageNumber);
  };

  return !isLoading &&
  articles &&
  popularTexts && (
          <div>
            <Header />
            <Grid container sx={{justifyContent: 'center'}}>
              <Grid item sx={{padding:"10px!important"}} xs={12} md={6}>
                <BoardTable articles={articles} />
                <div>
                  <Pagination
                      activePage={activePage}
                      itemsCountPerPage={20}
                      totalItemsCount={totalItemsCount}
                      pageRangeDisplayed={5}
                      onChange={handlePageChange}
                  />
                </div>
              </Grid>
              <PopularTexts sx={{paddingTop: "0px!important", paddingLeft: "0px!important", padding:"10px!important", paddingRight: "10px"}} popularTexts={popularTexts} />
            </Grid>
          </div>
  );
};

export default AnonymousBoardMain;
