import React, { useReducer, useRef, useEffect, useCallback } from "react";
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
import axios from "axios";
import { useFocusEffect } from "expo-router";

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

// Define action types
const SET_ISSUES = "SET_ISSUES";
const SET_FILTERED_ISSUES = "SET_FILTERED_ISSUES";
const SET_CURRENT_STAGE = "SET_CURRENT_STAGE";

// Define initial state
const initialState = {
  currentStage: "Current",
  issues: [] as Issue[],
  filteredIssues: [] as Issue[],
};

// Define reducer function
const reducer = (state: typeof initialState, action: any) => {
  switch (action.type) {
    case SET_ISSUES:
      return {
        ...state,
        issues: action.payload,
        filteredIssues: filterIssues(action.payload, state.currentStage),
      };
    case SET_FILTERED_ISSUES:
      return {
        ...state,
        filteredIssues: action.payload,
      };
    case SET_CURRENT_STAGE:
      return {
        ...state,
        currentStage: action.payload,
        filteredIssues: filterIssues(state.issues, action.payload),
      };
    default:
      return state;
  }
};

// Filter issues based on stage
const filterIssues = (issues: Issue[], stage: string) => {
  return issues.filter((issue) =>
    stage === "Current" ? issue.status === "OPEN" : issue.status === "CLOSE"
  );
};

const IssuePage = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const slideAnim = useRef(new Animated.Value(0)).current;
  const navigation = useNavigation();

  useEffect(() => {
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
  }, [navigation]);

  const fetchAllIssues = async () => {
    try {
      const response = await axios.get("https://api.gms.intellx.in/tasks");
      dispatch({ type: SET_ISSUES, payload: response.data.issues });
    } catch (error) {
      console.log("Error fetching issues:", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchAllIssues();
    }, [])
  );

  const handleButtonPress = (stage: string) => {
    dispatch({ type: SET_CURRENT_STAGE, payload: stage });
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
              state.currentStage === "Current" && styles.selectedText,
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
              state.currentStage === "Resolved" && styles.selectedText,
            ]}
          >
            Resolved
          </Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={state.filteredIssues}
        renderItem={({ item }) => <Card issue={item} />}
        keyExtractor={(item) => item.issueNo}
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
