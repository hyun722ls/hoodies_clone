import { useEffect } from "react";
import { useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import Header from "../../../common/UI/header/header";
import { createArticle, modifyArticle } from "../anonymousBoardAPI";
import styled from "styled-components";
import { style } from "@mui/system";
import Swal from "sweetalert2";

const Articles = styled.div`
  position: relative;
  grid-column: 1/3;
  grid-row: 1;
  margin: 24px auto;
  max-width: 720px;
`

const ArticleHead = styled.div`
  margin-bottom: 1px;
  box-sizing: border-box;
  background-color: #fff;
`
const ArticleBody= styled.div`
  box-sizing: border-box;
  background-color: #fff;
`
const Textarea= styled.textarea`
  width: 98%;
  margin: 4px;
  border: 2px solid #EAE3D2;
  border-radius: 5px;
  resize : none
`
const Input = styled.input`
  width: 45%;
  margin: 4px;
  height: 24px;
  border: 2px solid #EAE3D2;
  border-radius: 5px;
  font-size: 16px;
`

const H3 = styled.h3`
  margin: 8px 4px;
  color: #1D3979;
`

const BtnBox = styled.div`
  display: flex;
  justify-content: space-between;
`
const Btn = styled.button`
  margin: 4px;
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
const BtnCancle = styled(Btn)`
  background-color: #F9F5EB;
  &:hover {
    background-color: #EAE3D2;
  }
`

const AnnoymousArticleForm = () => {
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
    history.go(-1);
    // history.push("/board/annoymous");
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
    if (response){
      Swal.fire({
        title: '등록완료',
        icon: 'success',
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false,
      })
      history.push({ pathname: "/board/annoymous/detail", state: article._id });
      
    } else {
      Swal.fire({
        title: '등록실패',
        icon: 'error',
        timer: 2000,
        timerProgressBar: true,
      })
    }
   
  };

  const createRequestHandler = async (event) => {
    event.preventDefault();
    const response = await createArticle(title, content)
    if (response) {
      Swal.fire({
        title: '등록완료',
        icon: 'success',
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false,
      })
      history.push("/board/annonymous");
      

    } else {
      Swal.fire({
        title: '등록실패',
        icon: 'error',
        timer: 2000,
        timerProgressBar: true,
      })
    }
  };
  return (
    !isLoading &&
    (article ? (
      <div>
        <Header />
        <Articles>
          <form onSubmit={modifyRequestHandler} id="fix">
          <ArticleHead>
            <H3>게시글 수정 페이지</H3>
              <div>
                <Input
                  type="text"
                  value={title}
                  onChange={titleChangeHandler}
                  placeholder="제목을 입력하세요"
                  required
                />
              </div>          
          </ArticleHead>
          <ArticleBody>
            <div>
              <Textarea
                value={content}
                onChange={contentChangeHandler}
                placeholder="내용을 입력하세요"
                rows="15"
                required
              />
            </div>
          </ArticleBody>
          </form>
          <BtnBox>
            <BtnCancle onClick={backHandler}>뒤로 가기</BtnCancle>
            <Btn type="submit" form="fix">수정</Btn>
          </BtnBox>
        </Articles>
      </div>
    ) : (
      <div>
        <Header />
        <Articles>
          <form onSubmit={createRequestHandler} id="new">
          <ArticleHead>
            <H3>게시글 작성 페이지</H3>
              <div>
                <Input
                  type="text"
                  value={title}
                  onChange={titleChangeHandler}
                  placeholder="제목을 입력하세요"
                  required
                />
              </div>
          </ArticleHead>
          <ArticleBody>
              <Textarea
                value={content}
                onChange={contentChangeHandler}
                placeholder="내용을 입력하세요"
                rows="15"
                required
              />
          </ArticleBody>
          </form>
          <BtnBox>
            <BtnCancle onClick={backHandler}>뒤로 가기</BtnCancle>
            <Btn type="submit" form="new">등록</Btn>
          </BtnBox>
        </Articles>
      </div>
    ))
  );
};

export default AnnoymousArticleForm;
