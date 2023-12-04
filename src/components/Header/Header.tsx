import { Button } from "react-bootstrap";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";

export default function Header() {
  return (
    <Navbar
      expand="lg"
      fixed="top"
      style={{
        backgroundSize: "0",
        height: "70px",
        backgroundColor: "#50CB93",
        paddingLeft: "5%",
        paddingRight: "0",
      }}
    >
      <Container fluid className="p-0">
        <Navbar.Brand
          href="/"
          style={{ color: "black", display: "flex", alignItems: "center" }}
        >
          <span>PKU Community</span>
        </Navbar.Brand>
        <Navbar.Toggle
          aria-controls="basic-navbar-nav"
          style={{ marginRight: "10%" }}
        />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link className="text text-center" href="/">
              Home
            </Nav.Link>
            <Nav.Link className="text text-center" href="/about">
              About
            </Nav.Link>
            <Nav.Link className="text text-center" href="/courses">
              My
            </Nav.Link>
            <Nav.Link className="text text-center" href="/support">
              Support Us!
            </Nav.Link>
          </Nav>
          <div className="text text-center" style={{ marginRight: "5%" }}>
            <p className="d-inline me-3 text text-center">Please Log in.</p>
            <Button
              className="text text-center"
              variant="success"
              href="/login"
            >
              Login
            </Button>
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
