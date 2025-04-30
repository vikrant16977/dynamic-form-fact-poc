import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FormContext } from "../context/FormContext";
import {
  Container,
  Header,
  Segment,
  Button,
  Dropdown,
  Grid,
} from "semantic-ui-react";
import HeaderBar from "../components/HeaderBar";

const HomePage = () => {
  const { forms, updateSelectedFormId } = useContext(FormContext);
  const [selectedForm, setSelectedForm] = useState(null);
  const navigate = useNavigate();

  const handleGoToEdit = () => {
    if (!selectedForm) return;
    updateSelectedFormId(selectedForm);
    navigate("/admin");
  };

  return (
    <>
      <HeaderBar />
      <Container style={{ marginTop: "15rem" }}>
        <Header as="h2" textAlign="center">
          FACT Application - Main Menu
        </Header>
        <Grid stackable columns={2} divided>
          <Grid.Column>
            <Segment>
              <Header as="h3">Create a New Audit Type</Header>
              <Button
              style={{ marginTop: "4.8rem" }}
                primary
                fluid
                onClick={() => navigate("/admin")}
              >
                Go to Audit Type Builder
              </Button>
            </Segment>
          </Grid.Column>

          <Grid.Column>
            <Segment>
              <Header as="h3">Edit Existing Audit Type</Header>
              {forms.length > 0 ? (
                <>
                  <Dropdown
                    placeholder="Select an Audit Type"
                    fluid
                    selection
                    options={forms.map((f) => ({
                      key: f.id,
                      text: f.title,
                      value: f.id,
                    }))}
                    value={selectedForm}
                    onChange={(e, { value }) => setSelectedForm(value)}
                    style={{ marginBottom: "1rem" }}
                  />
                  <Button
                    secondary
                    fluid
                    disabled={!selectedForm}
                    onClick={handleGoToEdit}
                  >
                    Go & Edit Audit Type
                  </Button>
                </>
              ) : (
                <Header as="h4" color="grey">
                  No Audit Type available. Create one first.
                </Header>
              )}
            </Segment>
          </Grid.Column>
        </Grid>
      </Container>
    </>
  );
};

export default HomePage;