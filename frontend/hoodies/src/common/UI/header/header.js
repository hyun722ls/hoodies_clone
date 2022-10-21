import classes from "./header.module.css";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <nav className={classes.navbar}>
      <Link to="/index" className={classes.navbar__logo}>
        SSAFY
      </Link>
      <ul className={classes.navbar__menu}>
        <Link to="/user" className={classes.navbar__item}>
          내 정보
        </Link>
        {/* <Link to="/admin/form" state={null} className={classes.navbar__item}>
          Create
        </Link> */}
        <Link to="/login" className={classes.navbar__item}>
          Logout
        </Link>
      </ul>
    </nav>
  );
};

export default Header;
