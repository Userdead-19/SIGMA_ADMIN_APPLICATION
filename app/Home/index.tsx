import React, { useEffect, useReducer } from "react";
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  Alert,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ArrowUpRightIcon,
  CalendarIcon,
  ChevronRightIcon,
  CubeTransparentIcon,
  UsersIcon,
  RectangleStackIcon,
  PowerIcon,
  ChartBarIcon,
  UserIcon,
  ArrowLeftStartOnRectangleIcon,
} from "react-native-heroicons/outline";
import { CommonActions, useNavigation } from "@react-navigation/native";
import { router } from "expo-router";
import tw from "twrnc";
import { useUser } from "@/Hooks/UserContext";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BACKEND_URL } from "@/production.config";

const { width, height } = Dimensions.get("window");

// Initial state
const initialState = {
  issuesResolved: 0,
  TodoList: 0,
  totalIssues: 0,
  pendingIssues: 0,
};

// Reducer function
const reducer = (state: any, action: any) => {
  switch (action.type) {
    case "SET_ISSUES_RESOLVED":
      return { ...state, issuesResolved: action.payload };
    case "SET_TODO_LIST":
      return { ...state, TodoList: action.payload };
    case "SET_TOTAL_ISSUES":
      return { ...state, totalIssues: action.payload };
    default:
      return state;
  }
};

export default function TabLayout() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const navigation = useNavigation();

  const fetchCountSolvedISsues = async () => {
    try {
      const response = await axios.get(
        `${BACKEND_URL}/client/issues/total/closed`
      );
      dispatch({
        type: "SET_ISSUES_RESOLVED",
        payload: response.data.closed_issues,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const fetchTodoList = async () => {
    try {
      const response = await axios.get(
        `${BACKEND_URL}/client/issues/total/open`
      );
      dispatch({ type: "SET_TODO_LIST", payload: response.data.open_issues });
    } catch (error) {
      console.log(error);
    }
  };

  const fetchTotalIssues = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/client/issues/total`);
      dispatch({
        type: "SET_TOTAL_ISSUES",
        payload: response.data.total_issues,
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchCountSolvedISsues();
    fetchTodoList();
    fetchTotalIssues();
  }, []);

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  const user = useUser();

  return (
    <View
      style={[tw`flex-1 bg-[#F2F2F2] `, { marginTop: height * 0.01, gap: 2 }]}
    >
      <SafeAreaView
        style={{
          paddingHorizontal: width * 0.02,
          alignContent: "center",
          justifyContent: "center",
        }}
      >
        <View
          style={{
            maxHeight: "auto",
            gap: Platform.OS === "android" ? 10 : 25,
            justifyContent: Platform.OS === "android" ? "center" : "flex-start",
          }}
        >
          <View
            style={[
              tw`flex flex-row justify-between`,
              { marginVertical: height * 0.01 },
            ]}
          >
            <View
              style={[
                tw`bg-white rounded-full flex flex-row items-center justify-between`,
                {
                  height: height * 0.07,
                  width: width * 0.74,
                  paddingHorizontal: width * 0.04,
                },
              ]}
            >
              <UserIcon size={26} color={"blue"} />
              <Text
                style={[
                  tw`text-black  font-regular  uppercase`,
                  { fontSize: width * 0.04 },
                ]}
              >
                {user?.name}
              </Text>
            </View>
            <View style={tw`flex flex-row gap-1`}>
              <TouchableOpacity
                style={[
                  tw`bg-white rounded-full justify-center items-center`,
                  { height: height * 0.07, width: height * 0.07 },
                ]}
                onPress={() => {
                  Alert.alert("Logout", "Are you sure you want to logout?", [
                    {
                      text: "Cancel",
                      onPress: () => {},
                      style: "cancel",
                    },
                    {
                      text: "Yes",
                      onPress: () => {
                        AsyncStorage.removeItem("admin-token");
                        navigation.dispatch(
                          CommonActions.reset({
                            index: 0,
                            routes: [{ name: "(tabs)" }],
                          })
                        );
                      },
                    },
                  ]);
                }}
              >
                <ArrowLeftStartOnRectangleIcon size={22} color={"blue"} />
              </TouchableOpacity>
            </View>
          </View>
          <View style={tw`px-3 mt-2 mb-2 flex-row justify-between`}>
            <View
              style={[
                tw`bg-white p-4 rounded-3xl items-center justify-center`,
                { width: width * 0.28, height: height * 0.12 },
              ]}
            >
              <Text
                style={[
                  tw`text-center`,
                  { fontSize: width * 0.035, fontWeight: "300", color: "#333" },
                ]}
              >
                Total Issues
              </Text>
              <Text
                style={[
                  tw`mt-2 text-center`,
                  { fontSize: width * 0.065, fontWeight: "500", color: "#000" },
                ]}
              >
                {state.totalIssues}
              </Text>
            </View>
            <View
              style={[
                tw`bg-white p-4 rounded-3xl items-center justify-center`,
                { width: width * 0.28, height: height * 0.12 },
              ]}
            >
              <Text
                style={[
                  tw`text-center`,
                  { fontSize: width * 0.035, fontWeight: "300", color: "#333" },
                ]}
              >
                Solved Issues
              </Text>
              <Text
                style={[
                  tw`mt-2 text-center`,
                  { fontSize: width * 0.065, fontWeight: "500", color: "#000" },
                ]}
              >
                {state.issuesResolved}
              </Text>
            </View>
            <View
              style={[
                tw`bg-white p-4 rounded-3xl items-center justify-center`,
                { width: width * 0.28, height: height * 0.12 },
              ]}
            >
              <Text
                style={[
                  tw`text-center`,
                  { fontSize: width * 0.035, fontWeight: "300", color: "#333" },
                ]}
              >
                Pending Issues
              </Text>
              <Text
                style={[
                  tw`mt-2 text-center`,
                  { fontSize: width * 0.065, fontWeight: "500", color: "#000" },
                ]}
              >
                {state.TodoList}
              </Text>
            </View>
          </View>

          <View style={tw`px-1`}>
            <View style={[tw`flex flex-row space-x-1 mt-2`, { gap: 4 }]}>
              <TouchableOpacity
                style={[
                  tw`bg-white rounded-[50px] px-4`,
                  { width: "59%", height: height * 0.19 },
                ]}
                onPress={() => {
                  router.push("/Home/UserList");
                }}
              >
                <View style={tw`flex flex-row justify-between mt-4 ml-4`}>
                  <UsersIcon size={34} color={"blue"} />
                </View>
                {Platform.OS === "android" ? (
                  <Text
                    style={[
                      tw`mt-12 ml-3 font-semi-bold`,
                      { fontSize: width * 0.04 },
                    ]}
                  >
                    Users Console
                  </Text>
                ) : (
                  <Text
                    style={[
                      tw`mt-18 ml-3 font-semi-bold`,
                      { fontSize: width * 0.04 },
                    ]}
                  >
                    Users Console
                  </Text>
                )}
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  tw`bg-white rounded-[50px] ml-1`,
                  { width: "37%", height: height * 0.19 },
                ]}
                onPress={() => {
                  router.push("/Home/AdminConsole");
                }}
              >
                <View style={tw`mt-4 ml-4 `}>
                  <CubeTransparentIcon size={34} color={"blue"} />
                </View>
                {Platform.OS === "android" ? (
                  <Text
                    style={[
                      tw`mt-12 ml-3 font-semi-bold`,
                      { fontSize: width * 0.039 },
                    ]}
                  >
                    Admin Console
                  </Text>
                ) : (
                  <Text
                    style={[
                      tw`mt-18 ml-3 font-semi-bold`,
                      { fontSize: width * 0.039 },
                    ]}
                  >
                    Admin Console
                  </Text>
                )}
              </TouchableOpacity>
            </View>
            <View style={tw`flex flex-row mt-2`}>
              <View
                style={[
                  tw`rounded-[50px] mt-2 bg-[#3872F7] flex flex-col justify-between`,
                  { width: "59%", height: height * 0.35 },
                ]}
              >
                <TouchableOpacity
                  style={[
                    tw`flex justify-center items-center rounded-full`,
                    {
                      height: height * 0.07,
                      width: height * 0.07,
                      marginTop: height * 0.04,
                      marginLeft: width * 0.34,
                      backgroundColor: "white",
                    },
                  ]}
                  onPress={() => {
                    router.push("/Home/TodoList");
                  }}
                >
                  <ArrowUpRightIcon size={25} color={"blue"} />
                </TouchableOpacity>
                <View style={tw`mt-12 px-4 flex flex-row justify-between`}>
                  <CalendarIcon color="white" size={34} />
                  <View
                    style={tw`h-7 w-7 bg-red-500 rounded-full flex justify-center items-center`}
                  >
                    <Text style={tw`text-white`}>{state.TodoList}</Text>
                  </View>
                </View>
                <View style={tw`px-4`}>
                  <Text
                    style={[
                      tw`text-white mb-10`,
                      {
                        fontVariant: ["stylistic-nineteen"],
                        fontSize: 19,
                        fontWeight: "400",
                      },
                    ]}
                  >
                    Tasks
                  </Text>
                </View>
              </View>
              <View style={[tw`flex flex-col w-full ml-1 mt-3 `, { gap: 4 }]}>
                <TouchableOpacity
                  style={[
                    tw`bg-white rounded-[50px] ml-1`,
                    { width: "37%", height: height * 0.17 },
                  ]}
                  onPress={() => {
                    router.push("/Home/Issues");
                  }}
                >
                  <View style={tw`mt-5 ml-4`}>
                    <RectangleStackIcon size={34} color={"blue"} />
                  </View>
                  {Platform.OS === "android" ? (
                    <Text
                      style={[
                        tw`mt-10 ml-6 font-semi-bold`,
                        { fontSize: width * 0.04 },
                      ]}
                    >
                      Issues
                    </Text>
                  ) : (
                    <Text
                      style={[
                        tw`mt-15 ml-6 font-semi-bold`,
                        { fontSize: width * 0.04 },
                      ]}
                    >
                      Issues
                    </Text>
                  )}
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    tw`bg-white rounded-[50px] ml-1 mt-1`,
                    { width: "37%", height: height * 0.17 },
                  ]}
                  onPress={() => {
                    router.push("/Home/StatisticsPage");
                  }}
                >
                  <View style={tw`mt-5 ml-5`}>
                    <ChartBarIcon size={34} color={"blue"} />
                  </View>
                  {Platform.OS === "android" ? (
                    <Text
                      style={[
                        tw`mt-10 ml-6 font-semi-bold`,
                        { fontSize: width * 0.04 },
                      ]}
                    >
                      Statistics
                    </Text>
                  ) : (
                    <Text
                      style={[
                        tw`mt-15 ml-6 font-semi-bold`,
                        { fontSize: width * 0.04 },
                      ]}
                    >
                      Statistics
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <TouchableOpacity>
              <Text
                style={{
                  fontSize: 15,
                  color: "#333",
                  fontWeight: "400",
                  marginTop: 20,
                  textDecorationLine: "underline",
                }}
              >
                powered by team
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}
