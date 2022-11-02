// install (please make sure versions match peerDependencies)
// yarn add @nivo/core @nivo/radar
import { ResponsiveRadar } from '@nivo/radar'

// make sure parent container have a defined height when using
// responsive component, otherwise height will be 0 and
// no chart will be rendered.
// website examples showcase many properties,
// you'll often use just a few of them.

const evaluationPentagon = () => {
    const data = [
        {
          "taste": "인품",
          "chardonay": 10
        },
        {
          "taste": "프로젝트 지도력",
          "chardonay": 90
        },
        {
          "taste": "상담",
          "chardonay": 73
        },
        {
          "taste": "강의 전달력",
          "chardonay": 97
        },
        {
          "taste": "반 분위기",
          "chardonay": 95
        }
      ]
    return (
        <ResponsiveRadar
            data={data}
            keys={[ 'chardonay' ]}
            indexBy="taste"
            // valueFormat=">-.2f"
            margin={{ top: 70, right: 80, bottom: 40, left: 400 }}
            borderColor={{ from: 'color' }}
            borderWidth='4px'
            gridShape='linear'
            gridLabelOffset={20}
            dotSize={15}
            dotColor={{ theme: 'background' }}
            dotBorderWidth={2}
            colors='#617EAA'
            blendMode="multiply"
            motionConfig="wobbly"
            theme={{'fontSize':15,
                    'fontFamily':'IBM Plex Sans KR',
                    'grid' : {
                      'line':{
                        'stroke':'#EAE3D2'
                      }
                    }
                  }}
            // legends={[
            //     {
            //         anchor: 'top-left',
            //         direction: 'column',
            //         translateX: -50,
            //         translateY: -40,
            //         itemWidth: 80,
            //         itemHeight: 20,
            //         itemTextColor: '#999',
            //         symbolSize: 12,
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
    )
    }

export default evaluationPentagon