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
  UserIcon,
  RectangleStackIcon,
  BellAlertIcon,
} from "react-native-heroicons/outline";
import { useNavigation } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import tw from "twrnc";
import { router } from "expo-router";

const { width, height } = Dimensions.get("window");

export default function TabLayout() {
  const navigation = useNavigation();
  navigation.setOptions({
    headerShown: false,
  });

  return (
    <View
      style={[tw`flex-1 bg-[#F2F2F2]`, { marginTop: height * 0.02, gap: 3 }]}
    >
      <SafeAreaView style={{ paddingHorizontal: width * 0.025 }}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View
            style={[
              tw`flex flex-row justify-between`,
              { marginVertical: height * 0.02 },
            ]}
          >
            <View
              style={[
                tw`bg-white rounded-full flex flex-row items-center`,
                { height: height * 0.08, width: width * 0.75 },
              ]}
            >
              <Image
                source={{
                  uri: "https://bleedingcool.com/wp-content/uploads/2019/09/benedict-cumberbatch-1200x900.jpg",
                }}
                style={[
                  tw`border-1 rounded-full bg-black`,
                  { height: height * 0.08, width: height * 0.08 },
                ]}
              />
              <Text
                style={[
                  tw`text-black ml-4 text-md`,
                  { fontSize: width * 0.045 },
                ]}
              >
                Henry Cavil
              </Text>
              <TouchableOpacity style={tw`ml-3`}>
                <ChevronDownIcon size={20} color={"blue"} />
              </TouchableOpacity>
            </View>
            <View style={tw`flex flex-row gap-2`}>
              <TouchableOpacity
                style={[
                  tw`bg-white rounded-full justify-center items-center`,
                  { height: height * 0.08, width: height * 0.08 },
                ]}
                onPress={() => router.push("/Notifications")}
              >
                <BellAlertIcon size={30} color={"blue"} />
              </TouchableOpacity>
            </View>
          </View>
          <Text style={[tw`mt-3 ml-2`, { fontSize: width * 0.1 }]}>
            Hello Admin !
          </Text>
          <View
            style={[
              tw`flex w-full rounded-l-full rounded-r-full bg-white py-6 flex-row justify-between`,
              { height: height * 0.1, marginTop: height * 0.02 },
            ]}
          >
            <Text style={[tw`ml-7`, { fontSize: width * 0.045 }]}>
              Admin ID
            </Text>
            <View style={tw`flex flex-row space-x-2 items-center ml-5 mr-5`}>
              <Text style={[tw`text-lg`, { fontSize: width * 0.045 }]}>
                #21
              </Text>
              <TouchableOpacity>
                <ChevronRightIcon size={20} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={tw`px-2`}>
            <View style={[tw`flex flex-row space-x-2 mt-3`, { gap: 5 }]}>
              <TouchableOpacity
                style={[
                  tw`bg-white rounded-[50px] px-5`,
                  { width: "60%", height: height * 0.2 },
                ]}
                onPress={() => {
                  router.push("/Home/UserList");
                }}
              >
                <View style={tw`flex flex-row justify-between mt-5`}>
                  <UsersIcon size={35} color={"blue"} />
                </View>
                <Text
                  style={[
                    tw`mt-14 ml-3 font-semi-bold`,
                    { fontSize: width * 0.045 },
                  ]}
                >
                  Users Console
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  tw`bg-white rounded-[50px] ml-2`,
                  { width: "38%", height: height * 0.2 },
                ]}
                onPress={() => {}}
              >
                <View style={tw`mt-5 ml-5`}>
                  <CubeTransparentIcon size={35} color={"blue"} />
                </View>
                <Text
                  style={[
                    tw`mt-10 ml-7 font-semi-bold`,
                    { fontSize: width * 0.045 },
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
                  { width: "60%", height: height * 0.36 },
                ]}
              >
                <TouchableOpacity
                  style={[
                    tw`flex justify-center items-center rounded-full`,
                    {
                      height: height * 0.08,
                      width: height * 0.08,
                      marginTop: height * 0.05,
                      marginLeft: width * 0.35,
                      backgroundColor: "white",
                    },
                  ]}
                  onPress={() => {
                    router.push("/Home/TodoList");
                  }}
                >
                  <ArrowUpRightIcon size={26} color={"blue"} />
                </TouchableOpacity>
                <View style={tw`mt-13 px-5 flex flex-row justify-between`}>
                  <CalendarIcon color="white" size={35} />
                  <View
                    style={tw`h-8 w-8 bg-red-500 rounded-full flex justify-center items-center`}
                  >
                    <Text style={tw`text-white`}>7</Text>
                  </View>
                </View>
                <View style={tw`px-5 mt-5`}>
                  <Text
                    style={[
                      tw`text-white`,
                      {
                        fontVariant: ["stylistic-nineteen"],
                        fontSize: 20,
                        fontWeight: "800",
                      },
                    ]}
                  >
                    Tasks
                  </Text>
                </View>
              </View>
              <View style={[tw`flex flex-col w-full ml-2 mt-2 `, { gap: 5 }]}>
                <TouchableOpacity
                  style={[
                    tw`bg-white rounded-[50px] ml-2`,
                    { width: "38%", height: height * 0.18 },
                  ]}
                  onPress={() => {
                    router.push("/Home/Issues");
                  }}
                >
                  <View style={tw`mt-5 ml-5`}>
                    <RectangleStackIcon size={35} color={"blue"} />
                  </View>
                  <Text
                    style={[
                      tw`mt-10 ml-7 font-semi-bold`,
                      { fontSize: width * 0.045 },
                    ]}
                  >
                    Issues
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    tw`bg-white rounded-[50px] ml-2`,
                    { width: "38%", height: height * 0.18 },
                  ]}
                  onPress={() => {}}
                >
                  <View style={tw`mt-5 ml-5`}>
                    <CubeTransparentIcon size={35} color={"blue"} />
                  </View>
                  <Text
                    style={[
                      tw`mt-10 ml-7 font-semi-bold`,
                      { fontSize: width * 0.045 },
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
