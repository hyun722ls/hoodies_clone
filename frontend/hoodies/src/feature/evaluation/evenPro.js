import { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import Header from "../../common/UI/header/header";
import EvaulationComment from "./evaluationComment";
import EvaluationPentagon from "./evaluationPentagon";

const EvenPro = () => {
  const history = useHistory();
  const location = useLocation();
  const [staff, setStaff] = useState([]);
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [staffType, setStaffType] = useState("");

  const backHandler = (event) => {
    history.go(-1);
  };

  const deleteCommentHandler = (commentId) => {
    const newComments = [...comments];
    const index = comments.findIndex((comment) => comment.id === commentId);
    newComments.splice(index, 1);
    setComments(newComments);
  };

  const modifyCommentHandler = (commentId, newContent) => {
    const newComments = [...comments];
    const index = comments.findIndex((comment) => comment.id === commentId);
    newComments[index].content = newContent;
    setComments(newComments);
  };

  const createCommentHandler = (newContent) => {
    const newComments = [
      { content: newContent, writer: "현규는 똑똑해" },
      ...comments,
    ];
    setComments(newComments);
  };

  useEffect(() => {
    if (location.state) {
      setStaff(location.state);
      setComments(location.state.evaluations);
      if (location.state.type === 'consultant') {
        setStaffType("consultant");
      } else if (location.state.type === 'pro') {
        setStaffType("pro");
      } else {
        setStaffType("coach");
      }
    } else {
      alert("잘못된 접근입니다.");
      history.push("/index");
    }
    setIsLoading(false);
  }, []);
  return (
    !isLoading &&
    comments && (
      <div>
        <Header />
        <h4>
          {staff.writer} {staffType}
        </h4>
        <p>이메일 : {staff.email}</p>
        <p>설명 : {staff.etc}</p>
        <p>점수 : {staff.scores}</p>
        <div>
          <button onClick={backHandler}>뒤로 가기</button>
        </div>
        <EvaulationComment
          comments={comments}
          deleteCommentHandler={deleteCommentHandler}
          modifyCommentHandler={modifyCommentHandler}
          createCommentHandler={createCommentHandler}
        />
        <div style={{height:'500px'}}>
          <EvaluationPentagon></EvaluationPentagon>
        </div>
      </div>
    )
  );
};

export default EvenPro;
