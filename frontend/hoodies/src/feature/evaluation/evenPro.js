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

const EvenPro = () => {

  const history = useHistory();
  const location = useLocation();
  const ellipsisRef = useRef();
  const [staff, setStaff] = useState([]);
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [staffType, setStaffType] = useState("");
  const [longerText, setLongerText] = useState(3)

  function isOverflown(element) {
    return element.scrollHeight > element.clientHeight || element.scrollWidth > element.clientWidth;
  }

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
      if (response.type === "consultant") {
          setStaffType("consultant");
        } else if (response.type === "pro") {
          setStaffType("pro");
        } else {
          setStaffType("coach");
        }
    } else {
      console.log("댓글 삭제 에러");
    }
  };

  useEffect(() => {
    (async () => {
      if (location.state) {
        const response = await getStaff(location.state);
        setStaff(response);
        setComments(response.evaluations);
        if (response.type === "consultant") {
          setStaffType("consultant");
        } else if (response.type === "pro") {
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
    })();
    setIsLoading(false);
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
          <Grid container sx={{ height: "auto" }} item xs={8}>
            <Grid
              style={{
                border: "1px solid #EAE3D2",
                backgroundColor: "#F9F5EB",
              }}
              item
              xs={4}
            >
              <div style={{ paddingLeft: "10px" }}>
                <h4
                  style={{
                    color: "#1D3979",
                    borderBottom: "2px solid #1D3979",
                  }}
                >
                  {staff.writer}
                </h4>
                <p>직책: {staffType}</p>
                {staff.email ? <p>이메일 : {staff.email}</p> : <p>이메일 : N/A</p>}
                <p>설명 :</p>
                <div>
                  <Ellipsis ref={ellipsisRef}>{staff.etc}</Ellipsis>
                  {isOverflown(ellipsisRef.current) ? <div style={{fontSize:'10px', color:'grey'}} onClick={longerTextHandler}>더보기</div> : <div></div>}
                </div>
                {/* <p style={{textOverflow:'ellipsis', overflow:'hidden', WebkitLineClamp:3, display:'-webkit-box', wordBreak:'break-all',webkitBoxOrient:'vertical'}}>{staff.etc}</p> */}
                <p>{comments.length}명의 평가</p>
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
              xs={8}
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
                  display: "flex",
                  justifyContent: "center",
                  height: "40vh",
                  width: "70%",
                }}
              >
                <EvaluationPentagon staff={staff}></EvaluationPentagon>
              </div>
            </Grid>
            <Grid
              item
              xs={12}
              style={{
                zIndex: 100,
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
          <Grid
            item
            xs={4}
            style={{
              height: "inherit",
              overflowY: "scroll",
              overflowX: "hidden",
              backgroundColor:'#F9F5EB'
            }}
          >
            <EvaulationComment comments={comments} deleteCommentHandler={deleteCommentHandler} />
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
