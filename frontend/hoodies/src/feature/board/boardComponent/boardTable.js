import { useHistory } from "react-router-dom";
import { blockArticle } from "../../../common/refineData/blockArticle";
import {timeConventer} from "../../../common/refineData/refineTime"
import styled from "styled-components";

const Wrap = styled.div`
  position: relative;
  float: none;
  left: 24px;
  margin-top: 24px;
  width: 780px;
`

const Articles = styled(Wrap)`

`

const Article = styled.article`
  margin-bottom: -1px;
  box-sizing: border-box;
  border: 1px solid #EAE3D2;
  background-color: #fff;
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

// const ArticleP = styled.p`
//   margin: 0;
//   margin-bottom: 5px;
//   padding: 0;
//   max-height: 30px;
//   line-height: 15px;
//   white-space: normal;
//   overflow: hidden;
//   color: #a6a6a6;
//   font-size: 12px;
// `

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
  margin-left: 8px;
  padding: 0 2px;
  padding-left: 15px;
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


  return props.articles.length ? (
    <Articles>
      {props.articles.map((article) => {
        return (
          <Article>
            <ArticleA onClick={() => {
              detailPageHandler(article);
            }}
            key={article._id}>
              <ArticleH2>{blockArticle(article, article.category)}</ArticleH2>
              <ArticleTime>{timeConventer(article.createdAt)}</ArticleTime>
              <ArticleH3>{article.writer}</ArticleH3>
              <Score>
                <Item>{article.hit}</Item>
                <Item>{article.like}</Item>
              </Score>
              <ArticleHr/>
            </ArticleA>
          </Article>
        );
      })}
    </Articles>
  ) : (
    <p>작성된 글이 없습니다.</p>
  );
};

export default BoardTable;
