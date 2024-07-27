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

const UserCard = ({
  user,
  reloadFunction,
}: {
  user: User;
  reloadFunction: Function;
}) => {
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

  const deleteCurrentUser = async (id: string) => {
    try {
      const body = {
        id: user.id,
      };
      const response = await axios.delete(
        "https://api.gms.intellx.in/client/delete",
        { data: body }
      );
      console.log(response.data);
      reloadFunction();
      Alert.alert("User Deleted Successfully");
    } catch (error) {
      console.log(error);
      Alert.alert("Error Deleting User");
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <UserCircleIcon size={60} color="blue" />
        <View style={styles.textContainer}>
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
          onPress={() => {
            deleteCurrentUser(user.id);
          }}
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
  row: {
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  textContainer: {
    flexDirection: "column",
    flex: 1,
    flexShrink: 1,
  },
  userDetail: {
    fontSize: 16,
    color: "#555",
    marginBottom: 5,
    flexShrink: 1,
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
