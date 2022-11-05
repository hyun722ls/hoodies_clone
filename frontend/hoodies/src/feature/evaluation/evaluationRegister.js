import { Button, TextField } from "@mui/material";
import Rating from "@mui/material/Rating";
import { Fragment, useState } from "react";
import { postEvaluation, getStaff } from "./evaluationAPI";
import styled from "styled-components";
import { Grid } from "@mui/material";
import { useHistory } from "react-router-dom";
import Swal from "sweetalert2";
import StarRateRoundedIcon from "@mui/icons-material/StarRateRounded";
import StarOutlineRoundedIcon from "@mui/icons-material/StarOutlineRounded";

const Rate = styled.div`
  display: flex;
  flex-direction: column;
`;

const RateItem = styled.div`
  display: inline-flex;
  margin-bottom: 7px;
  align-items: center;
`;

const CreateEvaluation = (props) => {
  const history = useHistory();
  const [id, setId] = useState(props.id);
  const [personality, setPersonality] = useState(1);
  const [atmosphere, setAtmosphere] = useState(2);
  const [project, setProject] = useState(3);
  const [lecture, setLecture] = useState(4);
  const [consultation, setConsultation] = useState(5);
  const [studentComment, setStudentComment] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    const score = [personality, atmosphere, project, lecture, consultation];
    const response = await postEvaluation(id, score, studentComment);
    if (response.statusCode === 200) {
      const response1 = await getStaff(id);
      props.setStaff(response1);
      props.setComments(response1.evaluations);
      if (response) {
        Swal.fire({
          title: "게시",
          icon: "success",
          timer: 2000,
          timerProgressBar: true,
        });
        history.push({ pathname: "/pro/detail", state: props.staff });
      } else {
        console.log("이런!");
        history.push({ pathname: "/pro/detail", state: props.staff });
      }
    }
  }

  return (
    <Grid
      container
      items
      spacing={1}
      style={{ marginTop: "5px", marginLeft: "10px" }}
    >
      <Grid item xs={5} style={{ display: "flex", flexDirection: "column" }}>
        <RateItem>
          <p style={{ margin: 0, fontSize: "large", fontWeight: 500 }}>인품:</p>
          <Rating
            value={personality}
            onChange={(event, newValue) => {
              setPersonality(newValue);
            }}
            icon={<StarRateRoundedIcon fontSize="large" />}
            emptyIcon={<StarOutlineRoundedIcon fontSize="large" />}
          ></Rating>
        </RateItem>
        <RateItem>
          <p style={{ margin: 0, fontSize: "large", fontWeight: 500 }}>
            반 분위기:
          </p>
          <Rating
            value={atmosphere}
            onChange={(event, newValue) => {
              setAtmosphere(newValue);
            }}
            icon={<StarRateRoundedIcon fontSize="large" />}
            emptyIcon={<StarOutlineRoundedIcon fontSize="large" />}
          ></Rating>
        </RateItem>
        <RateItem>
          <p style={{ margin: 0, fontSize: "large", fontWeight: 500 }}>
            프로젝트 지도력:
          </p>
          <Rating
            value={project}
            onChange={(event, newValue) => {
              setProject(newValue);
            }}
            icon={<StarRateRoundedIcon fontSize="large" />}
            emptyIcon={<StarOutlineRoundedIcon fontSize="large" />}
          ></Rating>
        </RateItem>
        <RateItem>
          <p style={{ margin: 0, fontSize: "large", fontWeight: 500 }}>
            강의 전달력:
          </p>
          <Rating
            value={lecture}
            onChange={(event, newValue) => {
              setLecture(newValue);
            }}
            icon={<StarRateRoundedIcon fontSize="large" />}
            emptyIcon={<StarOutlineRoundedIcon fontSize="large" />}
          ></Rating>
        </RateItem>
        <RateItem>
          <p style={{ margin: 0, fontSize: "large", fontWeight: 500 }}>상담:</p>
          <Rating
            value={consultation}
            onChange={(event, newValue) => {
              setConsultation(newValue);
            }}
            icon={<StarRateRoundedIcon fontSize="large" />}
            emptyIcon={<StarOutlineRoundedIcon fontSize="large" />}
          ></Rating>
        </RateItem>
      </Grid>
      <Grid item xs={6.6} style={{ display: "flex", flexDirection: "column" }}>
        <TextField
          sx={{
            "& .MuiOutlinedInput-input": {
              height: "100px",
              backgroundColor: "white",
            },
          }}
          value={studentComment || ""}
          onChange={(event) => {
            setStudentComment(event.target.value);
          }}
          label="한줄평을 입력해주세요."
          variant="outlined"
        ></TextField>
        <div style={{ color: "red" }}>*게시 후 삭제, 수정이 불가합니다!</div>
        <Button
          style={{ marginTop: "10px" }}
          onClick={handleSubmit}
          variant="contained"
        >
          등록
        </Button>
      </Grid>
    </Grid>
  );
};

export default CreateEvaluation;
