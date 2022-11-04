import { useHistory } from "react-router-dom";
import { blockArticle } from "../../../common/refineData/blockArticle";
import {timeConventer} from "../../../common/refineData/refineTime"
import { fetchArticles } from "../boardAPI";
import CreateIcon from "@mui/icons-material/Create";
import Pagination from "react-js-pagination";
import styled from "styled-components";
import { useState, useEffect } from "react";
import {changeAnnonymous, checkBoradType} from "../../../common/refineData/anonymousWriter";

const Articles = styled.div`
  position: relative;
  grid-column: 1/3;
  grid-row: 1;
  margin-left: 90px;
`

const Article = styled.article`
  margin-bottom: -1px;
  box-sizing: border-box;
  border: 1px solid #F9F5EB;
  background-color: #fff;
  cursor: pointer;
`

const ArticleA = styled.a`
  margin: 0;
  padding: 16px;
  display: block;
`

const ArticleH2 = styled.h2`
  margin: 0;
  margin-bottom: 5px;
  line-height: 18px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 14px;
  font-weight: normal;
`

const ArticleH2_filter = styled.h2`
  margin: 0;
  margin-bottom: 5px;
  line-height: 18px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 13px;
  font-weight: normal;
  color: #ff5f5f;
`

const Title = styled.div`
  margin-bottom: -20px;
  padding: 16px;
  border: 1px solid #F9F5EB;
  box-sizing: border-box;
`

const H1 = styled.h1`
  margin: 0;
`
const NewArticle = styled.a`
  position: relative;
  float: none;
  margin-top: 24px;
  display: block;
  padding: 0 10px;
  height: 50px;
  line-height: 46px;
  border: 2px solid #EAE3D2;
  box-sizing: border-box;
  color: #a6a6a6;
  font-size: 14px;
  cursor: pointer;
`
const NewIcon = styled(CreateIcon)`
  position: absolute;
  top: 13px;
  right: 16px;
`
const ArticleH3 = styled.h3`
  margin: 0;
  padding: 0;
  float: left;
  max-width: 90px;
  height: 15px;
  line-height: 15px;
  font-size: 11px;
  font-weight: normal;
  letter-spacing: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const ArticleTime = styled.time`
  margin: 0;
  padding: 0;
  float: left;
  margin-right: 5px;
  height: 15px;
  line-height: 15px;
  font-size: 11px;
  color: #a6a6a6;
`

const Score = styled.ul`
  margin: 0;
  padding: 0;
  float: right;
  list-style: none;
`

const Item = styled.li`
  margin: 0;
  float: left;
  margin-left: 0px;
  padding: 0 2px;
  padding-left: 2px;
  height: 20px;
  line-height: 20px;
  font-size: 12px;
  background-repeat: no-repeat;
  background-position: left center;
  background-size: 11px 11px;
  cursor: pointer;
`

const ArticleHr = styled.hr`
  margin: 0;
  padding: 0;
  clear: both;
  height: 0;
  border: 0;
  width: 100%;
`

const BoardTable = (props) => {
  const history = useHistory();

  const detailPageHandler = (article) => {
    history.push({ pathname: "/board/free/detail", state: article._id });
  };

  const isFilter = (article) => {
      if (blockArticle(article, article.category) === article.title) {
          return 1
      } else {
          return 0
      }
  };

  const createArticle = () => {
    history.push("free/form");
  };

  return props.articles.length ? (
    <Articles>
      <Title>
        <H1>자유게시판</H1>
      </Title>
      <NewArticle onClick={createArticle}>
        새로운 게시글 작성
        <NewIcon />
      </NewArticle>
      {props.articles.map((article) => {
        return (
          <Article key={article._id}>
            <ArticleA onClick={() => {
              detailPageHandler(article);
            }}>
                <div style={{display: "flex", justifyContent: "space-between"}}>
                    {isFilter(article) ?
                        <ArticleH2>{blockArticle(article, article.category)}</ArticleH2>
                        : <ArticleH2_filter>{blockArticle(article, article.category)}</ArticleH2_filter>}
                    <ArticleH3 style={{color: "darkblue"}}>-{checkBoradType(article)}-</ArticleH3> {/*여기에 게시판 이름 넣기!*/}
                </div>
                <ArticleTime>{timeConventer(article.createdAt)}</ArticleTime>
                <ArticleH3>{changeAnnonymous(article)}</ArticleH3>
                <Score style={{}}>
                    <Item style={{fontSize: "2px"}}>조회수</Item><Item>{article.hit}</Item>
                    <Item style={{color: "red", fontSize: "2px"}}>추천수</Item><Item style={{color: "red"}}>{article.like}</Item>
                </Score>
                <ArticleHr/>
            </ArticleA>
          </Article>
        );
      })}
    </Articles>
  ) : (
    <Articles>
      <Title>
        <H1>작성된 글이 없습니다.</H1>
      </Title>
      <NewArticle onClick={createArticle}>
        새로운 게시글 작성
        <NewIcon />
      </NewArticle>
    </Articles>
  );
};

export default BoardTable;
