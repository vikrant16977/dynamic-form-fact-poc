
import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { FormContext } from "../context/FormContext";

const MySubmissions = () => {
  const [submissions, setSubmissions] = useState([]);
  const navigation = useNavigation();
  const { forms } = useContext(FormContext);

  useEffect(() => {
    const loadSubmissions = async () => {
      const data = await AsyncStorage.getItem("submitted_forms");
      if (data) setSubmissions(JSON.parse(data));
    };
    loadSubmissions();
  }, []);

  const getFormStructureById = (formId) => {
    return forms.find((f) => f.id === formId);
  };

  const renderItem = ({ item }) => {
    const formStructure = getFormStructureById(item.formId);
    return (
      <TouchableOpacity
        style={styles.item}
        onPress={() =>
          navigation.navigate("SubmissionDetail", {
            submission: item,
            formStructure: formStructure,
          })
        }
      >
        <Text style={styles.title}>{item.formTitle || "Untitled Form"}</Text>
        <Text>{new Date(item.date).toLocaleString()}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>My Submitted Forms</Text>
      <FlatList
        data={submissions}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  header: { fontSize: 20, fontWeight: "bold", marginBottom: 12 },
  item: {
    padding: 12,
    borderBottomWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#f9f9f9",
    borderRadius: 6,
    marginBottom: 8,
  },
  title: { fontWeight: "bold", fontSize: 16 },
});

export default MySubmissions;
