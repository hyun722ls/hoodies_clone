import * as React from 'react';
import { ResponsiveRadar } from '@nivo/radar';
import { useHistory } from "react-router-dom";
import staffs from "./staff.module.css";
import PageviewIcon from "@mui/icons-material/Pageview";
import Grid from '@mui/material/Grid';
import ReadMoreIcon from "@mui/icons-material/ReadMore";
import styled from "styled-components";
import { PRO_EVAL } from "../../../common/data/dummyData"

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
    const evaluationPageHandler = () => {history.push("/pro");
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
                  <p>{staff.career}</p>
                  <p>{staff.etc}</p>
                  <div style={{height:'320px'}}>
                      <ResponsiveRadar
                          data={[
                              {
                                  "item": "인품",
                                  "평균": 3.5,
                                  "작성자": staff.evaluations[0].score[0]
                              },
                              {
                                  "item": "프로젝트 지도력",
                                  "평균": 3.5,
                                  "작성자": staff.evaluations[0].score[1]
                              },
                              {
                                  "item": "상담",
                                  "평균": 3.5,
                                  "작성자": staff.evaluations[0].score[2]
                              },
                              {
                                  "item": "강의 전달력",
                                  "평균": 3.5,
                                  "작성자": staff.evaluations[0].score[3]
                              },
                              {
                                  "item": "반 분위기",
                                  "평균": 3.5,
                                  "작성자": staff.evaluations[0].score[4]
                              }
                          ]}
                          keys={[ '작성자' ]}
                          indexBy="item"
                          // valueFormat=">-.2f"
                          margin={{ top: 0, right: 100, bottom: -100, left: 100 }}
                          gridShape='circular'
                          maxValue={5}
                          borderColor={{ from: 'color' }}
                          gridLabelOffset={4}
                          isInteractive={false}
                          dotSize={0}
                          dotColor={{ theme: 'background' }}
                          dotBorderWidth={1}
                          colors={{ scheme: 'accent' }}
                          blendMode="overlay"
                          motionConfig="wobbly"
                          legends={[
                              {
                                  anchor: 'top-right',
                                  direction: 'column',
                                  translateX: -70,
                                  translateY: 100,
                                  itemWidth: 80,
                                  itemHeight: 20,
                                  itemTextColor: '#999',
                                  symbolSize: 8,
                                  symbolShape: 'circle',
                                  effects: [
                                      {
                                          on: 'hover',
                                          style: {
                                              itemTextColor: '#000'
                                          }
                                      }
                                  ]
                              }
                          ]}
                      />
                  </div>
                  <span>{staff.evaluations[0].writer}</span>
                  <span>{staff.evaluations[0].content}</span>
                  <span>{staff.evaluations[0].createdAt}</span>
              </Grid>
          );
        })}
      </div>
    </Grid>
  ) : (
    <Grid item xs={12} md={12}>작성된 글이 없습니다.</Grid>
  );
};

export default Staffs;
