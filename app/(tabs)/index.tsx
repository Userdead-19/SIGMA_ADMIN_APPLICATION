import React, { useEffect, useReducer, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { RouteProp } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router, useNavigation } from "expo-router";
import { Image } from "react-native";
import { useUser } from "@/Hooks/UserContext";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import * as jwt from "jwt-decode";

type State = {
  email: string;
  password: string;
  loading: boolean;
  error: string | null;
};

type Action =
  | { type: "SET_EMAIL"; payload: string }
  | { type: "SET_PASSWORD"; payload: string }
  | { type: "LOGIN_REQUEST" }
  | { type: "LOGIN_SUCCESS"; payload: { name: string; id: string } }
  | { type: "LOGIN_FAILURE"; payload: string };

const initialState: State = {
  email: "",
  password: "",
  loading: false,
  error: null,
};

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SET_EMAIL":
      return { ...state, email: action.payload };
    case "SET_PASSWORD":
      return { ...state, password: action.payload };
    case "LOGIN_REQUEST":
      return { ...state, loading: true, error: null };
    case "LOGIN_SUCCESS":
      return { ...state, loading: false, email: "", password: "" };
    case "LOGIN_FAILURE":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

const LoginScreen = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [isEmailFocused, setEmailFocused] = useState(false);
  const [isPasswordFocused, setPasswordFocused] = useState(false);
  const [secureText, setSecureText] = useState(true);
  const navigation = useNavigation();
  const { updateUser } = useUser();

  const checkForToken = async () => {
    try {
      let token = await AsyncStorage.getItem("admin-token");
      const decode = token ? jwt.jwtDecode(token) : null;
      console.log(decode);
      const body = {
        id: decode?.sub,
      };
      const response = await axios.post(
        `https://api.gms.intellx.in/manager/account`,
        body
      );
      updateUser({
        name: response.data.user.name,
        id: response.data.user.id,
        confirmed: true,
      });
      if (token) {
        router.replace("/Home");
      }
    } catch (error) {
      console.log("No token found");
    }
  };

  useEffect(() => {
    checkForToken();
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  const handleLogin = async () => {
    dispatch({ type: "LOGIN_REQUEST" });

    try {
      // Simulate API call
      let response = await axios.post(
        "https://api.gms.intellx.in/manager/login",
        {
          id: state.email,
          password: state.password,
        }
      );
      console.log(response.data);
      await AsyncStorage.setItem("admin-token", response.data.token);
      const token = await AsyncStorage.getItem("admin-token");
      console.log(token);
      dispatch({ type: "LOGIN_SUCCESS", payload: response.data });
      updateUser({
        name: response.data.user.name,
        id: response.data.user.id,
        confirmed: true,
      });
      router.replace("/Home");
    } catch (error) {
      dispatch({
        type: "LOGIN_FAILURE",
        payload: "Login failed. Please try again.",
      });
    }
  };

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={styles.scrollView}
      enableOnAndroid={true}
      extraHeight={100}
    >
      <View style={styles.container}>
        <Image
          source={require("../../assets/images/sigmalogo.png")}
          style={styles.logo}
        />

        <View style={{ padding: 20 }}>
          <Text style={styles.title}>Login</Text>
          <Text style={styles.subtitle}>Please sign in to continue.</Text>
        </View>
        <View
          style={[
            styles.inputContainer,
            isEmailFocused && styles.inputContainerFocused,
          ]}
        >
          <MaterialCommunityIcons name="email-outline" size={20} color="#999" />
          <TextInput
            style={styles.input}
            placeholder="Register Number"
            placeholderTextColor="#999"
            value={state.email}
            onFocus={() => setEmailFocused(true)}
            onBlur={() => setEmailFocused(false)}
            onChangeText={(text) =>
              dispatch({ type: "SET_EMAIL", payload: text })
            }
          />
        </View>
        <View
          style={[
            styles.inputContainer,
            isPasswordFocused && styles.inputContainerFocused,
          ]}
        >
          <MaterialCommunityIcons name="lock-outline" size={20} color="#999" />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#999"
            secureTextEntry={secureText}
            value={state.password}
            onFocus={() => setPasswordFocused(true)}
            onBlur={() => setPasswordFocused(false)}
            onChangeText={(text) =>
              dispatch({ type: "SET_PASSWORD", payload: text })
            }
          />
          <TouchableOpacity onPress={() => setSecureText(!secureText)}>
            <MaterialCommunityIcons
              name={secureText ? "eye" : "eye-off"}
              size={20}
              color="#999"
            />
          </TouchableOpacity>
        </View>
        {state.loading ? (
          <ActivityIndicator size="large" color="#8283e9" />
        ) : (
          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>LOGIN</Text>
          </TouchableOpacity>
        )}
        {state.error && <Text style={styles.errorText}>{state.error}</Text>}
        <TouchableOpacity
          onPress={() => router.push("/(tabs)/Signup")}
          style={{ position: "absolute", bottom: "4%" }}
        >
          <Text style={styles.signUpText}>
            Don't have an account?{" "}
            <Text style={styles.signUpLink}>Sign up</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    gap: 15,
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  logo: {
    width: 200, // Adjust the width as needed
    height: 200, // Adjust the height as needed
    marginBottom: "-20%",
    marginTop: "-50%", // Add some margin if needed
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    fontVariant: ["small-caps"],
    marginBottom: 5,
    marginLeft: "-40%",
  },
  subtitle: {
    fontSize: 16,
    color: "#999",
    marginBottom: 20,
    marginLeft: "-40%",
  },
  scrollView: {
    flexGrow: 1,
    padding: "2%",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "95%",
    borderColor: "#dddddd",
    borderBottomWidth: 2,
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  inputContainerFocused: {
    elevation: 5,
    shadowColor: "#dddddd",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
  },
  input: {
    flex: 1,
    height: 40,
    paddingHorizontal: 10,
    color: "#333",
    borderBlockColor: "#ddd",
  },
  forgotText: {
    color: "#ff9f00",
    fontSize: 14,
  },
  button: {
    backgroundColor: "#8283e9",
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
  signUpText: {
    fontSize: 14,
    color: "#999",
  },
  signUpLink: {
    color: "#8283e9",
  },
  errorText: {
    color: "red",
    marginTop: 10,
  },
});

export default LoginScreen;
