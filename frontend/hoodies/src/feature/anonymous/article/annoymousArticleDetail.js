import { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import Header from "../../../common/UI/header/header";
import {createComment, deleteArticle, deleteComment, fetchArticle, modifyComment} from "../anonymousBoardAPI";
import CommentList from "./commentList";
import styled from "styled-components";

const Articles = styled.div`
  position: relative;
  float: none;
  left: 24px;
  margin: 24px auto;
  width: 780px;
`
const ArticleHead = styled.div`
  margin-bottom: -1px;
  box-sizing: border-box;
  border-bottom: 2px solid #EAE3D2;
  background-color: #fff;
`
const ArticleH2 = styled.h2`
  margin: 0;
  margin-bottom: 5px;
  line-height: 18px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-weight: bold;
  font-size: 16px;
`
const ArticleH3 = styled.h3`
  margin: 0;
  margin-right: 5px;
  padding: 0;
  float: left;
  max-width: 90px;
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
`
const ArticleBody= styled.div`
  min-height: 320px;
  box-sizing: border-box;
  border-bottom: 2px solid #EAE3D2;
  background-color: #fff;
`

const StyledButton = styled.button`
  margin: 0 4px;
  min-width: 80px;
  height: 32px;
  border: 1px solid #F9F5EB;
  background-color: #EAE3D2;
  color: #1D3979;
  border-radius: 8px;
  font-weight: bold;
  &:hover {
    background-color: #D9D2C3;
    cursor: pointer;
  }
`
const RightButton = styled.button`
  float: right;
  margin: 0 4px;
  min-width: 80px;
  height: 32px;
  border: 1px solid #F9F5EB;
  background-color: #EAE3D2;
  color: #1D3979;
  border-radius: 8px;
  font-weight: bold;
  &:hover {
    background-color: #D9D2C3;
    cursor: pointer;
  }
`
const BtnCancle = styled(RightButton)`
  background-color: #F9F5EB;
  &:hover {
    background-color: #EAE3D2;
  }
`

const AnnoymousArticleDetail = () => {
  const location = useLocation();
  const [article, setArticle] = useState([]);
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const history = useHistory();

  const backHandler = (event) => {
    history.go(-1);
  };
  // 요청설개할것, 수정페이지에서 넘길때 새로운정보 필요

  const modifyHandler = (event) => {
    history.push({ pathname: "/board/annoymous/form", state: article });
  };

  const deleteHandler = async (event) => {
    const response = await deleteArticle(article._id)
    if (response) {
      history.push('/board/free');
    }
  }

  const deleteCommentHandler = async (commentId) => {
    const response = await deleteComment(article._id, commentId)
    if (response){
      const response1 = await fetchArticle(article._id)
      setArticle(response1)
      setComments(response1.comments)
    } else {
      const response1 = await fetchArticle(article._id)
      setArticle(response1)
      setComments(response1.comments)
    }
  };

  const modifyCommentHandler = async (commentId, newContent) => {
    const response = await modifyComment(article._id, commentId, newContent)
    if (response.statusCode === 200){
      const response1 = await fetchArticle(location.state)
      setArticle(response1)
      setComments(response1.comments)
    }
    else {
      const response1 = await fetchArticle(location.state)
      setArticle(response1)
      setComments(response1.comments)
     
    }
    // const newComments = [...comments];
    // const index = comments.findIndex((comment) => comment.id === commentId);
    // newComments[index].content = newContent;
    // setComments(newComments);
  };

  const createCommentHandler = async (newContent) => {
    const response = await createComment(article._id, newContent)
    if (response.statusCode === 200){
      const response1 = await fetchArticle(location.state)
      setArticle(response1)
      setComments(response1.comments)
    }
    else {
      const response1 = await fetchArticle(location.state)
      setArticle(response1)
      setComments(response1.comments)
     
    }
  };

  useEffect(() => {
    (async () => {
      if (location.state) {
        const response = await fetchArticle(location.state)
        setArticle(response);
        setComments(response.comments);
      } else {
        alert("잘못된 접근입니다.");
        history.push("/index");
      }
      setIsLoading(false);
    })()
  }, []);
  return (
    !isLoading &&
    comments && (
      <div>
        <Header />
        <Articles>ㄴ
          <ArticleHead>
            <ArticleH2>{article.title}</ArticleH2>
            <ArticleH3>{article.writer}</ArticleH3>
            <ArticleTime>{article.createdAt} {article.createdAt !== article.modifiedAt && <span>(수정됨 {article.modifiedAt})</span>} </ArticleTime>
            <Score>
              <Item>추천수 : {article.like}</Item>
              <Item>조회수 : {article.hit}</Item>
            </Score>
            <ArticleHr />
          </ArticleHead>
          <ArticleBody>
            <p>{article.content}</p>
          </ArticleBody>
        <CommentList
          comments={comments}
          setArticle={setArticle}
          setComments={setComments}
          deleteCommentHandler={deleteCommentHandler}
          modifyCommentHandler={modifyCommentHandler}
          createCommentHandler={createCommentHandler}
        />
        <div>
          <StyledButton onClick={backHandler}>목록보기</StyledButton>
          
          {article.writer === localStorage.getItem('nickname') && <RightButton onClick={modifyHandler}>수정</RightButton>}
          {article.writer === localStorage.getItem('nickname') && <BtnCancle onClick={deleteHandler}>삭제</BtnCancle>}
        </div>
        </Articles>
      </div>
    )
  );
};

export default AnnoymousArticleDetail;
