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
          "taste": "teaching skill",
          "chardonay": 10
        },
        {
          "taste": "mentoring skill",
          "chardonay": 90
        },
        {
          "taste": "class atmosphere",
          "chardonay": 73
        },
        {
          "taste": "strong",
          "chardonay": 97
        },
        {
          "taste": "sunny",
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
            gridShape='linear'
            gridLabelOffset={30}
            dotSize={30}
            dotColor={{ theme: 'background' }}
            dotBorderWidth={2}
            colors={{ scheme: 'nivo' }}
            blendMode="multiply"
            motionConfig="wobbly"
            theme={{'fontSize':20,
                    'fontFamily':'IBM Plex Sans KR'
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