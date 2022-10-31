import { useEffect, useState } from "react";
import { freePreview } from "../../common/data/dummyData";
import Header from "../../common/UI/header/header";
import BoardTable from "./boardComponent/boardTable";
import PopularTexts from "./boardComponent/popularTexts";
import classes from "./boardMain.module.css";
import CreateIcon from "@mui/icons-material/Create";
import { useHistory } from "react-router-dom";
import Pagination from "react-js-pagination";
import { fetchArticles, fetchPopularArticles } from "./boardAPI";
import "./boardMain.css";
import styled from "styled-components";

const Container = styled.div`
  position: relative;
  margin: 0 auto 24px auto;
  width: 1180px;
`
const Wrap = styled.div`
  position: relative;
  float: none;
  left: 24px;
  margin-top: 24px;
  width: 780px;
`
const Title = styled(Wrap)`
  margin-bottom: -20px;
  padding: 16px;
  border: 1px solid #EAE3D2;
  box-sizing: border-box;
`

const H1 = styled.h1`
  margin: 0;
`

const BoardMain = () => {
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
    setPopularTexts(response1);
    setIsLoading(false);
    })()
  }, [activePage]);

  const createArticle = () => {
    history.push("free/form");
  };

  const searchTextChangeHandler = (event) => {
    event.preventDefault();
    setSearchText(event.target.value);
  };

  const searchHandler = (event) => {
    event.preventDefault();
  };

  const handlePageChange = (pageNumber) => {
    console.log(`active page is ${pageNumber}`);
    setActivePage(pageNumber);
  };


  return (
    !isLoading &&
    articles &&
    popularTexts && (
      <div>
        <Header />
        <Container>
          <Title>
            <H1>자유게시판</H1>
          </Title>

          <div className={classes.searchDiv}>
            <form onSubmit={searchHandler}>
              <input
                type="text"
                value={searchText}
                onChange={searchTextChangeHandler}
                placeholder="검색어를 입력하세요"
              />
              <button className={classes.btn} type="submit">
                검색
              </button>
              <CreateIcon onClick={createArticle} />
            </form>
          </div>
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
        </Container>

        <PopularTexts popularTexts={popularTexts} />
      </div>
    )
  );
};

export default BoardMain;
