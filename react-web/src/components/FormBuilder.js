// src/components/FormBuilder.js
import React, { useState, useContext } from 'react';
import { Form, Button, Input, Dropdown, Label } from 'semantic-ui-react';
import { FormContext } from '../context/FormContext';

const fieldTypeOptions = [
  { key: 'text', text: 'Text Input', value: 'text' },
  { key: 'textarea', text: 'Textarea', value: 'textarea' },
  { key: 'radio', text: 'Radio Group', value: 'radio' },
  { key: 'checkbox', text: 'Checkbox Group', value: 'checkbox' },
  { key: 'select', text: 'Dropdown Select', value: 'select' },
];

const FormBuilder = () => {
  const { addFieldToForm, activeFormId } = useContext(FormContext);
  const [label, setLabel] = useState('');
  const [type, setType] = useState('');
  const [optionsText, setOptionsText] = useState('');

  const handleAddField = () => {
    if (!label || !type) return;

    const field = {
      label,
      type,
      options: ['radio', 'checkbox', 'select'].includes(type)
        ? optionsText.split(',').map(opt => opt.trim())
        : [],
    };

    addFieldToForm(activeFormId, field);

    // Clear inputs
    setLabel('');
    setType('');
    setOptionsText('');
  };

  return (
    <Form>
      <Form.Field>
        <label>Field Label</label>
        <Input
          placeholder="e.g. Full Name"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
        />
      </Form.Field>

      <Form.Field>
        <label>Field Type</label>
        <Dropdown
          placeholder="Select Type"
          fluid
          selection
          options={fieldTypeOptions}
          value={type}
          onChange={(e, { value }) => setType(value)}
        />
      </Form.Field>

      {['radio', 'checkbox', 'select'].includes(type) && (
        <Form.Field>
          <label>Options (comma separated)</label>
          <Input
            placeholder="Option1, Option2, Option3"
            value={optionsText}
            onChange={(e) => setOptionsText(e.target.value)}
          />
        </Form.Field>
      )}

      <Button type="button" color="blue" onClick={handleAddField}>
        Add Field
      </Button>
    </Form>
  );
};

export default FormBuilder;
