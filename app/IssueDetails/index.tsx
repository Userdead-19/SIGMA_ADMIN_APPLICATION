// app/details.tsx
import React, { useEffect, useState } from "react";
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  TextInput,
  Alert,
  Linking,
} from "react-native";
import { router, useGlobalSearchParams, useNavigation } from "expo-router";
import { AntDesign, Feather, SimpleLineIcons } from "@expo/vector-icons";
import axios from "axios";
import { useUser } from "@/Hooks/UserContext";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Appbar } from "react-native-paper";
import { BACKEND_URL } from "@/production.config";

const { width, height } = Dimensions.get("window");

interface Issue {
  _id: { $oid: string };
  issueNo: string;
  time: string;
  date: string;
  raised_by: { name: string; personId: string };
  issue: {
    issueLastUpdateTime: string;
    issueLastUpdateDate: string;
    issueType: string;
    issueCat: string;
    issueContent: string;
    block: string;
    floor: string;
    actionItem: string;
  };
  comments: {
    date: string;
    by: string;
    content: [
      {
        by: string;
        content: string;
      }
    ];
  }[];
  status: string;
  log: { date: string; action: string; by: string }[];
  survey: {
    Cleanliness: number;
    Functionality: number;
    Chair: number;
    Projector: number;
    Table: number;
    Urinals: number;
    Floor: number;
    Lights: number;
    Mirror: number;
    Toilets: number;
  };
  anonymity: string;
  assignee: string;
}

export default function IssueDetails() {
  const navigation = useNavigation();
  const user = useUser();
  const params = useGlobalSearchParams();
  let issue: Issue = params.issue
    ? JSON.parse(Array.isArray(params.issue) ? params.issue[0] : params.issue)
    : null;

  console.log(user);
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState(issue.comments);

  const getRatingText = (rating: number | null | undefined) => {
    if (rating === null || rating === undefined) {
      return "Unknown rating";
    }

    switch (rating) {
      case 1:
        return "Poor";
      case 2:
        return "Satisfactory";
      case 3:
        return "Average";
      default:
        return "Unknown rating";
    }
  };

  const handleAddComment = async () => {
    try {
      if (newComment.trim()) {
        let newCommentObj = {
          date: new Date().toLocaleString(),
          by: user.id, // replace with actual current user ID
          content: [{ by: user.id, content: newComment }],
        };

        // Prepare the request body
        const body = {
          user_id: user.id,
          content: newComment,
        };

        // Send the comment to the backend
        const response = await axios.post(
          `${BACKEND_URL}/task/add-comment/${issue.issueNo}`,
          body
        );

        // If successful, update the local state
        if (response.status === 200) {
          setComments((prevComments: any) => [...prevComments, newCommentObj]);
          console.log(comments);
          setNewComment(""); // Clear the input
          Alert.alert("Comment added successfully");
        }
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Axios Error:", error.response?.data || error.message);
        Alert.alert("Failed to add comment", `Error: ${error.message}`);
      } else {
        console.error("Unexpected Error:", error);
        Alert.alert("Failed to add comment", "An unexpected error occurred.");
      }
    }
  };

  const assignIssue = async () => {
    try {
      const body = {
        issueNo: issue.issueNo,
        assignee: user.id,
      };

      const response = await axios.post(
        `${BACKEND_URL}/client/assign_issue`,
        body
      );

      if (response.status === 200) {
        Alert.alert("Issue assigned successfully");
        issue.assignee = user.id;
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Axios Error:", error.response?.data || error.message);
        Alert.alert("Failed to assign issue", `Error: ${error.message}`);
      } else {
        console.error("Unexpected Error:", error);
        Alert.alert("Failed to assign issue", "An unexpected error occurred.");
      }
    }
  };

  React.useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  const reopenIssue = async () => {
    try {
      const body = {
        user_id: user.id,
      };
      const response = await axios.post(
        `${BACKEND_URL}/task/open/${issue.issueNo}`,
        body
      );
      if (response.status === 200) {
        Alert.alert("Issue has been reopened successfully");
        navigation.goBack();
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Axios Error:", error.response?.data || error.message);
        Alert.alert("Failed to reopen issue", `Error: ${error.message}`);
      } else {
        console.error("Unexpected Error:", error);
        Alert.alert("Failed to reopen issue", "An unexpected error occurred.");
      }
    }
  };

  const handlePrintToPDF = () => {
    const issueCode = `${issue?.issueNo}`; // Replace this with the actual issue code dynamically
    const pdfURL = `${BACKEND_URL}/task/export/${issueCode}`;
    Linking.openURL(pdfURL).catch((err) =>
      console.error("Failed to open URL:", err)
    );
  };

  const CloseIssue = async () => {
    try {
      const body = {
        user_id: user.id,
      };
      const response = await axios.post(
        `${BACKEND_URL}/task/close/${issue.issueNo}`,
        body
      );
      if (response.status === 200) {
        Alert.alert("Issue has been closed successfully");
        navigation.goBack();
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Axios Error:", error.response?.data || error.message);
        Alert.alert("Failed to close issue", `Error: ${error.message}`);
      } else {
        console.error("Unexpected Error:", error);
        Alert.alert("Failed to close issue", "An unexpected error occurred.");
      }
    }
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title="Sigma - GMS" />
      </Appbar.Header>
      <KeyboardAwareScrollView
        contentContainerStyle={styles.scrollView}
        enableOnAndroid={true}
        extraHeight={100}
      >
        <View style={styles.container}>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <View>
              <Text style={{ fontStyle: "italic", fontSize: 10 }}>
                Category
              </Text>
              <Text
                style={{ fontWeight: "bold", fontSize: 20, color: "black" }}
              >
                {issue?.issue.issueCat}
              </Text>
            </View>
            <View>
              {issue?.status === "CLOSE" ? (
                <Feather name="check-circle" size={27} color="green" />
              ) : (
                <SimpleLineIcons name="close" size={27} color="red" />
              )}
            </View>
          </View>
          <View
            style={{
              width: "100%",
              height: "0.1%",
              backgroundColor: "black",
              marginTop: 17,
            }}
          ></View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: 10,
            }}
          >
            <View>
              <Text>
                Lastly Updated Date : {issue?.issue.issueLastUpdateDate}{" "}
              </Text>
            </View>
            <View>
              <Text>Time : {issue?.issue.issueLastUpdateTime}</Text>
            </View>
          </View>
          <View style={{ marginTop: 20, gap: 10 }}>
            <Text style={styles.detailsText}>Issue ID: {issue?.issueNo}</Text>
            <Text style={styles.detailsText}>
              Raised By: {issue?.raised_by.name}
            </Text>
            <Text style={styles.detailsText}>
              Location: Floor:{issue?.issue.floor} - Block: {issue?.issue.block}
              -
              {issue?.issue.actionItem === "Restroom"
                ? "Restroom"
                : issue?.issue.actionItem === "Water Dispenser"
                ? "Dispenser NO"
                : "Room NO"}
              :
              {issue?.issue.actionItem === "Restroom"
                ? issue?.issue.issueContent
                : issue?.issue.actionItem === "Water Dispenser"
                ? issue?.issue.issueContent
                : issue?.issue.actionItem}
            </Text>

            <Text style={styles.detailsText}>
              Type: {issue?.issue.issueType}
            </Text>
            <Text style={styles.detailsText}>
              Content: {issue?.issue.issueContent}
            </Text>
            <Text style={styles.detailsText}>
              Action Item: {issue?.issue.actionItem}
            </Text>
            <Text style={styles.detailsText}>
              Assigned to :{" "}
              {!issue?.assignee ? "Not Assigned" : issue?.assignee}
            </Text>
            <Text style={styles.commentsHeading}>Survey Details</Text>
            <View
              style={{
                width: "100%",
                height: "0.1%",
                backgroundColor: "black",
                marginBottom: 10,
              }}
            ></View>
            {issue?.issue.issueType === "Complaint" ? (
              <Text>No survey details to display</Text>
            ) : (
              <>
                {issue?.issue.actionItem === "Classroom" && (
                  <>
                    <Text style={styles.detailsText}>
                      Table: {getRatingText(issue?.survey.Table)}
                    </Text>
                    <Text style={styles.detailsText}>
                      Chair: {getRatingText(issue?.survey.Chair)}
                    </Text>
                    <Text style={styles.detailsText}>
                      Projector: {getRatingText(issue?.survey.Projector)}
                    </Text>
                    <Text style={styles.detailsText}>
                      Cleanliness: {getRatingText(issue?.survey.Cleanliness)}
                    </Text>
                  </>
                )}
                {issue?.issue.actionItem === "Restroom" && (
                  <>
                    <Text style={styles.detailsText}>
                      Mirror & Washbasin: {getRatingText(issue?.survey.Mirror)}
                    </Text>
                    <Text style={styles.detailsText}>
                      Urinals: {getRatingText(issue?.survey.Urinals)}
                    </Text>
                    <Text style={styles.detailsText}>
                      Toilets: {getRatingText(issue?.survey.Toilets)}
                    </Text>
                    <Text style={styles.detailsText}>
                      Floor: {getRatingText(issue?.survey.Floor)}
                    </Text>
                    <Text style={styles.detailsText}>
                      Lights: {getRatingText(issue?.survey.Lights)}
                    </Text>
                  </>
                )}
                {issue?.issue.actionItem === "Department" && (
                  <>
                    <Text style={styles.detailsText}>
                      Cleanliness: {getRatingText(issue?.survey.Cleanliness)}
                    </Text>
                  </>
                )}
                {issue?.issue.actionItem === "Miscellaneous" && (
                  <Text>No survey details to display</Text>
                )}
                {issue?.issue.actionItem === "Water Dispenser" && (
                  <>
                    <Text>
                      Cleanliness: {getRatingText(issue?.survey.Cleanliness)}
                    </Text>
                    <Text>
                      Functionality:{" "}
                      {getRatingText(issue?.survey.Functionality)}
                    </Text>
                  </>
                )}
                {issue?.issue.actionItem === "Lift" && (
                  <Text>
                    Cleanliness: {getRatingText(issue?.survey.Cleanliness)}
                  </Text>
                )}
              </>
            )}
          </View>
          {issue?.status === "OPEN" ? (
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => {
                CloseIssue();
              }}
            >
              <Text style={styles.closeButtonText}>CLOSE THIS ISSUE</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => {
                reopenIssue();
              }}
            >
              <Text style={styles.closeButtonText}>REOPEN THIS ISSUE</Text>
            </TouchableOpacity>
          )}

          {issue.issue.issueType === "Complaint" &&
            (issue?.assignee === user.id || issue.assignee != null ? (
              <TouchableOpacity style={styles.closeButton} disabled={true}>
                <Text style={styles.closeButtonText}>ASSIGNED</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.closeButton}
                onPress={assignIssue}
              >
                <Text style={styles.closeButtonText}>ASSIGN ISSUE</Text>
              </TouchableOpacity>
            ))}
          <Text style={styles.commentsHeading}>COMMENTS</Text>
          {comments && comments.length > 0 ? (
            comments.map((comment, index) => (
              <View key={index} style={styles.commentBox}>
                <Text style={styles.commentUser}>{comment.by}</Text>
                <Text style={styles.commentContent}>{comment.date}</Text>

                {Array.isArray(comment.content) && comment.content.length > 0
                  ? comment.content.map((nestedComment, nestedIndex) => (
                      <View key={nestedIndex}>
                        <Text style={styles.commentContent}>
                          Comment : {nestedComment.content}
                        </Text>
                      </View>
                    ))
                  : null}
              </View>
            ))
          ) : (
            <Text style={{ alignSelf: "center", margin: 10 }}>
              No comments available
            </Text>
          )}

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textInput}
              value={newComment}
              onChangeText={setNewComment}
              placeholder="Add a comment"
            />
            <TouchableOpacity
              style={styles.addButton}
              onPress={handleAddComment}
            >
              <AntDesign name="plus" size={15} color="#555555" />
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={handlePrintToPDF}
          >
            <Text style={styles.closeButtonText}>Print Issue to PDF</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAwareScrollView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: "#FFFFFF",
    flexGrow: 1,
    padding: "2%",
    marginBottom: "5%",
  },
  container: {
    flex: 1,
    paddingTop: 40,
    paddingHorizontal: width * 0.05,
    backgroundColor: "#FFFFFF",
    minHeight: height,
  },
  closeButton: {
    borderWidth: 1,
    borderColor: "#DDE6F0",
    borderRadius: 10,
    padding: 10,
    backgroundColor: "#E6F0FF",
    alignItems: "center",
    marginBottom: 20,
    marginTop: 20,
  },
  closeButtonText: {
    fontSize: 16,
    color: "#003366",
  },
  commentsHeading: {
    fontSize: 15,
    fontWeight: "700",
    marginVertical: 10,
  },
  commentBox: {
    borderWidth: 1,
    borderColor: "#DDE6F0",
    borderRadius: 10,
    padding: 10,
    backgroundColor: "#FFFFFF",
    marginVertical: 10,
  },
  commentUser: {
    fontSize: 14,
    fontWeight: "600",
  },
  commentContent: {
    fontSize: 12,
    marginTop: 1,
  },
  inputContainer: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#DDE6F0",
    borderRadius: 10,
    padding: 10,
    backgroundColor: "#FFFFFF",
    marginTop: 20,
    alignItems: "center",
  },
  textInput: {
    flex: 1,
    marginRight: 10,
    fontSize: 12,
    color: "#333333",
  },
  addButton: {
    width: 30,
    height: 30,
    borderRadius: 20,
    backgroundColor: "#E6F0FF",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#DDE6F0",
  },
  logsContainer: {
    marginTop: 20,
  },
  logsHeading: {
    fontSize: 15,
    fontWeight: "700",
    marginVertical: 10,
  },
  logBox: {
    borderWidth: 1,
    borderColor: "#DDE6F0",
    borderRadius: 10,
    padding: 10,
    backgroundColor: "#FFFFFF",
    marginVertical: 10,
  },
  logDate: {
    fontSize: 12,
    fontWeight: "600",
  },
  logAction: {
    fontSize: 12,
    marginTop: 2,
  },
  logBy: {
    fontSize: 12,
    fontStyle: "italic",
  },
  detailsText: {
    fontSize: 14,
    marginBottom: 5,
  },
});
