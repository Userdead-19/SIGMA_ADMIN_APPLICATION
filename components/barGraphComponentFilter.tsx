import React, { useReducer, useEffect } from "react";
import { View, StyleSheet, Dimensions, ScrollView } from "react-native";
import { SelectList } from "@venedicto/react-native-dropdown";
import { BarChart } from "react-native-chart-kit";

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
  barPercentage: 0.5,
  useShadowColorFromDataset: false,
  propsForBackgroundLines: {
    strokeWidth: 1,
    stroke: "#ECECEC",
  },
  fillShadowGradient: "#3872F7",
  fillShadowGradientOpacity: 1,
};

// Action Types
const ACTIONS = {
  SET_DATA: "SET_DATA",
  SET_SELECTED_MONTH: "SET_SELECTED_MONTH",
};

// Reducer Function
const reducer = (state: any, action: any) => {
  switch (action.type) {
    case ACTIONS.SET_DATA:
      return {
        ...state,
        labels: Object.keys(action.payload),
        chartData: Object.values(action.payload),
        chartLabels: Object.keys(action.payload),
      };
    case ACTIONS.SET_SELECTED_MONTH:
      if (action.payload === null) {
        return {
          ...state,
          chartLabels: state.labels,
          chartData: state.chartData,
        };
      }
      return {
        ...state,
        chartLabels: [action.payload],
        chartData: [state.monthCounts[action.payload] || 0],
      };
    default:
      return state;
  }
};

// Function to preprocess data and count issues by month
const preprocessData = (data: Task[]) => {
  const monthCounts: { [key: string]: number } = {};

  data.forEach((item) => {
    const [day, month, year] = item.date.split("/");
    const monthYear = `${month}/${year}`;
    if (monthCounts[monthYear]) {
      monthCounts[monthYear]++;
    } else {
      monthCounts[monthYear] = 1;
    }
  });

  return monthCounts;
};

const BarGraphWithFilter: React.FC<BarGraphWithFilterProps> = ({ data }) => {
  const initialState = {
    labels: [],
    chartLabels: [],
    chartData: [],
    monthCounts: {},
  };

  const [state, dispatch] = useReducer(reducer, initialState);

  // Preprocess data and dispatch action to set data
  useEffect(() => {
    const monthCounts = preprocessData(data);
    dispatch({ type: ACTIONS.SET_DATA, payload: monthCounts });
  }, [data]);

  // Update chart data when selectedMonth changes
  const handleSelectMonth = (value: string | null) => {
    dispatch({ type: ACTIONS.SET_SELECTED_MONTH, payload: value });
  };

  const chartWidth = Dimensions.get("window").width * 1.5; // Increased width for horizontal scrolling
  const chartHeight = Dimensions.get("window").height * 0.5;

  return (
    <View style={styles.container}>
      <SelectList
        save="value"
        data={["All", ...state.labels]}
        search={false}
        setSelected={(value: string | null) =>
          value === null ? handleSelectMonth(null) : handleSelectMonth(value)
        }
        boxStyles={styles.selectBox}
        dropdownStyles={styles.dropdown}
      />
      <ScrollView horizontal showsHorizontalScrollIndicator={true}>
        <View style={{ width: chartWidth }}>
          <BarChart
            yAxisLabel=""
            yAxisSuffix=""
            data={{
              labels: state.chartLabels,
              datasets: [
                {
                  data: state.chartData,
                },
              ],
            }}
            width={chartWidth}
            height={chartHeight}
            chartConfig={chartConfig}
            verticalLabelRotation={0}
            fromZero
          />
        </View>
      </ScrollView>
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

export default BarGraphWithFilter;
