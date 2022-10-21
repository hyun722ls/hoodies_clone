import { useEffect, useState } from "react";
import { freePreview } from "../../common/data/dummyData";
import Header from "../../common/UI/header/header";
import BoardTable from "./boardComponent/boardTable";
import PopularTexts from "./boardComponent/popularTexts";
import classes from "./boardMain.module.css";
import CreateIcon from "@mui/icons-material/Create";
import { useHistory } from "react-router-dom";

const BoardMain = () => {
  const [articles, setArticles] = useState([]);
  const [page, setPage] = useState(1);
  const [popularTexts, setPopularTexts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const history = useHistory();

  useEffect(() => {
    // const response = 요청(게시글 20개가 한 페이지 = 제목, 닉네임, 시간, 조회수, 추천)
    // const response1 = 인기 게시글(제목, 날짜)
    // setArticles(response)
    // setPopularText(response1
    setArticles(freePreview);
    setPopularTexts(freePreview);
    setIsLoading(false);
  });

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
  return (
    !isLoading &&
    articles &&
    popularTexts && (
      <div>
        <Header />
        <h3>자유게시판</h3>

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
        <PopularTexts popularTexts={popularTexts} />
      </div>
    )
  );
};

export default BoardMain;
