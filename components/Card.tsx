import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image,
} from "react-native";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { ArrowUpRightIcon, UserIcon } from "react-native-heroicons/outline";
import tw from "twrnc";
import { router } from "expo-router";
const { width } = Dimensions.get("window");

interface CardProps {
  mainText: string;
  block: string;
  type: string;
  userName: string;
  dateTime: string;
}

const Card = ({ issue }: { issue: CardProps }) => (
  <View style={tw`bg-white rounded-2xl p-4 mb-4 shadow gap-5`}>
    <Text style={tw`text-lg font-bold mb-2`}>{issue.mainText}</Text>
    <View style={tw`flex-row items-center mb-2 gap-10`}>
      <View style={tw`flex flex-col`}>
        <Text style={tw`text-xs text-gray-600 mr-4`}>BLOCK</Text>
        <Text style={tw`text-base text-black mr-6 font-semibold text-2xl`}>
          {issue.block}
        </Text>
      </View>
      <View style={tw`flex flex-col`}>
        <Text style={tw`text-xs text-gray-600 mr-4`}>TYPE</Text>
        <Text style={tw`text-base text-black mr-6 font-semibold text-2xl`}>
          {issue.type}
        </Text>
      </View>
    </View>
    <View style={tw`border border-gray-200 px-5`}></View>
    <View style={tw`flex-row items-center mb-2`}>
      <Ionicons name="person-circle" size={40} color="gray" />
      <View style={tw`flex-1 ml-4`}>
        <Text style={tw`text-base font-bold`}>{issue.userName}</Text>
      </View>
      <TouchableOpacity
        style={tw`bg-blue-500 p-4  mx-[5%] rounded-full  ml-10  flex-row justify-center items-center gap-2`}
        onPress={() => {
          router.push({
            pathname: "/IssueDetails",
            params: {
              issue: JSON.stringify(issue),
            },
          });
        }}
      >
        <ArrowUpRightIcon size={20} color={"white"} />
      </TouchableOpacity>
    </View>
  </View>
);
const styles = StyleSheet.create({
  user: {
    flexDirection: "row",
    alignItems: "center",
  },
  userImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
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
  mainText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  dateTimeContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 5,
  },
  dateTimeItem: {
    flex: 0.5,
  },
  dateTimeHeading: {
    marginLeft: "5%",
    fontSize: 16,
    fontWeight: "600",
    color: "#555",
    marginBottom: 5,
  },
  dateTimeValue: {
    marginLeft: "4%",
    fontSize: 16,
    color: "#333",
  },
  userDateTimeContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  detailButton: {
    padding: 10,
  },
  dateTimeDetails: {
    marginLeft: 30,
  },
  dateTimeSmallText: {
    fontSize: 12,
    color: "#555",
  },
  card: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    marginTop: "5%",
    marginLeft: "4%",
    marginRight: "4%",
  },
  line: {
    borderTopWidth: 1,
    borderTopColor: "gray",
    marginVertical: "3%",
  },
  nameText: {
    fontSize: 16,
    fontWeight: "500",
  },
  userTitleText: {
    fontSize: 12,
    color: "gray",
  },
  suHeadingText: {
    fontSize: 14,
    color: "gray",
  },
});

export default Card;
