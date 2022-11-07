import { Grid } from "@mui/material";
import { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import Header from "../../common/UI/header/header";
import EvaulationComment from "./evaluationComment";
import EvaluationPentagon from "./evaluationPentagon";
// import styled from "styled-components";
import CreateEvaluation from "./evaluationRegister";
import Swal from "sweetalert2";
import { deleteComment, getStaff, postEvaluation } from "./evaluationAPI";

const EvenPro = () => {
  const dummyData = {
    averageScores: [1, 2, 3, 4, 5],
    career: ["삼성SDS", "SSG.COM", "넷마블 이츠게임즈", "SSAFY 컨설턴트"],
    contributor: [
      "bc3659f6f3ad0a7924d9b8b1c0ed6f670965b55ba965090b541e671bd0cd9e00",
    ],
    email: "www.google.com",
    etc: "JAVA, Spring, Unicty, C#\nOracle Query\nBig Data",
    evaluations: [
      {
        category: '{\n  "commentResult": "clean"\n}',
        content: "최고",
        createdAt: "2022-11-04 15:30:02",
        like: 0,
        score: [1, 2, 3, 4, 5],
        writer:
          "bc3659f6f3ad0a7924d9b8b1c0ed6f670965b55ba965090b541e671bd0cd9e00",
        _id: "6364b16aec210b489df24e1f",
      },
      {
        category: '{\n  "commentResult": "clean"\n}',
        content: "최고",
        createdAt: "2022-11-04 15:30:02",
        like: 0,
        score: [1, 2, 3, 4, 5],
        writer:
          "bc3659f6f3ad0a7924d9b8b1c0ed6f670965b55ba965090b541e671bd0cd9e00",
        _id: "6364b16aec210b489df24e1f",
      },
      {
        category: '{\n  "commentResult": "clean"\n}',
        content: "최고",
        createdAt: "2022-11-04 15:30:02",
        like: 0,
        score: [1, 2, 3, 4, 5],
        writer:
          "bc3659f6f3ad0a7924d9b8b1c0ed6f670965b55ba965090b541e671bd0cd9e00",
        _id: "6364b16aec210b489df24e1f",
      },
      {
        category: '{\n  "commentResult": "clean"\n}',
        content: "최고",
        createdAt: "2022-11-04 15:30:02",
        like: 0,
        score: [1, 2, 3, 4, 5],
        writer:
          "bc3659f6f3ad0a7924d9b8b1c0ed6f670965b55ba965090b541e671bd0cd9e00",
        _id: "6364b16aec210b489df24e1f",
      },
      {
        category: '{\n  "commentResult": "clean"\n}',
        content: "최고",
        createdAt: "2022-11-04 15:30:02",
        like: 0,
        score: [1, 2, 3, 4, 5],
        writer:
          "bc3659f6f3ad0a7924d9b8b1c0ed6f670965b55ba965090b541e671bd0cd9e00",
        _id: "6364b16aec210b489df24e1f",
      },
      {
        category: '{\n  "commentResult": "clean"\n}',
        content: "최고",
        createdAt: "2022-11-04 15:30:02",
        like: 0,
        score: [1, 2, 3, 4, 5],
        writer:
          "bc3659f6f3ad0a7924d9b8b1c0ed6f670965b55ba965090b541e671bd0cd9e00",
        _id: "6364b16aec210b489df24e1f",
      },
      {
        category: '{\n  "commentResult": "clean"\n}',
        content:
          "dslfjsdlkfjsdlkfjlsdkfjlsdkjflsdkjflsdkjflksdjflksdjflkdsjflkdsjflsdjflksdjlfksdjlfkjsdlfkjsdlfkjsdlfkjsdlfkj",
        createdAt: "2022-11-04 15:30:02",
        like: 0,
        score: [1, 2, 3, 4, 5],
        writer:
          "bc3659f6f3ad0a7924d9b8b1c0ed6f670965b55ba965090b541e671bd0cd9e00",
        _id: "6364b16aec210b489df24e1f",
      },
      {
        category: '{\n  "commentResult": "clean"\n}',
        content: "최고",
        createdAt: "2022-11-04 15:30:02",
        like: 0,
        score: [1, 2, 3, 4, 5],
        writer:
          "bc3659f6f3ad0a7924d9b8b1c0ed6f670965b55ba965090b541e671bd0cd9e00",
        _id: "6364b16aec210b489df24e1f",
      },
      {
        category: '{\n  "commentResult": "clean"\n}',
        content: "최고",
        createdAt: "2022-11-04 15:30:02",
        like: 0,
        score: [1, 2, 3, 4, 5],
        writer:
          "bc3659f6f3ad0a7924d9b8b1c0ed6f670965b55ba965090b541e671bd0cd9e00",
        _id: "6364b16aec210b489df24e1f",
      },
      {
        category: '{\n  "commentResult": "clean"\n}',
        content: "최고",
        createdAt: "2022-11-04 15:30:02",
        like: 0,
        score: [1, 2, 3, 4, 5],
        writer:
          "bc3659f6f3ad0a7924d9b8b1c0ed6f670965b55ba965090b541e671bd0cd9e00",
        _id: "6364b16aec210b489df24e1f",
      },
    ],
    modifiedAt: "2022-11-04 15:30:02",
    type: 1,
    writer: "이태희",
    _id: "1",
  };

  const history = useHistory();
  const location = useLocation();
  const [staff, setStaff] = useState([]);
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [staffType, setStaffType] = useState("");

  const backHandler = (event) => {
    history.go(-1);
  };

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
        console.log(response)
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
          sx={{ height: "500px", width: "100vw", marginTop: "1rem" }}
        >
          <Grid container sx={{ height: "500px" }} item xs={8}>
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
                <p>이메일 : {staff.email}</p>
                <pre style={{ fontFamily: "IBM Plex Sans KR" }}>
                  설명 : {staff.etc}
                </pre>
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
