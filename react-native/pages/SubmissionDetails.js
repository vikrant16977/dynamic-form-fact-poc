
import React from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";

const SubmissionDetail = ({ route }) => {
  const { submission, formStructure } = route.params;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>{submission.formTitle || "Submitted Form"}</Text>
      {formStructure?.sections?.map((section) => (
        <View key={section.id} style={styles.section}>
          <Text style={styles.sectionTitle}>{section.sectionTitle}</Text>
          {section.questions.map((q) => {
            const sectionResp = submission.responses?.[section.id] || {};
            const val = sectionResp[q.id];
            return (
              <View key={q.id} style={styles.questionContainer}>
                <Text style={styles.label}>{q.label}</Text>
                <Text style={styles.answer}>
                  {Array.isArray(val) ? val.join(", ") : val || "—"}
                </Text>
              </View>
            );
          })}
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