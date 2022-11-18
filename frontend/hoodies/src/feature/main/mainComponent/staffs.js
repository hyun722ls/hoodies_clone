import * as React from "react";
import { ResponsiveRadar } from "@nivo/radar";
import { useHistory } from "react-router-dom";
import staffs from "./staff.module.css";
import PageviewIcon from "@mui/icons-material/Pageview";
import Grid from "@mui/material/Grid";
// import ReadMoreIcon from "@mui/icons-material/ReadMore";
import styled from "styled-components";
// import { PRO_EVAL } from "../../../common/data/dummyData"
import Box from '@mui/material/Box';
import Rating from '@mui/material/Rating';
// import StarIcon from '@mui/icons-material/Star';
import StarRateRoundedIcon from '@mui/icons-material/StarRateRounded';

const Title = styled.div`
  font-size: 1em;
  margin-bottom: 10px;
  padding: 12px;
  border: 1px solid #f9f5eb;
  box-sizing: border-box;
  display: flex;
  text-align: center;
  justify-content: center;
  background-color: #e4ffc5;
`;

const DIV = styled.div`
  margin-bottom: 3px;
  display:flex;
  flex-wrap: wrap;
  justify-content: center;
`;

const DIV2 = styled.div`
  height: 15.2px;
`

const H1 = styled.h1`
  margin: 0;
`;

const H2 = styled.h2`
  font-size: medium;
  color: #090079;
`;

const H3 = styled.h3`
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  font-size: 3px;
  color: #0050ad;
`

const H4 = styled.h4`
  font-weight: bold;
`;

const H5 = styled.h5`
  font-weight: normal;
  text-align: center;
  font-size: 12px;
  margin-top: 0;
  color: goldenrod;
`;

const H6 = styled.h6`
  font-size: small;
  color: #0050ad;
  justify-content: end;
`;

const labels = {
  1: "저와는 맞지 않았어요 ;<",
  2: "보통이었어요 :O",
  3: "좋았어요! :)",
  4: "매우 좋았습니다!! :>",
  5: "최고의 PRO.",
};



const Staffs = (props) => {
    const history = useHistory();
    const evaluationPageHandler = () => {history.push("/pro");
    };
    const averageConventer = (staff) => {
        if (staff.evaluations.length > 0){
            const array = staff.evaluations[0].score
            const average = arr => arr.reduce((p, c) => p + c, 0) / arr.length;
            const value = Math.round(average(array))
            return value
        } else {
            const value = 0
            return value
        }

    }
    const dataConverter = (staff) => {
        if (staff.evaluations.length === 0) {
            let data = [
                {
                    "item": "열정",
                    "평균": staff.averageScores[0],
                },
                {
                    "item": "프로젝트 지도력",
                    "평균": staff.averageScores[1],
                },
                {
                    "item": "상담",
                    "평균": staff.averageScores[2],
                },
                {
                    "item": "강의 전달력",
                    "평균": staff.averageScores[3],
                },
                {
                    "item": "반 분위기",
                    "평균": staff.averageScores[4],
                }
            ]
            return data

        } else {
            let data = [
                {
                    "item": "열정",
                    "평균": staff.averageScores[0],
                    "작성자": staff.evaluations[staff.evaluations.length-1].score[0]
                },
                {
                    "item": "프로젝트 지도력",
                    "평균": staff.averageScores[1],
                    "작성자": staff.evaluations[staff.evaluations.length-1].score[1]
                },
                {
                    "item": "상담",
                    "평균": staff.averageScores[2],
                    "작성자": staff.evaluations[staff.evaluations.length-1].score[2]
                },
                {
                    "item": "강의 전달력",
                    "평균": staff.averageScores[3],
                    "작성자": staff.evaluations[staff.evaluations.length-1].score[3]
                },
                {
                    "item": "반 분위기",
                    "평균": staff.averageScores[4],
                    "작성자": staff.evaluations[staff.evaluations.length-1].score[4]
                }
            ]
            return data
        }
    }
    const detailPageHandler = (staff) => {
        history.push({ pathname: "/pro/detail", state: staff._id });
    };
    return props.staffs.length ? (
        <Grid container>
            <Title className={staffs.spacing}>
                <H1 className={staffs.title}>최신 평가&nbsp;&nbsp;&nbsp;</H1>
                <PageviewIcon onClick={evaluationPageHandler} />
            </Title>
            <DIV>
                {props.staffs.map((staff) => {
                   const value = averageConventer(staff)

                    return (
                        <Grid
                            className={`${staffs.card} ${staffs.border}`}
                            key={staff._id}
                            onClick={() => {
                                detailPageHandler(staff);
                            }}
                        >


                            <Grid sx={{ minWidth: 275}}>
                                <H2>{staff.writer}</H2>
                                <DIV2>
                                    <H3>{staff.etc}</H3>
                                </DIV2>

                                {/*<Grid item sx={{ margin: '0px', marginRight: '0px'}} xs={12} md={6}>*/}
                                <Grid item style={{height:'200px', width: '25vw', position: 'relative', display: 'table', marginLeft: 'auto', marginRight: 'auto'}} xs={12} md={6}>
                                    <ResponsiveRadar
                                        data={dataConverter(staff)}
                                        keys={[ '작성자' ]}
                                        indexBy="item"
                                        animate={false}
                                        height={200}
                                        width={300}
                                        // valueFormat=">-.2f"
                                        margin={{ top: 30, bottom: 30, right: 90, left: 90 }}
                                        gridShape='circular'
                                        maxValue={5}
                                        borderColor={{ from: 'color' }}
                                        gridLabelOffset={10}
                                        isInteractive={false}
                                        dotSize={0}
                                        dotColor={{ theme: 'background' }}
                                        dotBorderWidth={1}
                                        colors={{ scheme: 'accent' }}
                                        blendMode="overlay"
                                        motionConfig="wobbly"
                                        // legends={[
                                        //     {
                                        //         anchor: 'bottom-right',
                                        //         direction: 'column',
                                        //         translateX: -70,
                                        //         translateY: 100,
                                        //         itemWidth: 80,
                                        //         itemHeight: 220,
                                        //         itemTextColor: '#999',
                                        //         symbolSize: 8,
                                        //         symbolShape: 'circle',
                                        //         effects: [
                                        //             {
                                        //                 on: 'hover',
                                        //                 style: {
                                        //                     itemTextColor: '#000'
                                        //                 }
                                        //             }
                                        //         ]
                                        //     }
                                        // ]}
                                    />
                                </Grid>

                                {staff.evaluations.length > 0 ? <H4>익명님의 한줄평 : {staff.evaluations[staff.evaluations.length-1].content}</H4> : <H4>한줄평을 기다리고 있어요!😺</H4>}
                                <br />
                                <Box
                                    sx={{
                                        width: 300,
                                        alignItems: 'center',
                                    }}
                                >
                                    <Rating
                                        name="text-feedback"
                                        value={value}
                                        readOnly
                                        precision={0.5}
                                        icon={<StarRateRoundedIcon fontSize="large" />}
                                        emptyIcon={<StarRateRoundedIcon style={{ opacity: 0.45 }} fontSize="large" />}
                                    />
                                    <H5>{labels[value]}</H5>
                                    {staff.evaluations.length > 0 ? <H6>{staff.evaluations[staff.evaluations.length-1].createdAt}</H6> : <H6></H6>}
                                </Box>
                            </Grid>
                        </Grid>
                    )
                })}
            </DIV>
        </Grid>
    ) : (
        <Grid item xs={12} md={12}>작성된 글이 없습니다.</Grid>
    );
};

export default Staffs;
