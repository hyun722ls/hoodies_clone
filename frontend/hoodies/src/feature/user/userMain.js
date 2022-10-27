import { useEffect, useState } from "react";
import Header from "../../common/UI/header/header";
import CustomModal from "../../common/UI/modal/customModal";

const UserMain = () => {
  const [nickname, setNickname] = useState('')
  const [email, setEmail] = useState('')
  const [nicknameModalOpen, setNicknameModalOpen] = useState(false);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [originalPassword, setOriginalPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isNewNicknameDuplicated, setIsNewNicknameDuplicated] = useState(false)
  const [newNickname, setNewNickname] = useState('')
  
  useEffect(()=>{
    setNickname('현규는 똑똑해')
    setEmail('kms940125@hanmail.net')
  }, [])

  const openNicknameModal = () => {
    setNicknameModalOpen(true);
  };
  const closeNicknameModal = () => {
    setNicknameModalOpen(false);
    setNewNickname("");
  };

  const openPasswordModal = () => {
    setPasswordModalOpen(true);
  };

  const closePasswordModal = () => {
    setConfirmPassword('')
    setOriginalPassword('')
    setNewPassword('')
    setPasswordModalOpen(false)
  }

  const newNicknameChangeHandler = (event) => {
    event.preventDefault()
    setIsNewNicknameDuplicated(false)
    setNewNickname(event.target.value)
  }

  const newNicknameDuplicatedHandler = (event) => {
    event.preventDefault();
    if (newNickname.trim()) {
      setIsNewNicknameDuplicated(true);
      setNewNickname(newNickname);
      alert("닉네임 사용가능");
    }
  };

  const nicknameModifyHandler = (event) => {
    event.preventDefault()
    setNewNickname('')
    setNicknameModalOpen(false)
    setIsNewNicknameDuplicated(false)
    alert('변경성공')
  }

  const originiPasswordChangeHandler = (event) => {
    event.preventDefault()
    setOriginalPassword(event.target.value)
  }

  const newPasswordChangeHandler = (event) => {
    event.preventDefault()
    setNewPassword(event.target.value)
  }

  const confirmPasswordChangeHandler = (event) => {
    event.preventDefault()
    setConfirmPassword(event.target.value)
  }


  const passwordModifyHandler = (event) => {
    event.preventDefault()
    setConfirmPassword('')
    setNewPassword('')
    setOriginalPassword('')
    alert('변경성공')
  }



  let modalNicknameForm = (
    <form onSubmit={nicknameModifyHandler}>
      <span>변경할 닉네임을 입력하세요!</span>
      <div>
        <input
          type="textarea"
          value={newNickname}
          onChange={newNicknameChangeHandler}
        />
          <button onClick={newNicknameDuplicatedHandler}>
            {isNewNicknameDuplicated ? "사용 가능" : "중복 확인"}
          </button>
      </div>
      <div>
        <button type="submit">전송</button>
      </div>
    </form>
  );

  let modalPasswordForm = (
    <form onSubmit={passwordModifyHandler}>
      <p>기존 패스워드</p>
      <div>
        <input
          type="textarea"
          value={originalPassword}
          onChange={originiPasswordChangeHandler}
        />
      </div>
      <span>변경 패스워드</span>
      <div>
        <input
          type="textarea"
          value={newPassword}
          onChange={newPasswordChangeHandler}
        />
      </div>
      <span>변경 패스워드 확인</span>
      <div>
        <input
          type="textarea"
          value={confirmPassword}
          onChange={confirmPasswordChangeHandler}
        />
      </div>
      <div>
        <button type="submit">전송</button>
      </div>
    </form>
  );

  return (
    <div>
      <Header />
      <div>
        <h4>{nickname}</h4>
        <h5>{email}</h5>
      </div>
      <div>
        <p onClick={openNicknameModal}>닉네임 변경</p>
        <p onClick={openPasswordModal}>비밀번호 변경</p>
        <p>내가 쓴 글</p>
      </div>
      <CustomModal open={nicknameModalOpen} close={closeNicknameModal} header="">
        {modalNicknameForm}
      </CustomModal>
      <CustomModal open={passwordModalOpen} close={closePasswordModal} header="">
        {modalPasswordForm}
      </CustomModal>
    </div>
  );
};

export default UserMain;
