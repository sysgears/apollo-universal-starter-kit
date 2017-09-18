import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Navbar, Nav, NavItem } from 'reactstrap';

import modules from '../modules';

const NavBar = () => (
  <Navbar color="faded" light>
    <Container>
      <Row className="align-items-center">
        <Link to="/" className="navbar-brand">
          Apollo Starter Kit
        </Link>
        <Nav>{modules.navItems}</Nav>

        <Nav className="ml-auto">
          {modules.navItemsRight}
          {(!__PERSIST_GQL__ || __DEV__) && (
            <NavItem>
              <a href="/graphiql" className="nav-link">
                GraphiQL
              </a>
            </NavItem>
          )}
        </Nav>
      </Row>
    </Container>
  </Navbar>
);

export default NavBar;
