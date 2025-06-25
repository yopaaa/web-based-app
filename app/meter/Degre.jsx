import { useEffect, useState } from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, G, Line, Path, Text as SvgText } from 'react-native-svg';

const { width } = Dimensions.get('window');

const CircularFlowMeterGauge = ({
  data = [],
  maxValue = 200,
  unit = 'L/min',
  title = 'Flow Meter'
}) => {
  const [currentValue, setCurrentValue] = useState(0);
  const [totalLiters, setTotalLiters] = useState(0);

  const sampleData = [
    { time: Date.now() - 5000, data: 45 },
    { time: Date.now() - 4000, data: 67 },
    { time: Date.now() - 3000, data: 89 },
    { time: Date.now() - 2000, data: 124 },
    { time: Date.now() - 1000, data: 156 },
    { time: Date.now(), data: 78 }
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

  const size = width * 0.8;
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2 - 30;
  const centerX = size / 2;
  const centerY = size / 2;

  const startAngle = 225;
  const endAngle = 315;
  const totalAngle = endAngle - startAngle;

  const percentage = Math.min(currentValue / maxValue, 1);
  const currentAngle = startAngle + (totalAngle * percentage);

  const polarToCartesian = (angle, radius) => {
    const rad = (angle * Math.PI) / 180;
    return {
      x: centerX + radius * Math.cos(rad),
      y: centerY + radius * Math.sin(rad)
    };
  };

  const createArcPath = (start, end, radius) => {
    const startCoord = polarToCartesian(start, radius);
    const endCoord = polarToCartesian(end, radius);
    const largeArc = Math.abs(end - start) > 180 ? 1 : 0;

    return `M ${startCoord.x} ${startCoord.y} A ${radius} ${radius} 0 ${largeArc} 1 ${endCoord.x} ${endCoord.y}`;
  };

  const backgroundPath = createArcPath(startAngle, endAngle, radius);
  const progressPath = createArcPath(startAngle, currentAngle, radius);

  const generateTicks = () => {
    const ticks = [];
    const tickCount = 4;

    for (let i = 0; i <= tickCount; i++) {
      const value = (maxValue / tickCount) * i;
      const angle = startAngle + (totalAngle * i) / tickCount;
      const rad = (angle * Math.PI) / 180;

      const inner = radius + 5;
      const outer = radius + 15;
      const label = radius + 30;

      const x1 = centerX + inner * Math.cos(rad);
      const y1 = centerY + inner * Math.sin(rad);
      const x2 = centerX + outer * Math.cos(rad);
      const y2 = centerY + outer * Math.sin(rad);
      const lx = centerX + label * Math.cos(rad);
      const ly = centerY + label * Math.sin(rad);

      ticks.push(
        <G key={i}>
          <Line
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="#666"
            strokeWidth={2}
          />
          <SvgText
            x={lx}
            y={ly + 4}
            fontSize={11}
            fill="#888"
            textAnchor="middle"
          >
            {value}
          </SvgText>
        </G>
      );
    }

    return ticks;
  };

  const indicator = polarToCartesian(currentAngle, radius);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Svg width={size} height={size}>
        {/* Background Arc */}
        <Path
          d={backgroundPath}
          stroke="#333"
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
        />

        {/* Progress Arc */}
        <Path
          d={progressPath}
          stroke="#FFD700"
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
        />

        {/* Tick Marks and Labels */}
        {generateTicks()}

        {/* Indicator Circle */}
        <Circle
          cx={indicator.x}
          cy={indicator.y}
          r={6}
          fill="#FFD700"
          stroke="#1a1a1a"
          strokeWidth={2}
        />

        {/* Center Value */}
        <SvgText
          x={centerX}
          y={centerY - 10}
          fontSize={32}
          fill="#FFD700"
          fontWeight="bold"
          textAnchor="middle"
        >
          {Math.round(currentValue)}
        </SvgText>
        <SvgText
          x={centerX}
          y={centerY + 15}
          fontSize={12}
          fill="#888"
          textAnchor="middle"
        >
          {unit}
        </SvgText>
      </Svg>

      <View style={styles.bottom}>
        <Text style={styles.literLabel}>Liter</Text>
        <Text style={styles.literValue}>{totalLiters}'</Text>
        <Text style={styles.timestamp}>
          Last updated:{' '}
          {new Date(sensorData[sensorData.length - 1]?.time || Date.now()).toLocaleTimeString()}
        </Text>
      </View>
    </View>
  );
};

// export default CircularFlowMeterGauge;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#111',
    flex: 1,
    justifyContent: 'center'
  },
  title: {
    color: '#aaa',
    fontSize: 14,
    marginBottom: 8
  },
  bottom: {
    marginTop: 24,
    alignItems: 'center'
  },
  literLabel: {
    color: '#ccc',
    fontSize: 14
  },
  literValue: {
    fontSize: 32,
    color: '#FFD700',
    fontWeight: 'bold',
    fontFamily: 'monospace'
  },
  timestamp: {
    color: '#666',
    fontSize: 12,
    marginTop: 10
  }
});



const App = () => {
  const [sensorData, setSensorData] = useState([{ time: Date.now(), data: 0 }]);

  useEffect(() => {
    const interval = setInterval(() => {
      const newReading = {
        time: Date.now(),
        data: Math.floor(Math.random() * 180) + 10
      };
      setSensorData(prev => [...prev.slice(-19), newReading]);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <CircularFlowMeterGauge 
      data={sensorData}
      maxValue={200}
      unit="L/min"
      title="Flow Meter"
    />
  );
};

export default App;
