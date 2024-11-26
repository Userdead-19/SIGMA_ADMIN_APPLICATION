import React, { useEffect, useState, useCallback } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { PieChart } from "react-native-chart-kit";
import axios from "axios";
import { useNavigation } from "expo-router";
import { ActivityIndicator, Appbar } from "react-native-paper";
import BarGraphWithFilter from "@/components/barGraphComponentFilter";
import BarGraph from "@/components/barGraphComponent";
import { BACKEND_URL } from "@/production.config";

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

const StatisticsPage: React.FC = () => {
  const [data, setData] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [labels, setLabels] = useState<string[]>([]);
  const [values, setValues] = useState<number[]>([]);
  const [openIssues, setOpenIssues] = useState<number>(0);
  const [closedIssues, setClosedIssues] = useState<number>(0);
  const [past365DaysData, setPast365DaysData] = useState({
    open: 0,
    closed: 0,
  });
  const [past30DaysData, setPast30DaysData] = useState({ open: 0, closed: 0 });
  const [workEfficiency, setWorkEfficiency] = useState<number | null>(null);
  const navigation = useNavigation();

  const fetchData = async () => {
    try {
      const [taskResponse, closedResponse, openResponse] = await Promise.all([
        axios.get(`${BACKEND_URL}/tasks`),
        axios.get(`${BACKEND_URL}/client/issues/total/closed`),
        axios.get(`${BACKEND_URL}/client/issues/total/open`),
      ]);

      setData(taskResponse.data.issues);
      setClosedIssues(closedResponse.data.closed_issues);
      setOpenIssues(openResponse.data.open_issues);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const parseDate = useCallback((dateStr: string) => {
    const parts = dateStr.split("/");
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const year =
      parts[2].length === 2
        ? parseInt(parts[2], 10) + 2000
        : parseInt(parts[2], 10);

    return new Date(year, month, day);
  }, []);

  const filterIssuesByDateRange = useCallback(
    (days: number) => {
      const today = new Date();

      return data.filter((item) => {
        const issueDate = parseDate(item.date);
        const timeDiff = today.getTime() - issueDate.getTime();
        return timeDiff <= days * 24 * 60 * 60 * 1000;
      });
    },
    [data, parseDate]
  );

  const calculateWorkEfficiency = (
    closedComplaint: number,
    totComplaint: number,
    closedSuggestion: number,
    totSuggestion: number
  ) => {
    if (totComplaint > 0 && totSuggestion > 0) {
      const complaintEfficiency = (closedComplaint / totComplaint) * 100;
      const suggestionEfficiency = (closedSuggestion / totSuggestion) * 100;
      const efficiency = 0.6 * complaintEfficiency + 0.4 * suggestionEfficiency;
      setWorkEfficiency(efficiency);
    }
  };

  useEffect(() => {
    fetchData();
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

  useEffect(() => {
    if (data.length > 0) {
      const categoryCount: Record<string, number> = {};
      let closedComplaint = 0;
      let totComplaint = 0;
      let closedSuggestion = 0;
      let totSuggestion = 0;

      data.forEach((item) => {
        const category = item.issue.issueCat;

        // Counting categories
        categoryCount[category] = (categoryCount[category] || 0) + 1;

        // Counting based on issue type and status
        if (item.status === "CLOSE" && item.issue.issueType === "ISSUE") {
          closedComplaint++;
        }
        if (item.issue.issueType === "ISSUE") {
          totComplaint++;
        }
        if (item.status === "CLOSE" && item.issue.issueType === "FEEDBACK") {
          closedSuggestion++;
        }
        if (item.issue.issueType === "FEEDBACK") {
          totSuggestion++;
        }
      });

      // Filtering issues for past 365 and 30 days
      const past365DaysIssues = filterIssuesByDateRange(365);
      const past30DaysIssues = filterIssuesByDateRange(30);

      const past365DaysClosed = past365DaysIssues.filter(
        (item) => item.status === "CLOSE"
      ).length;
      const past365DaysOpen = past365DaysIssues.length - past365DaysClosed;

      const past30DaysClosed = past30DaysIssues.filter(
        (item) => item.status === "CLOSE"
      ).length;
      const past30DaysOpen = past30DaysIssues.length - past30DaysClosed;

      // Setting the data
      setPast365DaysData({ open: past365DaysOpen, closed: past365DaysClosed });
      setPast30DaysData({ open: past30DaysOpen, closed: past30DaysClosed });

      setLabels(Object.keys(categoryCount));
      setValues(Object.values(categoryCount));

      // Calculating work efficiency
      calculateWorkEfficiency(
        closedComplaint,
        totComplaint,
        closedSuggestion,
        totSuggestion
      );
    }
  }, [data, filterIssuesByDateRange]);

  return (
    <>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Statistics" />
      </Appbar.Header>
      <View style={styles.container}>
        {isLoading ? (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <ActivityIndicator size="large" color="blue" />
          </View>
        ) : (
          <ScrollView
            contentContainerStyle={styles.scrollViewContent}
            showsVerticalScrollIndicator={false}
            alwaysBounceVertical
          >
            <View style={styles.workEfficiencyContainer}>
              <Text style={styles.workEfficiencyText}>
                Work Efficiency:{" "}
                {workEfficiency ? `${workEfficiency.toFixed(2)}%` : "N/A"}
              </Text>
            </View>
            <View style={styles.chartContainer}>
              <Text style={styles.chartTitle}>Issue Categories</Text>
              <BarGraph labels={labels} values={values} />
            </View>
            <View style={styles.chartContainer}>
              <Text style={styles.chartTitle}>Past 365 Days Issues</Text>
              <PieChart
                data={[
                  {
                    name: `Open Issues (${past365DaysData.open})`,
                    population: past365DaysData.open,
                    color: "rgba(0, 122, 255, 1)", // Black
                    legendFontColor: "#7F7F7F",
                    legendFontSize: 15,
                  },
                  {
                    name: `Closed Issues (${past365DaysData.closed})`,
                    population: past365DaysData.closed,
                    color: "rgba(255, 0, 0, 1)", // Light Blue
                    legendFontColor: "#7F7F7F",
                    legendFontSize: 15,
                  },
                ]}
                width={300}
                height={220}
                chartConfig={{
                  backgroundGradientFrom: "#fff",
                  backgroundGradientTo: "#fff",
                  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                  strokeWidth: 2,
                }}
                accessor="population"
                backgroundColor="transparent"
                paddingLeft="15"
                center={[0, 0]}
              />
            </View>
            <View style={styles.chartContainer}>
              <Text style={styles.chartTitle}>Past 30 Days Issues</Text>
              <PieChart
                data={[
                  {
                    name: `Open Issues (${past30DaysData.open})`,
                    population: past30DaysData.open,
                    color: "rgba(0, 122, 255, 1)", // Black
                    legendFontColor: "#7F7F7F",
                    legendFontSize: 15,
                  },
                  {
                    name: `Closed Issues (${past30DaysData.closed})`,
                    population: past30DaysData.closed,
                    color: "rgba(255, 0, 0, 1)", // Light Blue
                    legendFontColor: "#7F7F7F",
                    legendFontSize: 15,
                  },
                ]}
                width={300}
                height={220}
                chartConfig={{
                  backgroundGradientFrom: "#fff",
                  backgroundGradientTo: "#fff",
                  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                  strokeWidth: 2,
                }}
                accessor="population"
                backgroundColor="transparent"
                paddingLeft="15"
                center={[0, 0]}
              />
            </View>
            <View style={styles.chartContainer}>
              <BarGraphWithFilter data={data} />
            </View>
          </ScrollView>
        )}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollViewContent: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  workEfficiencyContainer: {
    marginBottom: 20,
  },
  workEfficiencyText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  chartContainer: {
    marginBottom: 20,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
});

export default StatisticsPage;
