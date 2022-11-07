import classes from "./header.module.css";
import { Link, useHistory } from "react-router-dom";
import { Fragment } from "react";
import { logOut, postInquiry } from "../../../feature/auth/authApi";

const Header = () => {
  const history = useHistory()
  const logout = async (event) => {
    event.preventDefault()
    const response = await logOut()
    if (response){
      localStorage.clear()
      history.push('/login')
    }
  }

  const inquiryHandler = async (event) => {
    event.preventDefault()
    const content = '가는가'
    const response = await postInquiry(content)
  
  }

  return (
    <Fragment>
      <div className={classes.navbar__wrapper}>
        <Link to='/index' className={classes.navbar__logo}>
          Hoodies
        </Link>
      </div>
      <nav className={classes.navbar}>
        <ul className={classes.navbar__menu}>
          <li>
            <Link to="/user" className={classes.navbar__item}>
              내 정보
            </Link>
          </li>
          <li>
            <Link to="/board/free" className={classes.navbar__item}>
              자유 게시판
            </Link>
          </li>
          <li>
            <Link to="/board/anonymous" className={classes.navbar__item}>
              익명 게시판
            </Link>
          </li>
          <li>
            <Link to="/pro" className={classes.navbar__item}>
              평가 게시판
            </Link>
          </li>
          {/* <Link to="/admin/form" state={null} className={classes. navbar__item}>
            Create
          </Link> */}
          {localStorage.getItem('flag') &&  <Link to="/admin" className={classes.navbar__item}>
              문의 결과
            </Link>}
          {!localStorage.getItem('flag') && 
          <li>
            <span onClick={inquiryHandler} className={classes.navbar__item}>
              문의 보내기
            </span>
          </li>}

          <li>
            <span onClick={logout} className={classes.navbar__item}>
              Logout
            </span>
          </li>
          
        </ul>
      </nav>
    </Fragment>
  );
};

export default Header;
