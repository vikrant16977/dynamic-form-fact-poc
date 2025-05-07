import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FormContext } from "../context/FormContext";
import {
  Container,
  Header,
  Segment,
  Button,
  Dropdown,
  Input,
  Divider,
  Grid,
} from "semantic-ui-react";
import HeaderBar from "../components/HeaderBar";

const HomePage = () => {
  const { forms, updateSelectedFormId, addNewForm } = useContext(FormContext);
  const [formName, setFormName] = useState("");
  const [selectedForm, setSelectedForm] = useState(null);
  const navigate = useNavigate();

  const handleCreate = () => {
    if (!formName.trim()) return;
    localStorage.setItem("newForm", "true");
    addNewForm(formName.trim());
    navigate("/admin");
  };

  const handleEdit = () => {
    if (!selectedForm) return;
    updateSelectedFormId(selectedForm);
    localStorage.setItem("newForm", "false");
    navigate("/admin");
  };

  const handleDiscard = () => {
    setFormName("");
    setSelectedForm(null);
  };

  return (
    <>
      <HeaderBar />
      <Container text style={{ marginTop: "10rem" }}>
        <Segment
          padded="very"
          raised
          style={{ boxShadow: "0 1px 6px rgba(0,0,0,0.1)" }}
        >
          <Header as="h3">Create a New Form</Header>

          <Input
            placeholder="Enter Form Name"
            value={formName}
            onChange={(e) => setFormName(e.target.value)}
            fluid
            style={{ marginBottom: "2rem", marginTop: "1rem" }}
          />

          <Divider horizontal>Or</Divider>

          <Dropdown
            placeholder="Select pre-existing Forms"
            fluid
            selection
            options={forms.map((f) => ({
              key: f.id,
              text: f.title,
              value: f.id,
            }))}
            value={selectedForm}
            onChange={(e, { value }) => setSelectedForm(value)}
            style={{ margin: "2rem 0" }}
          />

          <Grid columns={2} stackable>
            <Grid.Column>
              <Button fluid onClick={handleDiscard}>
                Discard
              </Button>
            </Grid.Column>
            <Grid.Column>
             {selectedForm? <Button
                fluid
                style={{ backgroundColor: "#11329E", color: "white" }}
                onClick={selectedForm ? handleEdit : handleCreate}
                disabled={!formName && !selectedForm}
              > 
               Edit
              </Button>:
               <Button
               fluid
               style={{ backgroundColor: "#11329E", color: "white" }}
               onClick={selectedForm ? handleEdit : handleCreate}
               disabled={!formName && !selectedForm}
             > 
               Create
             </Button>

}
            </Grid.Column>
          </Grid>
        </Segment>
      </Container>
    </>
  );
};

export default HomePage;
