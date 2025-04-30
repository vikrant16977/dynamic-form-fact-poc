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
} from "semantic-ui-react";
import { Link } from "react-router-dom";
import HeaderBar from "../components/HeaderBar";
import AdminFormBuilder from "../components/AdminFormBuilder";

// Inline form preview renderer (reuse logic from UserPage)
// Inline form preview renderer (reuse logic from UserPage)
const FormPreview = ({ form }) => {
  if (!form) return null;
  return (
    <Form>
      {form.sections.map((section) => (
        <Segment key={section.id} style={{ background: "#f7f7f7" }}>
          <Header as="h4" color="blue">
            {section.sectionTitle}
          </Header>
          <Grid columns={2} stackable>
            {section.questions.map((q) => (
              <Grid.Column key={q.id}>
                <Form.Field required>
                  <label>{q.label}</label>
                  {q.type === "text" && <Form.Input />}
                  {q.type === "textarea" && <Form.TextArea />}
                  {q.type === "radio" && (
                    <Form.Group inline>
                      {q.options.map((opt, i) => (
                        <Form.Radio key={i} label={opt} />
                      ))}
                    </Form.Group>
                  )}

                  {q.type === "checkbox" && (
                    <Form.Group inline>
                      {q.options.map((opt, i) => (
                        <Form.Checkbox key={i} label={opt} />
                      ))}
                    </Form.Group>
                  )}

                  {q.type === "dropdown" && (
                    <Dropdown
                      fluid
                      selection
                      options={q.options.map((opt, i) => ({
                        key: i,
                        text: opt,
                        value: opt,
                      }))}
                    />
                  )}
                  {q.type === "number" && <Form.Input type="number" />}
                  {q.type === "email" && <Form.Input type="email" />}
                  {q.type === "date" && <Form.Input type="date" />}
                  {q.type === "time" && <Form.Input type="time" />}
                </Form.Field>
              </Grid.Column>
            ))}
          </Grid>
        </Segment>
      ))}
    </Form>
  );
};

const AdminPage = () => {
  const { forms, setForms, selectedFormId, addNewForm, updateSelectedFormId } =
    useContext(FormContext);

  const [newFormTitle, setNewFormTitle] = useState("");
  const [previewVisible, setPreviewVisible] = useState(true);

  const handleCreateForm = () => {
    if (!newFormTitle.trim()) return;
    addNewForm(newFormTitle.trim());
    setNewFormTitle("");
    setPreviewVisible(false);
  };

  const selectedForm = forms.find((f) => f.id === selectedFormId);

  return (
    <>
      <HeaderBar />
      <Container style={{ marginTop: "10rem" }}>
        <Header as="h2" textAlign="center">
          Admin – Form Builder
        </Header>

        <Segment>
          <Form>
            <Form.Input
              placeholder="New Form Title"
              value={newFormTitle}
              onChange={(e) => setNewFormTitle(e.target.value)}
            />
            <Button primary onClick={handleCreateForm}>
              Create Form
            </Button>
          </Form>
        </Segment>

        {forms.length > 0 && (
          <Segment>
            <Form>
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
                  onChange={(_, { value }) => {
                    updateSelectedFormId(value);
                    setPreviewVisible(false);
                  }}
                />
              </Form.Field>
            </Form>
          </Segment>
        )}

        {selectedFormId && selectedForm && (
          <>
            <Button
              secondary
              style={{ marginBottom: "1rem" }}
              onClick={() => setPreviewVisible((v) => !v)}
            >
              {previewVisible ? "Hide Preview" : "Show Preview"}
            </Button>

            <Grid>
              <Grid.Column width={previewVisible ? 8 : 16}>
                <AdminFormBuilder
                  selectedForm={selectedForm}
                  forms={forms}
                  setForms={setForms}
                  selectedFormId={selectedFormId}
                />
              </Grid.Column>

              {previewVisible && (
                <Grid.Column width={8}>
                  <Segment>
                    <Header as="h3">Preview: {selectedForm.title}</Header>
                    <FormPreview form={selectedForm} />
                  </Segment>
                </Grid.Column>
              )}
            </Grid>

            <Link to="/form">
              <Button color="green" fluid style={{ marginTop: "1rem" }}>
                Go to User Form Page
              </Button>
            </Link>
          </>
        )}
      </Container>
    </>
  );
};

export default AdminPage;
