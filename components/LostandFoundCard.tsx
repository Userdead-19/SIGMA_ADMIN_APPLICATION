import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image,
} from "react-native";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { ArrowUpRightIcon, UserIcon } from "react-native-heroicons/outline";
import tw from "twrnc";
import { router } from "expo-router";
const { width } = Dimensions.get("window");

// interface Issue {
//   _id: { $oid: string };
//   issueNo: string;
//   time: string;
//   date: string;
//   raised_by: { name: string; personId: string };
//   issue: {
//     issueLastUpdateTime: string;
//     issueLastUpdateDate: string;
//     issueType: string;
//     issueCat: string;
//     issueContent: string;
//     block: string;
//     floor: string;
//     actionItem: string;
//   };
//   comments: { date: string; by: string; content: string }[];
//   status: string;
//   log: { date: string; action: string; by: string }[];
//   survey: {};
//   anonymity: string;
// }

const LostandFoundCard = ({ item: issue }: { item: any }) => (
  <View style={styles.cardContainer}>
    <View style={styles.rowContainer}>
      <View style={styles.imageContainer}>
        {issue?.images?.length > 0 ? (
          issue.images.map((image: any, index: any) => (
            <Image key={index} source={{ uri: image }} style={styles.image} />
          ))
        ) : (
          <Text>No images attached.</Text>
        )}
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.cardTitle}>{issue.item_details.item_name}</Text>
        <View style={styles.rowContainer}>
          <View style={styles.infoBlock}>
            <Text style={styles.infoHeading}>Last Seen</Text>
            <Text
              style={styles.infoContent}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {issue.last_seen_location}
            </Text>
          </View>
          <View style={styles.infoBlock}>
            <Text style={styles.infoHeading}>Date Lost</Text>
            <Text
              style={styles.infoContent}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {issue.date_lost}
            </Text>
          </View>
        </View>
      </View>
    </View>
    <View style={styles.divider} />
    <View style={styles.userContainer}>
      <Ionicons name="person-circle" size={40} color="gray" />
      <View style={styles.userInfo}>
        <Text style={styles.userName} numberOfLines={1}>
          {issue.name}
        </Text>
        <Text style={styles.userRollNo} numberOfLines={1}>
          {issue.roll_no}
        </Text>
      </View>
      <TouchableOpacity
        style={styles.button}
        onPress={() =>
          router.push({
            pathname: "/IssueDetails/LostandFoundDetails",
            params: { issue: JSON.stringify(issue) },
          })
        }
      >
        <View>
          <Text style={styles.userI}>View More</Text>
        </View>
      </TouchableOpacity>
    </View>
  </View>
);

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: "#FFFFFF",
    flexGrow: 1,
    padding: "2%",
    marginBottom: "12%",
  },
  // addButton: {
  //   position: "absolute",
  //   bottom:'-4%',
  //   right: 20,
  //   alignItems: "center",
  //   justifyContent: "center",
  // },
  cardContainer: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
    textTransform: "uppercase",
    color: "#333",
  },
  rowContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    marginBottom: 8,
    gap: 16,
  },
  infoBlock: {
    flex: 1,
  },
  infoHeading: {
    fontSize: 12,
    color: "gray",
    marginBottom: 4,
  },
  infoContent: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
  divider: {
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
    marginVertical: 8,
  },
  userContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  userInfo: {
    marginLeft: 16,
    flex: 1,
  },
  userI: {
    color: "#fff",
    fontSize: 9,
    textAlign: "center",
  },
  userName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  userRollNo: {
    fontSize: 12,
    color: "gray",
  },
  button: {
    backgroundColor: "#8283e9",
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 10,
    alignSelf: "flex-start",
    marginTop: "3%",
  },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e6e6e4",
    borderRadius: 8,
    paddingHorizontal: 8,
    flex: 1,
  },
  addButton: {
    marginLeft: 8,
  },

  // searchContainer: {
  //   flexDirection: "row",
  //   alignItems: "center",
  //   backgroundColor: "#e6e6e4",
  //   borderRadius: 8,
  //   paddingHorizontal: 8,
  //   marginVertical: 16,
  // },
  searchIcon: {
    marginRight: 8,
  },
  imageContainer: {
    flex: 0.3,
    marginRight: 16,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  textContainer: {
    flex: 0.7,
    flexDirection: "column",
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 14,
    color: "#333",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  loaderContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40,
  },
  noComplaintsText: {
    textAlign: "center",
    marginTop: 20,
    color: "#555",
    fontSize: 16,
  },
});
export default LostandFoundCard;
