import Header from "../../common/UI/header/header";

const UserMain = () => {
  return (
    <div>
      <Header />
      <div>내 정보</div>
      <div>
        <p>닉네임 변경</p>
        <p>비밀번호 변경</p>
        <p>내가 쓴 글</p>
      </div>
    </div>
  );
};

export default UserMain;
