import { Button, TextField } from "@mui/material";
import Rating from "@mui/material/Rating";
import { Fragment, useState } from "react";
import { postEvaluation, getStaff, checkEvaluation } from "./evaluationAPI";
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
  const [enthusiasm, setEnthusiasm] = useState(5);
  const [atmosphere, setAtmosphere] = useState(5);
  const [project, setProject] = useState(5);
  const [lecture, setLecture] = useState(5);
  const [consultation, setConsultation] = useState(5);
  const [studentComment, setStudentComment] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    const score = [enthusiasm, atmosphere, project, lecture, consultation];
    if (studentComment.trim()) {
      const formData = new FormData()
      formData.set('comment', studentComment)
      const checkStuduentData = await checkEvaluation(formData)
      
      
      if (checkStuduentData.commentResult !== 'clean'){
        Swal.fire('부적절한 표현이 있습니다. 상대를 생각하세요.')
       } else {
         const response = await postEvaluation(id, score, studentComment);
         if (response.statusCode === 200) {
           const response1 = await getStaff(id);
           props.setStaff(response1);
           props.setComments(response1.evaluations);
           Swal.fire({
             title: "게시",
             icon: "success",
             timer: 2000,
             timerProgressBar: true,
           });
         } else {
           Swal.fire({
             title: "이미 평가글을 올렸습니다.",
             icon: "warning",
             timer: 2000,
             timerProgressBar: true,
           });
         }
  
      }
    } else {
      Swal.fire('내용을 입력해주세요!')
    }

  }

  return (
    <Grid
      container
      items
      spacing={1}
      style={{ marginTop: "5px", paddingLeft: "20px", marginBottom:'15px' }}
    >
      <Grid item md={5} xs={12} style={{ width:'90%', display: "flex", flexDirection: "column" }}>
        <RateItem>
          <p style={{ margin: 0, fontSize: "large", fontWeight: 500 }}>열정:</p>
          <Rating
            sx={{width:'80%'}}
            value={enthusiasm}
            onChange={(event, newValue) => {
              setEnthusiasm(newValue);
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
      <Grid item md={7} xs={12} style={{ display: "flex", flexDirection: "column" }}>
        <TextField
          sx={{
            width:'95%',
            "& .MuiOutlinedInput-input": {
              height: "100px",
              backgroundColor: "white",
            },
            fontFamily:'IBM Plex Sans KR'
          }}
          value={studentComment || ""}
          onChange={(event) => {
            setStudentComment(event.target.value);
          }}
          label="한줄평을 입력해주세요."
          variant="outlined"
          inputProps={{maxLength: 140}}
          multiline
        ></TextField>
        <div style={{ fontWeight:600, color: "red", fontSize:'small' }}>*게시 후 삭제, 수정이 불가합니다!</div>
        <Button
          style={{ backgroundColor:'#1D3979', fontWeight:700, color:'white', marginTop: "10px", width:'95%' }}
          onClick={handleSubmit}
          
        >
          등록
        </Button>
      </Grid>
    </Grid>
  );
};

export default CreateEvaluation;
