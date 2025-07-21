import React from "react";
import { Menu, Image, Icon } from "semantic-ui-react";
import { Link, useLocation } from "react-router-dom";
import logo from "./images/socal-gas.png";

const HeaderBar = () => {
  const location = useLocation();

  return (
    <>
      <Menu borderless style={{ background: "#FFFF", padding: "0 2rem" }}>
        {/* Logo */}
        <Menu.Item as={Link} to="/">
          <Image
            src={logo}
            size="tiny"
            alt="SoCalGas Logo"
            background="#FFFF"
          />
        </Menu.Item>
      </Menu>
      <Menu
        borderless
        fixed="top"
        style={{ background: "#0C2D87", padding: "0 2rem " }}
      >
        {/* Navigation */}
        <Menu.Item
          as={Link}
          to="/"
          name="Home"
          style={{
            color: "#fff",
            fontWeight: location.pathname === "/" ? "bold" : "normal",
          }}
        />
        <Menu.Item
          as={Link}
          to="/admin"
          name="Form Creator"
          style={{
            color: "#fff",
            fontWeight: location.pathname === "/admin" ? "bold" : "normal",
          }}
        />

        {/* Right Side Icons */}
        <Menu.Menu position="right">
          <Menu.Item as={Link} to="/form">
            <Icon name="user icon" style={{ color: "white", marginRight: 4 }} />
            <span style={{ color: "white" }}>User</span>
          </Menu.Item>
          <Menu.Item>
            <Icon
              name="question circle outline"
              style={{ color: "white", marginRight: 4 }}
            />
            <span style={{ color: "white" }}>Help</span>
          </Menu.Item>
          <Menu.Item>
            <div
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                backgroundColor: "#002366",
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "bold",
              }}
            >
              OG
            </div>
          </Menu.Item>
        </Menu.Menu>
      </Menu>
    </>
  );
};

export default HeaderBar;
