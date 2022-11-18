// install (please make sure versions match peerDependencies)
// yarn add @nivo/core @nivo/radar
import { ResponsiveRadar } from '@nivo/radar'
import Grid from "@mui/material/Grid";
import * as React from "react";

// make sure parent container have a defined height when using
// responsive component, otherwise height will be 0 and
// no chart will be rendered.
// website examples showcase many properties,
// you'll often use just a few of them.

const evaluationPentagon = (props) => {

    const name = props.staff.writer
    const averageScores = props.staff.averageScores

    const data = [
        {
          "criteria": "인품",
          [`${name}`]: averageScores[0]
        },
        {
          "criteria": "프로젝트 지도력",
          [`${name}`]: averageScores[1]
        },
        {
          "criteria": "상담",
          [`${name}`]: averageScores[2]
        },
        {
          "criteria": "강의 전달력",
          [`${name}`]: averageScores[3]
        },
        {
          "criteria": "반 분위기",
          [`${name}`]: averageScores[4]
        }
      ]
    return (
        ////////////////////////////////////////////////////////////////////////////////
        ///////////////////////////////// 선물 두고 가유 /////////////////////////////////
        <Grid item style={{height:'200px', display: 'table'}} xs={12} md={6}>
            <ResponsiveRadar
                data={[
                    {
                        "criteria": "열정",
                        [`${name}`]: averageScores[0]
                    },
                    {
                        "criteria": "지도력",
                        [`${name}`]: averageScores[1]
                    },
                    {
                        "criteria": "상담",
                        [`${name}`]: averageScores[2]
                    },
                    {
                        "criteria": "강의 전달력",
                        [`${name}`]: averageScores[3]
                    },
                    {
                        "criteria": "반 분위기",
                        [`${name}`]: averageScores[4]
                    }
                ]}
                keys={[ `${name}` ]}
                indexBy="criteria"
                animate={false}
                height={300}
                width={340}
                valueFormat=">-.2f"
                margin={{ top: 40, bottom: 60}}
                gridShape='linear'
                maxValue={5}
                borderColor={{ from: 'color' }}
                gridLabelOffset={20}
                isInteractive={true}
                dotSize={15}
                dotColor={{ theme: 'background' }}
                dotBorderWidth={2}
                colors='#617EAA'
                blendMode='normal'
                motionConfig="wobbly"
                theme={{'fontSize':15,
                    'fontFamily':'IBM Plex Sans KR',
                    'grid' : {
                      'line':{
                        'stroke':'grey'
                      }
                    }
                  }}
            />
        </Grid>
        //////////////////////////////////내 코드 끝이에유/////////////////////////////////
        ////////////////////////////////////////////////////////////////////////////////

        ////////////////////////////////////////////////////////////////////////////////
        ///////////////////////////////형 코드 시작이에유//////////////////////////////////
        // <ResponsiveRadar
        //     data={data}
        //     keys={[ `${props.staff.writer}` ]}
        //     indexBy="criteria"
        //     // valueFormat=">-.2f"
        //     margin={{ top: 70, right: 80, bottom: 40, left: 400 }}
        //     maxValue={5}
        //     borderColor={{ from: 'color' }}
        //     borderWidth='4px'
        //     gridShape='linear'
        //     gridLabelOffset={20}
        //     dotSize={15}
        //     dotColor={{ theme: 'background' }}
        //     dotBorderWidth={2}
        //     colors='#617EAA'
        //     blendMode="multiply"
        //     motionConfig="wobbly"
        //     theme={{'fontSize':15,
        //             'fontFamily':'IBM Plex Sans KR',
        //             'grid' : {
        //               'line':{
        //                 'stroke':'#EAE3D2'
        //               }
        //             }
        //           }}
        //     // legends={[
        //     //     {
        //     //         anchor: 'top-left',
        //     //         direction: 'column',
        //     //         translateX: -50,
        //     //         translateY: -40,
        //     //         itemWidth: 80,
        //     //         itemHeight: 20,
        //     //         itemTextColor: '#999',
        //     //         symbolSize: 12,
        //     //         symbolShape: 'circle',
        //     //         effects: [
        //     //             {
        //     //                 on: 'hover',
        //     //                 style: {
        //     //                     itemTextColor: '#000'
        //     //                 }
        //     //             }
        //     //         ]
        //     //     }
        //     // ]}
        // />
        //////////////////////////////////형 코드 끝이에유/////////////////////////////////
        ////////////////////////////////////////////////////////////////////////////////
    )
    }

export default evaluationPentagon