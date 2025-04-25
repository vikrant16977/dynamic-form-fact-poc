// src/pages/AdminPage.js
import React, { useContext, useState } from 'react';
import { Container, Header, Divider, List, Button, Input, Segment } from 'semantic-ui-react';
import { FormContext } from '../context/FormContext';
import FormBuilder from '../components/FormBuilder';
import { Link } from 'react-router-dom';

const AdminPage = () => {
  const {
    forms,
    createNewForm,
    activeFormId,
    setActiveFormId,
    getActiveForm
  } = useContext(FormContext);

  const [newFormTitle, setNewFormTitle] = useState("");

  const handleCreateForm = () => {
    if (newFormTitle.trim()) {
      createNewForm(newFormTitle);
      setNewFormTitle("");
    }
  };

  const activeForm = getActiveForm();

  return (
    <Container style={{ marginTop: '2em' }}>
      <Header as="h2">Admin - Form Manager</Header>

      <Segment>
        <Input
          placeholder="New Form Title"
          value={newFormTitle}
          onChange={(e) => setNewFormTitle(e.target.value)}
        />
        <Button onClick={handleCreateForm} color="green" style={{ marginLeft: '1em' }}>
          Create Form
        </Button>
      </Segment>

      <Header as="h4">Your Forms:</Header>
      <List divided relaxed>
        {forms.map((form) => (
          <List.Item key={form.id}>
            <List.Content floated="right">
              <Button
                size="mini"
                onClick={() => setActiveFormId(form.id)}
                color={form.id === activeFormId ? "blue" : "grey"}
              >
                Edit
              </Button>
            </List.Content>
            <List.Content>
              <List.Header>{form.title}</List.Header>
              <List.Description>{form.fields.length} field(s)</List.Description>
            </List.Content>
          </List.Item>
        ))}
      </List>

      <Divider />

      {activeForm ? (
        <>
          <Header as="h3">Editing: {activeForm.title}</Header>
          <FormBuilder />
        </>
      ) : (
        <p>Select a form to edit its fields</p>
      )}

      <Divider />
      <Button as={Link} to="/form" color="teal">
        Go to User Form →
      </Button>
    </Container>
  );
};

export default AdminPage;
