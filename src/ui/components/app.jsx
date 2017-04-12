import React from 'react';
import { css } from 'glamor';
import { Container } from 'reactstrap';

import NavBar from './nav_bar';

const footerHeight = '40px';

const footerStyle = css({
  position: 'absolute',
  bottom: 0,
  width: '100%',
  lineHeight: footerHeight,
  height: footerHeight
});

export default function App({ children }) {
  return (
    <div>
      <NavBar />
      <Container>
        {children}
      </Container>
      <footer {...footerStyle}>
        <div className='text-center'>
          &copy; 2016. Example Apollo App.
        </div>
      </footer>
    </div>
  );
}

App.propTypes = {
  children: React.PropTypes.element,
};
