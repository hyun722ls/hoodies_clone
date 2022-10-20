import { useState } from "react";
import { Link } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const emailChangeHandler = (event) => {
    event.preventDefault();
    setEmail(event.target.value);
  };

  const passwordChangeHandler = (event) => {
    event.preventDefault();
    setPassword(event.target.value);
  };

  const LoginHandler = (event) => {
    event.preventDefault();
  };

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
      </div>
    </div>
  );
};

export default Login;
