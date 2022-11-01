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
          "chardonay": 27,
          "carmenere": 66,
          "syrah": 55
        },
        {
          "taste": "인성",
          "chardonay": 113,
          "carmenere": 100,
          "syrah": 40
        },
        {
          "taste": "heavy",
          "chardonay": 73,
          "carmenere": 28,
          "syrah": 91
        },
        {
          "taste": "strong",
          "chardonay": 97,
          "carmenere": 68,
          "syrah": 86
        },
        {
          "taste": "sunny",
          "chardonay": 70,
          "carmenere": 69,
          "syrah": 60
        }
      ]
    return (
        <ResponsiveRadar
            data={data}
            keys={[ 'chardonay', 'carmenere', 'syrah' ]}
            indexBy="taste"
            // valueFormat=">-.2f"
            margin={{ top: 70, right: 80, bottom: 40, left: 80 }}
            borderColor={{ from: 'color' }}
            gridLabelOffset={36}
            dotSize={10}
            dotColor={{ theme: 'background' }}
            dotBorderWidth={2}
            colors={{ scheme: 'nivo' }}
            blendMode="multiply"
            motionConfig="wobbly"
            legends={[
                {
                    anchor: 'top-left',
                    direction: 'column',
                    translateX: -50,
                    translateY: -40,
                    itemWidth: 80,
                    itemHeight: 20,
                    itemTextColor: '#999',
                    symbolSize: 12,
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
    )
    }

export default evaluationPentagon