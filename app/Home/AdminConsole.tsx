import React, { useEffect, useState } from "react";
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Alert,
  ActivityIndicator, // Import ActivityIndicator for loading spinner
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
  const [loading, setLoading] = useState(true); // Add loading state for users
  const [loadingApproval, setLoadingApproval] = useState(false); // Add loading state for approval actions

  const GetApprovalUsers = async () => {
    setLoading(true); // Set loading to true before API call
    try {
      const response = await axios.get(
        "https://api.gms.intellx.in/manager/pending-approval"
      );
      setUser(response.data.users);
    } catch (error: any) {
      console.log("Error fetching users:", error);
      Alert.alert("Error fetching users:", error.message);
    } finally {
      setLoading(false); // Set loading to false after API call
    }
  };

  const ApproveUser = async (confkey: any) => {
    setLoadingApproval(true); // Set loadingApproval to true before API call
    try {
      await axios.get(`https://api.gms.intellx.in/manager/approve/${confkey}`);
      Alert.alert("User Approved");
      GetApprovalUsers(); // Refresh the list after approval
    } catch (error: any) {
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
    } finally {
      setLoadingApproval(false); // Set loadingApproval to false after API call
    }
  };

  const RejectUser = async (id: any) => {
    setLoadingApproval(true); // Set loadingApproval to true before API call
    try {
      await axios.delete(`https://api.gms.intellx.in/manager/reject/${id}`);
      Alert.alert("User Rejected");
      GetApprovalUsers(); // Refresh the list after rejection
    } catch (error: any) {
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
    } finally {
      setLoadingApproval(false); // Set loadingApproval to false after API call
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
            {loading ? ( // Show loading spinner if loading is true
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#555555" />
              </View>
            ) : user.length > 0 ? (
              user.map((u, i) => (
                <ApprovalCard
                  key={i}
                  user={u}
                  ApproveUser={ApproveUser}
                  RejectUser={RejectUser}
                />
              ))
            ) : (
              <View style={styles.noRequestsContainer}>
                <Text style={styles.noRequestsText}>
                  This is where you approve requests for administrator
                  registrations.
                </Text>
              </View>
            )}
          </SafeAreaView>
        </View>
      </ScrollView>
      {loadingApproval && ( // Show loading spinner for approval actions
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#555555" />
        </View>
      )}
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: Dimensions.get("window").height - 100, // Adjust based on your layout
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
});
