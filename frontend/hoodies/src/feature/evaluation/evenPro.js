  import { Grid } from "@mui/material";
import { useEffect, useState, useRef } from "react";
import { useHistory, useLocation } from "react-router-dom";
import Header from "../../common/UI/header/header";
import EvaulationComment from "./evaluationComment";
import EvaluationPentagon from "./evaluationPentagon";
import styled from "styled-components";
import CreateEvaluation from "./evaluationRegister";
import Swal from "sweetalert2";
import { deleteComment, getStaff, postEvaluation } from "./evaluationAPI";

const CommentGrid = styled(Grid)`
  && {
    background-color: #F9F5EB;
    &::-webkit-scrollbar {display:none};
  }
`

const EvenPro = () => {

  const history = useHistory();
  const location = useLocation();
  const [staff, setStaff] = useState([]);
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [staffType, setStaffType] = useState("");
  const [longerText, setLongerText] = useState(3);
  const [isOverflown, setIsOverflown] = useState(false);

  // function isOverflown(element) {
  //   const {scrollHeight, clientHeight} = element;
  //   return scrollHeight > clientHeight
  // }
  const ellipsisRef = useRef()
  const longerTextHandler = (event) => {
    event.preventDefault();
    if (longerText < 50) {
      setLongerText(100);
    }
    else {
      setLongerText(3)
    }
  }

  const backHandler = (event) => {
    history.go(-1);
  };

  const Ellipsis = styled.div`
    -webkit-box-orient: vertical;
    text-overflow: ellipsis;
    overflow: hidden;
    -webkit-line-clamp: ${longerText};
    display: -webkit-box;
    word-break: break-word;
    `

  const deleteCommentHandler = async (commentId) => {
    const response = await deleteComment(staff._id, commentId);
    if (response.statusCode === 200) {
      const response1 = await getStaff(staff._id);
      setStaff(response1);
      setComments(response1.evaluations);
      if (response.type === 1) {
          setStaffType("consultant");
        } else if (response.type === 2) {
          setStaffType("pro");
        } else {
          setStaffType("coach");
        }
    } else {
      console.log("댓글 삭제 에러");
    }
  };

  useEffect(()=>{
    if (ellipsisRef.current){
      if(ellipsisRef.current.clientHeight >= ellipsisRef.current.scrollHeight) {
        setIsOverflown(true)
      }
      // console.log(ellipsisRef.current.clientHeight)
    }
  }, [staff])
  useEffect(() => {
    (async () => {
      // 배포용
      if (location.state) {
        const response = await getStaff(location.state);
        setStaff(response);
        setComments(response.evaluations);
        if (response.type === 1) {
          setStaffType("consultant");
        } else if (response.type === 2) {
          setStaffType("pro");
        } else {
          setStaffType("coach");
        }
      } else {
        Swal.fire({
          title: "잘못된 접근입니다.",
          icon: "warning",
          timer: 2000,
        });
        history.push("/index");
      }

      // 로컬용
      // setStaff(location.state)
      // setComments(location.state.evaluations)
      setIsLoading(false);
      
    })();
  }, []);

  

  return (
    !isLoading &&
    comments && staff.averageScores?.length > 0 && (
      <div>
        <Header />
        <Grid
          container
          sx={{ height: "auto", width: "auto" }}
        >
          <Grid container sx={{ height: "auto" }} item md={8} xs={12}>
            <Grid
              style={{
                border: "1px solid #EAE3D2",
                backgroundColor: "#F9F5EB",
              }}
              item
              xs={12}
              md={4}
            >
              <div style={{ paddingLeft: "10px" }}>
                <h2
                  style={{
                    color: "#1D3979",
                    borderBottom: "2px solid #1D3979",
                  }}
                >
                  {staff.writer}
                </h2>
                <p><b>직책: </b> {staffType}</p>
                {staff.email ? <p><b>이메일 : </b>{staff.email}</p> : <p>이메일 : N/A</p>}
                <p style={{fontWeight:600}}>설명 :</p>
                <div>
                  <Ellipsis ref={ellipsisRef}>{staff.etc}</Ellipsis>
                  {!isOverflown ? <div style={{fontSize:'10px', color:'grey', cursor:'pointer'}} onClick={longerTextHandler}>더보기</div> : <div></div>}
                  {/* <div style={{fontSize:'10px', color:'grey', cursor:'pointer'}} onClick={longerTextHandler}>더보기</div> */}
                </div>
                {/* <p style={{textOverflow:'ellipsis', overflow:'hidden', WebkitLineClamp:3, display:'-webkit-box', wordBreak:'break-all',webkitBoxOrient:'vertical'}}>{staff.etc}</p> */}
                <p><b>{comments.length}</b>명의 평가</p>
              </div>
            </Grid>
            <Grid
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                border: "1px solid #EAE3D2",
                backgroundColor: "#F9F5EB",
              }}
              item
              xs={12}
              md={8}
            >
              <div
                style={{
                  fontWeight: 700,
                  fontSize: "1.2rem",
                  color: "#1D3979",
                  paddingTop: "0.5rem",
                }}
              >
                평가 그래프
              </div>
              <div
                style={{
                  display: "inline-flex",
                  justifyContent: "center",
                  height: "40vh",
                  width: "90%",
                }}
              >
                <EvaluationPentagon staff={staff}></EvaluationPentagon>
              </div>
            </Grid>
            <Grid
              item
              xs={12}
              style={{
                zIndex: 80,
                backgroundColor: "#F9F5EB",
                border: "1px solid #EAE3D2",
              }}
            >
              <CreateEvaluation
                setComments={setComments}
                setStaff={setStaff}
                id={staff._id}
                staff={staff}
              ></CreateEvaluation>
            </Grid>
          </Grid>
          <CommentGrid
            item
            md={4}
            xs={12}
            style={{
              height: "inherit",
              overflowY: "scroll",
              overflowX: "hidden",
            }}
          >
            <EvaulationComment comments={comments} deleteCommentHandler={deleteCommentHandler} />
          </CommentGrid>
        </Grid>
        {/* <div>
          <button onClick={backHandler}>뒤로 가기</button>
        </div> */}
      </div>
    )
  );
};

export default EvenPro;
