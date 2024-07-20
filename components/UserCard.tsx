import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Animated,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { UserCircleIcon, UserIcon } from "react-native-heroicons/outline";

const { width } = Dimensions.get("window");
const user = {
  _id: "63bad9d81a86f91ef7fcce56",
  name: "Sanjith T",
  id: "20PW32",
  hashword: "d63dc919e201d7bc4c825630d2cf25fdc93d4b2f0d46706d29038d01",
  confirmed: true,
  confkey: "7366B4EB",
};

interface User {
  name: string;
  _id: string;
  id: string;
  hashword: string;
  confirmed: boolean;
  confkey: string;
}

const UserCard = ({ user }: { user: User }) => {
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
        <Text
          style={{
            color: user.confirmed ? "green" : "red",
          }}
        >
          Account Status : {user.confirmed ? "Confirmed" : "Pending"}
        </Text>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => alert("Delete User")}
        >
          <Text style={styles.deleteButtonText}>Delete</Text>
        </TouchableOpacity>
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
  deleteButton: {
    backgroundColor: "red",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  deleteButtonText: {
    color: "white",
    fontSize: 16,
  },
});

export default UserCard;
