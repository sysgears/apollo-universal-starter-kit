import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Navbar, Nav, NavItem } from 'reactstrap';

import modules from '../modules';
import AuthNav from '../modules/user/containers/auth_nav';

const NavBar = () => (
  <Navbar color="faded" light>
    <Container>
      <Row className="align-items-center">
        <Link to="/" className="navbar-brand">Apollo Starter Kit</Link>
        <Nav>
          {modules.navItems}
        </Nav>

        <Nav className="ml-auto">
          <AuthNav />
          <NavItem>&nbsp;&nbsp;</NavItem>
        {(!__PERSIST_GQL__ || __DEV__) &&
          <NavItem>
            <a href="/graphiql">GraphiQL</a>
          </NavItem>
        }
      </Nav>
      </Row>
    </Container>
  </Navbar>
);

export default NavBar;
