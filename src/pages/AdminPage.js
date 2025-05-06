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
} from "semantic-ui-react";
import { Link } from "react-router-dom";
import HeaderBar from "../components/HeaderBar";
import AdminFormBuilder from "../components/AdminFormBuilder";

const AdminPage = () => {
  const { forms, setForms, selectedFormId, addNewForm, updateSelectedFormId } =
    useContext(FormContext);
  const [newFormTitle, setNewFormTitle] = useState("");
  const selectedForm = forms.find((f) => f.id === selectedFormId);

  const handleCreateForm = () => {
    if (!newFormTitle.trim()) return;
    addNewForm(newFormTitle.trim());
    setNewFormTitle("");
  };
  const newForm = localStorage.getItem("newForm");
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
                <Button color="grey" style={{ marginRight: "1rem" }}>
                  Discard
                </Button>
                <Button color="blue" onClick={handleCreateForm}>
                  Create
                </Button>
              </Grid.Column>
            </Grid>
          ) : (
            <Grid columns={2} verticalAlign="middle">
              <Grid.Column>
                <Header as="h2">Form Editor</Header>
              </Grid.Column>{" "}
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
              <Link to="/form">
                <Button color="green" fluid style={{ marginTop: "1rem" }}>
                  Go to User Form Page
                </Button>
              </Link>
            </Grid.Column>
          </Grid>
        )}
      </Container>
    </>
  );
};

export default AdminPage;
