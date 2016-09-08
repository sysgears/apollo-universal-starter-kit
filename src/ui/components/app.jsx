import React from 'react'
import { StyleSheet, css } from 'aphrodite'
import { Row } from 'react-bootstrap'
import NavBar from './nav_bar'

const styles = StyleSheet.create({
  greyRow: {
    backgroundColor: 'grey',
    width: '100%',
    height: '5px'
  },
});


export default function App({ children }) {
  return (
    <div>
      <div className={css(styles.greyRow)}>
      </div>
      <NavBar>
      </NavBar>
      <div className="container">
        {children}
      </div>
      <footer id="footer" className="container">
        <Row className="text-center">
          &copy; 2016. Example Apollo App.
        </Row>
      </footer>
    </div>
  );
}

App.propTypes = {
  children: React.PropTypes.object,
};
