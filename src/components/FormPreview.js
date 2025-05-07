// src/components/FormPreview.js
import React from "react";
import { Form, Dropdown, Segment, Grid, Header } from "semantic-ui-react";

const FormPreview = ({ form, setActiveSectionId, activeSectionId, onQuestionClick }) => {
  if (!form) return null;

  return (
    <Form>
      {form.sections.map((section) => (
        <Segment
          key={section.id}
          onClick={() => setActiveSectionId(section.id)}
          style={{
            backgroundColor:
              activeSectionId === section.id ? "#e0f7fa" : "#f9f9f9",
            border:
              activeSectionId === section.id
                ? "2px solid #d6d6d6"
                : "1px solid #ccc",
            cursor: "pointer",
          }}
        >
          <Header as="h4" color="blue">
            {section.sectionTitle}
          </Header>
          <Grid columns={2} stackable>
            {section.questions.map((q) => (
              <Grid.Column key={q.id} onClick={(e) => { e.stopPropagation(); onQuestionClick(section.id, q.id); }}>
                <Form.Field required>
                  <label>{q.label}</label>
                  {q.type === "text" && <Form.Input placeholder={q.placeholder || ""} />}
                  {q.type === "textarea" && <Form.TextArea placeholder={q.placeholder || ""} />}
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
                  {q.type === "number" && <Form.Input type="number" placeholder={q.placeholder || ""} />}
                  {q.type === "email" && <Form.Input type="email" placeholder={q.placeholder || ""} />}
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

export default FormPreview;
