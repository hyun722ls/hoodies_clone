const CustomModal = (props) => {
  // 열기, 닫기, 모달 헤더 텍스트를 부모로부터 받아옴
  const { open, close, header } = props;
  const handleChildElementClick = (e) => {
    e.stopPropagation();
    // Do other stuff here
  };

  return (
    // 모달이 열릴때 openModal 클래스가 생성된다.
    <div onClick={close}>
      {open ? (
        <section onClick={(e) => handleChildElementClick(e)}>
          <header>
            {header}
            <button onClick={close}>&times;</button>
          </header>
          <div>
            <div>
              <span>무엇을 함?</span>
            </div>
          </div>
          <main>{props.children}</main>
        </section>
      ) : null}
    </div>
  );
};

export default CustomModal;
