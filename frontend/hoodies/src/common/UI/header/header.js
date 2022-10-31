import classes from "./header.module.css";
import { Link } from "react-router-dom";
import { Fragment } from "react";

const Header = () => {
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
            <Link to="/login" className={classes.navbar__item}>
              Logout
            </Link>
          </li>
        </ul>
      </nav>
    </Fragment>
  );
};

export default Header;
