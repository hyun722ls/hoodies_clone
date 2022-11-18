import { useEffect } from "react";
import { useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import Header from "../../../common/UI/header/header";
import { createArticle, modifyArticle, previewImg, uploadImg } from "../boardAPI";
import styled from "styled-components";
import { style } from "@mui/system";
import Swal from "sweetalert2";
import CloseIcon from '@mui/icons-material/Close';
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import { IMAGE_URL } from "../../../common/api/url";
import { SignalCellularNull } from "@material-ui/icons";

const Articles = styled.div`
  position: relative;
  margin: 24px auto;
  padding: 0 24px;
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
  min-width: 200px;
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
const ImageList = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  margin: 4px;
`
const ImageInput = styled.input`
  display: none;
`
const ImageCard = styled.div`
  position: relative;
  display: inline-flex;
  align-items: center;
  margin: 4px;
  padding: 4px;
  height: 200px;
  border: 1px solid #EAE3D2;
`
const StyledCloseIcon = styled(CloseIcon)`
  cursor: pointer;
  position: absolute;
  right: 0;
  top: 0;
`
const StyledImg = styled.img`
  max-height: 200px;
  max-width: 200px;
`
const ImgName = styled.pre`
  margin-right: 4px;
`
const ImageIcon = styled(AddAPhotoIcon)`
  cursor: pointer;
  margin: 4px;
`

const ArticleForm = () => {
  const [article, setArticle] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imgSrc, setImgSrc] = useState([]);
  const [imgList, setImgList] = useState([]);
  const history = useHistory();
  const location = useLocation();

  useEffect(() => {
    if (location.state) {
      setArticle(location.state);
      setTitle(location.state.title);
      setContent(location.state.content);
      if (location.state.filePaths) {
        const imgUrl = location.state.filePaths.map((filePath) => {
          return IMAGE_URL + filePath
        })
        location.state.filePaths.forEach(async (filePath) => {
          const url = IMAGE_URL + filePath
          const response = await fetch(url, {
            mode: 'cors',
          });
          const data = await response.blob();
          const ext = url.split('.').pop();
          const filename = url.split('/').pop();
          const metadata = { type: `image/${ext}` };
          
          const file = new File([data], filename, metadata);
          setImgList((prev)=> [...prev, file])
          
        })
       
        setImgSrc(imgUrl)
        
      }
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {}, [imgSrc])
  
  const backHandler = (event) => {
    history.go(-1);
    // history.push("/board/free");
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
      const formData = new FormData()
      if(imgList.length > 0){
        imgList.forEach((file) => {
          formData.append('files', file)
        })
      } else{
        const test = null
        formData.append('files', test)
      }      
      const imgResponse = await uploadImg(id, formData)
      if (imgResponse?.statusCode === 200) {
        Swal.fire({
          title: '수정완료',
          icon: 'success',
          timer: 2000,
          timerProgressBar: true,
          showConfirmButton: false,
        })
        history.push({ pathname: "/board/free/detail", state: article._id });
      } else {
        Swal.fire({
          title: '수정실패',
          icon: 'error',
          timer: 2000,
          timerProgressBar: true,
        })
      }

    }
    
  };

  const createRequestHandler = async (event) => {
    event.preventDefault();
    const response = await createArticle(title, content)
    if (imgList.length > 0) {
      const formData = new FormData()
      imgList.forEach((file) => {
        formData.append('files', file)
      })
      const imgResponse = await uploadImg(response._id,formData)
      if (imgResponse) {
        Swal.fire({
          title: '등록완료',
          icon: 'success',
          timer: 2000,
          timerProgressBar: true,
          showConfirmButton: false,
        })
        history.push("/board/free");
        
  
      } else {
        Swal.fire({
          title: '등록실패',
          icon: 'error',
          timer: 2000,
          timerProgressBar: true,
        })
      }
    } else {
      if (response) {
        Swal.fire({
          title: '등록완료',
          icon: 'success',
          timer: 2000,
          timerProgressBar: true,
          showConfirmButton: false,
        })
        history.push("/board/free");
        
  
      } else {
        Swal.fire({
          title: '등록실패',
          icon: 'error',
          timer: 2000,
          timerProgressBar: true,
        })
      }
    }
  };

  const handleAddImages = async (event) => {
    const imageLists = Array.from(event.target.files).map(file => file);
    const formData = new FormData()
    document.querySelector('#imgUpload').value = ''

    imageLists.forEach((file)=> {
      formData.append('files', file)
    })
    const response = await previewImg(formData)
    const message = []
    const censored = []
    response.forEach((str,index) => {
      if (str !== false) {
        if (!message.includes(str)) {
          message.push(str)
        }
        censored.push(index)
      }
    })
    if (message.length > 0) {
      Swal.fire({
        title: `${[...message]} 이미지가 감지되었습니다.`,
        icon: 'warning'
      })
    }
    const censoredImg = imageLists.filter((file,idx) => !censored.includes(idx))
    if (censoredImg.length + imgList.length < 5){
      let imageUrlLists = [...imgSrc];
      censoredImg.forEach((file) => {
        imageUrlLists.push(URL.createObjectURL(file))
      })
      setImgSrc(imageUrlLists)
      setImgList((prev) => [...prev, ...censoredImg])  

    } else {
      Swal.fire({
        title: '이미지는 4장 까지만 업로드 가능합니다',
        icon: 'warning',
        timer: '2000'
      })
    }
  }

  const deleteImageHandler = (id) => {
    const newImgList = imgList.filter((_,idx) => idx !== id)
    const newImgSrc = imgSrc.filter((_,idx) => idx !== id)
    setImgSrc(newImgSrc)
    setImgList(newImgList)
  }

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
            <Textarea
              value={content}
              onChange={contentChangeHandler}
              placeholder="내용을 입력하세요"
              rows="15"
              required
            />
            <ImageList>
                {imgSrc.map((img, id) => (
                  <ImageCard key={id} >
                    <StyledImg src={img} alt={`${img}`} />
                    {/* <ImgName>{imgList[id].name}</ImgName> */}
                    <StyledCloseIcon onClick={() => deleteImageHandler(id)}/>
                  </ImageCard>
                ))}
            </ImageList>
            <label htmlFor="imgUpload" onChange={handleAddImages}>
              <ImageIcon fontSize="large" />
              <ImageInput type="file" id="imgUpload" multiple></ImageInput>
            </label>
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
              <ImageList>
                {imgSrc.map((img, id) => (
                  <ImageCard key={id} >
                    <StyledImg src={img} alt={`${img}`} />
                    {/* <ImgName>{imgList[id].name}</ImgName> */}
                    <StyledCloseIcon onClick={() => deleteImageHandler(id)}/>
                  </ImageCard>
                ))}
              </ImageList>
              <label htmlFor="imgUpload" onChange={handleAddImages}>
                <ImageIcon fontSize="large" />
                <ImageInput type="file" id="imgUpload" multiple></ImageInput>
              </label>
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

export default ArticleForm;
