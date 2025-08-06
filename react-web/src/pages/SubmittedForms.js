import React, { useEffect, useState } from "react";
import {
  Container,
  Header,
  Segment,
  Table,
  Loader,
  Modal,
  Button,
  Form,
  Grid,
  Card,
  Icon,
  Divider,
  Image,
} from "semantic-ui-react";
import HeaderBar from "../components/HeaderBar";

const SubmittedFormsPage = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [parsedSubmission, setParsedSubmission] = useState({});

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const res = await fetch(
          "https://dynamicformbackend.onrender.com/odata/v4/catalog/FormSubmissions"
        );
        const data = await res.json();
        setSubmissions(data.value || []);
      } catch (err) {
        console.error("Error fetching submissions:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, []);

  const handleViewSubmission = (submission) => {
    try {
      const parsed = JSON.parse(submission.submission || "{}");
      setParsedSubmission(parsed);
      setSelectedSubmission(submission);
    } catch (err) {
      console.error("Error parsing submission:", err);
    }
  };

  const renderField = (key, value) => {
    if (Array.isArray(value)) {
      return value.join(", ");
    }
    return value?.toString();
  };

  const renderSubmissionForm = () => {
    const sections = Object.entries(parsedSubmission);

    return (
      <Form>
        {sections.map(([sectionKey, sectionData]) => (
          <Segment
            key={sectionKey}
            style={{
              background: "#f9f9f9",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            }}
          >
            <Header as="h3" style={{ color: "#0C2D87"}}>
              <Icon name="folder open" /> Section: {sectionKey}
            </Header>
            <Divider />
            <Grid columns={3} stackable>
              {Object.entries(sectionData).map(([qKey, qValue]) => (
                <Grid.Column key={qKey}>
                  <Form.Field>
                    <label style={{ fontWeight: "bold", color: "#555" }}>
                      {qKey}
                    </label>
                    <Form.Input value={renderField(qKey, qValue)} readOnly />
                  </Form.Field>
                </Grid.Column>
              ))}
            </Grid>
          </Segment>
        ))}
      </Form>
    );
  };

  return (
    <>
      <HeaderBar />
      <Container style={{ marginTop: "6rem" }}>
        <Segment raised>
          <Header as="h2"  style={{ color: "#0C2D87"}}>
            <Icon name="file alternate outline" /> Submitted Forms
          </Header>
          <Divider />
          {loading ? (
            <Loader active inline="centered" />
          ) : (
            <Card.Group itemsPerRow={3} stackable>
              {submissions.map((sub) => (
                <Card
                  key={sub.ID}
                  onClick={() => handleViewSubmission(sub)}
                  style={{
                    background: "linear-gradient(135deg, #f0f4ff, #e6f7ff)",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    borderRadius: "12px",
                    transition: "transform 0.2s ease-in-out",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.transform = "scale(1.02)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.transform = "scale(1)")
                  }
                >
                  <Card.Content>
                    <Card.Header
                      style={{ color: "#0C2D87", fontSize: "1.2rem" }}
                    >
                      <Icon name="hashtag" />Submission ID: {sub.ID}
                    </Card.Header>
                    <Card.Meta style={{ marginTop: "0.5rem", color: "#555" }}>
                      <Icon name="file outline" /> Form ID: {sub.form_ID_ID}
                    </Card.Meta>

                    <Card.Description textAlign="center">
                      <Icon
                        name="file alternate outline"
                        size="huge"
                         style={{ color: "#0C2D87"}}
                      />
                      <p
                        style={{
                          marginTop: "1rem",
                          fontWeight: "bold",
                          color: "#0C2D87",
                        }}
                      >
                        Submission available
                      </p>
                      <p style={{ fontStyle: "italic", color: "#666" }}>
                        Click to view full details
                      </p>
                    </Card.Description>
                  </Card.Content>
                 
                </Card>
              ))}
            </Card.Group>
          )}
        </Segment>

        {selectedSubmission && (
          <Modal
            open={true}
            onClose={() => setSelectedSubmission(null)}
            size="large"
            closeIcon
          >
            <Modal.Header>
              <Icon name="clipboard list" /> Form Submission (ID:{" "}
              {selectedSubmission.ID})
            </Modal.Header>
            <Modal.Content scrolling>{renderSubmissionForm()}</Modal.Content>
            <Modal.Actions>
              <Button color="red" onClick={() => setSelectedSubmission(null)}>
                <Icon name="close" /> Close
              </Button>
            </Modal.Actions>
          </Modal>
        )}
      </Container>
    </>
  );
};

export default SubmittedFormsPage;
