import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Container } from 'reactstrap';

import NavBar from './NavBar';
import settings from '../../../../../../../../../settings';

const footerHeight = '40px';

const Footer = styled.footer`
  margin-top: 10px;
  line-height: ${footerHeight};
  height: ${footerHeight};
`;

const PageLayout = ({ children, navBar }) => {
  return (
    <section className="d-flex flex-column flex-grow-1">
      <section className="d-flex flex-column flex-grow-1 flex-shrink-0">
        <section className="d-flex flex-column">{navBar !== false && <NavBar />}</section>
        <Container id="content">{children}</Container>
      </section>
      <Footer className="d-flex flex-shrink-0 justify-content-center">
        <span>&copy; 2017. {settings.app.name}.</span>
      </Footer>
    </section>
  );
};

PageLayout.propTypes = {
  children: PropTypes.node,
  navBar: PropTypes.bool
};

export default PageLayout;
