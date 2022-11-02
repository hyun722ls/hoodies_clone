import { useState } from "react";
import { useHistory, Link, Route } from "react-router-dom";
import CustomModal from "../../../common/UI/modal/customModal";
import { authMM, checkNickname, sendMM, signup } from "../authApi";
import styled from "styled-components";

const Container = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  margin: -280px 0 24px -180px;
  height: 560px;
  width: 360px;

`
const Form = styled.form`
  margin: 0;
  padding: 0;
`
const InputDiv = styled.div`
  margin-bottom: 32px;
  padding: 4px 10px;
  border: 1px solid #d6d6d6;
  background-color: #fff;
`
const Input = styled.input`
  margin: 0;
  padding: 0;
  border: 0;
  width: auto;
  height: 28px;
  line-height: 28px;
  font-size: 16px;
  background-color: transparent;
  outline: none;
  vertical-align: middle;
`
const InputPassword = styled(Input)`
  width: 100%;
`

const InputBtn = styled.button`
  position: absolute;
  right: 4px;
  margin: 0 4px;
  min-width: 80px;
  height: 28px;
  border: 1px solid #F9F5EB;
  background-color: #EAE3D2;
  color: #1D3979;
  border-radius: 5px;
  font-weight: bold;
  &:hover {
    background-color: #D9D2C3;
    cursor: pointer;
  }
`
const BtnCancle = styled(Link)`
  position: absolute;
  left: 4px;
  margin: 0 4px;
  min-width: 80px;
  height: 28px;
  line-height: 28px;
  border: 1px solid #F9F5EB;
  background-color: #F9F5EB;
  color: #1D3979;
  border-radius: 5px;
  font-weight: bold;
  text-decoration: none;
  text-align: center;
  font-size: 16px;
  &:hover {
    background-color: #EAE3D2;
  }
`
const Logo = styled.p`
  text-decoration: none;
  font-size: 40px;
  color: #1D3979;
  cursor: pointer;
  text-align: center;
  font-family: 'Milky Honey';
`



const Signup = () => {
  const [email, setEmail] = useState("");
  const [emailCheck, setEmailCheck] = useState(false);
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [authCode, setAuthCode] = useState("");
  const [isNicknameDuplicated, setIsNicknameDuplicated] = useState(false);

  const history = useHistory();

  const nicknameChangeHandler = (event) => {
    event.preventDefault();
    setNickname(event.target.value);
    setIsNicknameDuplicated(false);
  };

  const emailChangeHandler = (event) => {
    event.preventDefault();
    setEmail(event.target.value);
  };

  const passwordChangeHandler = (event) => {
    event.preventDefault();
    setPassword(event.target.value);
  };

  const confirmPasswordChangeHandler = (event) => {
    event.preventDefault();
    setConfirmPassword(event.target.value);
  };

  const checkEmailHandler = async (event) => {
    event.preventDefault();
    const response = await sendMM(email) 
    if (response.statusCode === '200'){
      setModalOpen(true);
    } else {
      alert('이메일을 잘못 입력하셨습니다.')
    }
  };

  const closeModal = () => {
    setModalOpen(false);
    setAuthCode("");
  };

  const authCodeChangeHandler = (event) => {
    event.preventDefault();
    setAuthCode(event.target.value);
  };

  const authCodeTransferHandler = async (event) => {
    event.preventDefault();
    if (authCode.trim()) {
      const response = await authMM(email, authCode)
      if (response.statusCode === '200'){
        setAuthCode("");
        setEmail(email);
        setEmailCheck(true);
        alert("인증됨");
        setModalOpen(false);
      } else {
        setAuthCode("");
        setEmail('');
        setEmailCheck(false);
        alert("잘못된 유효코드입니다.");
        setModalOpen(false);
      }
    }
  };

  const NicknameDuplicatedHandler = async (event) => {
    event.preventDefault();
    if (nickname.trim()) {
      const response = await checkNickname(nickname)
      if (response.cnt === 0 && response.statusCode === "200"){
        setIsNicknameDuplicated(true);
        setNickname(nickname);
        alert("닉네임 사용가능");

      } else {
        alert("서버 에러")
      }
    }
  };

  let modalAuthCodeForm = (
    <form onSubmit={authCodeTransferHandler}>
      <span>보낸 코드을 확인하세요!</span>
      <div>
        <input
          type="textarea"
          value={authCode}
          onChange={authCodeChangeHandler}
        />
      </div>
      <div>
        <button type="submit">전송</button>
      </div>
    </form>
  );

  const signupHandler = async (event) => {
    event.preventDefault();
    if (
      nickname &&
      email &&
      password === confirmPassword &&
      isNicknameDuplicated &&
      emailCheck
    ) {
      const response = await signup(email, password, nickname)
      if (response.statusCode === '200'){
        localStorage.setItem('token', response.accessToken)
        localStorage.setItem('nickname', response.nickname)
        localStorage.setItem('email', email)
        history.push("/index");
      } 
      // 요청감
    
    }
  };

  return (
    <Container>
      <Logo>
        Hoodies
      </Logo>
      <Form onSubmit={signupHandler}>
        <InputDiv>
          <Input
            value={nickname}
            onChange={nicknameChangeHandler}
            type="text"
            placeholder="닉네임"
          />
          <InputBtn onClick={NicknameDuplicatedHandler}>
            {isNicknameDuplicated ? "사용 가능" : "중복 확인"}
          </InputBtn>
        </InputDiv>
        <InputDiv>
          <Input
            value={email}
            disabled={emailCheck}
            onChange={emailChangeHandler}
            type="text"
            placeholder="이메일"
          />
          <InputBtn onClick={checkEmailHandler}>
            {emailCheck ? "승인 완료" : "승인 요청"}
          </InputBtn>
        </InputDiv>
        <InputDiv>
          <InputPassword
            value={password}
            onChange={passwordChangeHandler}
            type="password"
            placeholder="패스워드"
          />
        </InputDiv>
        <InputDiv>
          <InputPassword
            value={confirmPassword}
            onChange={confirmPasswordChangeHandler}
            type="password"
            placeholder="패스워드 확인"
          />
        </InputDiv>
        <div>
          <InputBtn type="submit">회원가입</InputBtn>
        </div>
      </Form>
      <BtnCancle to="/login">뒤로</BtnCancle>
      <CustomModal open={modalOpen} close={closeModal} header="">
        {modalAuthCodeForm}
      </CustomModal>
    </Container>
  );
};

export default Signup;
