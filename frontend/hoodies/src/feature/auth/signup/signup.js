import { useState } from "react";
import { useHistory, Link, Route } from "react-router-dom";
import CustomModal from "../../../common/UI/modal/customModal";
import { authMM, checkNickname, sendMM, signup } from "../authApi";
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
        localStorage.setItem('token', response.token)
        localStorage.setItem('nickname', response.nickname)
        localStorage.setItem('email', email)
        history.push("/index");
      } 
      // 요청감
    
    }
  };

  return (
    <div>
      <form onSubmit={signupHandler}>
        <div>
          <h3>nickname</h3>
          <input
            value={nickname}
            onChange={nicknameChangeHandler}
            type="text"
          />
          <button onClick={NicknameDuplicatedHandler}>
            {isNicknameDuplicated ? "사용 가능" : "중복 확인"}
          </button>
        </div>
        <div>
          <h3>email</h3>
          <input
            value={email}
            disabled={emailCheck}
            onChange={emailChangeHandler}
            type="text"
          />
          <button onClick={checkEmailHandler}>
            {emailCheck ? "승인 완료" : "승인 요청"}
          </button>
        </div>
        <div>
          <h4>password</h4>
          <input
            value={password}
            onChange={passwordChangeHandler}
            type="password"
          />
        </div>
        <div>
          <h4>Confirm password</h4>
          <input
            value={confirmPassword}
            onChange={confirmPasswordChangeHandler}
            type="password"
          />
        </div>
        <div>
          <button type="submit">회원가입</button>
        </div>
      </form>
      <div>
        <Link to="/login">뒤로</Link>
      </div>
      <CustomModal open={modalOpen} close={closeModal} header="">
        {modalAuthCodeForm}
      </CustomModal>
    </div>
  );
};

export default Signup;
