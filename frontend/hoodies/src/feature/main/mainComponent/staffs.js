import { useHistory } from "react-router-dom";
import staffs from "./staff.module.css";
import PageviewIcon from "@mui/icons-material/Pageview";
import Grid from '@mui/material/Grid';
import ReadMoreIcon from "@mui/icons-material/ReadMore";
import styled from "styled-components";

const Title = styled.div`
  font-size: 1em;
  margin-bottom: 10px;
  padding: 12px;
  border: 1px solid #F9F5EB;
  box-sizing: border-box;
  display: flex;
  text-align: center;
  justify-content: center;
  background-color: #e4ffc5;
`

const H1 = styled.h1`
  margin: 0;
`

const Staffs = (props) => {
  const history = useHistory();
  const evaluationPageHandler = () => {
    history.push("/pro");
  };

  const detailPageHandler = (staff) => {
    history.push({ pathname: "/pro/detail", state: staff });
    console.log(staff)
  };

  return props.staffs.length ? (
    <Grid container>
          <Title className={staffs.spacing}>
              <H1 className={staffs.title}>최신 평가&nbsp;&nbsp;&nbsp;</H1>
              <PageviewIcon onClick={evaluationPageHandler} />
          </Title>
      <div>
        {props.staffs.map((staff) => {
          return (
            <Grid
              className={staffs.card}
              key={staff._id}
              onClick={() => {
                detailPageHandler(staff);
              }}
            >
                <span>{staff.writer}</span>
                <span>{staff.email}</span> {/*a태그 걸기*/}
                <p>{staff.career}&nbsp;&nbsp;&nbsp;{staff.etc}</p>
                <p></p>
                <span>{staff.evaluations[0].writer}</span>
                <span>{staff.evaluations[0].content}</span>
                <span>{staff.evaluations[0].createdAt}</span>
            </Grid>
            // <tr key={article.id}>
            //   <td>{article.title}</td>
            //   <td>{article.writer}</td>
            //   <td>{article.createdAt}</td>
            //   <td>{article.viewCnt}</td>
            // </tr>
          );
        })}
      </div>
    </Grid>
  ) : (
    <Grid item xs={12} md={12}>작성된 글이 없습니다.</Grid>
  );
};

export default Staffs;
