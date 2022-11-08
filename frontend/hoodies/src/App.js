import { BrowserRouter, Switch } from "react-router-dom";
import PrivateRoute from "./common/routes/privateRoute";
import PublicRoute from "./common/routes/publicRoute";
import ErrorPage from "./common/UI/error/errorPage";
import RedirectComponent from "./common/UI/error/redirectComponent";
import AnonymousBoardMain from "./feature/anonymous/anonymousBoardMain";
import AnonymousArticleDetail from "./feature/anonymous/article/anonymousArticleDetail";
import AnonymousArticleForm from "./feature/anonymous/article/anonymousArticleForm";
import Login from "./feature/auth/login/login";
import Signup from "./feature/auth/signup/signup";
import ArticleDetail from "./feature/board/article/articleDetail";
import ArticleForm from "./feature/board/article/articleForm";
import BoardMain from "./feature/board/boardMain";
import EvaluationMain from "./feature/evaluation/evaluationMain";

import EvaluationNewMain from "./feature/evaluation/evaluationNewMain";

import EvenPro from "./feature/evaluation/evenPro";
import Main from "./feature/main/main";
import ImageUpload from "./feature/test/imageUpload";
import UserMain from "./feature/user/userMain";
import UserBoard from "./feature/user/userBoard";
import AdminRoute from "./common/routes/adminRoute";
import AdminPage from "./feature/auth/admin/adminPage";


function App() {
  return (
    <div>
      <BrowserRouter>
        <Switch>
          <PublicRoute restricted component={Login} exact path="/login" />
          <PublicRoute restricted component={Signup} exact path="/signup" />
        
          <PrivateRoute component={RedirectComponent} exact path="/" />
          <PrivateRoute component={Main} exact path="/index" />
          <PrivateRoute component={BoardMain} exact path="/board/free" />
          <PrivateRoute component={ArticleDetail} exact path="/board/free/detail" />
          <PrivateRoute component={ArticleForm} exact path="/board/free/form" />
          <PrivateRoute component={AnonymousBoardMain} exact path="/board/anonymous" />
          <PrivateRoute component={AnonymousArticleDetail} exact path="/board/anonymous/detail" />
          <PrivateRoute component={AnonymousArticleForm} exact path="/board/anonymous/form" />
          <PrivateRoute component={EvaluationMain} exact path="/pro" />

          <PrivateRoute component={EvaluationNewMain} exact path="/pro/new" />

          <PrivateRoute component={EvenPro} exact path="/pro/detail" />
          <PrivateRoute component={UserMain} exact path="/user" />
          <PrivateRoute component={UserBoard} exact path="/user/board" />
          <AdminRoute component={AdminPage} exact path="/admin" />
          <PrivateRoute component={ErrorPage} path="*" />
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
