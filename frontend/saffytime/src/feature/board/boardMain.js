import { useEffect, useState } from "react";
import Header from "../../common/UI/header/header";
import PopularTexts from "./boardComponent/popularTexts";

const BoardMain = () => {
  const [articles, setArticles] = useState([]);
  const [page, setPage] = useState(1);
  const [popularTexts, setPopularTexts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    // const response = 요청(게시글 20개가 한 페이지 = 제목, 닉네임, 시간, 조회수, 추천)
    // const response1 = 인기 게시글(제목, 날짜)
    // setArticles(response)
    // setPopularText(response1)
    setIsLoading(false);
  });
  return (
    !isLoading && (
      <div>
        <Header />
        <div>
          <h3>자유게시판</h3>
          {/* 여기는 table로 */}
        </div>
        <PopularTexts popularTexts={popularTexts} />
      </div>
    )
  );
};

export default BoardMain;
