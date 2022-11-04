import { useHistory } from "react-router-dom";
import { blockArticle } from "../../../common/refineData/blockArticle";
import styled from "styled-components";
import { changeAnnonymous, checkBoradType } from "../../../common/refineData/anonymousWriter";
import { blockCnt } from "../../../common/api/url";

const RightArticles = styled.div`
  grid-column: 3/4;
  grid-row: 1;
  width: 320px;
  margin-bottom: auto;
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
    if (article.reporter?.length > blockCnt){
      alert('신고 누적된 게시글입니다.')
    } else {
      if (article.type === 1){
        history.push({ pathname: "/board/free/detail", state: article._id });
    
      } else {
        history.push({ pathname: "/board/annoymous/detail", state: article._id });
      }
    

    }
  };
 
  return props.popularTexts.length ? (
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
                }}
              >
                <ArticleH2>{blockArticle(article, article.category)}</ArticleH2>
                <ArticleH3>{checkBoradType(article)}</ArticleH3>
                <ArticleH3>{changeAnnonymous(article)}</ArticleH3>
                <ArticleHr />
              </ArticleA>
            </Article>
          );
        })}
    </RightArticles>
  ) : (
    <p>작성된 글이 없습니다.</p>
  );
};

// 이거는 리스트 처리로

export default PopularTexts;
