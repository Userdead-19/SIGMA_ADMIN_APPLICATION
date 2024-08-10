import React, { useEffect, useReducer, useState, useRef } from "react";
import {
  FlatList,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import {
  FAB,
  Provider as PaperProvider,
  Searchbar,
  Button,
} from "react-native-paper";
import UserCard from "@/components/UserCard";
import axios from "axios";
import tw from "twrnc";
import { router } from "expo-router";

const { width } = Dimensions.get("window");

// Initial state
const initialState = {
  open: false,
  user: [],
  filteredUser: [],
  loading: false,
  page: 1,
  hasMore: true,
};

// Reducer function
const reducer = (state: any, action: any) => {
  switch (action.type) {
    case "SET_OPEN":
      return { ...state, open: action.payload };
    case "SET_USER":
      return {
        ...state,
        user: [...state.user, ...action.payload],
        filteredUser: [...state.user, ...action.payload],
        page: state.page + 1,
      };
    case "SET_FILTERED_USER":
      return { ...state, filteredUser: action.payload };
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_HAS_MORE":
      return { ...state, hasMore: action.payload };
    default:
      return state;
  }
};

export default function Tab() {
  const navigation = useNavigation();
  const [state, dispatch] = useReducer(reducer, initialState);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortAsc, setSortAsc] = useState(true);

  const fetchAllUsers = async () => {
    if (!state.hasMore) return;

    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const response = await axios.get(
        `https://api.gms.intellx.in/administrator/all-users?page=${state.page}`
      );
      const users = response.data.users;

      if (users.length > 0) {
        dispatch({ type: "SET_USER", payload: users });
      } else {
        dispatch({ type: "SET_HAS_MORE", payload: false });
      }
    } catch (error) {
      console.log(error);
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const onChangeSearch = (query: any) => {
    setSearchQuery(query);
    const filteredUsers = state.user.filter((user: any) =>
      user.name.toLowerCase().includes(query.toLowerCase())
    );
    dispatch({ type: "SET_FILTERED_USER", payload: filteredUsers });
  };

  const onSortUsers = () => {
    const sortedUsers = [...state.filteredUser].sort((a, b) => {
      if (sortAsc) {
        return a.name.localeCompare(b.name);
      } else {
        return b.name.localeCompare(a.name);
      }
    });
    dispatch({ type: "SET_FILTERED_USER", payload: sortedUsers });
    setSortAsc(!sortAsc);
  };

  useEffect(() => {
    fetchAllUsers();
  }, []);

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  const renderFooter = () => {
    if (!state.loading) return null;
    return <ActivityIndicator size="large" color="#0000ff" animating={true} />;
  };

  return (
    <PaperProvider>
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
            <Text style={styles.headingText}>User Details</Text>
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
              onPress={onSortUsers}
              style={[styles.sortButton, tw`bg-blue-500`]}
            >
              <Text
                style={{
                  color: "white",
                }}
              >
                Sort
              </Text>
            </Button>
          </View>

          <FlatList
            data={state.filteredUser}
            renderItem={({ item }) => (
              <UserCard user={item} reloadFunction={fetchAllUsers} />
            )}
            keyExtractor={(item, index) => `${item.id}-${index}`}
            onEndReached={fetchAllUsers}
            onEndReachedThreshold={0.5}
            ListFooterComponent={renderFooter}
            showsVerticalScrollIndicator={false}
          />
        </SafeAreaView>
      </View>
      <FAB
        style={[styles.fab, tw`bg-blue-500`]}
        icon={state.open ? "minus" : "plus"}
        onPress={() => {
          dispatch({ type: "SET_OPEN", payload: !state.open });
          router.push({ pathname: "/Home/AddUser" });
        }}
      />
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
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
  },
});
