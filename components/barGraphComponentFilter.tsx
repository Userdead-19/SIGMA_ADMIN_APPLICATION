import React, { useReducer, useEffect } from "react";
import { View, StyleSheet, Dimensions, ScrollView, Text } from "react-native";
import { LineChart } from "react-native-chart-kit";

// Define the types for the data structure
interface Comment {
  by: string;
  content: string;
  date: string;
}

interface Log {
  action: string;
  by: string;
  date: string;
}

interface IssueDetails {
  actionItem: string;
  block: string;
  floor: string;
  issueCat: string;
  issueContent: string;
  issueLastUpdateDate: string;
  issueLastUpdateTime: string;
  issueType: string;
}

interface Survey {
  Table: string;
  Chair: string;
  Projector: string;
  Cleanliness: string;
}

interface RaisedBy {
  name: string;
  personId: string;
}

interface Task {
  issueNo: string;
  time: string;
  date: string;
  raised_by: RaisedBy;
  issue: IssueDetails;
  comments: Comment[];
  status: string;
  log: Log[];
  survey: Survey;
  anonymity: string;
}

interface BarGraphWithFilterProps {
  data: Task[];
}

// Chart Configuration
const chartConfig = {
  backgroundGradientFrom: "#F2F2F2",
  backgroundGradientTo: "#F2F2F2",
  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  barPercentage: 0.3,
  useShadowColorFromDataset: false,
  propsForBackgroundLines: {
    strokeWidth: 1,
    stroke: "#ECECEC",
  },
  fillShadowGradient: "#3872F7",
  fillShadowGradientOpacity: 1,
};

// Define action types
const ACTIONS = {
  SET_DATA: "SET_DATA",
  SET_SELECTED_MONTH: "SET_SELECTED_MONTH",
};

// Define state type
interface State {
  labels: string[];
  openIssues: number[];
  closedIssues: number[];
  originalChartData: any; // Adjust this type as needed
  chartData: any; // Adjust this type as needed
  chartColors: {
    openIssuesColor: string;
    closedIssuesColor: string;
  };
}

// Reducer Function
const reducer = (state: State, action: any): State => {
  switch (action.type) {
    case ACTIONS.SET_DATA:
      return {
        ...state,
        labels: action.payload.labels,
        openIssues: action.payload.openIssues,
        closedIssues: action.payload.closedIssues,
        originalChartData: {
          labels: action.payload.labels,
          datasets: [
            {
              data: action.payload.openIssues,
              color: () => state.chartColors.openIssuesColor, // Color for open issues
            },
            {
              data: action.payload.closedIssues,
              color: () => state.chartColors.closedIssuesColor, // Color for closed issues
            },
          ],
        },
        chartData: {
          labels: action.payload.labels,
          datasets: [
            {
              data: action.payload.openIssues,
              color: () => state.chartColors.openIssuesColor, // Color for open issues
            },
            {
              data: action.payload.closedIssues,
              color: () => state.chartColors.closedIssuesColor, // Color for closed issues
            },
          ],
        },
      };
    case ACTIONS.SET_SELECTED_MONTH:
      if (action.payload === null) {
        return {
          ...state,
          chartData: state.originalChartData,
        };
      }
      return {
        ...state,
        chartData: {
          labels: state.labels,
          datasets: [
            {
              data: state.originalChartData.datasets[0].data.filter(
                (_: any, index: any) => state.labels[index] === action.payload
              ),
              color: () => state.chartColors.openIssuesColor, // Color for open issues
            },
            {
              data: state.originalChartData.datasets[1].data.filter(
                (_: any, index: any) => state.labels[index] === action.payload
              ),
              color: () => state.chartColors.closedIssuesColor, // Color for closed issues
            },
          ],
        },
      };
    default:
      return state;
  }
};

// Function to preprocess data and count issues by month
const preprocessData = (data: Task[]) => {
  const monthCounts: { [key: string]: { open: number; closed: number } } = {};

  data.forEach((item) => {
    const [day, month, year] = item.date.split("/");
    const monthYear = `${month}/${year}`;
    const status = item.status.toLowerCase();

    if (!monthCounts[monthYear]) {
      monthCounts[monthYear] = { open: 0, closed: 0 };
    }

    if (status === "open") {
      monthCounts[monthYear].open += 1;
    } else if (status === "close") {
      monthCounts[monthYear].closed += 1;
    }
  });

  // Create arrays from monthCounts object
  const labels = Object.keys(monthCounts);
  const openIssues = labels.map((label) => monthCounts[label].open);
  const closedIssues = labels.map((label) => monthCounts[label].closed);

  // Sort the arrays based on labels
  const sortedIndices = labels
    .map((label, index) => index)
    .sort((a, b) => labels[a].localeCompare(labels[b]));

  const sortedLabels = sortedIndices.map((i) => labels[i]);
  const sortedOpenIssues = sortedIndices.map((i) => openIssues[i]);
  const sortedClosedIssues = sortedIndices.map((i) => closedIssues[i]);

  return {
    labels: sortedLabels,
    openIssues: sortedOpenIssues,
    closedIssues: sortedClosedIssues,
  };
};

const BarGraphWithFilter: React.FC<BarGraphWithFilterProps> = ({ data }) => {
  const initialState: State = {
    labels: [],
    openIssues: [],
    closedIssues: [],
    originalChartData: { labels: [], datasets: [] },
    chartData: { labels: [], datasets: [] },
    chartColors: {
      openIssuesColor: "rgba(0, 122, 255, 1)", // Blue for open issues
      closedIssuesColor: "rgba(255, 0, 0, 1)", // Red for closed issues
    },
  };

  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const { labels, openIssues, closedIssues } = preprocessData(data);
    dispatch({
      type: ACTIONS.SET_DATA,
      payload: { labels, openIssues, closedIssues },
    });
  }, [data]);

  const chartWidth = Dimensions.get("window").width * 1.5;
  const chartHeight = Dimensions.get("window").width * 0.7;

  return (
    <View style={styles.container}>
      {state.chartData.labels.length > 0 ? (
        <ScrollView horizontal showsHorizontalScrollIndicator={true}>
          <View style={{ width: chartWidth }}>
            <LineChart
              yAxisLabel=""
              yAxisSuffix=""
              data={state.chartData}
              width={chartWidth}
              height={chartHeight}
              chartConfig={chartConfig}
              verticalLabelRotation={0}
              fromZero
            />
            <View style={styles.legend}>
              <View
                style={{
                  ...styles.legendItem,
                  backgroundColor: state.chartColors.openIssuesColor,
                }}
              />
              <Text style={styles.legendText}>Open Issues</Text>
              <View
                style={{
                  ...styles.legendItem,
                  backgroundColor: state.chartColors.closedIssuesColor,
                }}
              />
              <Text style={styles.legendText}>Closed Issues</Text>
            </View>
          </View>
        </ScrollView>
      ) : (
        <Text>No data available</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#F2F2F2",
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "#E0E0E0",
    elevation: 5,
  },
  legend: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
    alignItems: "center",
  },
  legendItem: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginHorizontal: 10,
  },
  legendText: {
    fontSize: 14,
    marginHorizontal: 5,
    color: "#333",
  },
});

export default BarGraphWithFilter;
