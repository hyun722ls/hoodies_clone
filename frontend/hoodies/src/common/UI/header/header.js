import classes from "./header.module.css";
import { Link, useHistory, useLocation } from "react-router-dom";
import { Fragment } from "react";
import { logOut, postInquiry } from "../../../feature/auth/authApi";
import {useMediaQuery} from 'react-responsive';
import Swal from "sweetalert2";

const Header = () => {
  const isPc = useMediaQuery({
    query : "(min-width:1024px)"
  });
  const isMobile = useMediaQuery({
    query: "(max-width:1023px)"
  });
  const history = useHistory()
  const location = useLocation()
  const logout = async (event) => {
    event.preventDefault()
    const response = await logOut()
    Swal.fire({
      title: '성공적으로 로그아웃했습니다',
      icon: 'success',
      timer: 2000,
      timerProgressBar: true,
    })
    if (response){
      localStorage.clear()
      history.push('/login')
    }
  }

  const inquiryHandler = async (event) => {
    event.preventDefault()
    Swal.fire({
      input: 'textarea',
      inputLabel: '문의사항을 입력해 주세요',
      inputPlaceholder: '문의사항',
      inputAttributes: {
        'resize': 'none',
      },
      confirmButtonText: '확인',
      cancelButtonText: '닫기',
      showCancelButton: true,
      reverseButtons: true,
      preConfirm: async (value) => {
        if (!value) {
          Swal.showValidationMessage('내용을 입력해주세요.')
        } else {
          const response = await postInquiry(value)
          if (response.statusCode === 200) {
            Swal.fire({
              title: '문의가 성공적으로 등록되었습니다.',
              icon: 'success',
            })
          } else {
            Swal.fire({
              title: '오류가 발생했습니다.',
              icon: 'error'
            })
          }
        }
      },
    })
  }

  const freeBoardHandler = (event) => {
    event.preventDefault()
    if(location.pathname === '/board/free'){
      history.go(0)
    } else {
      history.push('/board/free')
    }
  }

  const anonymousBoardHandler = (event) => {
    event.preventDefault()
    if(location.pathname === 'board/anonymous'){
      history.go(0)
    } else {
      history.push('/board/anonymous')
    }
  }

  const codingBoardHandler = (event) => {
    event.preventDefault()
    if(location.pathname === '/board/coding'){
      history.go(0)
    } else {
      history.push('/board/coding')
    }
  }

  return (
    <Fragment>
      {isPc && 
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
              <p onClick={freeBoardHandler} className={classes.navbar__item}>
                자유 게시판
              </p>
            </li>
            <li>
              <p onClick={anonymousBoardHandler} className={classes.navbar__item}>
                익명 게시판
              </p>
            </li>
            <li>
              <p onClick={codingBoardHandler} className={classes.navbar__item}>
                코딩 게시판
              </p>
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
      </Fragment>}
      {isMobile && 
      <Fragment>
        <div className={classes.navbar__wrapper}>
          <div className="hamburger-menu" style={{position:'relative', right:'25%'}}>
              <input id={classes.menu__toggle} type="checkbox" />
              <label className={classes.menu__btn} htmlFor={classes.menu__toggle}>
                <span></span>
              </label>

              <ul className={classes.menu__box}>
                <li>
                  <Link to="/user" className={classes.menu__item}>
                    내 정보
                  </Link>
                </li>               
                <li><span onClick={freeBoardHandler} className={classes.menu__item} >자유 게시판</span></li>
                <li><span onClick={anonymousBoardHandler} className={classes.menu__item} >익명 게시판</span></li>
                <li>
                  <span onClick={codingBoardHandler} className={classes.menu__item}>
                    코딩 게시판
                  </span>
                </li>
                <li>
                  <Link to="/pro" className={classes.menu__item}>
                    평가 게시판
                  </Link>
                </li>
                {localStorage.getItem('flag') &&  <Link to="/admin" className={classes.menu__item}>
                문의 결과
              </Link>}
                {!localStorage.getItem('flag') && <li><span className={classes.menu__item} onClick={inquiryHandler} >문의 보내기</span></li>}
                <li><span className={classes.menu__item} onClick={logout}>Logout</span></li>
              </ul>
          </div>
          <Link to='/index' className={classes.navbar__logo} style={{marginTop:'6px'}}>
            Hoodies
          </Link>
        </div>
      </Fragment>}
    </Fragment>
  );
};

export default Header;
