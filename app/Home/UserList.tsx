import React, { useState } from "react";
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
import { FAB, Provider as PaperProvider } from "react-native-paper";
import UserCard from "@/components/UserCard";
import { router } from "expo-router";

const { width } = Dimensions.get("window");

const user = [
  {
    _id: "63bad9d81a86f91ef7fcce56",
    name: "Sanjith T",
    id: "20PW32",
    hashword: "d63dc919e201d7bc4c825630d2cf25fdc93d4b2f0d46706d29038d01",
    confirmed: true,
    confkey: "7366B4EB",
  },
  {
    _id: "63c0a1a1b4e3d3eecf1d3d23",
    name: "John Doe",
    id: "20PW01",
    hashword: "d41d8cd98f00b204e9800998ecf8427e",
    confirmed: true,
    confkey: "12345ABC",
  },
  {
    _id: "63c0a1b2b4e3d3eecf1d3d24",
    name: "Jane Smith",
    id: "20PW02",
    hashword: "098f6bcd4621d373cade4e832627b4f6",
    confirmed: true,
    confkey: "67890DEF",
  },
  {
    _id: "63c0a1c3b4e3d3eecf1d3d25",
    name: "Alice Johnson",
    id: "20PW03",
    hashword: "5f4dcc3b5aa765d61d8327deb882cf99",
    confirmed: false,
    confkey: "11223AAA",
  },
  {
    _id: "63c0a1c3b4e3d3eecf1d3d25",
    name: "Alice Johnson",
    id: "20PW03",
    hashword: "5f4dcc3b5aa765d61d8327deb882cf99",
    confirmed: false,
    confkey: "11223AAA",
  },
];

export default function Tab() {
  const navigation = useNavigation();
  const [open, setOpen] = useState(false);

  navigation.setOptions({
    headerShown: false,
  });

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
              <Text style={styles.headingText}>User Details</Text>
            </View>
            {user.map((u, i) => (
              <UserCard key={i} user={u} />
            ))}
          </SafeAreaView>
        </View>
      </ScrollView>
      <FAB
        style={styles.fab}
        icon={open ? "minus" : "plus"}
        onPress={() => {
          router.push({ pathname: "/Home/AddUser" });
        }}
      />
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
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
  },
});
