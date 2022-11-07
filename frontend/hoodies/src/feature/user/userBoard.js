import { useEffect, useState } from "react";
import { fetchArticles } from "./userApi";
import Header from "../../common/UI/header/header";
import BoardTable from "./userComponent/boardTable";
import styled from "styled-components";
import "./userBoard.css";

const Container = styled.div`
  margin: 24px;
`

const UserBoard = () => {
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // const response = 요청(게시글 20개가 한 페이지 = 제목, 닉네임, 시간, 조회수, 추천)
    // const response1 = 인기 게시글(제목, 날짜)
    // setArticles(response)
    // setPopularText(response1
    (async () => {
      const response = await fetchArticles()
    setArticles(response);
    setIsLoading(false);
    })()
  }, []);

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