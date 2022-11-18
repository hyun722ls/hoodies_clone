import { useEffect, useState } from "react";
import Pagination from "react-js-pagination";
import { fetchArticles, fetchPopularArticles, fetchSearch } from "./codingBoardAPI";
import Header from "../../common/UI/header/header";
import BoardTable from "./boardComponent/boardTable";
import PopularTexts from "./boardComponent/popularTexts";
import { useHistory } from "react-router-dom";
import Grid from '@mui/material/Grid';
import { freeBoard, popularData } from "../../common/data/styleData";
import styled from "styled-components";

const SearchDiv = styled.div`
  margin: 8px;
  padding: 4px 10px;
  border-radius: 8px;
  border: 1px solid #d6d6d6;
  background-color: #fff;
  display: inline-block;
`
const Input = styled.input`
  margin: 4px;
  padding: 0;
  border: 1px solid #eae3d2;
  height: 28px;
  line-height: 28px;
  font-size: 16px;
  background-color: transparent;
  vertical-align: middle;
`
const StyledSelect = styled.select`
  height: 28px;
  border: 1px solid #eae3d2;
  cursor: pointer;
`
const StyledButton = styled.button`
  height: 28px;
  background-color: #eae3d2;
  border: 1px solid #f9f5eb;
  cursor: pointer;
`

const CodeBoardMain = () => {
  const [articles, setArticles] = useState([]);
  const [activePage, setActivePage] = useState(1);
  const [popularTexts, setPopularTexts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [selected, setSelected] = useState("1")
  const [totalItemsCount, setTotalItemCount] = useState(0)
  const [keyword, setKeyword] = useState('')
  const [option, setOption] = useState(1)
  const [pageControl, setPageControl] = useState(false)
  const history = useHistory();


  useEffect(() => {
    (async () => {
      // 배포용
      if (!pageControl ){
        const response = await fetchArticles(activePage)
        const response1 = await fetchPopularArticles()
      setTotalItemCount(response.totalElements)
      setArticles(response.content);
      if(response1){
        setPopularTexts(response1)
      }
    } else {
      const response = await fetchSearch(option, keyword, activePage)
      const response1 = await fetchPopularArticles()
      setTotalItemCount(response.totalElements)
      setArticles(response.content);
      if(response1){
        setPopularTexts(response1)
      }
    }
    setIsLoading(false);
    // setArticles(freeBoard.content)
    // setPopularTexts(popularData)
    // setTotalItemCount(freeBoard.totalElements)
    // setIsLoading(false);
    })()
  }, [activePage]);


  const searchTextHandler = (event) => {
    event.preventDefault()
    setSearchText(event.target.value)
  }

  const searchHandler = async (event) => {
    event.preventDefault()
    if(searchText.trim()){
      const tmpOption = parseInt(selected)
      setOption(tmpOption)
      const tmpKeyword = searchText
      const response = await fetchSearch(parseInt(selected), searchText, 1)
      if (response){
        setKeyword(tmpKeyword) 
        setArticles(response.content)
        setActivePage(1)
        setTotalItemCount(response.totalElements)
        setPageControl(true)
      }
    }
  };

  const handleSelect = (event) => {
    event.preventDefault()
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
              <SearchDiv>
                <form onSubmit={searchHandler}>
                <StyledSelect onChange={handleSelect} value={selected}>
                  <option key="1" value="1">제목</option>
                  <option key="2" value="2">작성자</option>
                  <option key="3" value="3">내용</option>
                </StyledSelect>
                <Input type="text" onChange={searchTextHandler} />
                <StyledButton type="submit">검색</StyledButton>
                </form>
              </SearchDiv>
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

export default CodeBoardMain;
