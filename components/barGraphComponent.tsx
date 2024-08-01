import React from "react";
import { Dimensions, View } from "react-native";
import { BarChart } from "react-native-chart-kit";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

const chartConfig = {
  backgroundGradientFrom: "#F2F2F2",
  backgroundGradientTo: "#F2F2F2",
  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  barPercentage: 0.5,
  useShadowColorFromDataset: false,
  propsForBackgroundLines: {
    strokeWidth: 1,
    stroke: "#ECECEC",
  },
  fillShadowGradient: "#3872F7", // Main bar color
  fillShadowGradientOpacity: 1,
};

const BarGraph = ({ labels, values }: { labels: any; values: any }) => {
  const chartData = {
    labels: labels,
    datasets: [
      {
        data: values,
      },
    ],
  };

  const chartWidth = screenWidth * 0.9; // Keep the width same
  const chartHeight = screenHeight * 0.5; // Keep the height same

  console.log(labels, values);

  return (
    <View
      style={{
        borderWidth: 1,
        borderRadius: 10,
        padding: 5,
      }}
    >
      <BarChart
        yAxisLabel=""
        yAxisSuffix=""
        data={chartData}
        width={chartWidth}
        height={chartHeight}
        chartConfig={chartConfig}
        verticalLabelRotation={30}
      />
    </View>
  );
};

export default BarGraph;
