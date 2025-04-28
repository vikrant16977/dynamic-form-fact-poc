import React, { useContext, useState } from "react";
import { FormContext } from "../context/FormContext";
import {
  Container,
  Header,
  Segment,
  Form,
  Button,
  Dropdown,
} from "semantic-ui-react";
import { Link } from "react-router-dom";
const UserPage = () => {
  const { forms } = useContext(FormContext);

  const [selectedFormId, setSelectedFormId] = useState("");
  const [formData, setFormData] = useState({});

  const selectedForm = forms.find((form) => form.id === selectedFormId);

  const handleInputChange = (sectionIndex, questionIndex, value) => {
    setFormData((prev) => ({
      ...prev,
      [`${sectionIndex}-${questionIndex}`]: value,
    }));
  };

  const handleSubmit = () => {
    console.log("Submitted Data:", formData);
    alert("Form submitted successfully!");
    setFormData({});
    setSelectedFormId("");
  };

  return (
    <Container style={{ marginTop: "2rem" }}>
      <Button
        as={Link}
        to="/admin"
        color="blue"
        icon="arrow left"
        content="Back to Admin"
      />
      <Header as="h1" textAlign="center" dividing>
        User - Fill and Submit Forms
      </Header>

      {/* Form Selection */}
      {forms.length > 0 ? (
        <Dropdown
          placeholder="Select a form"
          fluid
          selection
          options={forms.map((form) => ({
            key: form.id,
            text: form.title,
            value: form.id,
          }))}
          value={selectedFormId}
          onChange={(e, { value }) => setSelectedFormId(value)}
          style={{ marginBottom: "2rem" }}
        />
      ) : (
        <Header as="h3" textAlign="center">
          No forms available. Please ask admin to create one.
        </Header>
      )}

      {/* Render Selected Form */}
      {selectedForm && (
        <Form onSubmit={handleSubmit}>
          {selectedForm.sections.map((section, sectionIndex) => (
            <Segment
              key={sectionIndex}
              style={{
                padding: "2rem",
                border: "1px solid #ccc",
                marginBottom: "2rem",
              }}
            >
              <Header as="h3" color="teal">
                {section.sectionTitle}
              </Header>

              {section.questions.map((question, questionIndex) => {
                const key = `${sectionIndex}-${questionIndex}`;
                const value = formData[key] || "";

                switch (question.type) {
                  case "text":
                    return (
                      <Form.Input
                        key={key}
                        label={question.label}
                        value={value}
                        onChange={(e) =>
                          handleInputChange(
                            sectionIndex,
                            questionIndex,
                            e.target.value
                          )
                        }
                      />
                    );
                  case "textarea":
                    return (
                      <Form.TextArea
                        key={key}
                        label={question.label}
                        value={value}
                        onChange={(e) =>
                          handleInputChange(
                            sectionIndex,
                            questionIndex,
                            e.target.value
                          )
                        }
                      />
                    );
                  case "radio":
                    return (
                      <Form.Group grouped key={key}>
                        <label>{question.label}</label>
                        {question.options.map((opt, idx) => (
                          <Form.Radio
                            key={idx}
                            label={opt}
                            value={opt}
                            checked={value === opt}
                            onChange={(e, { value }) =>
                              handleInputChange(
                                sectionIndex,
                                questionIndex,
                                value
                              )
                            }
                          />
                        ))}
                      </Form.Group>
                    );
                  case "checkbox":
                    return (
                      <Form.Checkbox
                        key={key}
                        label={question.label}
                        checked={value === true}
                        onChange={(e, { checked }) =>
                          handleInputChange(
                            sectionIndex,
                            questionIndex,
                            checked
                          )
                        }
                      />
                    );
                  case "dropdown":
                    return (
                      <Form.Select
                        key={key}
                        label={question.label}
                        options={question.options.map((opt) => ({
                          key: opt,
                          text: opt,
                          value: opt,
                        }))}
                        value={value}
                        onChange={(e, { value }) =>
                          handleInputChange(sectionIndex, questionIndex, value)
                        }
                      />
                    );
                  case "number":
                    return (
                      <Form.Input
                        key={key}
                        type="number"
                        label={question.label}
                        value={value}
                        onChange={(e) =>
                          handleInputChange(
                            sectionIndex,
                            questionIndex,
                            e.target.value
                          )
                        }
                      />
                    );
                  case "email":
                    return (
                      <Form.Input
                        key={key}
                        type="email"
                        label={question.label}
                        value={value}
                        onChange={(e) =>
                          handleInputChange(
                            sectionIndex,
                            questionIndex,
                            e.target.value
                          )
                        }
                      />
                    );
                  case "date":
                    return (
                      <Form.Input
                        key={key}
                        type="date"
                        label={question.label}
                        value={value}
                        onChange={(e) =>
                          handleInputChange(
                            sectionIndex,
                            questionIndex,
                            e.target.value
                          )
                        }
                      />
                    );
                  default:
                    return null;
                }
              })}
            </Segment>
          ))}

          <Button color="green" type="submit" size="large" fluid>
            Submit Form
          </Button>
        </Form>
      )}
    </Container>
  );
};

export default UserPage;
