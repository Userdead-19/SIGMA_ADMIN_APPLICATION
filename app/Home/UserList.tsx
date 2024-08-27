import React, { useEffect, useReducer, useState } from "react";
import {
  FlatList,
  View,
  Text,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Appbar,
  Button,
  FAB,
  Provider as PaperProvider,
  Searchbar,
} from "react-native-paper";
import UserCard from "@/components/UserCard";
import axios from "axios";
import tw from "twrnc";
import { router, useNavigation } from "expo-router";

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
        hasMore: false,
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
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortAsc, setSortAsc] = useState<boolean>(true);

  const fetchAllUsers = async () => {
    if (!state.hasMore || state.loading) return;
    console.log("Fetching users...");
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const response = await axios.get(
        `https://api.gms.intellx.in/administrator/all-users` // Adjust query params as needed
      );
      const users = response.data.users;

      if (users.length > 0) {
        dispatch({ type: "SET_USER", payload: users });
      } else {
        dispatch({ type: "SET_HAS_MORE", payload: false });
      }
    } catch (error) {
      console.log(error);
      // Optionally handle error here
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const onChangeSearch = (query: string) => {
    setSearchQuery(query);
    const filteredUsers = state.user.filter((user: any) =>
      user.name.toLowerCase().includes(query.toLowerCase())
    );
    dispatch({ type: "SET_FILTERED_USER", payload: filteredUsers });
  };

  const onSortUsers = () => {
    const sortedUsers = [...state.filteredUser].sort((a, b) => {
      return sortAsc
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name);
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

  const handleLoadMore = () => {
    if (!state.loading && state.hasMore) {
      fetchAllUsers();
    }
  };

  return (
    <PaperProvider>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title="Sigma - GMS" />
      </Appbar.Header>
      <View style={styles.container}>
        <SafeAreaView style={{ paddingHorizontal: width * 0.035 }}>
          <View style={styles.searchSortContainer}>
            <Searchbar
              placeholder="Search User"
              onChangeText={onChangeSearch}
              value={searchQuery}
              style={styles.searchBar}
            />
            <Button
              mode="contained"
              onPress={onSortUsers}
              style={[styles.sortButton, tw`bg-blue-400`]}
            >
              <Text style={styles.sortButtonText}>Sort</Text>
            </Button>
          </View>

          <FlatList
            data={state.filteredUser}
            renderItem={({ item }) => (
              <UserCard user={item} fetchAllUsers={fetchAllUsers} />
            )}
            keyExtractor={(item) => item.id.toString()}
            onEndReached={handleLoadMore}
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
    flex: 1,
    backgroundColor: "#F2F2F2",
    marginBottom: 30,
  },
  searchSortContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20, // Adjusted margin
    height: 40,
  },
  searchBar: {
    flex: 1,
    marginRight: 5,
    backgroundColor: "white",
    fontSize: 16, // Adjusted font size
  },
  sortButton: {
    height: 40,
    justifyContent: "center",
  },
  sortButtonText: {
    color: "white",
    fontWeight: "500", // Adjusted font weight
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
  },
});
