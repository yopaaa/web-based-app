import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, G, Line, Polygon, Rect, Text as SvgText } from 'react-native-svg';

const gaugeWidth = 280;
const gaugeHeight = 20;

const LinearFlowMeterGauge = ({ data = [], maxValue = 200, unit = 'L/min', title = 'Flow Meter' }) => {
  const [currentValue, setCurrentValue] = useState(0);
  const [totalLiters, setTotalLiters] = useState(0);

  const sampleData = [
    { time: Date.now() - 5000, data: 45 },
    { time: Date.now() - 4000, data: 67 },
    { time: Date.now() - 3000, data: 89 },
    { time: Date.now() - 2000, data: 124 },
    { time: Date.now() - 1000, data: 156 },
    { time: Date.now(), data: 78 },
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

  const percentage = Math.min(currentValue / maxValue, 1);
  const fillWidth = gaugeWidth * percentage;

  const generateTicks = () => {
    const ticks = [];
    const tickCount = 5;

    for (let i = 0; i <= tickCount; i++) {
      const tickValue = (maxValue / tickCount) * i;
      const tickPosition = (gaugeWidth / tickCount) * i;

      ticks.push(
        <G key={`tick-${i}`}>
          <Line x1={tickPosition} y1={gaugeHeight + 5} x2={tickPosition} y2={gaugeHeight + 15} stroke="#666" strokeWidth="2" />
          <SvgText
            x={tickPosition}
            y={gaugeHeight + 30}
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

  const generateMinorTicks = () => {
    const ticks = [];
    const tickCount = 20;

    for (let i = 0; i <= tickCount; i++) {
      const tickPosition = (gaugeWidth / tickCount) * i;
      if (i % 4 !== 0) {
        ticks.push(
          <Line
            key={`minor-${i}`}
            x1={tickPosition}
            y1={gaugeHeight + 5}
            x2={tickPosition}
            y2={gaugeHeight + 10}
            stroke="#444"
            strokeWidth="1"
          />
        );
      }
    }
    return ticks;
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{title}</Text>

      <View style={styles.valueBox}>
        <Text style={styles.mainValue}>{Math.round(currentValue)}</Text>
        <Text style={styles.unit}>{unit}</Text>
      </View>

      <Svg width={gaugeWidth + 40} height={80}>
        {/* Background bar */}
        <Rect x={0} y={0} width={gaugeWidth} height={gaugeHeight} fill="#2a2a2a" rx="10" ry="10" />
        {/* Fill */}
        <Rect x={0} y={0} width={fillWidth} height={gaugeHeight} fill="#ffd700" rx="10" ry="10" />
        {/* Pointer */}
        <G transform={`translate(${fillWidth}, 0)`}>
          <Polygon points="0,-5 8,0 0,25 -8,0" fill="#ffd700" />
          <Circle cx="0" cy="10" r="3" fill="#fff" />
        </G>
        {generateMinorTicks()}
        {generateTicks()}
      </Svg>

      <View style={styles.infoBox}>
        <Text style={styles.infoLabel}>Liter</Text>
        <Text style={styles.totalValue}>{totalLiters}'</Text>
      </View>

      <View style={styles.readingBox}>
        <Text style={styles.readingLabel}>Latest Reading:</Text>
        <Text style={styles.readingTime}>
          {new Date(sensorData[sensorData.length - 1]?.time || Date.now()).toLocaleTimeString()}
        </Text>
      </View>

      <View style={styles.statusGrid}>
        <View style={styles.statusItem}>
          <Text style={styles.statusText}>{currentValue > 0 ? 'ACTIVE' : 'IDLE'}</Text>
          <Text style={styles.statusLabel}>Status</Text>
        </View>
        <View style={styles.statusItem}>
          <Text style={[styles.statusText, { color: '#60a5fa' }]}>{Math.round(percentage * 100)}%</Text>
          <Text style={styles.statusLabel}>Capacity</Text>
        </View>
        <View style={styles.statusItem}>
          <Text style={[styles.statusText, { color: '#a78bfa' }]}>{sensorData.length}</Text>
          <Text style={styles.statusLabel}>Readings</Text>
        </View>
      </View>

      <View style={styles.historyBox}>
        <Text style={styles.historyTitle}>Recent Data History</Text>
        {sensorData.slice(-4).reverse().map((item, index) => (
          <View key={index} style={styles.historyItem}>
            <Text style={styles.historyTime}>{new Date(item.time).toLocaleTimeString()}</Text>
            <View style={styles.barWrapper}>
              <View style={styles.barBackground}>
                <View style={[styles.barFill, { width: `${(item.data / maxValue) * 100}%` }]} />
              </View>
              <Text style={styles.barValue}>{item.data}</Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#111827',
    alignItems: 'center',
  },
  title: {
    color: '#9CA3AF',
    fontSize: 18,
    marginBottom: 20,
  },
  valueBox: {
    alignItems: 'center',
    marginBottom: 20,
  },
  mainValue: {
    fontSize: 60,
    fontWeight: 'bold',
    color: '#facc15',
  },
  unit: {
    color: '#9CA3AF',
    fontSize: 16,
  },
  infoBox: {
    alignItems: 'center',
    marginVertical: 20,
  },
  infoLabel: {
    color: '#9CA3AF',
    fontSize: 14,
  },
  totalValue: {
    fontSize: 28,
    color: '#facc15',
    fontWeight: 'bold',
  },
  readingBox: {
    alignItems: 'center',
    marginBottom: 20,
  },
  readingLabel: {
    color: '#6B7280',
    fontSize: 12,
  },
  readingTime: {
    color: '#D1D5DB',
    fontSize: 14,
  },
  statusGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: gaugeWidth,
    marginVertical: 20,
  },
  statusItem: {
    backgroundColor: '#1F2937',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
  },
  statusText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#34d399',
  },
  statusLabel: {
    color: '#9CA3AF',
    fontSize: 12,
  },
  historyBox: {
    width: gaugeWidth,
    backgroundColor: '#1F2937',
    borderRadius: 10,
    padding: 12,
    marginTop: 20,
  },
  historyTitle: {
    color: '#FCD34D',
    fontSize: 14,
    marginBottom: 10,
  },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  historyTime: {
    color: '#9CA3AF',
    fontSize: 12,
  },
  barWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  barBackground: {
    width: 60,
    height: 4,
    backgroundColor: '#374151',
    borderRadius: 4,
    overflow: 'hidden',
    marginRight: 5,
  },
  barFill: {
    height: '100%',
    backgroundColor: '#facc15',
  },
  barValue: {
    color: '#facc15',
    fontSize: 12,
    width: 30,
    textAlign: 'right',
  },
});

// Simulasi penggunaan
const App = () => {
  const [sensorData, setSensorData] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const newReading = {
        time: Date.now(),
        data: Math.floor(Math.random() * 180) + 20,
      };
      setSensorData(prev => [...prev, newReading].slice(-10));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <LinearFlowMeterGauge
      data={sensorData}
      maxValue={200}
      unit="L/min"
      title="Flow Meter"
    />
  );
};

export default App;
