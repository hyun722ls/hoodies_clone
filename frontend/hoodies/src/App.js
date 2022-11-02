import { BrowserRouter, Route, Switch } from "react-router-dom";
import PrivateRoute from "./common/routes/privateRoute";
import PublicRoute from "./common/routes/publicRoute";
import ErrorPage from "./common/UI/error/errorPage";
import Login from "./feature/auth/login/login";
import Signup from "./feature/auth/signup/signup";
import ArticleDetail from "./feature/board/article/articleDetail";
import ArticleForm from "./feature/board/article/articleForm";
import BoardMain from "./feature/board/boardMain";
import EvaluationMain from "./feature/evaluation/evaluationMain";
import EvenPro from "./feature/evaluation/evenPro";
import Main from "./feature/main/main";
import UserMain from "./feature/user/userMain";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Switch>
          <PublicRoute restricted component={Login} exact path="/login" />
          <PublicRoute restricted component={Signup} exact path="/signup" />
          <PrivateRoute component={Main} exact path="/index" />
          <PrivateRoute component={BoardMain} exact path="/board/free" />
          <PrivateRoute component={ArticleDetail} exact path="/board/free/detail" />
          <PrivateRoute component={ArticleForm} exact path="/board/free/form" />
          <PrivateRoute component={EvaluationMain} exact path="/pro" />
          <PrivateRoute component={EvenPro} exact path="/pro/detail" />
          <PrivateRoute component={UserMain} exact path="/user" />
          <PrivateRoute component={ErrorPage} path="*" />
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
