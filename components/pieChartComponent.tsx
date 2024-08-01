import React from "react";
import { View, Dimensions } from "react-native";
import { PieChart } from "react-native-chart-kit";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

const chartConfig = {
  backgroundGradientFrom: "#F2F2F2",
  backgroundGradientTo: "#F2F2F2",
  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  fillShadowGradient: "#3872F7", // Main color
  fillShadowGradientOpacity: 1,
};

const PieChartExample = () => {
  const data = [
    {
      name: "Task 1",
      population: 21500000,
      color: "#3872F7",
      legendFontColor: "#7F7F7F",
      legendFontSize: 15,
    },
    {
      name: "Task 2",
      population: 2800000,
      color: "#F3BA2F",
      legendFontColor: "#7F7F7F",
      legendFontSize: 15,
    },
    {
      name: "Task 3",
      population: 527612,
      color: "#F14E4E",
      legendFontColor: "#7F7F7F",
      legendFontSize: 15,
    },
    {
      name: "Task 4",
      population: 8538000,
      color: "#9FEF3F",
      legendFontColor: "#7F7F7F",
      legendFontSize: 15,
    },
  ];

  return (
    <View>
      <PieChart
        data={data}
        width={screenWidth * 0.9}
        height={screenHeight * 0.5}
        chartConfig={chartConfig}
        accessor={"population"}
        backgroundColor={"transparent"}
        paddingLeft={"15"}
        absolute
      />
    </View>
  );
};

export default PieChartExample;
