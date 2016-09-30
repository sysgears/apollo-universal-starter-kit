import React from 'react'
import { StyleSheet, css } from 'aphrodite'
import { Row } from 'react-bootstrap'
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
      <NavBar>
      </NavBar>
      <div className="container">
        {children}
      </div>
      <footer className={classnames('container', css(styles.footer))}>
        <Row className='text-center'>
          &copy; 2016. Example Apollo App.
        </Row>
      </footer>
    </div>
  );
}

App.propTypes = {
  children: React.PropTypes.element,
};
