// app/details.tsx
import React from "react";
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { useGlobalSearchParams, useNavigation } from "expo-router";
import { AntDesign } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

interface Issue {
  raised_by: { name: string; personId: string };
  issue: {
    issueLastUpdateTime: string;
    issueLastUpdateDate: string;
    issueType: string;
    issueCat: string;
    issueContent: string;
    block: string;
    floor: string;
    actionItem: string;
  };
  comments: { date: string; by: string; content: string }[];
  status: string;
  log: { date: string; action: string; by: string }[];
  survey: {};
  anonymity: string;
}

export default function IssueDetails() {
  const navigation = useNavigation();

  const params = useGlobalSearchParams();
  const issue: Issue = params.issue
    ? JSON.parse(Array.isArray(params.issue) ? params.issue[0] : params.issue)
    : null;

  React.useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  return (
    <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.iconContainer}
            onPress={() => {
              navigation.goBack();
            }}
          >
            <AntDesign name="left" size={20} color="#555555" />
          </TouchableOpacity>
          <Text style={styles.headingText}>Issue Details</Text>
        </View>
        <View style={styles.detailsContainer}>
          <Text style={styles.category}>{issue.issue.issueCat}</Text>
          <Text style={styles.title}>{issue.issue.issueContent}</Text>
          <View style={styles.details}>
            <Text style={styles.detailText}>
              Raised By: {issue.raised_by.name}
            </Text>
            <Text style={styles.detailText}>Block: {issue.issue.block}</Text>
            <Text style={styles.detailText}>Type: {issue.issue.issueType}</Text>
            <Text style={styles.detailText}>
              {`Date and Time: ${issue.issue.issueLastUpdateDate}   ${issue.issue.issueLastUpdateTime}`}
            </Text>
            {/* Add more details as needed */}
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: "#FFFFFF",
  },
  container: {
    flex: 1,
    paddingHorizontal: width * 0.05,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 20,
    position: "relative",
  },
  iconContainer: {
    position: "absolute",
    left: 0,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
  },
  headingText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333333",
    textAlign: "center",
  },
  detailsContainer: {
    borderWidth: 1,
    borderColor: "#dddddd",
    borderRadius: 10,
    padding: 20,
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  category: {
    fontSize: 14,
    color: "#999999",
    marginBottom: 5,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#333333",
    marginBottom: 20,
  },
  details: {
    marginTop: 10,
  },
  detailText: {
    fontSize: 16,
    color: "#555555",
    marginBottom: 10,
  },
});
