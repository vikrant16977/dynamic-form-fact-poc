// src/pages/UserPage.js
import React, { useContext, useState } from 'react';
import { Container, Header, Dropdown, Button } from 'semantic-ui-react';
import { FormContext } from '../context/FormContext';
import DynamicForm from '../components/DynamicForm';
import { Link } from 'react-router-dom';

const UserPage = () => {
  const { forms } = useContext(FormContext);
  const [selectedFormId, setSelectedFormId] = useState(null);

  const selectedForm = forms.find((f) => f.id === selectedFormId);

  const formOptions = forms.map((form) => ({
    key: form.id,
    text: form.title,
    value: form.id,
  }));

  return (
    <Container style={{ marginTop: '2em' }}>
      <Button as={Link} to="/admin" color="blue" icon="arrow left" content="Back to Admin" />
      <Header as="h2">User - Fill a Form</Header>

      <Dropdown
        placeholder="Select a Form"
        fluid
        selection
        options={formOptions}
        value={selectedFormId}
        onChange={(e, { value }) => setSelectedFormId(value)}
        style={{ marginBottom: '2em' }}
      />

      {selectedForm ? (
        <DynamicForm form={selectedForm} />
      ) : (
        <p>Please select a form to begin.</p>
      )}
    </Container>
  );
};

export default UserPage;
