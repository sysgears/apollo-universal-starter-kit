import React from 'react';
import styled from 'styled-components';
import { Container } from 'reactstrap';

import NavBar from './nav_bar';
import Routes from './routes';

const footerHeight = '40px';

const Footer = styled.footer`
  position: absolute;
  bottom: 0;
  width: 100%;
  line-height: ${footerHeight};
  height: ${footerHeight};
`;

export default function App() {
  return (
    <div>
      <NavBar />
      <Container id="content">
        {Routes}
      </Container>
      <Footer>
        <div className="text-center">
          &copy; 2017. Example Apollo App.
        </div>
      </Footer>
    </div>
  );
}
