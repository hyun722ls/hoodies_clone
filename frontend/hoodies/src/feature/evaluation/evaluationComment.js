import { useState } from "react";

const EvaulationComment = (props) => {
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
      {props.comments.map((comment) => {
        return (
          <ul key={comment._id}>
            <li>
              {comment.content}, {comment.writer}
            </li>
            <button onClick={() => props.deleteCommentHandler(comment.id)}>
              삭제
            </button>
            <button onClick={() => openModifyForm(comment.id, comment.content)}>
              수정
            </button>
            {modifyForm && commentId === comment.id && (
              <form onSubmit={modifyHandler}>
                <input
                  type="text"
                  value={modifyContent}
                  onChange={modifyContentChangeHandler}
                  placeholder="댓글을 입력하세요"
                />
                <button type="submit">댓글 수정</button>
              </form>
            )}
          </ul>
        );
      })}

      <form onSubmit={createHandler}>
        <input
          type="text"
          value={newContent}
          onChange={newContentChangeHandler}
          placeholder="댓글을 입력하세요"
        />
        <button type="submit">댓글 등록</button>
      </form>
    </div>
  ) : (
    <div>
      <p>댓글이 없습니다.</p>
      <form onSubmit={createHandler}>
        <input
          type="text"
          value={newContent}
          onChange={newContentChangeHandler}
          placeholder="댓글을 입력하세요"
        />
        <button type="submit">댓글 등록</button>
      </form>
    </div>
  );
};

export default EvaulationComment;
