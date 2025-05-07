import React, { useState, useContext } from "react";
import {
  Segment,
  Header,
  Form,
  Button,
  Dropdown,
  Grid,
} from "semantic-ui-react";
import { FormContext } from "../context/FormContext";
import FormPreview from "./FormPreview";
import FieldPropertyModal from "./FieldPropertyModal";

const questionTypeOptions = [
  { key: "text", text: "Text Field", value: "text" },
  { key: "textarea", text: "Textarea", value: "textarea" },
  { key: "radio", text: "Radio Buttons", value: "radio" },
  { key: "checkbox", text: "Checkbox", value: "checkbox" },
  { key: "dropdown", text: "Dropdown", value: "dropdown" },
  { key: "number", text: "Number Field", value: "number" },
  { key: "email", text: "Email Field", value: "email" },
  { key: "date", text: "Date Picker", value: "date" },
];

const AdminFormBuilder = ({
  selectedForm,
  forms,
  setForms,
  selectedFormId,
}) => {
  const [newSectionTitle, setNewSectionTitle] = useState("");
  const [activeSectionId, setActiveSectionId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedField, setSelectedField] = useState(null);
  const [selectedSectionId, setSelectedSectionId] = useState(null);

  const { addSectionToForm } = useContext(FormContext);
  const handleQuestionClick = (sectionId, questionId) => {
    const section = selectedForm.sections.find((s) => s.id === sectionId);
    const question = section.questions.find((q) => q.id === questionId);
    setSelectedField(question);
    setSelectedSectionId(sectionId);
    setModalOpen(true);
  };

  const handleModalSave = (updatedField) => {
    const updatedForms = forms.map((form) => {
      if (form.id === selectedFormId) {
        const updatedSections = form.sections.map((section) => {
          if (section.id === selectedSectionId) {
            const updatedQuestions = section.questions.map((q) =>
              q.id === updatedField.id ? updatedField : q
            );
            return { ...section, questions: updatedQuestions };
          }
          return section;
        });
        return { ...form, sections: updatedSections };
      }
      return form;
    });

    setForms(updatedForms);
    localStorage.setItem("forms", JSON.stringify(updatedForms));
    setModalOpen(false);
  };
  const handleAddSection = () => {
    if (newSectionTitle.trim() !== "") {
      const newSection = {
        id: Date.now(),
        sectionTitle: newSectionTitle.trim(),
        questions: [],
      };
      addSectionToForm(selectedFormId, newSection);
      setNewSectionTitle("");
    }
  };

  const handleAddFieldToSection = (type) => {
    if (!activeSectionId) {
      alert("Please select a section to add the field.");
      return;
    }

    const updatedForms = forms.map((form) => {
      if (form.id === selectedFormId) {
        const updatedSections = form.sections.map((section) => {
          if (section.id === activeSectionId) {
            const newQuestion = {
              id: Date.now(),
              label: `${type} field`,
              type,
              options:
                type === "radio" || type === "dropdown"
                  ? ["Option 1", "Option 2"]
                  : [],
            };
            return {
              ...section,
              questions: [...section.questions, newQuestion],
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
  };

  return (
    <>
      <Grid>
        <Grid.Column width={4}>
          <Segment>
            <Header as="h4">Add Section</Header>
            <Form>
              <Form.Input
                placeholder="Section Title"
                value={newSectionTitle}
                onChange={(e) => setNewSectionTitle(e.target.value)}
              />
              <Button color="blue" onClick={handleAddSection} fluid>
                Add Section
              </Button>
            </Form>
          </Segment>
          <Segment>
            <Header as="h4">Add Field</Header>
            {questionTypeOptions.map((opt) => (
              <Button
                key={opt.key}
                onClick={() => handleAddFieldToSection(opt.value)}
                style={{ margin: "0.25rem 0" }}
                fluid
              >
                {opt.text}
              </Button>
            ))}
          </Segment>
        </Grid.Column>

        <Grid.Column width={"12"}>
          <Header as="h3" style={{ textDecoration: "underline" }}>
            Live Preview
          </Header>
        {selectedForm?.sections?.length>0 ?  <Header as="h3" size="tiny" color="grey" style={{ marginTop: "-0.5rem" }}>
            Click on the below field types to open its editing options*
          </Header>
          : <Header as="h3" size="tiny" color="grey" style={{ marginTop: "-0.5rem" }}>
          Add sections from left menu by entering section's title and clicking on "Add Section" button to start creating your form.
        </Header>
}
          <FormPreview
            form={selectedForm}
            setActiveSectionId={setActiveSectionId}
            activeSectionId={activeSectionId}
            onQuestionClick={handleQuestionClick}
          />
        </Grid.Column>
      </Grid>
      <FieldPropertyModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleModalSave}
        field={selectedField}
      />
    </>
  );
};

export default AdminFormBuilder;
