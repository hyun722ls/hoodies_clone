import classes from "./header.module.css";
import { Link, useHistory } from "react-router-dom";
import { Fragment } from "react";

const Header = () => {
  const history = useHistory()
  const logout = (event) => {
    event.preventDefault()
    localStorage.clear()
    history.push('/login')
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
              익명 게시판
            </Link>
          </li>
          <li>
            <Link to="/board/free" className={classes.navbar__item}>
              구인 구직
            </Link>
          </li>
          <li>
            <Link to="/board/free" className={classes.navbar__item}>
              정보 게시판
            </Link>
          </li>
          {/* <Link to="/admin/form" state={null} className={classes. navbar__item}>
            Create
          </Link> */}
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
