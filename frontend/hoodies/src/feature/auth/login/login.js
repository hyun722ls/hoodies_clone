import { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { login, passworAuthMM, passwordSendMM } from "../authApi";
import styled from "styled-components";
import Swal from "sweetalert2";

const Container = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  margin: -280px 0 24px -180px;
  height: 560px;
  width: 360px;
`;
const Form = styled.form`
  margin: 0;
  padding: 0;
`;
const InputDiv = styled.div`
  margin-bottom: 32px;
  padding: 4px 10px;
  border: 1px solid #d6d6d6;
  background-color: #fff;
`;
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
`;

const InputBtn = styled.button`
  position: absolute;
  right: 4px;
  margin: 0 4px;
  min-width: 80px;
  height: 28px;
  border: 1px solid #f9f5eb;
  background-color: #eae3d2;
  color: #1d3979;
  border-radius: 5px;
  font-weight: bold;
  &:hover {
    background-color: #d9d2c3;
    cursor: pointer;
  }
`;
const StyledLink = styled(Link)`
  margin: 0 4px;
  color: inherit;
  text-decoration: none;
  text-align: center;
  font-size: 12px;
  &:hover {
    cursor: pointer;
  }
`;
const StyledSpan = styled.span`
  margin: 0 4px;
  color: inherit;
  text-decoration: none;
  text-align: center;
  font-size: 12px;
  &:hover {
    cursor: pointer;
  }
`;
const Logo = styled.p`
  text-decoration: none;
  font-size: 40px;
  color: #1d3979;
  cursor: pointer;
  text-align: center;
  font-family: "Milky Honey";
`;

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [seekEmail, setSeekEmail] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
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
        localStorage.setItem("hashNickname", response.hashNickname);
        localStorage.setItem("email", email);
        if (Object.keys(response).includes('isAdmin')) {
          localStorage.setItem("flag", response.isAdmin);
        }
        history.push("/index");
      } else {
        Swal.fire({
          title: '올바르지 않은 이메일 혹은 비밀번호입니다',
          icon: 'error'
        })
      }
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

  const resetPasswordHandler = async (event) => {
    event.preventDefault();
    Swal.fire({
      title: "이메일주소를 입력해주세요",
      input: "email",
      inputPlaceholder: "이메일",
      validationMessage: "올바른 이메일 형식이 아닙니다.",
      allowOutsideClick: false,
      showCancelButton: true,
      reverseButtons: true,
      cancelButtonText: "닫기",
      confirmButtonText: "다음",
      preConfirm: async (value) => {
        const response = await passwordSendMM(value);
        if (response.statusCode === "200") {
        } else {
          Swal.showValidationMessage("올바른 이메일 형식이 아닙니다.");
        }
      },
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Mattermost에서 코드 확인 후 입력해주세요.",
          input: "text",
          inputPlaceholder: "코드",
          allowOutsideClick: false,
          showCancelButton: true,
          reverseButtons: true,
          cancelButtonText: "닫기",
          confirmButtonText: "확인",
          preConfirm: async (value) => {
            const response = await passworAuthMM(result.value, value);
            if (response.statusCode === "200") {
            } else {
              Swal.showValidationMessage("잘못된 코드를 입력하였습니다.");
            }
          },
        }).then((result) => {
          if (result.isConfirmed) {
            Swal.fire({
              icon: "success",
              title: "비밀번호가 성공적으로 초기화 되었습니다.",
              html: "Mattermost에서 확인해 주세요.",
              timer: "3000",
              confirmButtonText: "확인",
            });
          }
        });
      }
    });
  };

  return (
    <Container>
      <Logo>Hoodies</Logo>
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
            placeholder="비밀번호"
          />
        </InputDiv>
        <div>
          <InputBtn type="submit">로그인</InputBtn>
        </div>
      </Form>
      <div>
        <StyledLink to="/signup">회원가입</StyledLink>
        <StyledSpan onClick={resetPasswordHandler}>비밀번호 초기화</StyledSpan>
      </div>
    </Container>
  );
};

export default Login;
