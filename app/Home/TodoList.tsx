import React from "react";
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

const { width } = Dimensions.get("window");

interface CardProps {
  mainText: string;
  block: string;
  type: string;
  userName: string;
  dateTime: string;
}

const cardsData: CardProps[] = [
  {
    mainText: "Restroom Complaint",
    block: "J block",
    type: "Ladies",
    userName: "Shreya Suresh",
    dateTime: "July 20, 10:00 AM",
  },
  {
    mainText: "Restroom Complaint",
    block: "K block",
    type: "Gents",
    userName: "Rahul Sharma",
    dateTime: "July 21, 11:00 AM",
  },
  {
    mainText: "Restroom Complaint",
    block: "L block",
    type: "Ladies",
    userName: "Anita Roy",
    dateTime: "July 22, 9:00 AM",
  },
  {
    mainText: "Restroom Complaint",
    block: "J block",
    type: "Ladies",
    userName: "Shreya Suresh",
    dateTime: "July 20, 10:00 AM",
  },
  {
    mainText: "Restroom Complaint",
    block: "K block",
    type: "Gents",
    userName: "Rahul Sharma",
    dateTime: "July 21, 11:00 AM",
  },
  {
    mainText: "Restroom Complaint",
    block: "L block",
    type: "Ladies",
    userName: "Anita Roy",
    dateTime: "July 22, 9:00 AM",
  },
];

export default function Tab() {
  const navigation = useNavigation();
  navigation.setOptions({
    headerShown: false,
  });

  return (
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
          {cardsData.map((card: CardProps, index: number) => (
            <Card
              key={index}
              issue={{
                mainText: card.mainText,
                block: card.block,
                type: card.type,
                userName: card.userName,
                dateTime: card.dateTime,
              }}
            />
          ))}
        </SafeAreaView>
      </View>
    </ScrollView>
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
  // Add remaining styles
});
