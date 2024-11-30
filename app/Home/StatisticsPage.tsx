import React, { useEffect, useState, useCallback } from "react";
import {
  Alert,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { PieChart } from "react-native-chart-kit";
import axios from "axios";
import { useNavigation } from "expo-router";
import { ActivityIndicator, Appbar, Button } from "react-native-paper";
import BarGraphWithFilter from "@/components/barGraphComponentFilter";
import BarGraph from "@/components/barGraphComponent";
import { BACKEND_URL } from "@/production.config";
import DateTimePicker from "@react-native-community/datetimepicker";

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
  const [customStartDate, setCustomStartDate] = useState<Date | null>(null);
  const [customEndDate, setCustomEndDate] = useState<Date | null>(null);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
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
    const complaintEfficiency = (closedComplaint / totComplaint) * 100;
    const suggestionEfficiency = (closedSuggestion / totSuggestion) * 100;

    const efficiency = 0.6 * complaintEfficiency + 0.4 * suggestionEfficiency;

    setWorkEfficiency(efficiency);
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
        let category = item.issue.issueCat;
        if (!category) {
          category = "Miscellaneous";
        }

        // Counting categories
        categoryCount[category] = (categoryCount[category] || 0) + 1;

        // Counting based on issue type and status
        if (item.status === "CLOSE" && item.issue.issueType === "Complaint") {
          closedComplaint++;
        }
        if (item.issue.issueType === "Complaint") {
          totComplaint++;
        }
        if (item.status === "CLOSE" && item.issue.issueType === "Feedback") {
          closedSuggestion++;
        }
        if (item.issue.issueType === "Feedback") {
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

  const handleGeneratePDF = async () => {
    if (!customStartDate || !customEndDate) {
      Alert.alert("Error", "Please select a valid date range.");
      return;
    }
    try {
      const fromDate = formatDateToDDMMYYYY(customStartDate);
      const toDate = formatDateToDDMMYYYY(customEndDate);

      const pdfURL = `${BACKEND_URL}/manager/generate-pdf?from=${fromDate}&to=${toDate}`;
      await Linking.openURL(pdfURL);
    } catch (error) {
      Alert.alert("Error", "Failed to open PDF link.");
    }
  };

  const formatDateToDDMMYYYY = (date: any) => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const openPDF = (fromDate: any, toDate: any) => {
    const pdfURL = `${BACKEND_URL}/manager/generate-pdf?from=${fromDate}&to=${toDate}`;
    Linking.openURL(pdfURL).catch((err) =>
      Alert.alert("Error", `Failed to open URL: ${err.message}`)
    );
  };
  const handleStartDateChange = (event: any, selectedDate?: Date) => {
    setShowStartPicker(false);
    if (selectedDate) setCustomStartDate(selectedDate);
  };

  const handleEndDateChange = (event: any, selectedDate?: Date) => {
    setShowEndPicker(false);
    if (selectedDate) setCustomEndDate(selectedDate);
  };

  const getCurrentDateRange = () => {
    const today = new Date();
    const formattedDate = formatDateToDDMMYYYY(today);
    return { from: formattedDate, to: formattedDate };
  };

  const getPastWeekDateRange = () => {
    const today = new Date();
    const pastWeek = new Date(today);
    pastWeek.setDate(today.getDate() - 7);
    return {
      from: formatDateToDDMMYYYY(pastWeek),
      to: formatDateToDDMMYYYY(today),
    };
  };

  const getPastMonthDateRange = () => {
    const today = new Date();
    const pastMonth = new Date(today);
    pastMonth.setMonth(today.getMonth() - 1);
    return {
      from: formatDateToDDMMYYYY(pastMonth),
      to: formatDateToDDMMYYYY(today),
    };
  };

  // Handlers
  const handleCurrentDayPDF = () => {
    const { from, to } = getCurrentDateRange();
    openPDF(from, to);
  };

  const handlePastWeekPDF = () => {
    const { from, to } = getPastWeekDateRange();
    openPDF(from, to);
  };

  const handlePastMonthPDF = () => {
    const { from, to } = getPastMonthDateRange();
    openPDF(from, to);
  };
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
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <View style={styles.dateRangeContainer}>
                <Text style={styles.label}>Select Custom Date Range:</Text>
                <TouchableOpacity
                  onPress={() => setShowStartPicker(true)}
                  style={styles.dateButton}
                >
                  <Text style={styles.dateText}>
                    {customStartDate
                      ? formatDateToDDMMYYYY(customStartDate)
                      : "Select Start Date"}
                  </Text>
                </TouchableOpacity>
                {showStartPicker && (
                  <DateTimePicker
                    value={customStartDate || new Date()}
                    mode="date"
                    display="default"
                    onChange={handleStartDateChange}
                  />
                )}

                <TouchableOpacity
                  onPress={() => setShowEndPicker(true)}
                  style={styles.dateButton}
                >
                  <Text style={styles.dateText}>
                    {customEndDate
                      ? formatDateToDDMMYYYY(customEndDate)
                      : "Select End Date"}
                  </Text>
                </TouchableOpacity>
                {showEndPicker && (
                  <DateTimePicker
                    value={customEndDate || new Date()}
                    mode="date"
                    display="default"
                    onChange={handleEndDateChange}
                  />
                )}
              </View>

              <Button
                mode="contained"
                style={styles.pdfButton}
                onPress={handleGeneratePDF}
                disabled={!customStartDate || !customEndDate}
              >
                Generate PDF
              </Button>
            </View>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={handleCurrentDayPDF}
            >
              <Text style={styles.closeButtonText}>Print Curent Day PDF</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={handlePastWeekPDF}
            >
              <Text style={styles.closeButtonText}>Print Past Week PDF</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={handlePastMonthPDF}
            >
              <Text style={styles.closeButtonText}>Print Past Month PDF</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={handlePastMonthPDF}
            >
              <Text style={styles.closeButtonText}>Print Past year PDF</Text>
            </TouchableOpacity>
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
  closeButton: {
    borderWidth: 1,
    borderColor: "#DDE6F0",
    borderRadius: 10,
    padding: 10,
    backgroundColor: "#E6F0FF",
    alignItems: "center",
    marginBottom: 20,
    marginTop: 20,
  },
  closeButtonText: {
    fontSize: 16,
    color: "#003366",
  },
  dateRangeContainer: { marginVertical: 20 },
  label: { fontSize: 16, fontWeight: "600", marginBottom: 10 },
  dateButton: {
    backgroundColor: "#ddd",
    padding: 10,
    borderRadius: 5,
    marginVertical: 5,
    width: 200,
    alignItems: "center",
  },
  dateText: { fontSize: 14 },
  pdfButton: { marginVertical: 10, width: 200, alignSelf: "center" },
  metricContainer: { marginVertical: 10 },
  metricText: { fontSize: 18, fontWeight: "600" },
});

export default StatisticsPage;
