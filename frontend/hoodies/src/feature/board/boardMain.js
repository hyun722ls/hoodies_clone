import { useEffect, useState } from "react";
import Pagination from "react-js-pagination";
import { fetchArticles, fetchPopularArticles, fetchSearch } from "./boardAPI";
import Header from "../../common/UI/header/header";
import BoardTable from "./boardComponent/boardTable";
import PopularTexts from "./boardComponent/popularTexts";
import { useHistory } from "react-router-dom";
import Grid from '@mui/material/Grid';
import { freeBoard, popularData } from "../../common/data/styleData";


const BoardMain = () => {
  const [articles, setArticles] = useState([]);
  const [activePage, setActivePage] = useState(1);
  const [popularTexts, setPopularTexts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [selected, setSelected] = useState("")
  const [totalItemsCount, setTotalItemCount] = useState(0)
  const [pageControl, setPageControl] = useState(false)
  const history = useHistory();


  useEffect(() => {
    (async () => {
      // 배포용
      const response = await fetchArticles(activePage)
      const response1 = await fetchPopularArticles()
    setTotalItemCount(response.totalElements)
    setArticles(response.content);
    if(response1){
      setPopularTexts(response1)
    }
    setIsLoading(false);
    // setArticles(freeBoard.content)
    // setPopularTexts(popularData)
    // setTotalItemCount(freeBoard.totalElements)
    // setIsLoading(false);
    })()
  }, [activePage]);


  const searchTextHandler = (event) => {
    setSearchText(event.target.value)
  }

  const searchHandler = async (event) => {
    event.preventDefault();
    if(searchText.trim()){
      const response = await fetchSearch(selected, searchText, 1)
      if (response){
        setArticles(response)
        setActivePage(1)
        setTotalItemCount(response.length)
        setPageControl(true)
      }
    }
  };

  const handleSelect = (event) => {
    setSelected(event.target.value);
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
              <form onSubmit={searchHandler}>
              <select onChange={handleSelect}>
			          <option key="1" value="1">제목</option>
			          <option key="2" value="2">작성자</option>
			          <option key="3" value="3">내용</option>
		          </select>
              <input type="text" onChange={searchTextHandler} />
              <button type="submit">검색</button>
              </form>
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

export default BoardMain;
