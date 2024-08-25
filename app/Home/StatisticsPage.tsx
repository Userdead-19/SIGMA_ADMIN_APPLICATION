import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import BarGraph from "@/components/barGraphComponent";
import axios from "axios";
import { useNavigation } from "expo-router";
import { Appbar } from "react-native-paper";
import BarGraphWithFilter from "@/components/barGraphComponentFilter";

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
      const response = await axios.get("https://api.gms.intellx.in/tasks");
      setData(response.data.issues);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchData2 = async () => {
    try {
      const [response1, response2] = await Promise.all([
        axios.get("https://api.gms.intellx.in/client/issues/total/closed"),
        axios.get("https://api.gms.intellx.in/client/issues/total/open"),
      ]);
      setOpenIssues(response2.data.open_issues);
      setClosedIssues(response1.data.closed_issues);
    } catch (error) {
      console.error(error);
    }
  };

  const filterIssuesByDateRange = (days: number) => {
    const today = new Date();

    // Function to parse DD/MM/YYYY format to a Date object
    const parseDate = (dateStr: string) => {
      // Assuming the date format in your data is "DD/MM/YY" or "DD/MM/YYYY"
      const parts = dateStr.split("/");
      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1; // JavaScript months are zero-based
      const year =
        parts[2].length === 2
          ? parseInt(parts[2], 10) + 2000 // Handle 2-digit year by assuming 2000s
          : parseInt(parts[2], 10); // Handle 4-digit year

      return new Date(year, month, day);
    };

    const filteredIssues = data.filter((item) => {
      const issueDate = parseDate(item.date);

      const timeDiff = today.getTime() - issueDate.getTime();
      return timeDiff <= days * 24 * 60 * 60 * 1000;
    });

    return filteredIssues;
  };

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
    fetchData2();
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
        if (categoryCount[category]) {
          categoryCount[category]++;
        } else {
          categoryCount[category] = 1;
        }

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
  }, [data]);

  return (
    <>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Statistics" />
      </Appbar.Header>
      <View style={styles.container}>
        {isLoading ? (
          <Text>Loading...</Text>
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
              <Text style={styles.chartTitle}>Issue Status</Text>
              <BarGraph
                labels={["Open Issues", "Closed Issues"]}
                values={[openIssues, closedIssues]}
              />
            </View>
            <View style={styles.chartContainer}>
              <Text style={styles.chartTitle}>Past 365 Days Issues</Text>
              <BarGraph
                labels={["Open Issues", "Closed Issues"]}
                values={[past365DaysData.open, past365DaysData.closed]}
              />
            </View>
            <View style={styles.chartContainer}>
              <Text style={styles.chartTitle}>Past 30 Days Issues</Text>
              <BarGraph
                labels={["Open Issues", "Closed Issues"]}
                values={[past30DaysData.open, past30DaysData.closed]}
              />
            </View>
            <View style={styles.chartContainer}>
              <Text style={styles.chartTitle}>Month Categorized Issues</Text>
              <BarGraphWithFilter data={data} />
            </View>
          </ScrollView>
        )}
      </View>
    </>
  );
};

export default StatisticsPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
  },
  scrollViewContent: {
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 20,
  },
  chartContainer: {
    marginBottom: 20,
    width: "100%",
    alignItems: "center",
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  workEfficiencyContainer: {
    marginBottom: 20,
    width: "100%",
    alignItems: "center",
  },
  workEfficiencyText: {
    fontSize: 20,
    fontWeight: "bold",
  },
});
