// src/components/DynamicForm.js
import React, { useState } from 'react';
import { Form, Button } from 'semantic-ui-react';

const DynamicForm = ({ form }) => {
  const [formData, setFormData] = useState({});

  const handleChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = () => {
    console.log("Form submitted:", formData);
    alert("Form submitted successfully! Check console.");
  };

  return (
    <Form onSubmit={handleSubmit}>
      {form.fields.map((field, idx) => {
        const { label, type, options } = field;
        const name = `field_${idx}`;

        if (type === 'text' || type === 'textarea') {
          return (
            <Form.Field key={idx}>
              <label>{label}</label>
              <Form.Input
                type="text"
                value={formData[name] || ''}
                onChange={(e) => handleChange(name, e.target.value)}
              />
            </Form.Field>
          );
        }

        if (type === 'radio') {
          return (
            <Form.Field key={idx}>
              <label>{label}</label>
              {options.map((opt, i) => (
                <Form.Radio
                  key={i}
                  label={opt}
                  name={name}
                  value={opt}
                  checked={formData[name] === opt}
                  onChange={(e, { value }) => handleChange(name, value)}
                />
              ))}
            </Form.Field>
          );
        }

        if (type === 'checkbox') {
          return (
            <Form.Field key={idx}>
              <label>{label}</label>
              {options.map((opt, i) => (
                <Form.Checkbox
                  key={i}
                  label={opt}
                  checked={formData[name]?.includes(opt)}
                  onChange={(e, { checked }) => {
                    const prev = formData[name] || [];
                    const next = checked
                      ? [...prev, opt]
                      : prev.filter((v) => v !== opt);
                    handleChange(name, next);
                  }}
                />
              ))}
            </Form.Field>
          );
        }

        if (type === 'select') {
          return (
            <Form.Field key={idx}>
              <label>{label}</label>
              <Form.Dropdown
                fluid
                selection
                options={options.map((opt) => ({ key: opt, text: opt, value: opt }))}
                value={formData[name] || ''}
                onChange={(e, { value }) => handleChange(name, value)}
              />
            </Form.Field>
          );
        }

        return null;
      })}

      <Button type="submit" color="green">Submit</Button>
    </Form>
  );
};

export default DynamicForm;
