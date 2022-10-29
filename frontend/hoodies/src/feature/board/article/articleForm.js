import { useEffect } from "react";
import { useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import Header from "../../../common/UI/header/header";
import { createArticle, modifyArticle } from "../boardAPI";

const ArticleForm = () => {
  const [article, setArticle] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const history = useHistory();
  const location = useLocation();

  useEffect(() => {
    if (location.state) {
      setArticle(location.state);
      setTitle(location.state.title);
      setContent(location.state.content);
    }
    setIsLoading(false);
  }, []);

  const backHandler = (event) => {
    // history.go(-1);
    history.push("/board/free");
  };

  const titleChangeHandler = (event) => {
    event.preventDefault();
    setTitle(event.target.value);
  };

  const contentChangeHandler = (event) => {
    event.preventDefault();
    setContent(event.target.value);
  };

  const modifyRequestHandler = async (event) => {
    event.preventDefault();
    const id = location.state?._id
    const response = await modifyArticle(title, content, id)
    if (response) {
      alert('등록완료')
      history.push({ pathname: "/board/free/detail", state: response });
      

    } else {
      alert('등록실패')
    }
   
  };

  const createRequestHandler = async (event) => {
    event.preventDefault();
    const response = await createArticle(title, content)
    if (response) {
      alert('등록완료')
      history.push("/board/free");
      

    } else {
      alert('등록실패')
    }
  };
  return (
    !isLoading &&
    (article ? (
      <div>
        <Header />
        <h3>게시글 수정 페이지</h3>
        <form onSubmit={modifyRequestHandler}>
          <div>
            <h5>제목</h5>
            <input
              type="text"
              value={title}
              onChange={titleChangeHandler}
              placeholder="제목을 입력하세요"
              required
            />
          </div>
          <div>
            <h5>내용</h5>
            <textarea
              value={content}
              onChange={contentChangeHandler}
              placeholder="내용을 입력하세요"
              required
            />
          </div>
          <div>
            <button type="submit">수정</button>
          </div>
        </form>
        <button onClick={backHandler}>뒤로 가기</button>
      </div>
    ) : (
      <div>
        <Header />
        <h3>게시글 작성 페이지</h3>
        <form onSubmit={createRequestHandler}>
          <div>
            <h5>제목</h5>
            <input
              type="text"
              value={title}
              onChange={titleChangeHandler}
              placeholder="제목을 입력하세요"
              required
            />
          </div>
          <div>
            <h5>내용</h5>
            <textarea
              value={content}
              onChange={contentChangeHandler}
              placeholder="내용을 입력하세요"
              required
            />
          </div>
          <div>
            <button type="submit">등록</button>
          </div>
        </form>
        <button onClick={backHandler}>뒤로 가기</button>
      </div>
    ))
  );
};

export default ArticleForm;
