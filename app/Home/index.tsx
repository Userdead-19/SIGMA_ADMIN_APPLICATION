import React from "react";
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Image,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ArrowUpRightIcon,
  CalendarIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  CubeTransparentIcon,
  UsersIcon,
  RectangleStackIcon,
  BellAlertIcon,
} from "react-native-heroicons/outline";
import { useNavigation } from "@react-navigation/native";
import { router } from "expo-router";
import tw from "twrnc";

const { width, height } = Dimensions.get("window");

export default function TabLayout() {
  const navigation = useNavigation();
  navigation.setOptions({
    headerShown: false,
  });

  return (
    <View
      style={[tw`flex-1 bg-[#F2F2F2]`, { marginTop: height * 0.01, gap: 2 }]}
    >
      <SafeAreaView style={{ paddingHorizontal: width * 0.02 }}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View
            style={[
              tw`flex flex-row justify-between`,
              { marginVertical: height * 0.01 },
            ]}
          >
            <View
              style={[
                tw`bg-white rounded-full flex flex-row items-center`,
                { height: height * 0.06, width: width * 0.7 },
              ]}
            >
              <Image
                source={{
                  uri: "https://bleedingcool.com/wp-content/uploads/2019/09/benedict-cumberbatch-1200x900.jpg",
                }}
                style={[
                  tw`border-1 rounded-full bg-black`,
                  { height: height * 0.06, width: height * 0.06 },
                ]}
              />
              <Text
                style={[
                  tw`text-black ml-3 text-sm`,
                  { fontSize: width * 0.04 },
                ]}
              >
                Henry Cavil
              </Text>
              <TouchableOpacity style={tw`ml-2`}>
                <ChevronDownIcon size={15} color={"blue"} />
              </TouchableOpacity>
            </View>
            <View style={tw`flex flex-row gap-1`}>
              <TouchableOpacity
                style={[
                  tw`bg-white rounded-full justify-center items-center`,
                  { height: height * 0.06, width: height * 0.06 },
                ]}
                onPress={() => router.push("/Notifications")}
              >
                <BellAlertIcon size={25} color={"blue"} />
              </TouchableOpacity>
            </View>
          </View>
          <Text style={[tw`mt-2 ml-2`, { fontSize: width * 0.08 }]}>
            Hello Admin!
          </Text>
          <View
            style={[
              tw`flex w-full rounded-l-full rounded-r-full bg-white py-5 flex-row justify-between`,
              { height: height * 0.08, marginTop: height * 0.01 },
            ]}
          >
            <Text style={[tw`ml-7`, { fontSize: width * 0.04 }]}>Admin ID</Text>
            <View style={tw`flex flex-row space-x-1 items-center ml-5 mr-5`}>
              <Text style={[tw`text-lg`, { fontSize: width * 0.04 }]}>#21</Text>
              <TouchableOpacity>
                <ChevronRightIcon size={15} />
              </TouchableOpacity>
            </View>
          </View>
          <View style={tw`px-2`}>
            <View style={[tw`flex flex-row space-x-1 mt-2`, { gap: 3 }]}>
              <TouchableOpacity
                style={[
                  tw`bg-white rounded-[50px] px-3`,
                  { width: "58%", height: height * 0.15 },
                ]}
                onPress={() => {
                  router.push("/Home/UserList");
                }}
              >
                <View style={tw`flex flex-row justify-between mt-3`}>
                  <UsersIcon size={30} color={"blue"} />
                </View>
                <Text
                  style={[
                    tw`mt-10 ml-2 font-semi-bold`,
                    { fontSize: width * 0.04 },
                  ]}
                >
                  Users Console
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  tw`bg-white rounded-[50px] ml-1`,
                  { width: "38%", height: height * 0.15 },
                ]}
                onPress={() => {}}
              >
                <View style={tw`mt-3 ml-3`}>
                  <CubeTransparentIcon size={30} color={"blue"} />
                </View>
                <Text
                  style={[
                    tw`mt-7 ml-3 font-semi-bold`,
                    { fontSize: width * 0.04 },
                  ]}
                >
                  Admin Console
                </Text>
              </TouchableOpacity>
            </View>
            <View style={tw`flex flex-row`}>
              <View
                style={[
                  tw`rounded-[50px] mt-3 bg-[#3872F7] flex flex-col`,
                  { width: "58%", height: height * 0.28 },
                ]}
              >
                <TouchableOpacity
                  style={[
                    tw`flex justify-center items-center rounded-full`,
                    {
                      height: height * 0.06,
                      width: height * 0.06,
                      marginTop: height * 0.03,
                      marginLeft: width * 0.35,
                      backgroundColor: "white",
                    },
                  ]}
                  onPress={() => {
                    router.push("/Home/TodoList");
                  }}
                >
                  <ArrowUpRightIcon size={20} color={"blue"} />
                </TouchableOpacity>
                <View style={tw`mt-8 px-5 flex flex-row justify-between`}>
                  <CalendarIcon color="white" size={30} />
                  <View
                    style={tw`h-6 w-6 bg-red-500 rounded-full flex justify-center items-center`}
                  >
                    <Text style={tw`text-white`}>7</Text>
                  </View>
                </View>
                <View style={tw`px-5 mt-3`}>
                  <Text
                    style={[
                      tw`text-white`,
                      {
                        fontVariant: ["stylistic-nineteen"],
                        fontSize: 18,
                        fontWeight: "800",
                      },
                    ]}
                  >
                    Tasks
                  </Text>
                </View>
              </View>
              <View style={[tw`flex flex-col w-full ml-1 mt-2`, { gap: 3 }]}>
                <TouchableOpacity
                  style={[
                    tw`bg-white rounded-[50px] ml-1`,
                    { width: "38%", height: height * 0.14 },
                  ]}
                  onPress={() => {
                    router.push("/Home/Issues");
                  }}
                >
                  <View style={tw`mt-3 ml-3`}>
                    <RectangleStackIcon size={30} color={"blue"} />
                  </View>
                  <Text
                    style={[
                      tw`mt-7 ml-3 font-semi-bold`,
                      { fontSize: width * 0.04 },
                    ]}
                  >
                    Issues
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    tw`bg-white rounded-[50px] ml-1`,
                    { width: "38%", height: height * 0.14 },
                  ]}
                  onPress={() => {}}
                >
                  <View style={tw`mt-3 ml-3`}>
                    <CubeTransparentIcon size={30} color={"blue"} />
                  </View>
                  <Text
                    style={[
                      tw`mt-7 ml-3 font-semi-bold`,
                      { fontSize: width * 0.04 },
                    ]}
                  >
                    Forum
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
