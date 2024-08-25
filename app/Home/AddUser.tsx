import React, { useEffect, useReducer, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { router } from "expo-router";

type State = {
  fullName: string;
  id: string;
  password: string;
  confirmPassword: string;
};

type Action =
  | { type: "SET_FULL_NAME"; payload: string }
  | { type: "SET_EMAIL"; payload: string }
  | { type: "SET_PASSWORD"; payload: string }
  | { type: "SET_CONFIRM_PASSWORD"; payload: string };

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SET_FULL_NAME":
      return { ...state, fullName: action.payload };
    case "SET_EMAIL":
      return { ...state, id: action.payload };
    case "SET_PASSWORD":
      return { ...state, password: action.payload };
    case "SET_CONFIRM_PASSWORD":
      return { ...state, confirmPassword: action.payload };
    default:
      return state;
  }
};

const SignUpScreen = () => {
  const [state, dispatch] = useReducer(reducer, {
    fullName: "",
    id: "",
    password: "password",
    confirmPassword: "password",
  });

  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const validateInputs = () => {
    const { fullName, id, password, confirmPassword } = state;
    if (!fullName || !id || !password || !confirmPassword) {
      Alert.alert("Error", "All fields are required.");
      return false;
    }
    // Add more validation logic if needed (e.g., email format, password strength)
    return true;
  };

  const CreateNewUser = async () => {
    if (!validateInputs()) return;
    setLoading(true);
    try {
      const response = await axios.post(
        "https://api.gms.intellx.in/administrator/new-user",
        {
          name: state.fullName,
          id: state.id,
          hashword: state.password,
        }
      );
      if (response.status === 201) {
        Alert.alert("Success", "User created successfully.");
        router.back(); // Navigate back to the previous screen
      } else {
        Alert.alert("Error", "Failed to create user.");
        console.log("Failed to create user:", response);
      }
    } catch (error: any) {
      Alert.alert("Error", error.message);
      console.error("Error creating user:", error.response || error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    navigation.setOptions({
      headerTitle: "",
    });
  }, []);

  return (
    <View style={styles.container}>
      <View
        style={{
          padding: 5,
          width: "100%",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text style={styles.title}>Create User</Text>
      </View>
      <View style={styles.inputContainer}>
        <MaterialCommunityIcons name="account-outline" size={20} color="#999" />
        <TextInput
          style={styles.input}
          placeholder="Full name"
          placeholderTextColor="#999"
          value={state.fullName}
          onChangeText={(text) =>
            dispatch({ type: "SET_FULL_NAME", payload: text })
          }
        />
      </View>
      <Text>Enter full name as per College ID Card</Text>
      <View style={styles.inputContainer}>
        <MaterialCommunityIcons name="account-outline" size={20} color="#999" />
        <TextInput
          style={styles.input}
          placeholder="Employee ID"
          placeholderTextColor="#999"
          value={state.id}
          onChangeText={(text) =>
            dispatch({ type: "SET_EMAIL", payload: text })
          }
        />
      </View>
      <Text>Enter Employee ID</Text>
      <View style={styles.inputContainer}>
        <MaterialCommunityIcons name="lock-outline" size={20} color="#999" />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#999"
          value={state.password}
        />
      </View>
      <Text>Default password is "Password" from new accounts.</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={CreateNewUser}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "CREATING..." : "CREATE"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    gap: 15,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 28,
    fontWeight: "900",
    fontVariant: ["small-caps"],
    marginLeft: "-40%",
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    borderColor: "#ddd",
    borderBottomWidth: 1,
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  input: {
    flex: 1,
    height: 40,
    paddingHorizontal: 10,
    color: "#333",
  },
  button: {
    backgroundColor: "#ff9f00",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    width: "40%",
    marginRight: "-45%",
    alignItems: "center",
    marginBottom: 15,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
});

export default SignUpScreen;
