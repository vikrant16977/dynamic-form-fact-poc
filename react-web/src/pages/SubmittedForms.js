
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
        const res = await fetch("https://dynamicformbackend.onrender.com/odata/v4/catalog/FormSubmissions");
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
          <Segment key={sectionKey} style={{ background: "#f7f7f7" }}>
            <Header as="h3" color="blue">
              Section: {sectionKey}
            </Header>
            <Grid columns={3} stackable>
              {Object.entries(sectionData).map(([qKey, qValue]) => (
                <Grid.Column key={qKey}>
                  <Form.Field>
                    <label>{qKey}</label>
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
      <Segment>
        <Header as="h2">Submitted Forms</Header>
        {loading ? (
          <Loader active inline="centered" />
        ) : (
          <Table celled selectable>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>ID</Table.HeaderCell>
                <Table.HeaderCell>Form ID</Table.HeaderCell>
                <Table.HeaderCell>Preview</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {submissions.map((sub) => (
                <Table.Row key={sub.ID} onClick={() => handleViewSubmission(sub)}>
                  <Table.Cell>{sub.ID}</Table.Cell>
                  <Table.Cell>{sub.form_ID_ID}</Table.Cell>
                  <Table.Cell>
                    {sub.submission.length > 50
                      ? sub.submission.slice(0, 50) + "..."
                      : sub.submission}
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        )}
      </Segment>

      {selectedSubmission && (
        <Modal open={true} onClose={() => setSelectedSubmission(null)} size="large">
          <Modal.Header>Form Submission (ID: {selectedSubmission.ID})</Modal.Header>
          <Modal.Content scrolling>{renderSubmissionForm()}</Modal.Content>
          <Modal.Actions>
            <Button onClick={() => setSelectedSubmission(null)}>Close</Button>
          </Modal.Actions>
        </Modal>
      )}
    </Container>
    </>
  );
};

export default SubmittedFormsPage;
