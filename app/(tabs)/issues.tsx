import React from "react";
import { ScrollView, Text, View, Dimensions, StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AntDesign } from '@expo/vector-icons'; // Import the necessary icon library

const { width, height } = Dimensions.get("window");

export default function Tab() {
  return (
    <ScrollView showsVerticalScrollIndicator={false}>
    <View style={styles.container}>
      <SafeAreaView style={{ paddingHorizontal: width * 0.025 }}>
        
          <View style={styles.header}>
            <TouchableOpacity style={styles.iconContainer}>
              <AntDesign name="left" size={15} color="#555555" />
            </TouchableOpacity>
            <Text style={styles.headingText}>To Do List</Text>
          </View>

          {/* Rectangular Components */}
          <View style={styles.card}>
            <Text style={styles.mainText}>Restroom Complaint</Text>

            {/* Date and Time */}
            <View style={styles.dateTimeContainer}>
              <View style={styles.dateTimeItem}>
                <Text style={styles.dateTimeHeading}>Block</Text>
                <Text style={styles.dateTimeValue}>J block</Text>
              </View>
              <View style={styles.dateTimeItem}>
                <Text style={styles.dateTimeHeading}>Type</Text>
                <Text style={styles.dateTimeValue}>Ladies</Text>
              </View>
            </View>
            <View style={styles.line}></View>
            
            {/* User and Date, Time */}
            <View style={styles.userDateTimeContainer}>
              <View style={styles.user}>
                <AntDesign name="user" size={20} color="#555555" />
                <Text style={styles.nameText}>Shreya Suresh</Text>
              </View>

              <View style={styles.dateTimeDetails}>
                <Text style={styles.dateTimeSmallText}>July 20, 10:00 AM</Text>
              </View>
            </View>

            {/* Subheading */}
            <Text style={styles.suHeadingText}></Text>
          </View>

          {/* Repeat for other cards */}
          <View style={styles.card}>
            <Text style={styles.mainText}>Restroom Complaint</Text>

            {/* Date and Time */}
            <View style={styles.dateTimeContainer}>
              <View style={styles.dateTimeItem}>
                <Text style={styles.dateTimeHeading}>Block</Text>
                <Text style={styles.dateTimeValue}>J block</Text>
              </View>
              <View style={styles.dateTimeItem}>
                <Text style={styles.dateTimeHeading}>Type</Text>
                <Text style={styles.dateTimeValue}>Ladies</Text>
              </View>
            </View>
            <View style={styles.line}></View>
            
            {/* User and Date, Time */}
            <View style={styles.userDateTimeContainer}>
              <View style={styles.user}>
                <AntDesign name="user" size={20} color="#555555" />
                <Text style={styles.nameText}>Shreya Suresh</Text>
              </View>

              <View style={styles.dateTimeDetails}>
                <Text style={styles.dateTimeSmallText}>July 20, 10:00 AM</Text>
              </View>
            </View>

            {/* Subheading */}
            <Text style={styles.suHeadingText}></Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.mainText}>Restroom Complaint</Text>

            {/* Date and Time */}
            <View style={styles.dateTimeContainer}>
              <View style={styles.dateTimeItem}>
                <Text style={styles.dateTimeHeading}>Block</Text>
                <Text style={styles.dateTimeValue}>J block</Text>
              </View>
              <View style={styles.dateTimeItem}>
                <Text style={styles.dateTimeHeading}>Type</Text>
                <Text style={styles.dateTimeValue}>Ladies</Text>
              </View>
            </View>
            <View style={styles.line}></View>
            
            {/* User and Date, Time */}
            <View style={styles.userDateTimeContainer}>
              <View style={styles.user}>
                <AntDesign name="user" size={20} color="#555555" />
                <Text style={styles.nameText}>Shreya Suresh</Text>
              </View>

              <View style={styles.dateTimeDetails}>
                <Text style={styles.dateTimeSmallText}>July 20, 10:00 AM</Text>
              </View>
            </View>

            {/* Subheading */}
            <Text style={styles.suHeadingText}></Text>
          </View>
        
      </SafeAreaView>
    </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  user: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: "#F2F2F2",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "4%",
    marginTop: '-10%', // Adjust padding above the header
  },
  iconContainer: {
    width: '8%',
    height: '120%',
    borderRadius: 20,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    position: 'absolute',
    left: width * 0.05,
    zIndex: 1,
    top: '-10%', // Ensure the icon container aligns with the top of the header
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 5, // Decrease padding below the date and time
  },
  dateTimeItem: {
    flex: 0.5,
  },
  dateTimeHeading: {
    marginLeft: '5%',
    fontSize: 16,
    fontWeight: "600",
    color: "#555",
    marginBottom: 5,
  },
  dateTimeValue: {
    marginLeft: '4%',
    fontSize: 16,
    color: "#333",
  },
  userDateTimeContainer: {
    flexDirection: 'column', // Stack items vertically
    alignItems: 'flex-start', // Align items to the start
  },
  dateTimeDetails: {
    marginLeft: 30, // Indent the dateTimeDetails from the user info
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
    marginLeft: 10,
  },
  suHeadingText: {
    fontSize: 14,
    color: "gray",
  },
});
