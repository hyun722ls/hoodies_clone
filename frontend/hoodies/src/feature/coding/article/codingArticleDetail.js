import { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import Header from "../../../common/UI/header/header";
import '@toast-ui/editor/dist/toastui-editor-viewer.css';
import { Viewer } from '@toast-ui/react-editor';
import {
  createComment,
  deleteArticle,
  deleteComment,
  fetchArticle,
  fetchLike,
  modifyComment,
  reportArticle,
  reportComment,
} from "../codingBoardAPI";
import CommentList from "./commentList";
import styled from "styled-components";
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import Tooltip from '@mui/material/Tooltip';
import Swal from "sweetalert2";

const Articles = styled.div`
  position: relative;
  float: none;
  margin: 24px auto;
  padding: 0 24px;
  max-width: 780px;
`;
const ArticleHead = styled.div`
  margin-bottom: -1px;
  box-sizing: border-box;
  border-bottom: 2px solid #eae3d2;
  background-color: #fff;
`;
const ArticleH2 = styled.h2`
  margin: 0;
  margin-bottom: 5px;
  line-height: 18px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-weight: bold;
  font-size: 16px;
`;
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
`;
const ArticleTime = styled.time`
  margin: 0;
  padding: 0;
  float: left;
  margin-right: 5px;
  height: 15px;
  line-height: 15px;
  font-size: 11px;
  color: #a6a6a6;
`;
const ArticleHr = styled.hr`
  margin: 0;
  padding: 0;
  clear: both;
  height: 0;
  border: 0;
  width: 100%;
`;
const Score = styled.ul`
  margin: 0;
  padding: 0;
  float: right;
  list-style: none;
`;
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
`;
const ArticleBody = styled.div`
  min-height: 320px;
  box-sizing: border-box;
  border-bottom: 2px solid #eae3d2;
  background-color: #fff;
`;

const StyledButton = styled.button`
  margin: 0 4px;
  min-width: 80px;
  height: 32px;
  border: 1px solid #f9f5eb;
  background-color: #eae3d2;
  color: #1d3979;
  border-radius: 8px;
  font-weight: bold;
  &:hover {
    background-color: #d9d2c3;
    cursor: pointer;
  }
`;
const RightButton = styled.button`
  float: right;
  margin: 0 4px;
  min-width: 80px;
  height: 32px;
  border: 1px solid #f9f5eb;
  background-color: #eae3d2;
  color: #1d3979;
  border-radius: 8px;
  font-weight: bold;
  &:hover {
    background-color: #d9d2c3;
    cursor: pointer;
  }
`;
const BtnCancle = styled(RightButton)`
  background-color: #f9f5eb;
  &:hover {
    background-color: #eae3d2;
  }
`;

const CodeArticleDetail = () => {
  const location = useLocation();
  const [article, setArticle] = useState([]);
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLike, setIsLike] = useState(false);
  const history = useHistory();

  const backHandler = (event) => {
    // history.go(-1);
    history.push({ pathname: "/board/coding" });
  };
  // 요청설개할것, 수정페이지에서 넘길때 새로운정보 필요

  const modifyHandler = (event) => {
    history.push({ pathname: "/board/coding/form", state: article });
  };

  const deleteHandler = async (event) => {
    Swal.fire({
      title: '삭제하시겠습니까?',
      showCancelButton: true,
      cancelButtonText: '취소',
      confirmButtonText: '삭제',
      reverseButtons: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        const response = await deleteArticle(article._id);
        if (response.statusCode === 200) {
          history.push("/board/coding");
        } else {
          console.log("게시글 삭제");
        }
      }
    })
  };

  const deleteCommentHandler = async (commentId) => {
    Swal.fire({
      title: '삭제하시겠습니까?',
      showCancelButton: true,
      cancelButtonText: '취소',
      confirmButtonText: '삭제',
      reverseButtons: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        const response = await deleteComment(article._id, commentId);
        if (response.statusCode === 200) {
          const response1 = await fetchArticle(article._id);
          setArticle(response1);
          setComments(response1.comments);
        } else {
          console.log("댓글 삭제 에러");
        }
      }
    })
  };

  const modifyCommentHandler = async (commentId, newContent) => {
    if (newContent.trim()) {
      const response = await modifyComment(article._id, commentId, newContent);
      if (response.statusCode === 200) {
        const response1 = await fetchArticle(location.state);
        setArticle(response1);
        setComments(response1.comments);
      } else {
        console.log("댓글 수정 오류");
      }
      // const newComments = [...comments];
      // const index = comments.findIndex((comment) => comment.id === commentId);
      // newComments[index].content = newContent;
      // setComments(newComments);
    } else {
      Swal.fire('댓글을 입력해주세요!')
    }
  };

  const createCommentHandler = async (newContent) => {
    if (newContent.trim()) {
      const response = await createComment(article._id, newContent);
      if (response.statusCode === 200) {
        const response1 = await fetchArticle(location.state);
        setArticle(response1);
        setComments(response1.comments);
      } else {
        console.log("댓글 생성 실패");
      }
    } else {
      Swal.fire('댓글을 입력해주세요!')
    }
  };

  const likeHandler = async (event) => {
    event.preventDefault();
    const response = await fetchLike(location.state);
    if (response.statusCode === 200) {
      const response1 = await fetchArticle(location.state);
   
      setArticle(response1);
      setComments(response1.comments);
      let tmpLike = Object.keys(response1.contributor).includes(
        localStorage.getItem("hashNickname")
      );
      if (
        tmpLike === true &&
        response1.contributor[localStorage.getItem("hashNickname")]
      ) {
        setIsLike(true);
        Swal.fire({
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });
      } else {
        setIsLike(false);
        Swal.fire({
          icon: "error",
          timer: 2000,
          showConfirmButton: false,
        });
      }
    } else {
      console.log("좋아요 실패");
    }
  };

  const reportHandler = async (event) => {
    event.preventDefault();
    if (article.reporter.includes(localStorage.getItem("hashNickname"))) {
      Swal.fire({
        title: "중복된 신고입니다.",
        icon: "warning",
        timer: 2000,
        timerProgressBar: true,
      });
    } else {
      Swal.fire({
        title: '신고하시겠습니까?',
        showCancelButton: true,
        cancelButtonText: '취소',
        confirmButtonText: '신고',
        reverseButtons: true,
      }).then(async (result) => {
        if (result.isConfirmed) {
          const response = await reportArticle(location.state);
          if (response.statusCode === 200) {
            const response1 = await fetchArticle(location.state);
            setArticle(response1);
            setComments(response1.comments);
            Swal.fire({
              title: "게시글이 신고되었습니다.",
              icon: "success",
              timer: 2000,
              timerProgressBar: true,
            });
          } else {
            console.log("신고 실패");
          }
        }
      })
    }
  };

  const reportCommentHandler = async (comment) => {
    if (comment.reporter.includes(localStorage.getItem("hashNickname"))) {
      Swal.fire({
        title: "중복된 신고입니다.",
        icon: "warning",
        timer: 2000,
        timerProgressBar: true,
      });
    } else {
      Swal.fire({
        title: '신고하시겠습니까?',
        showCancelButton: true,
        cancelButtonText: '취소',
        confirmButtonText: '신고',
        reverseButtons: true,
      }).then(async (result) => {
        if (result.isConfirmed) {
          const response = await reportComment(article._id, comment._id);
          if (response.statusCode === 200) {
            const response1 = await fetchArticle(location.state);
            setArticle(response1);
            setComments(response1.comments);
            Swal.fire({
              title: "선택한 댓글이 신고되었습니다.",
              icon: "success",
              timer: 2000,
              timerProgressBar: true,
            });
          } else {
            console.log("댓글 신고 오류");
          }
        }
      })
    }
  };

  useEffect(() => {
    (async () => {
      // 배포용
      if (location.state) {
        const response = await fetchArticle(location.state);
        if(!response){
          history.push('/404')
        }
        setArticle(response);
        setComments(response.comments);
        let tmpLike = Object.keys(response.contributor).includes(
          localStorage.getItem("hashNickname")
        );
        if (
          tmpLike === true &&
          response.contributor[localStorage.getItem("hashNickname")]
        ) {
          setIsLike(response.contributor[localStorage.getItem("hashNickname")]);
        } else {
          setIsLike(false);
        }
      } else {
        Swal.fire({
          title: "잘못된 접근입니다.",
          icon: "warning",
          timer: 2000,
        });
        history.push("/index");
      }
      // setArticle(location.state)
      // setComments(location.state.comments);

      setIsLoading(false);
    })();
  }, []);
  return (
    !isLoading &&
    comments && (
      <div>
        <Header />
        <Articles>
          <ArticleHead>
            <ArticleH2>{article.title}</ArticleH2>
            <ArticleH3>{article.writer}</ArticleH3>
            <ArticleTime>
              {article.createdAt}{" "}
              {article.createdAt !== article.modifiedAt && (
                <span>(수정됨 {article.modifiedAt})</span>
              )}{" "}
            </ArticleTime>
            <Score>
              <Item>추천수 : {article.like}</Item>
                <Tooltip title="추천!">
                    {isLike ? <ThumbUpAltIcon onClick={likeHandler} /> : <ThumbUpOffAltIcon onClick={likeHandler} />}
                </Tooltip>
              <Item>조회수 : {article.hit}</Item>
              <Item>|</Item>

                {localStorage.getItem('nickname') !== article.writer && 
                    <Tooltip title="신고!">
                      <WarningAmberIcon onClick={reportHandler} />
                    </Tooltip>}


            </Score>
            <ArticleHr />
          </ArticleHead>
          <ArticleBody>
            <Viewer initialValue={article.content} />
          </ArticleBody>
          <CommentList
            comments={comments}
            setArticle={setArticle}
            setComments={setComments}
            deleteCommentHandler={deleteCommentHandler}
            modifyCommentHandler={modifyCommentHandler}
            createCommentHandler={createCommentHandler}
            reportCommentHandler={reportCommentHandler}
          />
          <div>
            <StyledButton onClick={backHandler}>목록보기</StyledButton>

            {article.writer === localStorage.getItem("nickname") && (
              <RightButton onClick={modifyHandler}>수정</RightButton>
            )}
            {(article.writer === localStorage.getItem("nickname") ||
              localStorage.getItem("flag")) && (
              <BtnCancle onClick={deleteHandler}>삭제</BtnCancle>
            )}
          </div>
        </Articles>
      </div>
    )
  );
};

export default CodeArticleDetail;
