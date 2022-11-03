import { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import CustomModal from "../../../common/UI/modal/customModal";
import { login, passworAuthMM, passwordSendMM } from "../authApi";
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
  width: 100%;
  height: 28px;
  line-height: 28px;
  font-size: 16px;
  background-color: transparent;
  outline: none;
  vertical-align: middle;
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
const StyledLink = styled(Link)`
  margin: 0 4px;
  color: inherit;
  text-decoration: none;
  text-align: center;
  font-size: 12px;
  &:hover {
    cursor: pointer;
  }
`
const StyledSpan = styled.span`
  margin: 0 4px;
  color: inherit;
  text-decoration: none;
  text-align: center;
  font-size: 12px;
  &:hover {
    cursor: pointer;
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


const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [seekEmail, setSeekEmail] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [isTransferEmail, setIsTransferEmail] = useState(false);
  const [authCode, setAuthCode] = useState("");
  const history = useHistory();

  const passwordChangeHandler = (event) => {
    event.preventDefault();
    setPassword(event.target.value);
  };

  const LoginHandler = async (event) => {
    event.preventDefault();
    if (email && password) {
      const response = await login(email, password);
      if (response.statusCode === "200") {
        localStorage.setItem("token", response.accessToken);
        localStorage.setItem("nickname", response.nickname);
        localStorage.setItem("hashNickname", response.hashNickname)
        localStorage.setItem("email", email);
        history.push("/index");
      }
      // 오류 제어 코드 필요
    }
  };

  const closeModal = () => {
    setModalOpen(false);
    setSeekEmail("");
  };

  const emailChangeHandler = (event) => {
    event.preventDefault();
    setEmail(event.target.value);
  };

  const openModal = () => {
    setModalOpen(true);
  };

  const seekEmailChangeHandler = (event) => {
    event.preventDefault();
    setSeekEmail(event.target.value);
  };

  const authCodeChangeHandler = (event) => {
    event.preventDefault();
    setAuthCode(event.target.value);
  };

  const authCodeTransferHandler = async (event) => {
    event.preventDefault();
    if (authCode.trim()) {
      const response = await passworAuthMM(seekEmail, authCode);
      if (response.statusCode === "200") {
        setSeekEmail("");
        setAuthCode("");
        setIsTransferEmail(false);
        setModalOpen(false);
        alert(`패스워드는 ${response.password}입니다.`);
      } else {
        setSeekEmail("");
        setAuthCode("");
        setIsTransferEmail(false);
        setModalOpen(false);
        alert("인증코드를 잘못 입력하셨습니다.");
      }
    }
  };

  const emailTransferHandler = async (event) => {
    event.preventDefault();
    if (seekEmail.trim()) {
      const response = await passwordSendMM(seekEmail);
      if (response.statusCode === "200") {
        setIsTransferEmail(true);
      } else {
        setSeekEmail("");
        alert("이메일 형식이 아닙니다.");
        closeModal();
      }
    }
  };

  let modalEmailForm = (
    <form onSubmit={emailTransferHandler}>
      <span>이메일을 입력하세요!</span>
      <div>
        <input
          type="textarea"
          value={seekEmail}
          onChange={seekEmailChangeHandler}
        />
      </div>
      <div>
        <button type="submit">전송</button>
      </div>
    </form>
  );

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

  return (
    <Container>
      <Logo>
        Hoodies
      </Logo>
      <Form onSubmit={LoginHandler}>
        <InputDiv>
          <Input
            value={email}
            onChange={emailChangeHandler}
            type="text"
            required
            placeholder="이메일"
          />
        </InputDiv>
        <InputDiv>
          <Input
            value={password}
            onChange={passwordChangeHandler}
            type="password"
            required
            placeholder="패스워드"
          />
        </InputDiv>
        <div>
          <InputBtn type="submit">로그인</InputBtn>
        </div>
      </Form>
      <div>
        <StyledLink to="/signup">회원가입</StyledLink>
        <StyledSpan onClick={openModal}>비밀번호 초기화</StyledSpan>
      </div>
      <CustomModal open={modalOpen} close={closeModal} header="">
        {isTransferEmail ? modalAuthCodeForm : modalEmailForm}
      </CustomModal>
    </Container>
  );
};

export default Login;
