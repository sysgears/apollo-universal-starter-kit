import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

const styles = {
  form: {
    display: 'flex',
    alignItems: 'center'
  }
};

const Form = ({ children, classes, ...props }) => (
  <form className={props.layout === 'inline' ? classes.form : ''} {...props}>
    {children}
  </form>
);

Form.propTypes = {
  children: PropTypes.node,
  type: PropTypes.string,
  classes: PropTypes.object.isRequired,
  layout: PropTypes.string
};

export default withStyles(styles)(Form);
