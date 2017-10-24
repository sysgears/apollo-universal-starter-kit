import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Container } from 'reactstrap';

import NavBar from './NavBar';

const footerHeight = '40px';

const Footer = styled.footer`
  position: absolute;
  bottom: 0;
  width: 100%;
  line-height: ${footerHeight};
  height: ${footerHeight};
`;

const PageLayout = ({ children, navBar }) => {
  return (
    <section>
      {navBar !== false && <NavBar />}
      <Container id="content">{children}</Container>
      <Footer>
        <div className="text-center">&copy; 2017. Example Apollo App.</div>
      </Footer>
    </section>
  );
};

PageLayout.propTypes = {
  children: PropTypes.node,
  navBar: PropTypes.bool
};

export default PageLayout;
