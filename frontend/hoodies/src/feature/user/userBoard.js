import { useEffect, useState } from "react";
import { freePreview } from "../../common/data/dummyData";
import Pagination from "react-js-pagination";
import { fetchArticles } from "./userApi";
import Header from "../../common/UI/header/header";
import BoardTable from "./userComponent/boardTable";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import "./userBoard.css";

const Container = styled.div`
  margin: 24px;
`

const UserBoard = () => {
  const [articles, setArticles] = useState([]);
  const [activePage, setActivePage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [totalItemsCount, setTotalItemCount] = useState(0)
  const history = useHistory();

  useEffect(() => {
    // const response = 요청(게시글 20개가 한 페이지 = 제목, 닉네임, 시간, 조회수, 추천)
    // const response1 = 인기 게시글(제목, 날짜)
    // setArticles(response)
    // setPopularText(response1
    (async () => {
      const response = await fetchArticles(activePage)
    setTotalItemCount(response.totalElements)
    setArticles(response);
    setIsLoading(false);
    })()
  }, [activePage]);

  const handlePageChange = (pageNumber) => {
    console.log(`active page is ${pageNumber}`);
    setActivePage(pageNumber);
  };

  return !isLoading &&
  articles && (
    <div>
      <Header />
      <Container>
        <BoardTable articles={articles} />
      </Container>
    </div>
  );
};

export default UserBoard;