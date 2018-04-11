import React from 'react';
import { NavLink } from 'react-router-dom';
import { Container, Navbar, Nav, NavItem } from 'reactstrap';

import modules from '../../../../../../modules';
import settings from '../../../../../../../../../settings';

const NavBar = () => (
  <Navbar color="faded" light>
    <Container>
      <Nav>
        <NavLink to="/" className="navbar-brand">
          {settings.app.name}
        </NavLink>
        {modules.navItems}
      </Nav>

      <Nav className="justify-content-end">
        {modules.navItemsRight}
        {__DEV__ && (
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
