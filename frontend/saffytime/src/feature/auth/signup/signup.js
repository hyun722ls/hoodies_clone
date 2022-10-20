import { useState } from "react";
import { useHistory, Link, Route } from "react-router-dom";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [emailCheck, setEmailCheck] = useState(false);
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const emailChangeHandler = (event) => {
    event.preventDefault();
    setEmail(event.target.value);
  };

  const nicknameChangeHandler = (event) => {
    event.preventDefault();
    setNickname(event.target.value);
  };

  const passwordChangeHandler = (event) => {
    event.preventDefault();
    setPassword(event.target.value);
  };

  const confirmPasswordChangeHandler = (event) => {
    event.preventDefault();
    setConfirmPassword(event.target.value);
  };

  const checkEmailHandler = (event) => {
    event.preventDefault();
    // 요청
    setEmailCheck(true);
  };

  const signupHandler = (event) => {
    event.preventDefault();
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
        </div>
        <div>
          <h3>email</h3>
          <input value={email} onChange={emailChangeHandler} type="text" />
          <button onClick={checkEmailHandler}>인증</button>
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
    </div>
  );
};

export default Signup;
