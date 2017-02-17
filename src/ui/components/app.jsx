import React from 'react'
import { StyleSheet, css } from 'aphrodite'
import { Container } from 'reactstrap'
import classnames from 'classnames'

import NavBar from './nav_bar'

const footerHeight = '40px';

const styles = StyleSheet.create({
  footer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    lineHeight: footerHeight,
    height: footerHeight
  },
});

export default function App({ children }) {
  return (
    <div>
      <NavBar />
      <Container>
        {children}
      </Container>
      <footer className={classnames('container', css(styles.footer))}>
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
