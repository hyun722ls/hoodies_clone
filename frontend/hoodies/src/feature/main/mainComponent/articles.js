import { useHistory } from "react-router-dom";
import ReadMoreIcon from "@mui/icons-material/ReadMore";
import { blockArticle } from "../../../common/refineData/blockArticle";
import { timeConventer } from "../../../common/refineData/refineTime";
import Grid from '@mui/material/Grid';
import styled from "styled-components";

const Article = styled.article`
  margin-bottom: -1px;
  box-sizing: border-box;
  border: 1px solid #F9F5EB;
  background-color: #fff;
  cursor: pointer;
`

const Title = styled.div`
  font-size: 10px;
  margin-bottom: -10px;
  padding: 16px;
  border: 1px solid #F9F5EB;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  background-color: #F9F5EB;
`

const H1 = styled.h1`
  margin: 0;
`

const ArticleA = styled.a`
  margin: 0;
  padding: 12px;
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
  font-size: 14px;
  font-weight: normal;
  width: 350px;
  padding: 5px;
  color: cadetblue;
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

const Articles = (props) => {
const history = useHistory();

const freeBoardHandler = () => {
  history.push("/board/free");
};
const detailPageHandler = (article) => {
  history.push({ pathname: "/board/free/detail", state: article._id });
};

const isFilter = (article) => {
    if (blockArticle(article, article.category) === article.title) {
        return 1
    } else {
        return 0
    }
}

return props.articles.length ? (
  <Grid item sx={{ margin: '10px'}} xs={11.9} md={5.7}>
    <div>
        <Title>
            <H1>자유게시판 최신글</H1>
            <ReadMoreIcon
                fontSize="large"
                onClick={() => {
                    freeBoardHandler();
                }}
            />
        </Title>
    </div>
        {props.articles.map((article) => {
          return (
              <Article key={article._id}>
                  <ArticleA onClick={() => {
                      detailPageHandler(article);
                  }}>
                      {isFilter(article) ?
                          <ArticleH2>{blockArticle(article, article.category)}</ArticleH2>
                          : <ArticleH2_filter>{blockArticle(article, article.category)}</ArticleH2_filter>}
                      <ArticleTime>{timeConventer(article.createdAt)}</ArticleTime>
                      <ArticleH3>{article.writer}</ArticleH3>
                      <Score>
                          <Item>{article.hit}</Item>
                          <Item>{article.like}</Item>
                      </Score>
                      <ArticleHr/>
                  </ArticleA>
              </Article>

            //     { isFilter(article) ? <td>{article.title}</td> : <td_filter>{blockArticle(article, article.category)}</td_filter>}
            //     <td>{article.writer}</td>
            //     <td>{timeConventer(article.createdAt)}</td>
            //     <td>{article.hit}</td>
            //
            // </tr>
          );
        })}
  </Grid>
) : (
    <Grid item xs={12} md={6}>작성된 글이 없습니다.</Grid>
  );
};

export default Articles;
