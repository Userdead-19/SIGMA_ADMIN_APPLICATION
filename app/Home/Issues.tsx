import React, {
  useReducer,
  useRef,
  useEffect,
  useCallback,
  useState,
} from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  StyleSheet,
  FlatList,
} from "react-native";
import Card from "@/components/Card";
import axios from "axios";
import { router, useFocusEffect, useNavigation } from "expo-router";

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
const SET_VIEW_MODE = "SET_VIEW_MODE";

// Define initial state
const initialState = {
  currentStage: "Current",
  issues: [] as Issue[],
  filteredIssues: [] as Issue[],
  viewMode: "Tile", // New state for view mode
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
    case SET_VIEW_MODE:
      return {
        ...state,
        viewMode: action.payload,
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

  const handleViewToggle = () => {
    dispatch({
      type: SET_VIEW_MODE,
      payload: state.viewMode === "Tile" ? "Table" : "Tile",
    });
  };

  const handleItemPress = (issue: Issue) => {
    router.push({
      pathname: "/IssueDetails",
      params: {
        issue: JSON.stringify(issue),
      },
    });
  };

  const slideInterpolation = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "50%"],
  });

  // Table Header Component
  const TableHeader = () => (
    <View style={styles.tableHeader}>
      <Text style={styles.tableHeaderCell}>Issue No</Text>
      <Text style={styles.tableHeaderCell}>Content</Text>
      <Text style={styles.tableHeaderCell}>Status</Text>
    </View>
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

      {/* Toggle Button for View Mode */}
      <View style={styles.toggleContainer}>
        <TouchableOpacity onPress={handleViewToggle}>
          <Text style={styles.toggleText}>
            {state.viewMode === "Tile"
              ? "Switch to Table View"
              : "Switch to Tile View"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Render Table Headers only in Table View */}
      {state.viewMode === "Table" && <TableHeader />}

      <FlatList
        data={state.filteredIssues}
        renderItem={({ item }) =>
          state.viewMode === "Tile" ? (
            <TouchableOpacity onPress={() => handleItemPress(item)}>
              <Card issue={item} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={() => handleItemPress(item)}>
              <View style={styles.tableRow}>
                <Text style={styles.tableCell}>{item.issueNo}</Text>
                <Text style={styles.tableCell}>{item.issue.issueContent}</Text>
                <Text style={styles.tableCell}>{item.status}</Text>
              </View>
            </TouchableOpacity>
          )
        }
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
    backgroundColor: "#347aeb",
    borderRadius: 25,
  },
  selectedText: {
    color: "#fff",
  },
  toggleContainer: {
    alignItems: "center",
    marginVertical: 10,
  },
  toggleText: {
    fontSize: 18,
    color: "#347aeb",
  },
  listContainer: {
    padding: 16,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#ddd",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  tableHeaderCell: {
    flex: 1,
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  tableCell: {
    flex: 1,
    fontSize: 16,
    color: "#333",
    textAlign: "center",
  },
});

export default IssuePage;
