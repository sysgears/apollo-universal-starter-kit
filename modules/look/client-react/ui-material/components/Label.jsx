import React from 'react';
import PropTypes from 'prop-types';
import FormLabel from '@material-ui/core/FormLabel';
import { withStyles } from '@material-ui/core/styles';

const styles = {
  label: {
    minWidth: '120px',
    display: 'flex',
    justifyContent: 'space-evenly',
    alignItems: 'center'
  }
};

const Label = ({ children, classes, ...props }) => (
  <FormLabel className={classes.label} {...props}>
    {children}
  </FormLabel>
);

Label.propTypes = {
  children: PropTypes.node,
  classes: PropTypes.object
};

export default withStyles(styles)(Label);
