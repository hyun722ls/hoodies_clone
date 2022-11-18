import { useState } from "react";
import styled from "styled-components";
import { isAdmin } from "../../../common/api/isLogin";
import { blockComment } from "../../../common/refineData/blockArticle";

const StyledCommentList = styled.ul`
  margin: 8px 0;
  padding: 0;
  list-style: none;
`;
const StyledComment = styled.div`
  display: flex;
  padding: 8px 4px;
  box-sizing: border-box;
  border-bottom: 1px solid #f9f5eb;
  background-color: #fff;
`;
const Nickname = styled.div`
  display: block;
  font-size: 12px;
  min-width: 132px;
`;
const StyledContent = styled.div`
  font-size: 13px;
  width: 100%;
  word-break: keep-all;
`;

const StyledContentFilter = styled.div`
  color: #ff5f5f;
  width: 100%;
`

const Hr = styled.hr`
  margin: 0;
  padding: 0;
  clear: both;
  height: 0;
  border: 0;
`;
const ButtonList = styled.div`
  display: flex;
  justify-content: end;
  width: 88px;
`;
const StyledButton = styled.button`
  margin: 0 4px;
  min-width: 40px;
  border: 0;
  background-color: inherit;
  font-size: 12px;
  &:hover {
    cursor: pointer;
  }
`;

const CommentForm = styled.form`
  width: 100%;
  margin: 8px auto;
  display: flex;
`;
const CommentInput = styled.input`
  width: 95%;
`;
const CommentArea = styled.textarea`
  margin: 8px 0 8px 0;
  width: 780px;
  resize: none;
`;
const CommentButton = styled.button`
  margin: 8px;
  top: 0;
  min-width: 80px;
  height: 76px;
  border: 1px solid #f9f5eb;
  background-color: #eae3d2;
  color: #1d3979;
  border-radius: 8px;
  font-weight: bold;
  word-break: keep-all;
  &:hover {
    background-color: #d9d2c3;
    cursor: pointer;
  }
`;

const CommentList = (props) => {
  const [modifyForm, setModifyForm] = useState(false);
  const [modifyContent, setModifyContent] = useState("");
  const [commentId, setCommentId] = useState(null);
  const [newContent, setNewContent] = useState("");

  const openModifyForm = (id, content) => {
    setCommentId(id);
    setModifyForm(true);
    setModifyContent(content);
  };

  const modifyContentChangeHandler = (event) => {
    event.preventDefault();
    setModifyContent(event.target.value);
  };

  const modifyHandler = (event) => {
    event.preventDefault();
    props.modifyCommentHandler(commentId, modifyContent);
    setModifyContent("");
    setModifyForm(false);
    setCommentId(null);
  };

  const createHandler = (event) => {
    event.preventDefault();
    props.createCommentHandler(newContent);
    setNewContent("");
  };

  const newContentChangeHandler = (event) => {
    event.preventDefault();
    setNewContent(event.target.value);
  };

  return props.comments.length ? (
    <div>
      <StyledCommentList>
        {props.comments.map((comment) => {
          return (
            <li key={comment._id}>
              <StyledComment>
                <Nickname>{comment.writer}</Nickname>
                  {modifyForm && commentId === comment._id ? (
                      <StyledContent style={comment.content === blockComment(comment) ? {color:'black'} : {color:'#ff5f5f'}}>
                        <form onSubmit={modifyHandler} id="Mod">
                          <CommentInput
                            type="text"
                            value={modifyContent}
                            onChange={modifyContentChangeHandler}
                            placeholder="댓글을 입력하세요"
                          />
                        </form>
                      </StyledContent>
                  ) : (
                      <StyledContentFilter style={comment.content === blockComment(comment) ? {color:'black'} : {color:'#ff5f5f'}}>{isAdmin() ? `${comment.content}`  : blockComment(comment)}</StyledContentFilter>
                  )}
                <ButtonList>
                  {modifyForm && commentId === comment._id && (
                    <StyledButton type="submit" form="Mod">
                      확인
                    </StyledButton>
                  )}
                  {/*<button onClick={() => props.deleteCommentHandler(comment._id)}>*/}
                  {/*  삭제*/}
                  {/*</button>*/}
                  {comment.writer === localStorage.getItem("nickname") &&
                    !(modifyForm && commentId === comment._id) && (
                      <StyledButton
                        onClick={() =>
                          openModifyForm(comment._id, comment.content)
                        }
                      >
                        수정
                      </StyledButton>
                    )}
                  {(comment.writer === localStorage.getItem("nickname") ||
                    localStorage.getItem("flag")) && (
                    <StyledButton
                      onClick={() => props.deleteCommentHandler(comment._id)}
                    >
                      삭제
                    </StyledButton>
                  )}
                  {comment.writer !== localStorage.getItem("nickname") && (
                    <StyledButton
                      onClick={() => props.reportCommentHandler(comment)}
                    >
                      신고
                    </StyledButton>
                  )}
                </ButtonList>
                <Hr />
              </StyledComment>
            </li>
          );
        })}
      </StyledCommentList>

      <CommentForm onSubmit={createHandler} id="comment">
        <CommentArea
          type="text"
          value={newContent}
          onChange={newContentChangeHandler}
          placeholder="댓글을 입력하세요"
          rows="5"
        />
        <CommentButton type="submit" form="comment">
          댓글 등록
        </CommentButton>
        <Hr />
      </CommentForm>
    </div>
  ) : (
    <div>
      <p>댓글이 없습니다.</p>
      <CommentForm onSubmit={createHandler}>
        <CommentArea
          type="text"
          value={newContent}
          onChange={newContentChangeHandler}
          placeholder="댓글을 입력하세요"
          rows="5"
        />
        <CommentButton type="submit">댓글 등록</CommentButton>
        <Hr />
      </CommentForm>
    </div>
  );
};

export default CommentList;
