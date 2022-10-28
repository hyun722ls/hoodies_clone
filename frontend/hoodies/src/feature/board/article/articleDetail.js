import { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import Header from "../../../common/UI/header/header";
import { createComment, deleteComment, fetchArticle, modifyComment } from "../boardAPI";
import CommentList from "./commentList";

const ArticleDetail = () => {
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
    history.push({ pathname: "/board/free/form", state: article });
  };

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
    if (response){
      const response1 = await fetchArticle(location.state._id)
      setArticle(response1)
      setComments(response1.comments)
    }
    else {
      const response1 = await fetchArticle(location.state._id)
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
    if (response){
      const response1 = await fetchArticle(location.state._id)
      setArticle(response1)
      setComments(response1.comments)
    }
    else {
      const response1 = await fetchArticle(location.state._id)
      setArticle(response1)
      setComments(response1.comments)
     
    }
  };

  useEffect(() => {
    if (location.state) {
      setArticle(location.state);
      setComments(location.state.comments);
    } else {
      alert("잘못된 접근입니다.");
      history.push("/index");
    }
    setIsLoading(false);
  }, []);
  return (
    !isLoading &&
    comments && (
      <div>
        <Header />
        <h4>{article.title}</h4>
        <div>
          <p>작성시간 : {article.createdAt}</p>
          <p>조회수 : {article.hit}</p>
          <p>추천수 : {article.like}</p>
          <p>작성자 : {article.writer}</p>
        </div>
        <p>{article.content}</p>
        <div>
          <button onClick={backHandler}>뒤로 가기</button>
          
          {article.writer === localStorage.getItem('nickname') && <button onClick={modifyHandler}>수정</button>}
        </div>
        <CommentList
          comments={comments}
          setArticle={setArticle}
          setComments={setComments}
          deleteCommentHandler={deleteCommentHandler}
          modifyCommentHandler={modifyCommentHandler}
          createCommentHandler={createCommentHandler}
        />
      </div>
    )
  );
};

export default ArticleDetail;
