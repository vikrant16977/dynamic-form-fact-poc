import React from "react";
import { Menu, Image, Container } from "semantic-ui-react";
import { Link } from "react-router-dom";

const HeaderBar = () => {
  return (
    <Menu borderless fixed="top" style={{ background: "#002244", color: "#fff" }}>
      <Container>
        <Menu.Item as={Link} to="/">
          <span style={{ fontSize: "1.5em", fontWeight: "bold", color: "#fff" }}>
            Field Audit Collection Tool
          </span>
        </Menu.Item>

        <Menu.Menu position="right">
          <Menu.Item as={Link} to="/admin" style={{ color: "#fff" }}>
            Admin
          </Menu.Item>
          <Menu.Item as={Link} to="/form" style={{ color: "#fff" }}>
            User
          </Menu.Item>
        </Menu.Menu>
      </Container>
    </Menu>
  );
};

export default HeaderBar;
