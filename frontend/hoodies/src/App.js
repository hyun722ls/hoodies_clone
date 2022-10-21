import { BrowserRouter, Route, Switch } from "react-router-dom";
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
          <Route component={Login} exact path="/login" />
          <Route component={Signup} exact path="/signup" />
          <Route component={Main} exact path="/index" />
          <Route component={BoardMain} exact path="/board/free" />
          <Route component={ArticleDetail} exact path="/board/free/detail" />
          <Route component={ArticleForm} exact path="/board/free/form" />
          <Route component={EvaluationMain} exact path="/pro" />
          <Route component={EvenPro} exact path="/pro/detail" />
          <Route component={UserMain} exact path="/user" />
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
