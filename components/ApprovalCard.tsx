import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Animated,
  Alert,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { UserCircleIcon } from "react-native-heroicons/outline";
import axios from "axios";

const { width } = Dimensions.get("window");

interface User {
  name: string;
  _id: string;
  id: string;
  hashword: string;
  confirmed: boolean;
  confkey: string;
}

const ApprovalCard = ({
  user,
  resetFunction,
}: {
  user: User;
  resetFunction: () => void;
}) => {
  console.log(user);
  const [expanded, setExpanded] = useState(false);
  const animation = useRef(new Animated.Value(0)).current;

  const toggleExpand = () => {
    Animated.timing(animation, {
      toValue: expanded ? 0 : 1,
      duration: 300,
      useNativeDriver: false,
    }).start();
    setExpanded(!expanded);
  };

  const ApproveUser = async () => {
    try {
      const response = await axios.get(
        `https://api.gms.intellx.in/manager/approve/${user.confkey}`
      );
      resetFunction();
      Alert.alert("User Approved");
    } catch (error: any) {
      // Check if the error has a response object
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Unknown error occurred";
      Alert.alert("Error approving user", errorMessage);
      console.error(
        "Error approving user:",
        errorMessage,
        error.response || error
      );
    }
  };

  const RejectUser = async () => {
    try {
      const response = await axios.delete(
        `https://api.gms.intellx.in/manager/reject/${user.id}`
      );
      resetFunction();
      Alert.alert("User Rejected");
    } catch (error: any) {
      // Check if the error has a response object
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Unknown error occurred";
      Alert.alert("Error rejecting user", errorMessage);
      console.error(
        "Error rejecting user:",
        errorMessage,
        error.response || error
      );
    }
  };

  const heightInterpolate = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 100], // Adjust as needed for content height
  });

  return (
    <View style={styles.card}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-evenly",
        }}
      >
        <UserCircleIcon size={60} color="blue" />
        <View
          style={{
            flexDirection: "column",
          }}
        >
          <Text style={styles.userDetail}>Name: {user.name}</Text>
          <Text style={styles.userDetail}>ID: {user.id}</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.arrowButton} onPress={toggleExpand}>
        <AntDesign name={expanded ? "up" : "down"} size={20} color="#555555" />
      </TouchableOpacity>

      <Animated.View style={{ overflow: "hidden", height: heightInterpolate }}>
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.approveButton} onPress={ApproveUser}>
            <Text style={styles.buttonText}>Approve</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.rejectButton} onPress={RejectUser}>
            <Text style={styles.buttonText}>Reject</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    marginTop: "5%",
    marginLeft: "4%",
    marginRight: "4%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  mainText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  userDetail: {
    fontSize: 16,
    color: "#555",
    marginBottom: 5,
  },
  arrowButton: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  approveButton: {
    backgroundColor: "green",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    marginRight: 5,
  },
  rejectButton: {
    backgroundColor: "red",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    marginLeft: 5,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
});

export default ApprovalCard;
