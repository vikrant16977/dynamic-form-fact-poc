import React, { useContext, useState } from "react";
import { FormContext } from "../context/FormContext";
import {
  Container,
  Header,
  Form,
  Button,
  Dropdown,
  Segment,
} from "semantic-ui-react";
import { Link } from "react-router-dom";

const AdminPage = () => {
  const {
    forms,
    addNewForm,
    addSectionToForm,
    selectedFormId,
    updateSelectedFormId,
    getSelectedForm,
    setForms,
  } = useContext(FormContext);

  const [newFormTitle, setNewFormTitle] = useState("");
  const [newSectionTitle, setNewSectionTitle] = useState("");
  const [newQuestionDetails, setNewQuestionDetails] = useState({});

  const selectedForm = getSelectedForm();

  const handleCreateForm = () => {
    if (newFormTitle.trim() !== "") {
      addNewForm(newFormTitle.trim());
      setNewFormTitle("");
    }
  };

  const handleAddSection = () => {
    if (newSectionTitle.trim() !== "") {
      const newSection = {
        id: Date.now(), // Unique ID for section
        sectionTitle: newSectionTitle.trim(),
        questions: [],
      };
      addSectionToForm(selectedFormId, newSection);
      setNewSectionTitle("");
    }
  };

  const handleAddQuestion = (sectionId) => {
    const details = newQuestionDetails[sectionId];
    if (details && details.label.trim() !== "") {
      const updatedForms = forms.map((form) => {
        if (form.id === selectedFormId) {
          const updatedSections = form.sections.map((section) => {
            if (section.id === sectionId) {
              const newQuestion = {
                id: Date.now(), // Unique ID
                label: details.label.trim(),
                type: details.type,
                options:
                  details.type === "radio" || details.type === "dropdown"
                    ? details.options.split(",").map((opt) => opt.trim())
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

      // Clear only the question input for this section
      setNewQuestionDetails((prev) => ({
        ...prev,
        [sectionId]: { label: "", type: "text", options: "" },
      }));
    }
  };

  return (
    <Container style={{ marginTop: "2rem" }}>
      <Header as="h1" textAlign="center" dividing>
        Admin - Create/Edit Forms
      </Header>

      {/* Create New Form */}
      <Segment>
        <Header as="h3">Create New Form</Header>
        <Form>
          <Form.Input
            placeholder="Enter form title"
            value={newFormTitle}
            onChange={(e) => setNewFormTitle(e.target.value)}
          />
          <Button color="green" onClick={handleCreateForm}>
            Create Form
          </Button>
        </Form>
      </Segment>

      {/* Select Existing Form */}
      {forms.length > 0 && (
        <Segment>
          <Header as="h3">Select Form</Header>
          <Dropdown
            placeholder="Select a form"
            fluid
            selection
            options={forms.map((form) => ({
              key: form.id,
              text: form.title,
              value: form.id,
            }))}
            value={selectedFormId}
            onChange={(e, { value }) => updateSelectedFormId(value)}
          />
        </Segment>
      )}

      {/* Add Section */}
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

      {/* Add Question */}
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
                  value={newQuestionDetails[section.id]?.label || ""}
                  onChange={(e) =>
                    setNewQuestionDetails((prev) => ({
                      ...prev,
                      [section.id]: {
                        ...(prev[section.id] || {}),
                        label: e.target.value,
                      },
                    }))
                  }
                />
                <Form.Select
                  placeholder="Select question type"
                  options={[
                    { key: "text", text: "Text Field", value: "text" },
                    { key: "textarea", text: "Textarea", value: "textarea" },
                    { key: "radio", text: "Radio Buttons", value: "radio" },
                    { key: "checkbox", text: "Checkbox", value: "checkbox" },
                    { key: "dropdown", text: "Dropdown Select", value: "dropdown" },
                    { key: "number", text: "Number Field", value: "number" },
                    { key: "email", text: "Email Field", value: "email" },
                    { key: "date", text: "Date Picker", value: "date" },
                  ]}
                  value={newQuestionDetails[section.id]?.type || "text"}
                  onChange={(e, { value }) =>
                    setNewQuestionDetails((prev) => ({
                      ...prev,
                      [section.id]: {
                        ...(prev[section.id] || {}),
                        type: value,
                      },
                    }))
                  }
                />
                {(newQuestionDetails[section.id]?.type === "radio" ||
                  newQuestionDetails[section.id]?.type === "dropdown") && (
                  <Form.Input
                    placeholder="Enter options comma separated"
                    value={newQuestionDetails[section.id]?.options || ""}
                    onChange={(e) =>
                      setNewQuestionDetails((prev) => ({
                        ...prev,
                        [section.id]: {
                          ...(prev[section.id] || {}),
                          options: e.target.value,
                        },
                      }))
                    }
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

      {/* Form Preview */}
      {selectedForm && (
        <Segment>
          <Header as="h3">Preview: {selectedForm.title}</Header>
          {selectedForm.sections.map((section) => (
            <Segment key={section.id} style={{ backgroundColor: "#f1f1f1" }}>
              <Header as="h4" color="blue">
                {section.sectionTitle}
              </Header>
              {section.questions.map((question) => (
                <Form.Field key={question.id}>
                  <label>{question.label}</label>
                  {question.type === "text" && (
                    <Form.Input placeholder={question.label} />
                  )}
                  {question.type === "textarea" && (
                    <Form.TextArea placeholder={question.label} />
                  )}
                  {question.type === "radio" &&
                    question.options.map((option, index) => (
                      <Form.Radio key={index} label={option} />
                    ))}
                  {question.type === "checkbox" &&
                    question.options.map((option, index) => (
                      <Form.Checkbox key={index} label={option} />
                    ))}
                  {question.type === "dropdown" && (
                    <Dropdown
                      placeholder={question.label}
                      fluid
                      selection
                      options={question.options.map((option, index) => ({
                        key: index,
                        text: option,
                        value: option,
                      }))}
                    />
                  )}
                  {question.type === "number" && (
                    <Form.Input type="number" placeholder={question.label} />
                  )}
                  {question.type === "email" && (
                    <Form.Input type="email" placeholder={question.label} />
                  )}
                  {question.type === "date" && (
                    <Form.Input type="date" placeholder={question.label} />
                  )}
                </Form.Field>
              ))}
            </Segment>
          ))}
        </Segment>
      )}

      <Link to="/form">
        <Button color="green" fluid style={{ marginTop: "2rem" }}>
          Go to Form Page
        </Button>
      </Link>
    </Container>
  );
};

export default AdminPage;
