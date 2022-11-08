import { useHistory } from "react-router-dom";
import {timeConventer} from "../../../common/refineData/refineTime"
import styled from "styled-components";

const Articles = styled.div`
  position: relative;
  margin: 0 auto;
  max-width: 1180px;
`
const Article = styled.article`
  margin-bottom: -1px;
  box-sizing: border-box;
  border: 1px solid #F9F5EB;
  background-color: #fff;
`
const ArticleDiv = styled.div`
  margin: 0;
  padding: 16px;
  display: block;
`
const ArticleH2 = styled.h2`
  margin: 0;
  margin-bottom: 5px;
  line-height: 18px;
  white-space: break-spaces;
  overflow: hidden;
  font-size: 14px;
  font-weight: normal;
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
const ArticleH3 = styled.h3`
  margin: 0;
  padding: 0;
  float: left;
  max-width: 200px;
  height: 15px;
  line-height: 15px;
  font-size: 11px;
  font-weight: normal;
  letter-spacing: 0;
  white-space: nowrap;
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

  return props.articles.length ? (
    <Articles>
      <Title>
        <H1>문의글 내역</H1>
      </Title>
      {props.articles.map((article) => {
        return (
          <Article key={article._id}>
            <ArticleDiv>
                <div style={{display: "flex", justifyContent: "space-between"}}>
                    <ArticleH2>{article.content}</ArticleH2>
                </div>
                <ArticleTime>{article.createdAt}</ArticleTime>
                <ArticleH3>{article.writer}</ArticleH3>
                <ArticleHr/>
            </ArticleDiv>
          </Article>
        );
      })}
    </Articles>
  ) : (
    <Articles>
      <Title>
        <H1>작성된 글이 없습니다.</H1>
      </Title>
    </Articles>
  );
};

export default BoardTable;
