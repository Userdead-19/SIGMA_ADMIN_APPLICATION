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
import { useGlobalSearchParams, useRouter } from "expo-router";
import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "expo-router";

const { width } = Dimensions.get("window");

export default function IssueDetails() {
  const navigation = useNavigation();

  const params = useGlobalSearchParams();
  const issue = params.issue
    ? JSON.parse(Array.isArray(params.issue) ? params.issue[0] : params.issue)
    : null;
  console.log(issue);
  React.useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);
  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.iconContainer}
            onPress={() => {
              navigation.goBack();
            }}
          >
            <AntDesign name="left" size={15} color="#555555" />
          </TouchableOpacity>
          <Text style={styles.headingText}>Issue Details</Text>
        </View>
        <View style={styles.detailsContainer}>
          <Text style={styles.textLabel}>Raised By: {issue.userName}</Text>
          <Text style={styles.textLabel}>Block: {issue.block}</Text>
          <Text style={styles.textLabel}>Type: {issue.type}</Text>
          <Text style={styles.textLabel}>Date and Time: {issue.dateTime}</Text>
          {/* Add more details as needed */}
        </View>
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
  detailsContainer: {
    paddingHorizontal: width * 0.05,
  },
  textLabel: {
    fontSize: 16,
    marginVertical: 8,
  },
});
