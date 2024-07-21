import React from "react";
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import Card from "@/components/Card"; // Adjust the path as needed

const { width } = Dimensions.get("window");

interface Issue {
  _id: { $oid: string };
  issueNo: string;
  time: string;
  date: string;
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
const cardsData: Issue[] = [
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
];

export default function Tab() {
  const navigation = useNavigation();
  navigation.setOptions({
    headerShown: false,
  });

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.container}>
        <SafeAreaView style={{ paddingHorizontal: width * 0.025 }}>
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.iconContainer}
              onPress={() => {
                navigation.goBack();
              }}
            >
              <AntDesign name="left" size={15} color="#555555" />
            </TouchableOpacity>
            <Text style={styles.headingText}>To Do List</Text>
          </View>
          {cardsData.map((card: Issue, index: number) => (
            <Card key={index} issue={card} />
          ))}
        </SafeAreaView>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 40,
    flex: 1,
    backgroundColor: "#F2F2F2",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "4%",
    marginTop: "-10%",
  },
  iconContainer: {
    width: "8%",
    height: "120%",
    borderRadius: 20,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    left: width * 0.05,
    zIndex: 1,
    top: "-10%",
  },
  headingText: {
    fontSize: 19,
    fontWeight: "bold",
    color: "#555555",
    textAlign: "center",
    flex: 1,
  },
  // Add remaining styles
});
