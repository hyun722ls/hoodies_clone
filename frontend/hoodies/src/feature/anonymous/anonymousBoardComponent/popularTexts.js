import { useHistory } from "react-router-dom";
import { blockArticle } from "../../../common/refineData/blockArticle";
import styled from "styled-components";
import { changeAnonymous, checkBoardType } from "../../../common/refineData/anonymousWriter";
import { blockCnt } from "../../../common/api/url";
import Swal from "sweetalert2";
import Grid from "@mui/material/Grid";
import {timeConventer} from "../../../common/refineData/refineTime";
import { isAdmin } from "../../../common/api/isLogin";

const RightArticles = styled.div`
  width: 100%;
  background-color: #F9F5EB;
`
const Article = styled.article`
  margin-bottom: -1px;
  box-sizing: border-box;
  border: 1px solid #EAE3D2;
  cursor: pointer;
`

const ArticleA = styled.a`
  margin: 0;
  padding: 14px;
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

const Title = styled.div`
  padding: 16px;
  border: 1px solid #EAE3D2;
  box-sizing: border-box;
`

const H2 = styled.h2`
  color: #1D3979;
  margin: 0;
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

const PopularTexts = (props) => {
  const history = useHistory();

  const detailPageHandler = (article) => {
    if (article.reporter?.length > blockCnt && !isAdmin()){
      Swal.fire({
        title: '신고 누적된 게시글입니다.',
        icon: 'error',
        timer: 2000,
        timerProgressBar: true,
      })
    } else {
      if (article.type === 1){
        history.push({ pathname: "/board/free/detail", state: article._id });
      } else if(article.type === 2) {
        history.push({ pathname: "/board/anonymous/detail", state: article._id });
      } else {
        history.push({ pathname: "/board/coding/detail", state: article._id });
      }
    }
  };

  const isFilter = (article) => {
    if (blockArticle(article, article.category) === article.title) {
      return 1
    } else {
      return 0
    }
  };

  return props.popularTexts.length ? (
      <Grid item xs={12} md={3} sx={{margin:"10px"}}>
        <RightArticles>
          <Title>
            <H2>인기게시글</H2>
          </Title>
          {props.popularTexts.map((article) => {
            return (
                <Article key={article._id}>
                  <ArticleA
                      onClick={() => {
                        detailPageHandler(article);
                      }}>
                    <div style={{display: "flex", justifyContent: "space-between"}}>
                      {isFilter(article) ?
                          <ArticleH2>{blockArticle(article, article.category)}</ArticleH2>
                          : <ArticleH2_filter>{blockArticle(article, article.category)}</ArticleH2_filter>}
                      <ArticleH3 style={{color: "darkblue"}}>-{checkBoardType(article)}-</ArticleH3> {/*여기에 게시판 이름 넣기!*/}
                    </div>
                    <ArticleTime>{timeConventer(article.createdAt)}</ArticleTime>
                    <ArticleH3>{changeAnonymous(article)}</ArticleH3>
                    <Score>
                      <Item style={{fontSize: "2px"}}>조회수</Item><Item>&nbsp;{article.hit}&nbsp;</Item>
                      <Item style={{color: "red", fontSize: "2px"}}>추천수</Item><Item style={{color: "red"}}>&nbsp;{article.like}</Item>
                    </Score>
                    <ArticleHr/>
                  </ArticleA>
                </Article>
            );
          })}
        </RightArticles>
      </Grid>
  ) : (
    <p>작성된 글이 없습니다.</p>
  );
};

// 이거는 리스트 처리로

export default PopularTexts;
