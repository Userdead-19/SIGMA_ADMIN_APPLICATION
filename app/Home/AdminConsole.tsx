import React, { useEffect, useState } from "react";
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { FAB, Provider as PaperProvider } from "react-native-paper";
import ApprovalCard from "@/components/ApprovalCard";
import axios from "axios";

const { width } = Dimensions.get("window");

export default function Tab() {
  const navigation = useNavigation();
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState([]);

  const GetApprovalUsers = async () => {
    try {
      const response = await axios.get(
        "https://api.gms.intellx.in/manager/pending-approval"
      );
      setUser(response.data.users);
    } catch (error: any) {
      console.log("Error fetching users:", error);
      Alert.alert("Error fetching users:", error.message);
    }
  };

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
    GetApprovalUsers();
  }, []);

  return (
    <PaperProvider>
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
              <Text style={styles.headingText}>Admin Console</Text>
            </View>
            {user.length > 0 ? (
              user.map((u, i) => (
                <ApprovalCard
                  key={i}
                  user={u}
                  resetFunction={GetApprovalUsers}
                />
              ))
            ) : (
              <View style={styles.noRequestsContainer}>
                <Text style={styles.noRequestsText}>No requests pending</Text>
              </View>
            )}
          </SafeAreaView>
        </View>
      </ScrollView>
    </PaperProvider>
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
  noRequestsContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  noRequestsText: {
    fontSize: 16,
    color: "#555555",
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
  },
});
