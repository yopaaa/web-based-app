// App.js

import { useEffect, useState } from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, G, Path, Text as SvgText } from 'react-native-svg';

const { width } = Dimensions.get('window');

const FlowMeterGauge = ({
    data = [],
    maxValue = 200,
    unit = 'L/min',
    title = 'Flow Meter',
    gaugeRadius = 50,
    strokeWidth = 20,
    startAngle = -135,
    endAngle = 135,
    baseColor = "#ffd700"
}) => {
    const [currentValue, setCurrentValue] = useState(0);
    const [totalLiters, setTotalLiters] = useState(0);

    const sampleData = [
        { time: Date.now() - 5000, data: 0 },
    ];

    const sensorData = data.length > 0 ? data : sampleData;

    useEffect(() => {
        if (sensorData.length > 0) {
            const latestData = sensorData[sensorData.length - 1];
            setCurrentValue(latestData.data);

            const total = sensorData.reduce((sum, item) => sum + item.data, 0) / 60;
            setTotalLiters(Math.round(total));
        }
    }, [sensorData]);

    const size = width * 1;
    const radius = (size - strokeWidth) / 2 - (100 - gaugeRadius);


    const totalAngle = endAngle - startAngle;

    const percentage = Math.min(currentValue / maxValue, 1);
    const needleAngle = startAngle + totalAngle * percentage;
    const needleRad = (needleAngle * Math.PI) / 180;

    const needleLength = radius * 0.7;
    const centerX = size / 2;
    const centerY = size / 2;
    const needleX = centerX + needleLength * Math.cos(needleRad);
    const needleY = centerY + needleLength * Math.sin(needleRad);

    const createArcPath = (startAngle, endAngle, radius, centerX, centerY) => {
        const start = (startAngle * Math.PI) / 180;
        const end = (endAngle * Math.PI) / 180;

        const x1 = centerX + radius * Math.cos(start);
        const y1 = centerY + radius * Math.sin(start);
        const x2 = centerX + radius * Math.cos(end);
        const y2 = centerY + radius * Math.sin(end);

        const largeArc = endAngle - startAngle > 180 ? 1 : 0;

        return `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}`;
    };

    const backgroundPath = createArcPath(startAngle, endAngle, radius, centerX, centerY);
    const progressPath = createArcPath(startAngle, needleAngle, radius, centerX, centerY);

    const generateTicks = () => {
        const ticks = [];
        const tickCount = 5;

        for (let i = 0; i <= tickCount; i++) {
            const tickValue = (maxValue / tickCount) * i;
            const tickAngle = startAngle + (totalAngle * i) / tickCount;
            const tickRad = (tickAngle * Math.PI) / 180;

            const tickStartRadius = radius * 0.85;
            const tickEndRadius = radius * 0.95;
            const textRadius = radius * 0.75;

            const x1 = centerX + tickStartRadius * Math.cos(tickRad);
            const y1 = centerY + tickStartRadius * Math.sin(tickRad);
            const x2 = centerX + tickEndRadius * Math.cos(tickRad);
            const y2 = centerY + tickEndRadius * Math.sin(tickRad);

            const textX = centerX + textRadius * Math.cos(tickRad);
            const textY = centerY + textRadius * Math.sin(tickRad);

            ticks.push(
                <G key={i}>
                    <Path
                        d={`M ${x1} ${y1} L ${x2} ${y2}`}
                        stroke="#666"
                        strokeWidth="2"
                    />
                    <SvgText
                        x={textX}
                        y={textY + 4}
                        fontSize="12"
                        fill="#999"
                        textAnchor="middle"
                    >
                        {Math.round(tickValue)}
                    </SvgText>
                </G>
            );
        }
        return ticks;
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>{title}</Text>

            <Svg width={size} height={size * 1}>
                <Path d={backgroundPath} stroke="#2a2a2a" strokeWidth={strokeWidth} fill="none" />
                <Path d={progressPath} stroke={baseColor} strokeWidth={strokeWidth} fill="none" />
                {generateTicks()}
                <Circle cx={centerX} cy={centerY} r="6" fill={baseColor} />
                <Path
                    d={`M ${centerX} ${centerY} L ${needleX} ${needleY}`}
                    stroke={baseColor}
                    strokeWidth="3"
                />
                <SvgText
                    x={centerX}
                    y={centerY + -20}
                    fontSize="28"
                    fill={baseColor}
                    fontWeight="bold"
                    textAnchor="middle"
                >
                    {Math.round(currentValue)}
                </SvgText>
                <SvgText
                    x={centerX}
                    y={centerY + 30}
                    fontSize="14"
                    fill="#999"
                    textAnchor="middle"
                >
                    {unit}
                </SvgText>
            </Svg>

            <Text style={styles.literLabel}>Liter</Text>
            <Text style={styles.totalLiters}>{totalLiters}'</Text>

            <Text style={styles.latestLabel}>Latest Reading:</Text>
            <Text style={styles.latestTime}>
                {new Date(sensorData[sensorData.length - 1]?.time || Date.now()).toLocaleTimeString()}
            </Text>

            <View style={styles.dataBox}>
                <Text style={styles.dataBoxTitle}>Recent Data:</Text>
                {sensorData.slice(-3).map((item, index) => (
                    <View key={index} style={styles.dataRow}>
                        <Text style={styles.dataTime}>{new Date(item.time).toLocaleTimeString()}</Text>
                        <Text style={styles.dataValue}>{item.data} {unit}</Text>
                    </View>
                ))}
            </View>
        </ScrollView>
    );
};

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const App = () => {
    const [sensorData, setSensorData] = useState(
        [{ "data": 8, "time": 1748590044683 },
        { "data": 1, "time": 1748590044890 },
        { "data": 1, "time": 1748590045098 },
        { "data": 4, "time": 1748590045306 },
        { "data": 9, "time": 1748590045513 },
        { "data": 15, "time": 1748590045722 },
        { "data": 7, "time": 1748590045928 },
        { "data": 18, "time": 1748590046136 },
        { "data": 4, "time": 1748590046343 },
        { "data": 14, "time": 1748590046562 }]

    );

    useEffect(() => {
        const interval = setInterval(() => {
            const newReading = {
                time: Date.now(),
                data: getRandomInt(40, 50)
            };

            setSensorData(prev => {
                const updated = [...prev, newReading];
                return updated.slice(-10);
            });

        }, 200);

        return () => clearInterval(interval);
    }, []);

    //   useEffect(() => {
    //               console.log(sensorData);

    //   }, [sensorData])


    return (
        <>
            <FlowMeterGauge
                data={sensorData}
                maxValue={50}
                unit="L/min"
                title="Flow Meter"
            />


            {/* <Horizontal /> */}

            {/* <Degre /> */}
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#111',
        alignItems: 'center',
        paddingVertical: 20
    },
    title: {
        color: '#ccc',
        fontSize: 18,
        marginBottom: 10
    },
    literLabel: {
        color: '#888',
        fontSize: 14,
        marginTop: 10
    },
    totalLiters: {
        color: '#ffd700',
        fontSize: 30,
        fontWeight: 'bold'
    },
    latestLabel: {
        color: '#aaa',
        fontSize: 12,
        marginTop: 12
    },
    latestTime: {
        color: '#ccc',
        fontSize: 14
    },
    dataBox: {
        backgroundColor: '#222',
        padding: 12,
        borderRadius: 10,
        marginTop: 16,
        width: '85%'
    },
    dataBoxTitle: {
        color: '#ddd',
        fontSize: 14,
        marginBottom: 8
    },
    dataRow: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    dataTime: {
        color: '#777',
        fontSize: 12
    },
    dataValue: {
        color: '#ffd700',
        fontSize: 12
    }
});

export default App;
