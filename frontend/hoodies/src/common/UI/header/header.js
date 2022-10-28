import classes from "./header.module.css";
import { Link, useHistory } from "react-router-dom";

const Header = () => {
  const history = useHistory()
  const logout = (event) => {
    event.preventDefault()
    localStorage.clear()
    history.push('/login')
  }

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
        <span onClick={logout} className={classes.navbar__item}>
          Logout
        </span>
      </ul>
    </nav>
  );
};

export default Header;
