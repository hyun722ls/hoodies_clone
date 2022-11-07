  import { Grid } from "@mui/material";
import { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import Header from "../../common/UI/header/header";
import EvaulationComment from "./evaluationComment";
import EvaluationPentagon from "./evaluationPentagon";
// import styled from "styled-components";
import CreateEvaluation from "./evaluationRegister";
import Swal from "sweetalert2";

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

  useEffect(() => {
    console.log(location.state)

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
      Swal.fire({
        title: '잘못된 접근입니다.',
        icon: 'warning',
        timer: 2000,
      })
      history.push("/index");
    }
    setIsLoading(false);
  }, []);

  return (
    !isLoading &&
    comments && (
      <div>
        <Header />
        <Grid container sx={{height:'500px', width:'100vw'}}>
          <Grid container sx={{height:'500px'}} item xs={8}>
            <Grid style={{backgroundColor:'#EAE3D2'}} item xs={6}>
              <div>
                <h4>
                  {staff.writer}
                </h4>
                <p>{staffType}</p>
                <p>{comments.length}명의 평가</p>
                <p>이메일 : {staff.email}</p>
                <p>설명 : {staff.etc}</p>
              </div>
            </Grid>
            <Grid item xs={6}>
              <div style={{display:'flex','justifyContent':'center', height:'40vh', width:'70%'}}>
                <EvaluationPentagon staff={staff}></EvaluationPentagon>
              </div>
            </Grid>
            <Grid item xs={12} style={{backgroundColor:'#EAE3D2'}}>
              <CreateEvaluation setComments={setComments} id={staff._id} staff={staff}></CreateEvaluation>
            </Grid>
          </Grid>
          <Grid item xs={4} style={{marginTop:'0.5rem', height:'80vh', overflowY:'scroll', overflowX:'hidden'}}>
            <EvaulationComment comments={comments}/>
          </Grid>
        </Grid>
        {/* <div>
          <button onClick={backHandler}>뒤로 가기</button>
        </div> */}
      </div>
    )
  );
};

export default EvenPro;
