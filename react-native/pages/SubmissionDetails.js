import React from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
const SubmissionDetail = ({ route }) => {
  const { submission } = route.params;

  let parsedSubmission = {};
  try {
    parsedSubmission = JSON.parse(submission.submission);
  } catch (e) {
    console.error("Failed to parse submission:", e);
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>{submission.formTitle || "Submitted Form"}</Text>
      {Object.entries(parsedSubmission).map(([sectionTitle, questions]) => (
        <View key={sectionTitle} style={styles.section}>
          <Text style={styles.sectionTitle}>{sectionTitle}</Text>
          {Object.entries(questions).map(([questionLabel, answer]) => (
            <View key={questionLabel} style={styles.questionContainer}>
              <Text style={styles.label}>{questionLabel}</Text>
              <Text style={styles.answer}>
                {Array.isArray(answer) ? answer.join(", ") : answer || "—"}
              </Text>
            </View>
          ))}
        </View>
      ))}
    </ScrollView>
  );
};


const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  header: { fontSize: 20, fontWeight: "bold", marginBottom: 16 },
  section: {
    marginBottom: 24,
    padding: 16,
    backgroundColor: "#f7f7f7",
    borderRadius: 8,
  },
  sectionTitle: {
    fontSize: 16,
    color: "#11329E",
    fontWeight: "bold",
    marginBottom: 10,
  },
  questionContainer: { marginBottom: 14 },
  label: { fontWeight: "600", marginBottom: 4 },
  answer: {
    fontSize: 16,
    color: "#333",
    backgroundColor: "#fff",
    padding: 8,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#ccc",
  },
});

export default SubmissionDetail;