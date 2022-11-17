import { useState, useEffect } from "react";
import { useHistory, Link, Route } from "react-router-dom";
import { authMM, checkNickname, sendMM, signup } from "../authApi";
import styled from "styled-components";
import Swal from "sweetalert2";

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
  margin-bottom: 4px;
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
const StyledSmall = styled.div`
  text-align: left;
  font-size: smaller;
  color: #dd6b55;
`
const EmptyDiv = styled.div`
  height: 25px;
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
  const [isPasswordDuplicated, setIsPasswordDuplicated] = useState(false);

  useEffect(()=>{
    if (password.trim() === confirmPassword.trim() | !confirmPassword){
        setIsPasswordDuplicated(false)
    } else {
        setIsPasswordDuplicated(true)
    }
  }, [password, confirmPassword])

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
    if (!email) {
      Swal.fire({
        icon: 'error',
        title: '이메일을 입력해주세요.',
      })
    } else {
      const response = await sendMM(email) 
      if (response.statusCode === '200'){
        let timerInterval
        setEmailCheck(false)
        Swal.fire({
          title: 'Mettermost에 보낸<br> 코드를 입력해 주세요.',
          html: '<min></min> : <sec></sec>',
          input: 'text',
          timer: 180000,
          timerProgressBar: true,
          allowOutsideClick: false,
          showCancelButton: true,
          confirmButtonText: '확인',
          cancelButtonText: '취소',
          reverseButtons: true,
          preConfirm: async (value) => {
            const response = await authMM(email, value)
            if (!value) {
              Swal.showValidationMessage('코드를 입력해 주세요.')
            } else if (response.statusCode === '200') {
              setEmail(email);
              setEmailCheck(true)
            } else {
              Swal.showValidationMessage('잘못된 코드입니다.')
            }
            return { value }
          },
          didOpen: () => {
            const sec = Swal.getHtmlContainer().querySelector('sec')
            timerInterval = setInterval(() => {
              sec.textContent = parseInt(Swal.getTimerLeft() / 1000) % 60
            }, 1000)
            const min = Swal.getHtmlContainer().querySelector('min')
            timerInterval = setInterval(() => {
              min.textContent = parseInt(Swal.getTimerLeft() / 60000)
            }, 1000)
          },
          willClose: (isConfirmed) => {
            clearInterval(timerInterval)
          }
        })
      } else {
        Swal.fire({
          icon: 'error',
          title: '잘못된 사용자입니다.',
        })
      }
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

  const NicknameDuplicatedHandler = async (event) => {
    event.preventDefault();
    if (nickname.trim()) {
      const response = await checkNickname(nickname)
      if (response.cnt === 0 && response.statusCode === "200"){
        setIsNicknameDuplicated(true);
        setNickname(nickname);
        Swal.fire({
          icon: 'success',
          title: '사용가능한 닉네임입니다.',
        })

      } else if (response.cnt === 1 && response.statusCode === "200"){
        Swal.fire({
          icon: 'error',
          title: '중복된 닉네임입니다.',
        })
      } else {
        Swal.fire({
          icon: 'error',
          title: '에러가 발생했습니다.',
        })
      }
    }
  };

  const signupHandler = async (event) => {
    event.preventDefault();
    if (
      nickname &&
      email &&
      password.length > 7 &&
      password === confirmPassword &&
      isNicknameDuplicated &&
      emailCheck
    ) {
      const response = await signup(email, password, nickname)
      if (response.statusCode === '200'){
        localStorage.setItem('token', response.accessToken)
        localStorage.setItem('nickname', response.nickname)
        localStorage.setItem('email', email)
        localStorage.setItem('hashNickname', response.hashNickname)
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
            type="email"
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
            placeholder="비밀번호"
          />
        </InputDiv>
        <InputDiv>
          <InputPassword
            value={confirmPassword}
            onChange={confirmPasswordChangeHandler}
            type="password"
            placeholder="비밀번호 확인"
          />
        </InputDiv>
        <EmptyDiv>
          {password && password.length < 8 && <StyledSmall>8자 이상 입력해주세요</StyledSmall>}
          {password.length > 7 && isPasswordDuplicated && <StyledSmall>암호가 일치하지 않습니다</StyledSmall>}
        </EmptyDiv>
        <div>
          <InputBtn type="submit">회원가입</InputBtn>
        </div>
      </Form>
      <BtnCancle to="/login">뒤로</BtnCancle>
    </Container>
  );
};

export default Signup;
