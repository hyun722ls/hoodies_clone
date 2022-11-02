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
    setPopularTexts(response1);
    setIsLoading(false);
    })()
  }, [activePage]);


  const searchHandler = (event) => {
    event.preventDefault();
  };

  const handlePageChange = (pageNumber) => {
    console.log(`active page is ${pageNumber}`);
    setActivePage(pageNumber);
  };

  return !isLoading &&
  articles &&
  popularTexts && (
    <div>
      <Header />
      <Container>
        <div>
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
        </div>
        <PopularTexts popularTexts={popularTexts} />
      </Container>
    </div>
  );
};

export default AnonymousBoardMain;
