import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { UserIcon } from "react-native-heroicons/outline";

const { width } = Dimensions.get("window");

interface CardProps {
  mainText: string;
  block: string;
  type: string;
  userName: string;
  dateTime: string;
}

const Card: React.FC<CardProps> = ({
  mainText,
  block,
  type,
  userName,
  dateTime,
}) => {
  const navigation = useNavigation();

  return (
    <View style={styles.card}>
      <Text style={styles.mainText}>{mainText}</Text>
      <View style={styles.dateTimeContainer}>
        <View style={styles.dateTimeItem}>
          <Text style={styles.dateTimeHeading}>Block</Text>
          <Text style={styles.dateTimeValue}>{block}</Text>
        </View>
        <View style={styles.dateTimeItem}>
          <Text style={styles.dateTimeHeading}>Type</Text>
          <Text style={styles.dateTimeValue}>{type}</Text>
        </View>
      </View>
      <View style={styles.line}></View>
      <View style={styles.userDateTimeContainer}>
        <View style={styles.user}>
          <UserIcon size={25} color="#555555" />
          <Text style={styles.nameText}>{userName}</Text>
        </View>
        <View style={styles.dateTimeDetails}>
          <Text style={styles.dateTimeSmallText}>{dateTime}</Text>
        </View>
        <View
          style={{
            borderRadius: 20,
            backgroundColor: "#347aeb",
          }}
        >
          <TouchableOpacity style={styles.detailButton} onPress={() => {}}>
            <AntDesign name="right" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

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
