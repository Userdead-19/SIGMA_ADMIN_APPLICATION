import React, { useState, useMemo } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { StackedBarChart } from "react-native-chart-kit";
import { Picker } from "@react-native-picker/picker";

interface BarGraphWithFilterProps {
  data: Task[];
}

interface RaisedBy {
  name: string;
  personId: string;
}

interface Comment {
  date: string;
  by: string;
  content: string;
}

interface Log {
  date: string;
  action: string;
  by: string;
}

interface Survey {
  Table: string;
  Chair: string;
  Projector: string;
  Cleanliness: string;
}

interface Task {
  issueNo: string;
  time: string;
  date: string;
  raised_by: RaisedBy;
  issue: Issue;
  comments: Comment[];
  status: string;
  log: Log[];
  survey: Survey;
  anonymity: string;
}

interface Issue {
  issueLastUpdateTime: string;
  issueLastUpdateDate: string;
  issueType: string;
  issueCat: string;
  issueContent: string;
  block: string;
  floor: string;
  actionItem: string;
}

const BarGraphWithFilter: React.FC<BarGraphWithFilterProps> = ({ data }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  // Filter data based on selected category
  const filteredData = useMemo(() => {
    if (selectedCategory === "") return data;

    return data.filter((item) => item.issue.issueCat === selectedCategory);
  }, [selectedCategory, data]);

  // Calculate data for the stacked bar chart
  const chartData = useMemo(() => {
    const categoryData: Record<string, { open: number; closed: number }> = {};

    filteredData.forEach((item) => {
      const category = item.issue.issueCat;

      if (!categoryData[category]) {
        categoryData[category] = { open: 0, closed: 0 };
      }

      if (item.status === "CLOSE") {
        categoryData[category].closed += 1;
      } else {
        categoryData[category].open += 1;
      }
    });

    const labels = Object.keys(categoryData);
    const values = labels.map((label) => [
      categoryData[label].open,
      categoryData[label].closed,
    ]);

    return {
      labels,
      values,
    };
  }, [filteredData]);

  return (
    <ScrollView style={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>Issue Categories (Filtered)</Text>
        <Picker
          selectedValue={selectedCategory}
          onValueChange={(itemValue: any) => setSelectedCategory(itemValue)}
        >
          <Picker.Item label="All" value="" />
          {Array.from(new Set(data.map((item) => item.issue.issueCat))).map(
            (category) => (
              <Picker.Item key={category} label={category} value={category} />
            )
          )}
        </Picker>
        <ScrollView horizontal>
          <StackedBarChart
            data={{
              labels: chartData.labels,
              legend: ["Open", "Closed"], // Add the legend property
              data: chartData.values,
              barColors: ["#000000", "#ADD8E6"], // Black for Open, Light Blue for Closed
            }}
            width={Math.max(300, chartData.labels.length * 60)} // Dynamically increase width
            height={300} // Increased height for better spacing
            chartConfig={{
              backgroundGradientFrom: "#fff",
              backgroundGradientTo: "#fff",
              color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              strokeWidth: 2,
              barPercentage: 0.5, // Adjust bar size
            }}
            hideLegend={false}
            style={styles.chart}
            fromZero // Show values on  // Rotate labels for better spacing
          />
        </ScrollView>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
  },
  container: {
    marginTop: 20,
    marginBottom: 40,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
});

export default BarGraphWithFilter;
