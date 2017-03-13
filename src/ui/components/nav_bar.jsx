import React from 'react'
import { Link } from 'react-router-dom'
import { Container, Row, Navbar, Nav, NavItem } from 'reactstrap'

const NavBar = () => (
  <Navbar color="faded" light>
    <Container>
      <Row className="align-items-center">
        <Link to="/" className="navbar-brand">Apollo Starter Kit</Link>
        <Nav navbar>
          <NavItem>
            <a href="/graphiql">GraphiQL</a>
          </NavItem>
        </Nav>
      </Row>
    </Container>
  </Navbar>
);

export default NavBar;
