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
  TextInput,
  ActivityIndicator,
} from "react-native";
import Card from "@/components/Card";
import axios from "axios";
import { router, useFocusEffect, useNavigation } from "expo-router";
import { BACKEND_URL } from "@/production.config";

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
  assignee: string;
}

// Define action types
const SET_ISSUES = "SET_ISSUES";
const SET_FILTERED_ISSUES = "SET_FILTERED_ISSUES";
const SET_CURRENT_STAGE = "SET_CURRENT_STAGE";
const SET_VIEW_MODE = "SET_VIEW_MODE";
const SET_SEARCH_QUERY = "SET_SEARCH_QUERY";
const SET_LOADING = "SET_LOADING";
const SET_ERROR = "SET_ERROR";

// Define initial state
const initialState = {
  currentStage: "Current",
  issues: [] as Issue[],
  filteredIssues: [] as Issue[],
  viewMode: "Tile", // View mode can be 'Tile' or 'Table'
  searchQuery: "",
  loading: false,
  error: null as string | null,
};

// Define reducer function
const reducer = (state: typeof initialState, action: any) => {
  switch (action.type) {
    case SET_ISSUES:
      return {
        ...state,
        issues: action.payload,
        filteredIssues: filterIssues(
          action.payload,
          state.currentStage,
          state.searchQuery
        ),
        loading: false,
        error: null,
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
        filteredIssues: filterIssues(
          state.issues,
          action.payload,
          state.searchQuery
        ),
      };
    case SET_VIEW_MODE:
      return {
        ...state,
        viewMode: action.payload,
      };
    case SET_SEARCH_QUERY:
      return {
        ...state,
        searchQuery: action.payload,
        filteredIssues: filterIssues(
          state.issues,
          state.currentStage,
          action.payload
        ),
      };
    case SET_LOADING:
      return {
        ...state,
        loading: action.payload,
      };
    case SET_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false,
      };
    default:
      return state;
  }
};

// Filter issues based on stage and search query
const filterIssues = (issues: Issue[], stage: string, query: string) => {
  const lowerCaseQuery = query.toLowerCase();
  return issues.filter((issue) => {
    const isStageMatch =
      stage === "Current" ? issue.status === "OPEN" : issue.status === "CLOSE";
    const issueContent = issue.issue?.issueContent || "";
    const issueNo = issue.issueNo || "";
    const isQueryMatch =
      issueContent.toLowerCase().includes(lowerCaseQuery) ||
      issueNo.toLowerCase().includes(lowerCaseQuery);
    return isStageMatch && isQueryMatch;
  });
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

  const fetchAllIssues = useCallback(async () => {
    dispatch({ type: SET_LOADING, payload: true });
    try {
      const response = await axios.get(`${BACKEND_URL}/tasks`);
      if (response.data && response.data.issues) {
        dispatch({ type: SET_ISSUES, payload: response.data.issues });
      } else {
        dispatch({
          type: SET_ERROR,
          payload: "Invalid response from server.",
        });
      }
    } catch (error: any) {
      console.error("Error fetching issues:", error);
      dispatch({
        type: SET_ERROR,
        payload: error.message || "An unexpected error occurred.",
      });
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchAllIssues();
    }, [fetchAllIssues])
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

  const handleSearch = (query: string) => {
    dispatch({ type: SET_SEARCH_QUERY, payload: query });
  };

  const slideInterpolation = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "50%"],
  });

  // Table Header Component
  const TableHeader = () => (
    <View style={styles.tableHeader}>
      <Text style={styles.tableHeaderCell}>Issue Date</Text>
      <Text style={styles.tableHeaderCell}>Action Item</Text>
      <Text style={styles.tableHeaderCell}>Status</Text>
    </View>
  );

  // Render Item based on View Mode
  const renderItem = ({ item }: { item: Issue }) => {
    const status = item.status || "Unknown";
    const date = item.date || "N/A";
    const actionItem = item.issue?.actionItem || "N/A";

    if (state.viewMode === "Tile") {
      return (
        <TouchableOpacity onPress={() => handleItemPress(item)}>
          <Card issue={item} />
        </TouchableOpacity>
      );
    } else {
      return (
        <TouchableOpacity onPress={() => handleItemPress(item)}>
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>{date}</Text>
            <Text style={styles.tableCell}>{actionItem}</Text>
            <Text style={styles.tableCell}>{status}</Text>
          </View>
        </TouchableOpacity>
      );
    }
  };

  return (
    <View style={styles.container}>
      {/* Stage Toggle Buttons */}
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

      {/* View Mode Toggle */}
      <View style={styles.toggleContainer}>
        <TouchableOpacity onPress={handleViewToggle}>
          <Text style={styles.toggleText}>
            {state.viewMode === "Tile"
              ? "Switch to Table View"
              : "Switch to Tile View"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      {state.viewMode === "Table" && (
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search by Issue No or Content"
            value={state.searchQuery}
            onChangeText={handleSearch}
            autoCorrect={false}
            autoCapitalize="none"
            clearButtonMode="while-editing"
          />
        </View>
      )}

      {/* Table Header */}
      {state.viewMode === "Table" && <TableHeader />}

      {/* Loading Indicator */}
      {state.loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#347aeb" />
        </View>
      ) : state.error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{state.error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchAllIssues}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={state.filteredIssues}
          renderItem={renderItem}
          keyExtractor={(item) =>
            item._id?.$oid || item.issueNo || Math.random().toString()
          }
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No issues found.</Text>
            </View>
          }
        />
      )}
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
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  searchInput: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#eee",
    paddingVertical: 10,
    paddingHorizontal: 5,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#ccc",
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
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: "#e0e0e0",
    backgroundColor: "#fff",
    marginVertical: 4,
    borderRadius: 8,
    elevation: 1,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
  },
  tableCell: {
    flex: 1,
    fontSize: 14,
    color: "#555",
    textAlign: "center",
    paddingHorizontal: 5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  errorText: {
    fontSize: 16,
    color: "#ff3333",
    textAlign: "center",
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: "#347aeb",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  emptyContainer: {
    alignItems: "center",
    marginTop: 50,
  },
  emptyText: {
    fontSize: 18,
    color: "#999",
  },
});

export default IssuePage;
