// src/pages/AdminPage.js
import React, { useContext, useState } from "react";
import { FormContext } from "../context/FormContext";
import {
  Container,
  Header,
  Form,
  Button,
  Dropdown,
  Segment,
  Grid,
  Divider,
  Icon,
} from "semantic-ui-react";
import { Link, useNavigate } from "react-router-dom";
import HeaderBar from "../components/HeaderBar";
import AdminFormBuilder from "../components/AdminFormBuilder";

const AdminPage = () => {
  const navigate = useNavigate();
  const { forms, setForms, selectedFormId, addNewForm, updateSelectedFormId } =
    useContext(FormContext);
  const [newFormTitle, setNewFormTitle] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const selectedForm = forms.find((f) => f.id === selectedFormId);
  const newForm = localStorage.getItem("newForm");

  const handleCreateForm = () => {
    if (!newFormTitle.trim()) return;
    addNewForm(newFormTitle.trim());
    setNewFormTitle("");
  };

const generateShortId = (prefix) => {
  const random = Math.random().toString(36).substring(2, 4); // 2 characters
  return `${prefix}${random}`; // e.g., fz9
};

  const handleConfirmForm = async () => {
    if (!selectedForm) {
      alert("No form selected to submit.");
      return;
    }

    const payload = {
     
      ID: Math.floor(Math.random() * 10000) ,
      title: selectedForm.title,
      description: selectedForm.description || "Form created via builder",
      schema: JSON.stringify(selectedForm),
    };

    setIsSubmitting(true);
    try {
      const response = await fetch("https://dynamicformbackend.onrender.com/odata/v4/catalog/Forms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Form submitted successfully:", result);
        alert("Form submitted successfully!");
      } else {
        console.error("Failed to submit form:", response.statusText);
        alert("Failed to submit form.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Error submitting form.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <HeaderBar />
      <Container style={{ marginTop: "6rem" }}>
        <Segment>
          {newForm === "true" ? (
            <Grid columns={2} verticalAlign="middle">
              <Grid.Column>
                <Header as="h2">Form Builder</Header>
              </Grid.Column>

              <Grid.Column textAlign="right">
                <Button
                  color="grey"
                  style={{ marginRight: "1rem" }}
                  onClick={() => navigate("/home")}
                >
                  Back
                </Button>
                <Button
                  color="blue"
                  style={{ marginRight: "1rem" }}
                  onClick={handleCreateForm}
                >
                  Create
                </Button>
                <Button
                  color="green"
                  onClick={handleConfirmForm}
                  loading={isSubmitting}
                  disabled={isSubmitting}
                >
                  <Icon name="check" />
                  Confirm & Submit
                </Button>
              </Grid.Column>
            </Grid>
          ) : (
            <Grid columns={2} verticalAlign="middle">
              <Grid.Column>
                <Header as="h2">Form Editor</Header>
              </Grid.Column>
            </Grid>
          )}
          <Divider />

          {newForm === "true" && (
            <Form>
              <Form.Input
                placeholder="Form Title"
                value={newFormTitle}
                onChange={(e) => setNewFormTitle(e.target.value)}
              />
            </Form>
          )}

          {forms.length > 0 && (
            <Form style={{ marginTop: "1rem" }}>
              <Form.Field>
                <label>Select Form to Edit</label>
                <Dropdown
                  placeholder="Select a form"
                  fluid
                  selection
                  options={forms.map((f) => ({
                    key: f.id,
                    text: f.title,
                    value: f.id,
                  }))}
                  value={selectedFormId}
                  onChange={(_, { value }) => updateSelectedFormId(value)}
                />
              </Form.Field>
            </Form>
          )}
        </Segment>

        {selectedFormId && selectedForm && (
          <Grid>
            <Grid.Column width={"16"}>
              <AdminFormBuilder
                selectedForm={selectedForm}
                forms={forms}
                setForms={setForms}
                selectedFormId={selectedFormId}
              />
            </Grid.Column>
          </Grid>
        )}
      </Container>
    </>
  );
};

export default AdminPage;
