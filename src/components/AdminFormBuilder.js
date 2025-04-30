import React, { useState, useContext } from "react";
import {
  Segment,
  Header,
  Form,
  Button,
  Dropdown
} from "semantic-ui-react";
import { FormContext } from "../context/FormContext";

const questionTypeOptions = [
  { key: "text", text: "Text Field", value: "text" },
  { key: "textarea", text: "Textarea", value: "textarea" },
  { key: "radio", text: "Radio Buttons", value: "radio" },
  { key: "checkbox", text: "Checkbox", value: "checkbox" },
  { key: "dropdown", text: "Dropdown", value: "dropdown" },
  { key: "number", text: "Number Field", value: "number" },
  { key: "email", text: "Email Field", value: "email" },
  { key: "date", text: "Date Picker", value: "date" }
];

const AdminFormBuilder = ({ selectedForm, forms, setForms, selectedFormId }) => {
  const [newSectionTitle, setNewSectionTitle] = useState("");
  const [questionLabel, setQuestionLabel] = useState("");
  const [questionType, setQuestionType] = useState("text");
  const [questionOptions, setQuestionOptions] = useState("");

  const { addSectionToForm } = useContext(FormContext);

  const handleAddSection = () => {
    if (newSectionTitle.trim() !== "") {
      const newSection = {
        id: Date.now(),
        sectionTitle: newSectionTitle.trim(),
        questions: []
      };
      addSectionToForm(selectedFormId, newSection);
      setNewSectionTitle("");
    }
  };

  const handleAddQuestion = (sectionId) => {
    if (questionLabel.trim() !== "") {
      const updatedForms = forms.map((form) => {
        if (form.id === selectedFormId) {
          const updatedSections = form.sections.map((section) => {
            if (section.id === sectionId) {
              const newQuestion = {
                id: Date.now(),
                label: questionLabel.trim(),
                type: questionType,
                options:
                  questionType === "radio" || questionType === "dropdown"
                    ? questionOptions.split(",").map((opt) => opt.trim())
                    : []
              };
              return {
                ...section,
                questions: [...section.questions, newQuestion]
              };
            }
            return section;
          });
          return { ...form, sections: updatedSections };
        }
        return form;
      });
      setForms(updatedForms);
      localStorage.setItem("forms", JSON.stringify(updatedForms));
      setQuestionLabel("");
      setQuestionType("text");
      setQuestionOptions("");
    }
  };

  return (
    <>
      {selectedForm && (
        <Segment>
          <Header as="h3">Add Section to {selectedForm.title}</Header>
          <Form>
            <Form.Input
              placeholder="Enter section title"
              value={newSectionTitle}
              onChange={(e) => setNewSectionTitle(e.target.value)}
            />
            <Button color="blue" onClick={handleAddSection}>
              Add Section
            </Button>
          </Form>
        </Segment>
      )}

      {selectedForm && selectedForm.sections.length > 0 && (
        <Segment>
          <Header as="h3">Add Question</Header>
          {selectedForm.sections.map((section) => (
            <Segment key={section.id} style={{ backgroundColor: "#f9f9f9" }}>
              <Header as="h4" color="teal">
                Section: {section.sectionTitle}
              </Header>
              <Form>
                <Form.Input
                  placeholder="Question label"
                  value={questionLabel}
                  onChange={(e) => setQuestionLabel(e.target.value)}
                />
                <Form.Select
                  placeholder="Select question type"
                  options={questionTypeOptions}
                  value={questionType}
                  onChange={(e, { value }) => setQuestionType(value)}
                />
                {(questionType === "radio" || questionType === "dropdown") && (
                  <Form.Input
                    placeholder="Enter options comma separated"
                    value={questionOptions}
                    onChange={(e) => setQuestionOptions(e.target.value)}
                  />
                )}
                <Button
                  color="purple"
                  onClick={() => handleAddQuestion(section.id)}
                  style={{ marginTop: "1rem" }}
                >
                  Add Question
                </Button>
              </Form>
            </Segment>
          ))}
        </Segment>
      )}
    </>
  );
};

export default AdminFormBuilder;