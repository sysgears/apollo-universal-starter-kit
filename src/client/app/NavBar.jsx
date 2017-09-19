import React from 'react';
import { NavLink } from 'react-router-dom';
import { Container, Navbar, Nav, NavItem } from 'reactstrap';

import modules from '../modules';

const NavBar = () => (
  <Navbar color="faded" light>
    <Container>
      <Nav>
        <NavLink to="/" className="navbar-brand">
          Apollo Starter Kit
        </NavLink>
        {modules.navItems}
      </Nav>

      <Nav className="ustify-content-end">
        {modules.navItemsRight}
        {(!__PERSIST_GQL__ || __DEV__) && (
            <NavItem>
              <a href="/graphiql" className="nav-link">
                GraphiQL
              </a>
            </NavItem>
          )}
      </Nav>
    </Container>
  </Navbar>
);

export default NavBar;
