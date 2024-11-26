import React, { useCallback, useEffect, useReducer, useState } from "react";
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
import axios from "axios";
import {
  Searchbar,
  Button,
  Provider as PaperProvider,
} from "react-native-paper";
import tw from "twrnc";
import { useFocusEffect } from "expo-router";
import { BACKEND_URL } from "@/production.config";

const { width } = Dimensions.get("window");

// Initial state
const initialState = {
  issueList: [],
  filteredIssueList: [],
};

// Reducer function
const reducer = (state: any, action: any) => {
  switch (action.type) {
    case "SET_ISSUE_LIST":
      return {
        ...state,
        issueList: action.payload,
        filteredIssueList: action.payload,
      };
    case "SET_FILTERED_ISSUE_LIST":
      return { ...state, filteredIssueList: action.payload };
    default:
      return state;
  }
};

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

export default function Tab() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortAsc, setSortAsc] = useState(true);
  const navigation = useNavigation();

  const fetchIssues = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/tasks/todo`);
      dispatch({ type: "SET_ISSUE_LIST", payload: response.data.tasks });
    } catch (error) {
      console.log(error);
    }
  };

  const onChangeSearch = (query: any) => {
    setSearchQuery(query);
    const filteredIssues = state.issueList.filter((issue: any) =>
      issue.issue.issueContent.toLowerCase().includes(query.toLowerCase())
    );
    dispatch({ type: "SET_FILTERED_ISSUE_LIST", payload: filteredIssues });
  };

  const onSortIssues = () => {
    const sortedIssues = [...state.filteredIssueList].sort((a, b) => {
      if (sortAsc) {
        return a.issue.issueContent.localeCompare(b.issue.issueContent);
      } else {
        return b.issue.issueContent.localeCompare(a.issue.issueContent);
      }
    });
    dispatch({ type: "SET_FILTERED_ISSUE_LIST", payload: sortedIssues });
    setSortAsc(!sortAsc);
  };

  useFocusEffect(
    useCallback(() => {
      fetchIssues();
    }, [])
  );

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

  return (
    <PaperProvider>
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
            <View style={styles.searchSortContainer}>
              <Searchbar
                placeholder="Search"
                onChangeText={onChangeSearch}
                value={searchQuery}
                style={styles.searchBar}
              />
              <Button
                mode="contained"
                onPress={onSortIssues}
                style={[styles.sortButton, tw`bg-blue-500`]}
              >
                <Text style={{ color: "white" }}>Sort</Text>
              </Button>
            </View>
            {state.filteredIssueList.length === 0 ? (
              <View style={styles.emptyMessageContainer}>
                <Text style={styles.emptyMessageText}>No issues found</Text>
              </View>
            ) : (
              state.filteredIssueList.map((card: Issue, index: number) => (
                <Card key={index} issue={card} />
              ))
            )}
          </SafeAreaView>
        </View>
      </ScrollView>
    </PaperProvider>
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
  searchSortContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  searchBar: {
    flex: 1,
    marginRight: 10,
    backgroundColor: "white",
  },
  sortButton: {
    height: 50,
    justifyContent: "center",
    backgroundColor: "#ff9f00",
  },
  emptyMessageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: 200, // Adjust the height as needed
  },
  emptyMessageText: {
    fontSize: 18,
    color: "#555555",
  },
});
