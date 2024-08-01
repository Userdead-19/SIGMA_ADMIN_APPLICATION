import React from "react";
import { Dimensions, View } from "react-native";
import { BarChart } from "react-native-chart-kit";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

const chartConfig = {
  backgroundGradientFrom: "#1E2923",
  backgroundGradientTo: "#08130D",
  color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
  barPercentage: 0.5,
  useShadowColorFromDataset: false,
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

  // Define dynamic width and height based on screen size
  const chartWidth = screenWidth - 40; // Adjust the width as per your requirement
  const chartHeight = Math.min(screenHeight * 0.4, 300); // Adjust the height as per your requirement

  return (
    <View>
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
