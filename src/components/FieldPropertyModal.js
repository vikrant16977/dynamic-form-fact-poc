import React, { useState, useEffect } from "react";
import { Modal, Form, Button, TextArea } from "semantic-ui-react";

const FieldPropertyModal = ({ open, onClose, onSave, field }) => {
  const [label, setLabel] = useState("");
  const [placeholder, setPlaceholder] = useState("");
  const [options, setOptions] = useState("");

  useEffect(() => {
    if (field) {
      setLabel(field.label || "");
      setPlaceholder(field.placeholder || "");
      setOptions((field.options || []).join("\n"));
    }
  }, [field]);

  if (!field) return null; // ⛔️ prevent rendering when field is not set

  const handleSave = () => {
    const updatedField = {
      ...field,
      label,
      placeholder,
      options:
        field.type === "radio" ||
        field.type === "checkbox" ||
        field.type === "dropdown"
          ? options.split("\n").filter((opt) => opt.trim() !== "")
          : [],
    };
    onSave(updatedField);
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Modal.Header>Edit Field Properties</Modal.Header>
      <Modal.Content>
        <Form>
          <Form.Input
            label="Label"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
          />
          <Form.Input
            label="Placeholder"
            value={placeholder}
            onChange={(e) => setPlaceholder(e.target.value)}
          />
          {(field.type === "radio" ||
            field.type === "checkbox" ||
            field.type === "dropdown") && (
            <Form.Field>
              <label>Options (one per line)</label>
              <TextArea
                value={options}
                onChange={(e) => setOptions(e.target.value)}
              />
            </Form.Field>
          )}

          <Form.Checkbox
            label={{
              children: (
                <span style={{ color: "#333", fontWeight: "bold" }}>
                  Mandatory?
                </span>
              ),
            }}
            defaultChecked
            style={{ marginTop: "0.5rem" }}
          />
        </Form>
      </Modal.Content>
      <Modal.Actions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          style={{ backgroundColor: "#11329E", color: "white" }}
          onClick={handleSave}
        >
          Save
        </Button>
      </Modal.Actions>
    </Modal>
  );
};

export default FieldPropertyModal;
