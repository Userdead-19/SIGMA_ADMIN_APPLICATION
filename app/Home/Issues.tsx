import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  StyleSheet,
  FlatList,
} from "react-native";
import Card from "@/components/Card";
import { useNavigation } from "@react-navigation/native";

const issuesData = [
  {
    _id: { $oid: "659f92cbac8daf1e87da88f8" },
    issueNo: "LG0OS",
    time: "12:33 PM",
    date: "11/01/24",
    raised_by: { name: "MKB", personId: "MKB.AMCS" },
    issue: {
      issueLastUpdateTime: "12:33 PM",
      issueLastUpdateDate: "11/01/24",
      issueType: "FEEDBACK",
      issueCat: "PLUMBING",
      issueContent: "good",
      block: "M",
      floor: "3",
      actionItem: "502",
    },
    comments: [{ date: "11-01-24 12:33 PM", by: "MKB.AMCS", content: "good" }],
    status: "OPEN",
    log: [{ date: "11-01-24 12:33", action: "opened", by: "MKB.AMCS" }],
    survey: {},
    anonymity: "false",
  },
  {
    _id: { $oid: "659f92cbac8daf1e87da88fa" },
    issueNo: "LG0OT",
    time: "1:00 PM",
    date: "11/02/24",
    raised_by: { name: "XYZ", personId: "XYZ.AMCS" },
    issue: {
      issueLastUpdateTime: "1:00 PM",
      issueLastUpdateDate: "11/02/24",
      issueType: "COMPLAINT",
      issueCat: "ELECTRICAL",
      issueContent: "Light not working",
      block: "N",
      floor: "2",
      actionItem: "503",
    },
    comments: [
      {
        date: "11-02-24 1:00 PM",
        by: "XYZ.AMCS",
        content: "Light not working",
      },
    ],
    status: "OPEN",
    log: [{ date: "11-02-24 1:00", action: "opened", by: "XYZ.AMCS" }],
    survey: {},
    anonymity: "true",
  },
  {
    _id: { $oid: "659f92cbac8daf1e87da88fb" },
    issueNo: "LG0OU",
    time: "3:45 PM",
    date: "11/03/24",
    raised_by: { name: "ABC", personId: "ABC.AMCS" },
    issue: {
      issueLastUpdateTime: "3:45 PM",
      issueLastUpdateDate: "11/03/24",
      issueType: "FEEDBACK",
      issueCat: "CLEANING",
      issueContent: "Good cleaning",
      block: "O",
      floor: "1",
      actionItem: "504",
    },
    comments: [
      { date: "11-03-24 3:45 PM", by: "ABC.AMCS", content: "Good cleaning" },
    ],
    status: "CLOSED",
    log: [{ date: "11-03-24 3:45", action: "closed", by: "ABC.AMCS" }],
    survey: {},
    anonymity: "false",
  },
  {
    _id: { $oid: "659f92cbac8daf1e87da88fc" },
    issueNo: "LG0OV",
    time: "4:20 PM",
    date: "11/04/24",
    raised_by: { name: "LMN", personId: "LMN.AMCS" },
    issue: {
      issueLastUpdateTime: "4:20 PM",
      issueLastUpdateDate: "11/04/24",
      issueType: "COMPLAINT",
      issueCat: "WATER",
      issueContent: "Water leakage",
      block: "P",
      floor: "4",
      actionItem: "505",
    },
    comments: [
      { date: "11-04-24 4:20 PM", by: "LMN.AMCS", content: "Water leakage" },
    ],
    status: "CLOSED",
    log: [{ date: "11-04-24 4:20", action: "closed", by: "LMN.AMCS" }],
    survey: {},
    anonymity: "true",
  },
];

const IssuePage = () => {
  const [currentStage, setCurrentStage] = useState("Current");
  const slideAnim = useRef(new Animated.Value(0)).current;
  const navigation = useNavigation();
  navigation.setOptions({
    headerTitle: "Issues",
    headerTitleStyle: {
      fontSize: 24,
      fontWeight: "bold",
      color: "#333",
    },
    headerStyle: {
      alignItems: "center",
    },
  });
  const handleButtonPress = (stage: any) => {
    setCurrentStage(stage);
    Animated.timing(slideAnim, {
      toValue: stage === "Current" ? 0 : 1,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const slideInterpolation = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "50%"],
  });

  const filteredIssues = issuesData.filter((issue) =>
    currentStage === "Current"
      ? issue.status === "OPEN"
      : issue.status === "CLOSED"
  );

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <Animated.View
          style={[styles.selectedBackground, { left: slideInterpolation }]}
        />
        <TouchableOpacity
          style={styles.button}
          onPress={() => handleButtonPress("Current")}
        >
          <Text
            style={[
              styles.buttonText,
              currentStage === "Current" && styles.selectedText,
            ]}
          >
            Current
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => handleButtonPress("Resolved")}
        >
          <Text
            style={[
              styles.buttonText,
              currentStage === "Resolved" && styles.selectedText,
            ]}
          >
            Resolved
          </Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={filteredIssues}
        renderItem={({ item }) => (
          <Card
            mainText={item.issue.issueContent}
            block={item.issue.block}
            type={item.issue.issueType}
            userName={item.raised_by.name}
            dateTime={`${item.date} ${item.time}`}
          />
        )}
        keyExtractor={(item) => item._id.$oid}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F2F2",
  },
  buttonContainer: {
    flexDirection: "row",
    width: "80%",
    height: 50,
    backgroundColor: "#ddd",
    borderRadius: 25,
    overflow: "hidden",
    marginVertical: 20,
    alignSelf: "center",
    position: "relative",
  },
  button: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    fontSize: 16,
    color: "#333",
  },
  selectedBackground: {
    position: "absolute",
    width: "50%",
    height: "100%",
    backgroundColor: "#347aeb", // Change the color as needed
    borderRadius: 25,
  },
  selectedText: {
    color: "#fff",
  },
  listContainer: {
    padding: 16,
  },
});

export default IssuePage;
