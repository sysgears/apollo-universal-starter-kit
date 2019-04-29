import React from 'react';
import { NavLink } from 'react-router-dom';
import { Container, Navbar, Nav, NavItem } from 'reactstrap';

import settings from '@gqlapp/config';

const ref = { modules: null };

export const onAppCreate = modules => (ref.modules = modules);

const NavBar = () => (
  <Navbar color="faded" light>
    <Container>
      <Nav>
        <NavLink to="/" className="navbar-brand">
          {settings.app.name}
        </NavLink>
        {ref.modules.navItems}
      </Nav>

      <Nav className="justify-content-end">
        {ref.modules.navItemsRight}
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
