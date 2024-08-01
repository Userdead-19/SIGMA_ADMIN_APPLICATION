import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import BarGraph from "@/components/barGraphComponent"; // Assuming you have a BarGraph component
import axios from "axios";

// Define the types for the data you are working with
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

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (data.length > 0) {
      const categoryCount: Record<string, number> = {};
      data.forEach((item) => {
        const category = item.issue.issueCat;
        if (categoryCount[category]) {
          categoryCount[category]++;
        } else {
          categoryCount[category] = 1;
        }
      });

      setLabels(Object.keys(categoryCount));
      setValues(Object.values(categoryCount));
      console.log("Category", categoryCount);
    }
  }, [data]);

  return (
    <View style={styles.container}>
      {isLoading ? (
        <Text>Loading...</Text>
      ) : (
        <BarGraph labels={labels} values={values} />
      )}
    </View>
  );
};

export default StatisticsPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
});
