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
                { height: height * 0.07, width: width * 0.74 },
              ]}
            >
              <Image
                source={{
                  uri: "https://bleedingcool.com/wp-content/uploads/2019/09/benedict-cumberbatch-1200x900.jpg",
                }}
                style={[
                  tw`border-1 rounded-full bg-black`,
                  { height: height * 0.07, width: height * 0.07 },
                ]}
              />
              <Text
                style={[
                  tw`text-black ml-3 text-md`,
                  { fontSize: width * 0.044 },
                ]}
              >
                Henry Cavil
              </Text>
              <TouchableOpacity style={tw`ml-3`}>
                <ChevronDownIcon size={19} color={"blue"} />
              </TouchableOpacity>
            </View>
            <View style={tw`flex flex-row gap-1`}>
              <TouchableOpacity
                style={[
                  tw`bg-white rounded-full justify-center items-center`,
                  { height: height * 0.07, width: height * 0.07 },
                ]}
                onPress={() => router.push("/Notifications")}
              >
                <BellAlertIcon size={29} color={"blue"} />
              </TouchableOpacity>
            </View>
          </View>
          <Text style={[tw`mt-2 ml-2`, { fontSize: width * 0.09 }]}>
            Hello Admin !
          </Text>
          <View
            style={[
              tw`flex w-full rounded-l-full rounded-r-full bg-white py-5 flex-row justify-between`,
              { height: height * 0.09, marginTop: height * 0.01 },
            ]}
          >
            <Text style={[tw`ml-6`, { fontSize: width * 0.044 }]}>
              Admin ID
            </Text>
            <View style={tw`flex flex-row space-x-1 items-center ml-4 mr-4`}>
              <Text style={[tw`text-lg`, { fontSize: width * 0.044 }]}>
                #21
              </Text>
              <TouchableOpacity>
                <ChevronRightIcon size={19} />
              </TouchableOpacity>
            </View>
          </View>
          <View style={tw`px-1 mt-4 flex-row gap-5`}>
            <View
              style={[
                tw`bg-white p-4 rounded-lg items-center justify-center`,
                { width: width * 0.43, height: height * 0.12 },
              ]}
            >
              <Text style={[tw`text-lg font-bold`, { fontSize: width * 0.05 }]}>
                Total Issues
              </Text>
              <Text
                style={[tw`text-xl font-bold mt-2`, { fontSize: width * 0.06 }]}
              >
                23
              </Text>
            </View>
            <View
              style={[
                tw`bg-white p-4 rounded-lg items-center justify-center`,
                { width: width * 0.43, height: height * 0.12 },
              ]}
            >
              <Text style={[tw`text-lg font-bold`, { fontSize: width * 0.05 }]}>
                Solved Issues
              </Text>
              <Text
                style={[tw`text-xl font-bold mt-2`, { fontSize: width * 0.06 }]}
              >
                15
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
                <View style={tw`flex flex-row justify-between mt-4`}>
                  <UsersIcon size={34} color={"blue"} />
                </View>
                <Text
                  style={[
                    tw`mt-13 ml-3 font-semi-bold`,
                    { fontSize: width * 0.044 },
                  ]}
                >
                  Users Console
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  tw`bg-white rounded-[50px] ml-1`,
                  { width: "37%", height: height * 0.19 },
                ]}
                onPress={() => {}}
              >
                <View style={tw`mt-4 ml-4`}>
                  <CubeTransparentIcon size={34} color={"blue"} />
                </View>
                <Text
                  style={[
                    tw`mt-9 ml-6 font-semi-bold`,
                    { fontSize: width * 0.044 },
                  ]}
                >
                  Admin Console
                </Text>
              </TouchableOpacity>
            </View>
            <View style={tw`flex flex-row`}>
              <View
                style={[
                  tw`rounded-[50px] mt-2 bg-[#3872F7] flex flex-col`,
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
                    <Text style={tw`text-white`}>7</Text>
                  </View>
                </View>
                <View style={tw`px-4 mt-4`}>
                  <Text
                    style={[
                      tw`text-white`,
                      {
                        fontVariant: ["stylistic-nineteen"],
                        fontSize: 19,
                        fontWeight: "800",
                      },
                    ]}
                  >
                    Tasks
                  </Text>
                </View>
              </View>
              <View style={[tw`flex flex-col w-full ml-1 mt-1 `, { gap: 4 }]}>
                <TouchableOpacity
                  style={[
                    tw`bg-white rounded-[50px] ml-1`,
                    { width: "37%", height: height * 0.17 },
                  ]}
                  onPress={() => {
                    router.push("/Home/Issues");
                  }}
                >
                  <View style={tw`mt-4 ml-4`}>
                    <RectangleStackIcon size={34} color={"blue"} />
                  </View>
                  <Text
                    style={[
                      tw`mt-9 ml-6 font-semi-bold`,
                      { fontSize: width * 0.044 },
                    ]}
                  >
                    Issues
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    tw`bg-white rounded-[50px] ml-1`,
                    { width: "37%", height: height * 0.17 },
                  ]}
                  onPress={() => {}}
                >
                  <View style={tw`mt-4 ml-4`}>
                    <CubeTransparentIcon size={34} color={"blue"} />
                  </View>
                  <Text
                    style={[
                      tw`mt-9 ml-6 font-semi-bold`,
                      { fontSize: width * 0.044 },
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
