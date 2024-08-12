import React from "react";
import { Dimensions, ScrollView, View, StyleSheet } from "react-native";
import { BarChart } from "react-native-chart-kit";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

const BarGraph = ({
  labels,
  values,
}: {
  labels: string[];
  values: number[];
}) => {
  // Determine the maximum value in the dataset
  const maxValue = Math.max(...values);

  // Define the number of intervals/ticks on the Y-axis
  const yAxisTickCount = 5;

  // Determine the interval between ticks
  const yAxisInterval = Math.ceil(maxValue / yAxisTickCount);

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
    yAxisInterval, // Custom interval for Y-axis
  };

  const chartData = {
    labels: labels,
    datasets: [
      {
        data: values,
      },
    ],
  };

  const chartWidth = screenWidth * 0.9;
  const chartHeight = screenHeight * 0.6;

  return (
    <View style={styles.container}>
      <BarChart
        yAxisLabel=""
        yAxisSuffix=""
        data={{
          labels: chartData.labels,
          datasets: [
            {
              data: chartData.datasets[0].data,
            },
          ],
        }}
        width={chartWidth}
        height={chartHeight}
        chartConfig={chartConfig}
        verticalLabelRotation={chartData.labels.length > 5 ? 60 : 0} // Rotate labels if there are many
        fromZero
        yAxisInterval={yAxisInterval} // Apply the custom Y-axis interval
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    backgroundColor: "#F2F2F2",
    borderWidth: 1,
    borderRadius: 10,
  },
  selectBox: {
    borderWidth: 0,
    height: 50,
    width: 200,
    margin: 5,
  },
  dropdown: {
    height: 200,
    width: 200,
    borderWidth: 0.5,
    borderRadius: 5,
    margin: 5,
  },
});

export default BarGraph;
