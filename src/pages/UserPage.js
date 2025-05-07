// src/pages/UserPage.js
import React, { useContext, useState } from "react";
import { FormContext } from "../context/FormContext";
import {
  Container,
  Header,
  Form,
  Segment,
  Dropdown,
  Button,
  Message,
  Divider,
  Grid,
} from "semantic-ui-react";
import { Link } from "react-router-dom";
import HeaderBar from "../components/HeaderBar";

const UserPage = () => {
  const { forms, selectedFormId, updateSelectedFormId, getSelectedForm } =
    useContext(FormContext);

  const [responses, setResponses] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const selectedForm = getSelectedForm();

  const handleChange = (sectionId, questionId, value) => {
    setResponses((prev) => ({
      ...prev,
      [sectionId]: { ...prev[sectionId], [questionId]: value },
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", responses);
    setSubmitted(true);
  };

  return (
    <>
      <HeaderBar></HeaderBar>
      <Container style={{ marginTop: "5rem" }}>
        <Header as="h3" style={{ textDecoration: "underline" }}>
          Select the Form to Submit
        </Header>

        {/* Form Selection */}
        {forms.length > 0 ? (
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
              setResponses({});
              setSubmitted(false);
            }}
            style={{ marginBottom: "2rem" }}
          />
        ) : (
          <Message
            warning
            content="No forms available. Please ask admin to create one."
          />
        )}

        {/* Render Selected Form */}
        {selectedForm && (
          <Form onSubmit={handleSubmit}>
            {selectedForm.sections.map((section) => (
              <Segment key={section.id} style={{ background: "#f7f7f7" }}>
                <Header as="h3" color="blue">
                  {section.sectionTitle}
                </Header>

                <Grid columns={3} stackable>
                  {section.questions.map((q) => {
                    const sectionResp = responses[section.id] || {};
                    const val = sectionResp[q.id] ?? "";

                    return (
                      <Grid.Column key={q.id}>
                        <Form.Field required={q.required}>
                          <label>{q.label}</label>

                          {q.type === "text" && (
                            <Form.Input
                              value={val}
                              onChange={(e) =>
                                handleChange(section.id, q.id, e.target.value)
                              }
                            />
                          )}

                          {q.type === "textarea" && (
                            <Form.TextArea
                              value={val}
                              onChange={(e) =>
                                handleChange(section.id, q.id, e.target.value)
                              }
                            />
                          )}

                          {q.type === "radio" && (
                            <Form.Group inline>
                              {q.options.map((opt, i) => (
                                <Form.Radio
                                  key={i}
                                  label={opt}
                                  name={`${section.id}-${q.id}`}
                                  value={opt}
                                  checked={val === opt}
                                  onChange={() =>
                                    handleChange(section.id, q.id, opt)
                                  }
                                />
                              ))}
                            </Form.Group>
                          )}

                          {q.type === "checkbox" && (
                            <Form.Group inline>
                              {q.options.map((opt, i) => {
                                const arr = Array.isArray(val) ? val : [];
                                return (
                                  <Form.Checkbox
                                    key={i}
                                    label={opt}
                                    checked={arr.includes(opt)}
                                    onChange={(_, { checked }) => {
                                      const next = checked
                                        ? [...arr, opt]
                                        : arr.filter((x) => x !== opt);
                                      handleChange(section.id, q.id, next);
                                    }}
                                  />
                                );
                              })}
                            </Form.Group>
                          )}

                          {q.type === "dropdown" && (
                            <Dropdown
                              fluid
                              selection
                              options={q.options.map((opt, idx) => ({
                                key: idx,
                                text: opt,
                                value: opt,
                              }))}
                              value={val}
                              onChange={(_, { value }) =>
                                handleChange(section.id, q.id, value)
                              }
                            />
                          )}

                          {q.type === "number" && (
                            <Form.Input
                              type="number"
                              value={val}
                              onChange={(e) =>
                                handleChange(section.id, q.id, e.target.value)
                              }
                            />
                          )}

                          {q.type === "email" && (
                            <Form.Input
                              type="email"
                              value={val}
                              onChange={(e) =>
                                handleChange(section.id, q.id, e.target.value)
                              }
                            />
                          )}

                          {q.type === "date" && (
                            <Form.Input
                              type="date"
                              value={val}
                              onChange={(e) =>
                                handleChange(section.id, q.id, e.target.value)
                              }
                            />
                          )}

                          {q.type === "time" && (
                            <Form.Input
                              type="time"
                              value={val}
                              onChange={(e) =>
                                handleChange(section.id, q.id, e.target.value)
                              }
                            />
                          )}
                        </Form.Field>
                      </Grid.Column>
                    );
                  })}
                </Grid>
              </Segment>
            ))}

            <Divider />
            <Segment basic style={{ paddingBottom: "2rem" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "1rem",
                }}
              >
                <Button  type="button" onClick={ ()=>setResponses({})}>
                  Clear
                </Button>
                <Button
                  style={{ backgroundColor: "#11329E", color: "white" }}
                  type="submit"
                >
                  Submit
                </Button>
              </div>
            </Segment>
          </Form>
        )}

        {submitted && (
          <Message
            success
            header="Form submitted!"
            content="Your responses have been recorded."
            style={{ marginTop: "1rem" }}
          />
        )}
      </Container>
    </>
  );
};

export default UserPage;
