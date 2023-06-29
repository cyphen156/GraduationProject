import React from 'react';
import { View, Text } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

const PercentageCircle = ({ percentage }) => {
  const radius = 60; // 원의 반지름
  const circumference = 2 * Math.PI * radius; // 원의 둘레

  const strokeWidth = 12; // 원의 두께
  const strokeDashoffset = circumference - (circumference * percentage) / 100; // 퍼센트에 따른 stroke-dashoffset 값

  return (
    <View style={{ alignItems: 'center' }}>
      <Svg width={radius * 2} height={radius * 2}>
        <Circle
          cx={radius}
          cy={radius}
          r={radius - strokeWidth / 2}
          stroke="#4CAF50" // 원의 테두리 색상
          strokeWidth={strokeWidth}
          strokeDasharray={`${circumference} ${circumference}`} // stroke-dasharray 값
          strokeDashoffset={strokeDashoffset} // stroke-dashoffset 값
          fill="transparent" // 원 안쪽 색상
        />
      </Svg>
      <Text style={{ fontSize: 24, marginTop: 12 }}>{percentage}%</Text>
    </View>
  );
};

export default PercentageCircle;