import { useState } from "react";
import { Link } from "react-router-dom";
import CustomModal from "../../../common/UI/modal/customModal";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [seekEmail, setSeekEmail] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [isTransferEmail, setIsTransferEmail] = useState(false);
  const [authCode, setAuthCode] = useState("");

  const passwordChangeHandler = (event) => {
    event.preventDefault();
    setPassword(event.target.value);
  };

  const LoginHandler = (event) => {
    event.preventDefault();
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

  const authCodeTransferHandler = (event) => {
    event.preventDefault();
    if (authCode.trim()) {
      setSeekEmail("");
      setAuthCode("");
      setIsTransferEmail(false);
      setModalOpen(false);
      alert("패스워드는 2000입니다.");
    }
  };

  const emailTransferHandler = (event) => {
    event.preventDefault();
    if (seekEmail.trim()) {
      setIsTransferEmail(true);
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
    <div>
      <form onSubmit={LoginHandler}>
        <div>
          <h3>email</h3>
          <input value={email} onChange={emailChangeHandler} type="text" />
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
          <button type="submit">로그인</button>
        </div>
      </form>
      <div>
        <Link to="/signup">회원가입</Link>
        <span onClick={openModal}>비밀번호 초기화</span>
      </div>
      <CustomModal open={modalOpen} close={closeModal} header="">
        {isTransferEmail ? modalAuthCodeForm : modalEmailForm}
      </CustomModal>
    </div>
  );
};

export default Login;
