import { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import Header from "../../common/UI/header/header";
import EvaulationComment from "./evaluationComment";
import EvaluationPentagon from "./evaluationPentagon";
import styled from "styled-components";
import CreateEvaluation from "./evaluationRegister";


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
          {staff.writer} {staffType} {comments.length}명의 평가
        </h4>
        <p>이메일 : {staff.email}</p>
        <p>설명 : {staff.etc}</p>
        <div>
          <button onClick={backHandler}>뒤로 가기</button>
        </div>
        <EvaulationComment
          comments={comments}
        />
        {/* <div style={{position:'relative'}}> 
          <div style={{display:'flex', flexWrap:'wrap', marginLeft:'7vw'}}>
            <img src={LeftTop} style={{height:'20%', width:'45%', margin:'15px'}} alt=''></img>
            <img src={RightTop} style={{height:'20%', width:'45%',margin:'15px'}} alt=''></img>
            <img src={BottomLeft} style={{height:'20%', width:'45%',margin:'15px'}} alt=''></img>
            <img src={bottomright} style={{height:'20%', width:'45%',margin:'15px'}} alt=''></img>
          </div>
        </div> */}
          <div style={{display:'flex', position:'absolute',left:'4.5%' ,top:'25%' ,'justifyContent':'center', height:'70vh', width:'70%'}}>
            <EvaluationPentagon staff={staff}></EvaluationPentagon>
          </div>
        {/* <BoxOne style={{position:'relative'}}>
          <div style={{position:'absolute', top:'30%', right:'60%'}}>
            hello
          </div>
        </BoxOne> */}
        <CreateEvaluation setComments={setComments} id={staff._id} staff={staff}></CreateEvaluation>
      </div>
    )
  );
};

export default EvenPro;
